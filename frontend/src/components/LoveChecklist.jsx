import { useEffect, useState } from 'react';

// ✅ 组件1：从后端加载的“爱的清单”
export function ChecklistFromServer() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');

  const fetchItems = async () => {
    const res = await fetch('http://localhost:5000/love-list');
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async () => {
    if (!input.trim()) return;
    await fetch('http://localhost:5000/love-list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: input })
    });
    setInput('');
    fetchItems();
  };

  const toggleChecked = async (id, checked) => {
    await fetch(`http://localhost:5000/love-list/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checked: !checked })
    });
    fetchItems();
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">📖 爱的清单</h2>
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 border rounded px-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="想一起做的事..."
        />
        <button className="bg-pink-500 text-white px-4 py-1 rounded" onClick={handleAdd}>
          添加
        </button>
      </div>
      <ul>
        {items.map(item => (
          <li key={item.id} className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={!!item.checked}
              onChange={() => toggleChecked(item.id, item.checked)}
            />
            <span className={item.checked ? 'line-through text-gray-500' : ''}>{item.content}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ✅ 组件2：本地清单 + 爱的句子
export default function LoveChecklist() {
  const initialThingsToDo = [
    { id: 1, text: '一起去旅行', done: false },
    { id: 2, text: '一起做饭', done: false },
    { id: 3, text: '一起看电影', done: false },
  ];

  const loveMessages = [
    "你笑的样子是世界上最治愈的风景。",
    "每天醒来能看到你，就是幸福的开始。",
    "谢谢你出现在我的生命里。",
    // ...更多句子
  ];

  const [thingsToDo, setThingsToDo] = useState(initialThingsToDo);

  const toggleItem = (id) => {
    setThingsToDo(thingsToDo.map(item =>
      item.id === id ? { ...item, done: !item.done } : item
    ));
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">💖 想一起做的事</h2>
      <ul className="space-y-2">
        {thingsToDo.map(item => (
          <li
            key={item.id}
            className={`flex items-center p-2 rounded shadow cursor-pointer ${
              item.done ? 'bg-green-100 line-through' : 'bg-white'
            }`}
            onClick={() => toggleItem(item.id)}
          >
            <input type="checkbox" checked={item.done} readOnly className="mr-2" />
            {item.text}
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4">📜 想对你说的一百句话</h2>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        {loveMessages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
