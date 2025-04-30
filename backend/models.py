# models.py
import sqlite3

def init_db():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            date TEXT NOT NULL
        )
    ''')

    def init_db():
        conn = sqlite3.connect("database.db")
        c = conn.cursor()
        # 爱的清单
        c.execute('''
            CREATE TABLE IF NOT EXISTS love_list (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT NOT NULL,
                checked INTEGER DEFAULT 0
            )
        ''')
        conn.commit()
        conn.close()

    conn.commit()
    conn.close()
