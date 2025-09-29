import psycopg2
from db import get_db_connection

class BlogPost:
    def __init__(self, title, content, author=None, date_posted=None, id=None):
        self.id = id
        self.title = title
        self.content = content
        self.author = author
        self.date_posted = date_posted

    @staticmethod
    def get_all_posts():
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, title, content, author, date_posted FROM blog_posts")
        posts_data = cursor.fetchall()
        conn.close()
        return [BlogPost(id=row[0], title=row[1], content=row[2], author=row[3], date_posted=row[4]) for row in posts_data]

    def save(self):
        conn = get_db_connection()
        cursor = conn.cursor()
        if self.id:  # Update existing post
            cursor.execute("UPDATE blog_posts SET title = %s, content = %s, author = %s WHERE id = %s",
                           (self.title, self.content, self.author, self.id))
        else:  # Insert new post
            cursor.execute("INSERT INTO blog_posts (title, content, author) VALUES (%s, %s, %s) RETURNING id",
                           (self.title, self.content, self.author))
            self.id = cursor.fetchone()[0]
        conn.commit()
        conn.close()

    # Add more methods as needed, such as delete, update, etc.

