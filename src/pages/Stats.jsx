import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, DollarSign, Cigarette, Calendar, Target } from 'lucide-react';
import { getWeeklyData, getMonthlyData, getLogs, getConfig } from '../utils/storage';

export default function StatsPage() {
  const [view, setView] = useState('weekly');

  const weeklyData = useMemo(() => getWeeklyData(), []);
  const monthlyData = useMemo(() => getMonthlyData(), []);
  const allLogs = useMemo(() => getLogs(), []);
  const config = useMemo(() => getConfig(), []);

  const data = view === 'weekly' ? weeklyData : monthlyData;
  const maxCount = Math.max(...data.map(d => d.count), 1);

  const totalCigarettes = allLogs.length;
  const todayCount = weeklyData[weeklyData.length - 1]?.count || 0;
  const yesterdayCount = weeklyData[weeklyData.length - 2]?.count || 0;

  const startDate = new Date(config.startDate);
  const daysSince = Math.max(1, Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  const avgPerDay = (totalCigarettes / daysSince).toFixed(1);

  const trend = todayCount - yesterdayCount;
  const trendIcon = trend < 0 ? TrendingDown : trend > 0 ? TrendingUp : Target;
  const TrendIcon = trendIcon;

  const totalSpent = (totalCigarettes * config.pricePerPack) / config.cigarettesPerPack;

  const last7 = weeklyData.slice(-7);
  const weeklyAvg = (last7.reduce((s, d) => s + d.count, 0) / 7).toFixed(1);
  const bestDay = Math.min(...weeklyData.map(d => d.count));
  const worstDay = Math.max(...weeklyData.map(d => d.count));

  return (
    <div className="page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="page-title">آمار و گزارش</h1>
      </motion.div>

      <motion.div
        className="stats-grid"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="stat-box">
          <div className="stat-value">{totalCigarettes}</div>
          <div className="stat-label">کل سیگارها</div>
        </div>
        <div className="stat-box">
          <div className="stat-value" style={{ color: trend <= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {todayCount}
          </div>
          <div className="stat-label">
            امروز
            {trend !== 0 && (
              <span style={{ marginRight: 4, color: trend < 0 ? 'var(--success)' : 'var(--danger)' }}>
                {trend > 0 ? '+' : ''}{trend}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="stats-grid"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="stat-box">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <DollarSign size={16} style={{ color: 'var(--warning)' }} />
            <div className="stat-value" style={{ fontSize: 20, color: 'var(--warning)' }}>
              {totalSpent.toLocaleString('fa-IR')}
            </div>
          </div>
          <div className="stat-label">تومان خرج شده</div>
        </div>
        <div className="stat-box">
          <div className="stat-value" style={{ color: 'var(--success)' }}>{avgPerDay}</div>
          <div className="stat-label">میانگین روزانه</div>
        </div>
      </motion.div>

      <motion.div
        className="card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button
            className="btn"
            style={{
              flex: 1,
              padding: '10px 12px',
              fontSize: 13,
              background: view === 'weekly' ? 'var(--accent)' : 'var(--bg-secondary)',
              color: view === 'weekly' ? 'var(--bg-primary)' : 'var(--text-secondary)',
              border: '1px solid ' + (view === 'weekly' ? 'var(--accent)' : 'var(--border)'),
            }}
            onClick={() => setView('weekly')}
          >
            هفتگی
          </button>
          <button
            className="btn"
            style={{
              flex: 1,
              padding: '10px 12px',
              fontSize: 13,
              background: view === 'monthly' ? 'var(--accent)' : 'var(--bg-secondary)',
              color: view === 'monthly' ? 'var(--bg-primary)' : 'var(--text-secondary)',
              border: '1px solid ' + (view === 'monthly' ? 'var(--accent)' : 'var(--border)'),
            }}
            onClick={() => setView('monthly')}
          >
            ماهانه
          </button>
        </div>

        <div className="bar-chart">
          {data.map((d, i) => {
            const height = maxCount > 0 ? (d.count / maxCount) * 100 : 0;
            const isToday = d.date === new Date().toLocaleDateString('en-CA');
            const label = view === 'weekly' ? d.dayName : d.day;
            return (
              <div key={d.date} className="bar-col">
                {d.count > 0 && (
                  <motion.span
                    className="bar-value"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.03 }}
                  >
                    {d.count}
                  </motion.span>
                )}
                <motion.div
                  className={`bar ${isToday ? 'today' : ''}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(height, 2)}%` }}
                  transition={{ delay: 0.2 + i * 0.03, duration: 0.5, ease: 'easeOut' }}
                />
                <span className="bar-label">{label}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        className="card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
          خلاصه عملکرد
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              <Calendar size={14} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 6 }} />
              روزهای فعال
            </span>
            <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{daysSince} روز</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              <Cigarette size={14} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 6 }} />
              میانگین هفتگی
            </span>
            <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{weeklyAvg}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--success)', fontSize: 14 }}>
              🎯 بهترین روز
            </span>
            <span style={{ fontWeight: 700, color: 'var(--success)' }}>{bestDay} سیگار</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--danger)', fontSize: 14 }}>
              ⚠️ بدترین روز
            </span>
            <span style={{ fontWeight: 700, color: 'var(--danger)' }}>{worstDay} سیگار</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
