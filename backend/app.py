# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from models import init_db

from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)  # 开启跨域支持
init_db()


@app.route('/love-list', methods=['GET'])
def get_love_list():
    conn = get_db_connection()
    items = conn.execute('SELECT * FROM love_list').fetchall()
    conn.close()
    return jsonify([dict(item) for item in items])

@app.route('/love-list', methods=['POST'])
def add_love_item():
    data = request.json
    content = data.get('content')
    if not content:
        return jsonify({'error': 'Content required'}), 400
    conn = get_db_connection()
    conn.execute('INSERT INTO love_list (content, checked) VALUES (?, 0)', (content,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Item added'}), 201

@app.route('/love-list/<int:item_id>', methods=['PATCH'])
def toggle_love_item(item_id):
    data = request.json
    checked = data.get('checked')
    conn = get_db_connection()
    conn.execute('UPDATE love_list SET checked = ? WHERE id = ?', (int(checked), item_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Item updated'})



@app.route('/love-days', methods=['GET'])
def love_days():
    # 假设你们在一起的日期
    start_date_str = '2024-12-27'
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
    today = datetime.today()

    # 计算在一起的天数
    days_together = (today - start_date).days

    # 下一次纪念日（100 天整）
    next_100 = ((days_together // 100) + 1) * 100
    next_100_day = start_date + timedelta(days=next_100)
    countdown_100 = (next_100_day - today).days

    # 一周年纪念（每年）
    next_anniversary_year = today.year if today.month < start_date.month or (
                today.month == start_date.month and today.day < start_date.day) else today.year + 1
    next_anniversary = datetime(next_anniversary_year, start_date.month, start_date.day)
    countdown_anniversary = (next_anniversary - today).days

    return jsonify({
        "days_together": days_together,
        "next_100_day": next_100_day.strftime('%Y-%m-%d'),
        "countdown_100": countdown_100,
        "next_anniversary": next_anniversary.strftime('%Y-%m-%d'),
        "countdown_anniversary": countdown_anniversary
    })



def get_db_connection():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

from flask import Response
import json

# 定义根路径路由
@app.route('/')
def index():
    return "Welcome to the Love Records API!"

@app.route('/events', methods=['GET'])
def get_events():
    try:
        conn = get_db_connection()
        events = conn.execute('SELECT * FROM events').fetchall()
        conn.close()
        print("Fetched events:", events)  # 添加调试信息
        return Response(
            json.dumps([dict(event) for event in events], ensure_ascii=False),
            content_type='application/json; charset=utf-8'
        )
    except Exception as e:
        print("Error fetching events:", e)
        return jsonify({'error': 'Failed to fetch events'}), 500

@app.route('/events', methods=['POST'])
def add_event():
    try:
        data = request.json
        title = data.get('title')
        description = data.get('description')
        date = data.get('date')
        if not title or not date:
            return jsonify({'error': 'Title and date required'}), 400
        conn = get_db_connection()
        conn.execute('INSERT INTO events (title, description, date) VALUES (?, ?, ?)',
                     (title, description, date))
        conn.commit()
        conn.close()
        print("Event added successfully")  # 添加调试信息
        return jsonify({'message': 'Event added successfully'}), 201
    except Exception as e:
        print("Error adding event:", e)
        return jsonify({'error': 'Failed to add event'}), 500
if __name__ == '__main__':
    app.run(debug=True)