from __future__ import annotations

import logging
from dataclasses import dataclass
from datetime import date, datetime
from decimal import Decimal, ROUND_HALF_UP
from typing import Any, Dict, List

import pandas as pd
import yfinance as yf

LOGGER = logging.getLogger(__name__)

DecimalLike = Decimal


@dataclass
class PortfolioSummary:
    total_invested: DecimalLike
    total_return: DecimalLike
    total_current_value: DecimalLike
    percentage_up: float


@dataclass
class PortfolioHolding:
    ticker: str
    long_name: str | None
    sector: str | None
    market_cap: int | None
    earliest_buy_date: str | None
    weighted_avg_price: float
    current_price: float
    total_quantity: float
    performance: str
    percentage_change: float
    invested: float
    current_value: float
    history: List[Dict[str, float | str]]


class PortfolioBuilderError(RuntimeError):
    """Raised when portfolio data cannot be computed."""


def build_portfolio(stock_purchases: pd.DataFrame) -> Dict[str, Any]:
    """Transform raw stock purchase data into the API payload structure.

    Args:
        stock_purchases: DataFrame with columns `Ticker`, `BuyDate`, `BuyPrice`, `Quantity`.

    Returns:
        Dict matching the PortfolioResponse expected by the frontend.
    """
    if stock_purchases is None or stock_purchases.empty:
        summary = PortfolioSummary(
            total_invested=Decimal("0"),
            total_return=Decimal("0"),
            total_current_value=Decimal("0"),
            percentage_up=0.0,
        )
        return {
            "summary": _serialize_summary(summary),
            "holdings": [],
        }

    holdings: List[PortfolioHolding] = []
    total_invested = Decimal("0")
    total_current_value = Decimal("0")

    grouped = stock_purchases.groupby("Ticker")

    for ticker, group in grouped:
        try:
            holding = _build_holding(ticker, group)
        except Exception as exc:  # noqa: BLE001 - we want to keep processing other tickers
            LOGGER.warning("Failed to build holding for ticker %s: %s", ticker, exc)
            continue

        total_invested += Decimal(str(holding.invested))
        total_current_value += Decimal(str(holding.current_value))
        holdings.append(holding)

    total_return = total_current_value - total_invested
    percentage_up = float(
        _quantize((total_return / total_invested) * 100) if total_invested != 0 else Decimal("0")
    )

    summary = PortfolioSummary(
        total_invested=total_invested,
        total_return=total_return,
        total_current_value=total_current_value,
        percentage_up=percentage_up,
    )

    return {
        "summary": _serialize_summary(summary),
        "holdings": [_serialize_holding(holding) for holding in holdings],
    }


def _build_holding(ticker: str, group: pd.DataFrame) -> PortfolioHolding:
    total_quantity = float(group["Quantity"].sum())
    if total_quantity <= 0:
        raise PortfolioBuilderError("quantity must be positive")

    invested = Decimal("0")
    for _, row in group.iterrows():
        invested += Decimal(str(row["BuyPrice"])) * Decimal(str(row["Quantity"]))

    weighted_avg_price = float(
        _quantize(invested / Decimal(str(total_quantity))) if total_quantity else Decimal("0")
    )

    ticker_client = yf.Ticker(ticker)
    try:
        history_df = ticker_client.history(period="6mo", interval="1d")
    except Exception as exc:  # noqa: BLE001
        raise PortfolioBuilderError(f"unable to retrieve history: {exc}") from exc

    if history_df.empty:
        raise PortfolioBuilderError("empty price history")

    current_price = float(_quantize(Decimal(str(history_df["Close"].iloc[-1]))))
    current_value = float(_quantize(Decimal(str(current_price)) * Decimal(str(total_quantity))))

    percentage_change = 0.0
    performance = "Neutral"
    if weighted_avg_price:
        percentage_change = float(
            _quantize(
                ((Decimal(str(current_price)) - Decimal(str(weighted_avg_price)))
                 / Decimal(str(weighted_avg_price)))
                * 100
            )
        )
        performance = "Up" if current_price >= weighted_avg_price else "Down"

    history_points = _extract_history(history_df)
    info = _safe_info(ticker_client)

    earliest_buy_date = _format_date(group["BuyDate"].min())

    return PortfolioHolding(
        ticker=ticker,
        long_name=info.get("longName"),
        sector=info.get("sector"),
        market_cap=info.get("marketCap"),
        earliest_buy_date=earliest_buy_date,
        weighted_avg_price=weighted_avg_price,
        current_price=current_price,
        total_quantity=total_quantity,
        performance=performance,
        percentage_change=percentage_change,
        invested=float(_quantize(invested)),
        current_value=current_value,
        history=history_points,
    )


def _extract_history(history_df: pd.DataFrame) -> List[Dict[str, float | str]]:
    trimmed = history_df[["Close"]].tail(180).reset_index()
    history: List[Dict[str, float | str]] = []
    for _, row in trimmed.iterrows():
        date_value = row["Date"]
        if isinstance(date_value, (datetime, date)):
            date_string = date_value.strftime("%Y-%m-%d")
        else:
            date_string = str(date_value)
        history.append({"date": date_string, "close": round(float(row["Close"]), 2)})
    return history


def _safe_info(ticker: yf.Ticker) -> Dict[str, Any]:
    try:
        return ticker.info or {}
    except Exception as exc:  # noqa: BLE001
        LOGGER.debug("Failed to fetch ticker.info: %s", exc)
        return {}


def _format_date(value: Any) -> str | None:
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return None
    if isinstance(value, (datetime, date)):
        return value.strftime("%Y-%m-%d")
    return str(value)


def _quantize(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def _serialize_summary(summary: PortfolioSummary) -> Dict[str, float]:
    return {
        "totalInvested": float(_quantize(summary.total_invested)),
        "totalReturn": float(_quantize(summary.total_return)),
        "totalCurrentValue": float(_quantize(summary.total_current_value)),
        "percentageUp": float(summary.percentage_up),
    }


def _serialize_holding(holding: PortfolioHolding) -> Dict[str, Any]:
    return {
        "ticker": holding.ticker,
        "longName": holding.long_name,
        "sector": holding.sector,
        "marketCap": holding.market_cap,
        "earliestBuyDate": holding.earliest_buy_date,
        "weightedAvgPrice": holding.weighted_avg_price,
        "currentPrice": holding.current_price,
        "totalQuantity": holding.total_quantity,
        "performance": holding.performance,
        "percentageChange": holding.percentage_change,
        "invested": holding.invested,
        "currentValue": holding.current_value,
        "history": holding.history,
    }
