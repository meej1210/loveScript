import { useEffect, useState } from 'react';
import { getEvents, addEvent } from './api';
import './index.css';
import LoveDays from './components/LoveDays';
import LoveChecklist from './components/LoveChecklist';

function App() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', date: '' });
  const [images, setImages] = useState([]);

  useEffect(() => {
    getEvents().then(setEvents);
    fetch('/api/image-stream')
      .then(response => response.json())
      .then(data => setImages(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addEvent(form);
    setForm({ title: '', description: '', date: '' });
    const updated = await getEvents();
    setEvents(updated);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">❤️ 恋爱记录</h1>

      {/* 纪念日组件 */}
      <LoveDays />

      {/* 图片流展示 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {images.map((image, index) => (
          <img
            key={index}
            src={`/api/images/${image}`}
            alt={image}
            className="w-full h-auto rounded shadow"
          />
        ))}
      </div>

      {/* 添加纪念日表单 */}
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input
          name="title"
          placeholder="标题"
          value={form.title}
          onChange={handleChange}
          required
          className="block w-full border px-2 py-1 rounded"
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
          className="block w-full border px-2 py-1 rounded"
        />
        <textarea
          name="description"
          placeholder="描述"
          value={form.description}
          onChange={handleChange}
          className="block w-full border px-2 py-1 rounded"
        />
        <button
          type="submit"
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
        >
          添加记录
        </button>
      </form>

      <ul className="space-y-2 mb-10">
        {events.map(ev => (
          <li key={ev.id} className="border p-2 rounded shadow">
            <strong>{ev.date} - {ev.title}</strong><br />
            <em>{ev.description}</em>
          </li>
        ))}
      </ul>

      {/* 爱的清单组件 */}
      <LoveChecklist />
    </div>
  );
}

export default App;
