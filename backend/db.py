import os
import psycopg2
import pandas as pd
from werkzeug.security import generate_password_hash, check_password_hash

def get_db_connection():
    return psycopg2.connect(
        host=os.environ.get("POSTGRES_HOST"),
        database=os.environ.get("POSTGRES_DATABASE"),
        user=os.environ.get("POSTGRES_USER"),
        password=os.environ.get("POSTGRES_PASSWORD"),
        port=os.environ.get("POSTGRES_PORT", "5432")  # Defaulting to 5432 if not set
    )



def verify_subscription_code(email, code):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id FROM users WHERE email = %s AND subscription_code = %s", (email, code))
        result = cursor.fetchone()
        return result is not None
    except Exception as e:
        print(f"Error in verify_subscription_code: {e}")
        return False
    finally:
        conn.close()

def update_subscription_code(user_id, code):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE users SET subscription_code = %s WHERE id = %s", (code, user_id))
        conn.commit()
    except Exception as e:
        print(f"Error in update_subscription_code: {e}")
    finally:
        conn.close()




def delete_stock(ticker):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Check if the stock exists
        cursor.execute("SELECT id FROM stocks WHERE ticker = %s", (ticker,))
        stock = cursor.fetchone()
        if stock:
            stock_id = stock[0]

            # Delete related records from stock_purchases, stock_sales, and user_stocks
            cursor.execute("DELETE FROM stock_purchases WHERE stock_id = %s", (stock_id,))
            cursor.execute("DELETE FROM stock_sales WHERE stock_id = %s", (stock_id,))
            cursor.execute("DELETE FROM user_stocks WHERE stock_id = %s", (stock_id,))

            # Finally, delete the stock record
            cursor.execute("DELETE FROM stocks WHERE id = %s", (stock_id,))
            conn.commit()
            print(f"Stock with ticker '{ticker}' and related records have been deleted.")
        else:
            print(f"No stock found with ticker '{ticker}'.")
    except psycopg2.Error as e:
        print(f"Database error: {e}")
        conn.rollback()  # Rollback in case of error
    finally:
        conn.close()



def get_subscription_code_for_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT subscription_code FROM users WHERE id = %s", (user_id,))
        result = cursor.fetchone()
        return result[0] if result else None
    except Exception as e:
        print(f"Error in get_subscription_code_for_user: {e}")
        return None
    finally:
        conn.close()






def read_stock_purchases(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT s.ticker, sp.buy_date, sp.buy_price, sp.quantity 
        FROM stock_purchases sp
        JOIN stocks s ON sp.stock_id = s.id
        WHERE sp.user_id = %s
    """, (user_id,))
    stock_purchases = cursor.fetchall()
    conn.close()
    return pd.DataFrame(stock_purchases, columns=['Ticker', 'BuyDate', 'BuyPrice', 'Quantity'])


def write_stock_purchases(user_id, new_data):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        for _, row in new_data.iterrows():
            ticker = row['Ticker']
            # Check if the stock ticker exists
            cursor.execute("SELECT id FROM stocks WHERE ticker = %s", (ticker,))
            result = cursor.fetchone()

            if result:
                stock_id = result[0]
            else:
                # Insert new stock ticker
                cursor.execute("INSERT INTO stocks (ticker) VALUES (%s) RETURNING id", (ticker,))
                stock_id = cursor.fetchone()[0]

            # Now insert into stock_purchases with the stock_id
            cursor.execute(
                "INSERT INTO stock_purchases (user_id, stock_id, buy_date, buy_price, quantity) VALUES (%s, %s, %s, %s, %s)",
                (user_id, stock_id, row['BuyDate'], row['BuyPrice'], row['Quantity'])
            )
        conn.commit()
    except psycopg2.Error as e:
        print(f"Database error: {e}")
    finally:
        conn.close()







def get_user_id(email):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        result = cursor.fetchone()
        return result[0] if result else None
    except Exception as e:
       # print(f"Error in get_user_id: {e}")
        print(f"Error in get_user_id for email {email}: {e}")
        return None
    finally:
        conn.close()


def create_user(email, password):
    conn = get_db_connection()
    cursor = conn.cursor()
    hashed_password = generate_password_hash(password)
    try:
        cursor.execute("INSERT INTO users (email, password) VALUES (%s, %s)", (email, hashed_password))
        conn.commit()
    except psycopg2.Error as e:
        print(f"Database error: {e}")
    finally:
        conn.close()

def verify_user(email, password):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT password FROM users WHERE email = %s", (email,))
    user_record = cursor.fetchone()
    conn.close()
    if user_record:
        return check_password_hash(user_record[0], password)
    return False

# Function to add a stock to a user's portfolio
def add_stock_to_user(user_id, stock_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO user_stocks (user_id, stock_id) VALUES (%s, %s)", (user_id, stock_id))
        conn.commit()
    except psycopg2.Error as e:
        print(f"Database error: {e}")
    finally:
        conn.close()

def get_user_stocks(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT s.id, s.ticker, COALESCE(SUM(sp.quantity), 0) as total_quantity
            FROM user_stocks us
            JOIN stocks s ON us.stock_id = s.id
            LEFT JOIN stock_purchases sp ON s.id = sp.stock_id AND sp.user_id = us.user_id
            WHERE us.user_id = %s
            GROUP BY s.id
        """, (user_id,))
        stocks = cursor.fetchall()
        return stocks
    except psycopg2.Error as e:
        print(f"Database error: {e}")
    finally:
        conn.close()



def get_master_user_stocks():
    master_email = 'mastinder@yahoo.com'
    master_user_id = get_user_id(master_email)
    return get_user_stocks(master_user_id) if master_user_id else []



def get_usa_user_stocks():
    usa_email = 'stockliveedu@gmail.com'  # Replace with the actual USA user's email
    usa_user_id = get_user_id(usa_email)
    
    # Fetch and return the stocks for the USA user if the user ID is found
    return get_user_stocks(usa_user_id) if usa_user_id else []



def check_user(email, password):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT password FROM users WHERE email = %s", (email,))
        user_record = cursor.fetchone()
        if user_record and check_password_hash(user_record[0], password):
            return True
        else:
            return False
    except psycopg2.Error as e:
        print(f"Database error: {e}")
        return False
    finally:
        conn.close()



# db.py

def create_google_user(email, google_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO users (email, google_id) VALUES (%s, %s)", (email, google_id))
        conn.commit()
    except psycopg2.Error as e:
        print(f"Database error: {e}")
    finally:
        conn.close()

def get_google_user(email):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, email, google_id FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        return user
    except psycopg2.Error as e:
        print(f"Database error: {e}")
    finally:
        conn.close()

