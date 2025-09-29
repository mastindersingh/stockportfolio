# lessons.py
class Lesson:
    def __init__(self, title, content, description=None, author=None, date_posted=None):
        self.title = title
        self.content = content
        self.description = description or content[:140]
        self.author = author
        self.date_posted = date_posted

# Create an empty list to store lessons
lessons = []

# Function to add a new lesson
def add_lesson(title, content, description=None, author=None, date_posted=None):
    lesson = Lesson(title, content, description=description, author=author, date_posted=date_posted)
    lessons.append(lesson)

# Example lessons
add_lesson(
    "Introduction to Stock Trading",
    "Content for lesson 1...",
    description="Start with the basics of markets, brokers, and order types.",
    author="Author Name",
    date_posted="Date",
)
add_lesson(
    "Understanding Stock Market Trends",
    "Content for lesson 2...",
    description="Learn how to interpret price action and identify long-term trends.",
    author="Author Name",
    date_posted="Date",
)
# Add more lessons as needed

