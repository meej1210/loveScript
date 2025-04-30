// frontend/src/components/LoveDays.jsx
import React from 'react';

function LoveDays() {
  const startDate = new Date('2023-12-27'); // 修改为你们在一起的日期
  const today = new Date();

  const diffTime = Math.abs(today - startDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const next100 = 100 - (diffDays % 100);
  const nextAnniversary = new Date(startDate);
  nextAnniversary.setFullYear(today.getFullYear());

  if (nextAnniversary < today) {
    nextAnniversary.setFullYear(today.getFullYear() + 1);
  }

  const formatDate = (date) =>
    date.toISOString().split('T')[0].replace(/-/g, '/');

  return (
    <div style={{ marginBottom: 20, background: '#ffe0e9', padding: 15, borderRadius: 8 }}>
      <h2>🎉 纪念日提醒</h2>
      <p>在一起已经 <strong>{diffDays}</strong> 天啦 ❤️</p>
      <p>距离下一个百日纪念还有 <strong>{next100}</strong> 天</p>
      <p>下一次周年纪念是 <strong>{formatDate(nextAnniversary)}</strong></p>
    </div>
  );
}

export default LoveDays;
