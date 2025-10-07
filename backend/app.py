from __future__ import annotations

import logging
import os
from datetime import datetime
from functools import wraps
from typing import Any, Dict, List

import pandas as pd
import yfinance as yf
from dotenv import load_dotenv
from flask import Blueprint, Flask, current_app, jsonify, request, session
from flask_cors import CORS
from flask_mail import Mail, Message
from requests.exceptions import HTTPError

from db import (
    create_user,
    get_subscription_code_for_user,
    get_user_id,
    read_stock_purchases,
    update_subscription_code,
    verify_subscription_code,
    verify_user,
)
from lesson import lessons
from models import BlogPost
from services.portfolio import build_portfolio

load_dotenv(".env.development.local", override=False)
load_dotenv()

logging.basicConfig(level=os.environ.get("LOG_LEVEL", "INFO"))
LOGGER = logging.getLogger(__name__)

MASTER_PORTFOLIO_EMAIL = os.environ.get("MASTER_PORTFOLIO_EMAIL", "mastinder@yahoo.com")
USA_PORTFOLIO_EMAIL = os.environ.get("USA_PORTFOLIO_EMAIL", "stockliveedu@gmail.com")

mail = Mail()
api = Blueprint("api", __name__)


def login_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if not session.get("logged_in"):
            return jsonify({"error": "unauthorized"}), 401
        return func(*args, **kwargs)

    return wrapper


@api.get("/health")
def healthcheck() -> Any:
    return jsonify({"status": "ok"})


@api.post("/auth/login")
def api_login() -> Any:
    payload = request.get_json(silent=True) or {}
    email = payload.get("email")
    password = payload.get("password")

    if not email or not password:
        return jsonify({"error": "email-and-password-required"}), 400

    if not verify_user(email, password):
        return jsonify({"error": "invalid-credentials"}), 401

    user_id = get_user_id(email)
    if user_id is None:
        return jsonify({"error": "user-not-found"}), 404

    session.clear()
    session["logged_in"] = True
    session["email"] = email
    session["user_id"] = user_id
    subscription_code = get_subscription_code_for_user(user_id)
    session["subscription_code"] = subscription_code

    return (
        jsonify(
            {
                "authenticated": True,
                "email": email,
                "userId": user_id,
                "subscriptionCode": subscription_code,
            }
        ),
        200,
    )


@api.post("/auth/logout")
@login_required
def api_logout() -> Any:
    session.clear()
    return jsonify({"status": "logged-out"})


@api.post("/auth/register")
def api_register() -> Any:
    payload = request.get_json(silent=True) or {}
    email = payload.get("email")
    password = payload.get("password")

    if not email or not password:
        return jsonify({"error": "email-and-password-required"}), 400

    try:
        create_user(email, password)
    except Exception as exc:  # noqa: BLE001 - surface a generic error to clients
        LOGGER.warning("Registration failed for %s: %s", email, exc)
        return jsonify({"error": "registration-failed"}), 400

    return jsonify({"status": "registered"}), 201


@api.get("/auth/session")
def api_session() -> Any:
    if session.get("logged_in"):
        return (
            jsonify(
                {
                    "authenticated": True,
                    "email": session.get("email"),
                    "userId": session.get("user_id"),
                    "subscriptionCode": session.get("subscription_code"),
                }
            ),
            200,
        )
    return jsonify({"authenticated": False}), 200


@api.post("/auth/subscription")
@login_required
def api_subscription() -> Any:
    payload = request.get_json(silent=True) or {}
    code = payload.get("subscriptionCode")
    email = session.get("email")
    user_id = session.get("user_id")

    if not code:
        return jsonify({"error": "subscription-code-required"}), 400

    if not (email and verify_subscription_code(email, code)):
        return jsonify({"error": "invalid-subscription-code"}), 400

    update_subscription_code(user_id, code)
    session["subscription_code"] = code
    return jsonify({"status": "subscription-updated", "subscriptionCode": code})


@api.get("/portfolio/<string:variant>")
@login_required
def api_portfolio(variant: str) -> Any:
    lookup_email = None

    if variant == "me":
        user_id = session.get("user_id")
        if not user_id:
            return jsonify({"error": "user-not-found"}), 404
    elif variant == "master":
        session_email = session.get("email")
        subscription_code = session.get("subscription_code")
        if not (
            session_email
            and subscription_code
            and verify_subscription_code(session_email, subscription_code)
        ):
            return jsonify({"error": "subscription-required"}), 403
        lookup_email = MASTER_PORTFOLIO_EMAIL
    elif variant == "usa":
        lookup_email = USA_PORTFOLIO_EMAIL
    else:
        return jsonify({"error": "unknown-portfolio"}), 400

    if lookup_email:
        user_id = get_user_id(lookup_email)
        if user_id is None:
            return jsonify({"error": "portfolio-owner-not-found"}), 404

    payload = _build_portfolio_response(user_id)
    return jsonify(payload)


@api.get("/lessons")
def api_lessons() -> Any:
    serialized = [
        {
            "title": lesson.title,
            "description": getattr(lesson, "description", lesson.content[:120]),
            "content": lesson.content,
            "author": getattr(lesson, "author", None),
            "datePosted": getattr(lesson, "date_posted", None),
        }
        for lesson in lessons
    ]
    return jsonify({"lessons": serialized})


@api.post("/chat")
@login_required
def api_chat() -> Any:
    """AI Chat endpoint for stock portfolio assistance"""
    payload = request.get_json(silent=True) or {}
    user_message = payload.get("message", "").strip()
    
    if not user_message:
        return jsonify({"error": "message-required"}), 400
    
    try:
        # Get user context for personalized responses
        user_id = session.get("user_id")
        user_email = session.get("email")
        
        # Generate AI response based on user message and portfolio context
        ai_response = generate_ai_response(user_message, user_id, user_email)
        
        return jsonify({
            "response": ai_response,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as exc:
        LOGGER.warning("Chat API failed for user %s: %s", user_id, exc)
        return jsonify({"error": "chat-service-unavailable"}), 500


@api.get("/stock-search")
@login_required
def api_stock_search() -> Any:
    """Stock search endpoint with comprehensive stock information"""
    symbol = request.args.get("symbol", "").strip().upper()
    
    if not symbol:
        return jsonify({"error": "symbol-required"}), 400
    
    try:
        # Fetch stock data using yfinance
        stock_info = get_comprehensive_stock_info(symbol)
        
        if not stock_info:
            return jsonify({"error": "stock-not-found"}), 404
            
        return jsonify(stock_info)
        
    except Exception as exc:
        LOGGER.warning("Stock search failed for symbol %s: %s", symbol, exc)
        return jsonify({"error": "stock-search-failed"}), 500


@api.get("/blog")
def api_blog() -> Any:
    posts = BlogPost.get_all_posts()
    serialized = [
        {
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "author": post.author,
            "datePosted": post.date_posted.isoformat()
            if isinstance(post.date_posted, datetime)
            else post.date_posted,
        }
        for post in posts
    ]
    return jsonify({"posts": serialized})


@api.get("/stock-recommendations")
def api_stock_recommendations() -> Any:
    return jsonify({"recommendations": _generate_stock_recommendations()})


@api.post("/contact")
def api_contact() -> Any:
    payload = request.get_json(silent=True) or {}
    name = payload.get("name")
    email = payload.get("email")
    message = payload.get("message")

    if not all([name, email, message]):
        return jsonify({"error": "name-email-message-required"}), 400

    mail_username = current_app.config.get("MAIL_USERNAME")
    if not mail_username:
        LOGGER.warning("Mail credentials missing; skipping send")
        return jsonify({"status": "queued"}), 202

    msg = Message(
        subject="New Contact Form Submission",
        recipients=[mail_username],
        body=f"Name: {name}\nEmail: {email}\nMessage: {message}",
        reply_to=email,
    )

    try:
        mail.send(msg)
    except Exception as exc:  # noqa: BLE001 - mail transport shouldn't crash the API
        LOGGER.warning("Unable to send contact email: %s", exc)
        return jsonify({"status": "queued"}), 202

    return jsonify({"status": "sent"}), 202


@api.get("/stock/<string:symbol>")
def api_stock(symbol: str) -> Any:
    try:
        ticker = yf.Ticker(symbol)
        history_df = ticker.history(period="1mo", interval="1d")
    except Exception as exc:  # noqa: BLE001
        LOGGER.warning("Failed to fetch stock %s: %s", symbol, exc)
        return jsonify({"error": "stock-fetch-failed"}), 502

    history: List[Dict[str, Any]] = []
    if not history_df.empty:
        history = [
            {
                "date": row.Index.strftime("%Y-%m-%d")
                if isinstance(row.Index, (datetime, pd.Timestamp))
                else str(row.Index),
                "close": round(float(row.Close), 2),
            }
            for row in history_df.itertuples()
        ]

    info: Dict[str, Any] = {}
    try:
        info = ticker.info or {}
    except HTTPError as exc:
        LOGGER.debug("HTTP error retrieving info for %s: %s", symbol, exc)
    except Exception as exc:  # noqa: BLE001
        LOGGER.debug("Failed to fetch ticker.info for %s: %s", symbol, exc)

    return jsonify({"info": info, "history": history})


def _build_portfolio_response(user_id: int) -> Dict[str, Any]:
    purchases = read_stock_purchases(user_id)
    return build_portfolio(purchases)


def get_comprehensive_stock_info(symbol: str) -> Dict[str, Any]:
    """Get comprehensive stock information using yfinance"""
    try:
        # Create yfinance Ticker object
        ticker = yf.Ticker(symbol)
        
        # Get stock info
        info = ticker.info
        
        # Get current price data
        hist = ticker.history(period="2d")
        if hist.empty:
            return None
            
        current_price = float(hist['Close'].iloc[-1])
        previous_close = float(info.get('previousClose', hist['Close'].iloc[-2] if len(hist) > 1 else current_price))
        
        change = current_price - previous_close
        change_percent = (change / previous_close) * 100 if previous_close != 0 else 0
        
        # Compile comprehensive stock data
        stock_data = {
            "symbol": symbol,
            "name": info.get('longName', info.get('shortName', symbol)),
            "currentPrice": current_price,
            "previousClose": previous_close,
            "change": change,
            "changePercent": change_percent,
            "volume": int(info.get('volume', 0)),
            "marketCap": int(info.get('marketCap', 0)),
            "peRatio": float(info.get('trailingPE', 0)) if info.get('trailingPE') else None,
            "dividendYield": float(info.get('dividendYield', 0)) * 100 if info.get('dividendYield') else None,
            "high52Week": float(info.get('fiftyTwoWeekHigh', 0)),
            "low52Week": float(info.get('fiftyTwoWeekLow', 0)),
            "sector": info.get('sector', 'N/A'),
            "industry": info.get('industry', 'N/A'),
            "description": info.get('longBusinessSummary', 'No description available'),
            "website": info.get('website', ''),
            "employees": int(info.get('fullTimeEmployees', 0)) if info.get('fullTimeEmployees') else None,
            "founded": info.get('foundedYear', ''),
            "headquarters": f"{info.get('city', '')}, {info.get('state', '')}, {info.get('country', '')}".strip(', '),
        }
        
        return stock_data
        
    except Exception as e:
        LOGGER.error(f"Error fetching stock info for {symbol}: {e}")
        return None


def generate_ai_response(user_message: str, user_id: int, user_email: str) -> str:
    """Generate AI response for stock portfolio chat"""
    # Simple rule-based AI responses for stock portfolio queries
    message_lower = user_message.lower()
    
    # Portfolio-related queries
    if any(keyword in message_lower for keyword in ['portfolio', 'stocks', 'holdings', 'investments']):
        try:
            portfolio_data = _build_portfolio_response(user_id)
            total_value = portfolio_data.get('summary', {}).get('totalCurrentValue', 0)
            total_invested = portfolio_data.get('summary', {}).get('totalInvested', 0)
            total_return = portfolio_data.get('summary', {}).get('totalReturn', 0)
            
            return f"""Based on your current portfolio:

📊 **Portfolio Summary:**
• Total Current Value: ₹{total_value:,.2f}
• Total Invested: ₹{total_invested:,.2f}
• Total Return: ₹{total_return:,.2f}

Your portfolio shows {'positive' if total_return >= 0 else 'negative'} performance. Would you like me to analyze specific stocks or suggest investment strategies?"""
        except:
            return "I'd be happy to help with your portfolio analysis! Please make sure you're logged in and have portfolio data available."
    
    # Market analysis queries
    elif any(keyword in message_lower for keyword in ['market', 'trend', 'analysis', 'prediction']):
        return """🔍 **Market Analysis Insights:**

• **Current Market**: The Indian stock market shows mixed signals with sector rotation happening across IT, pharma, and infrastructure stocks.

• **Key Trends**: Technology stocks are consolidating while infrastructure and renewable energy sectors show strength.

• **Investment Strategy**: Consider diversification across sectors and maintain a long-term perspective.

Would you like me to analyze any specific stocks from your portfolio or discuss sector-wise allocation?"""
    
    # Stock-specific queries
    elif any(keyword in message_lower for keyword in ['tcs', 'infosys', 'reliance', 'hdfc', 'icici']):
        return """📈 **Stock Analysis:**

For blue-chip stocks like TCS, Infosys, Reliance, HDFC, and ICICI:

• **Fundamentals**: These are generally strong companies with solid business models
• **Performance**: They tend to be less volatile and provide steady returns
• **Strategy**: Good for long-term wealth creation and portfolio stability

Would you like detailed analysis of any specific stock from your portfolio?"""
    
    # Risk management queries
    elif any(keyword in message_lower for keyword in ['risk', 'loss', 'profit', 'sell', 'buy']):
        return """⚖️ **Risk Management Tips:**

• **Diversification**: Spread investments across different sectors
• **Stop Loss**: Consider setting stop-loss levels for individual stocks
• **Position Sizing**: Don't put more than 5-10% in any single stock
• **Regular Reviews**: Monitor your portfolio monthly

• **Golden Rule**: Never invest money you can't afford to lose
• **Long-term View**: Stay focused on long-term goals rather than daily fluctuations

What specific aspect of risk management would you like to discuss?"""
    
    # General investment advice
    elif any(keyword in message_lower for keyword in ['advice', 'strategy', 'invest', 'buy', 'sell']):
        return """💡 **Investment Strategy Advice:**

**For Long-term Wealth Creation:**
• Focus on fundamentally strong companies
• Regular SIP investments in quality stocks
• Maintain 60-70% equity, 30-40% debt allocation

**Key Principles:**
• Buy and hold quality stocks
• Don't try to time the market
• Stay disciplined with your investment plan
• Review and rebalance quarterly

**Avoid Common Mistakes:**
• Emotional trading decisions
• Following market rumors
• Putting all money in single stock/sector

What's your investment timeline and risk appetite?"""
    
    # Greeting and general queries
    elif any(keyword in message_lower for keyword in ['hello', 'hi', 'help', 'what', 'how']):
        return """👋 **Hello! I'm your AI Stock Portfolio Assistant**

I can help you with:
• 📊 Portfolio analysis and performance review
• 📈 Stock research and recommendations  
• 💰 Investment strategies and planning
• ⚖️ Risk management advice
• 📉 Market trends and insights

**Popular Questions:**
• "How is my portfolio performing?"
• "Should I buy or sell [stock name]?"
• "What's the market outlook?"
• "How can I reduce my portfolio risk?"

What would you like to know about your investments?"""
    
    # Default response for unrecognized queries
    else:
        return f"""🤔 **I understand you're asking about:** "{user_message}"

I specialize in stock market and portfolio advice. I can help you with:

• **Portfolio Analysis**: Review your current holdings and performance
• **Stock Research**: Get insights on specific stocks
• **Investment Strategy**: Plan your investment approach
• **Risk Management**: Optimize your portfolio risk
• **Market Insights**: Understand current market trends

Could you rephrase your question in terms of stocks, investments, or portfolio management? I'm here to help optimize your investment journey!"""


def _generate_stock_recommendations() -> List[Dict[str, Any]]:
    return [
        {"name": "Apple Inc.", "price": 185.12, "recommendation": "Buy"},
        {"name": "Microsoft Corp.", "price": 411.78, "recommendation": "Hold"},
        {"name": "NVIDIA Corp.", "price": 119.52, "recommendation": "Watch"},
    ]


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.update(
        SECRET_KEY=os.environ.get("SECRET_KEY", "change-me"),
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE=os.environ.get("SESSION_COOKIE_SAMESITE", "Lax"),
        JSON_SORT_KEYS=False,
        MAIL_SERVER=os.environ.get("MAIL_SERVER", "smtp.gmail.com"),
        MAIL_PORT=int(os.environ.get("MAIL_PORT", 587)),
        MAIL_USE_TLS=os.environ.get("MAIL_USE_TLS", "true").lower() == "true",
        MAIL_USERNAME=os.environ.get("MAIL_USERNAME"),
        MAIL_PASSWORD=os.environ.get("MAIL_PASSWORD"),
        MAIL_DEFAULT_SENDER=(
            os.environ.get("MAIL_DEFAULT_SENDER") or os.environ.get("MAIL_USERNAME")
        ),
    )

    cors_origins = os.environ.get("FRONTEND_ORIGIN", "*")
    CORS(app, resources={r"/api/*": {"origins": cors_origins}}, supports_credentials=True)

    mail.init_app(app)
    app.register_blueprint(api, url_prefix="/api")

    @app.route("/")
    def root():
        return jsonify({"status": "ok", "service": "stockliveamazon-backend"})

    @app.errorhandler(Exception)
    def _handle_unexpected_error(error: Exception):  # pragma: no cover - emergency handler
        LOGGER.exception("Unhandled error: %s", error)
        return jsonify({"error": "internal-server-error"}), 500

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))