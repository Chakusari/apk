import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Cigarette, DollarSign, RotateCcw, Info, ChevronDown, Target } from 'lucide-react';
import { getConfig, setConfig, getLogs } from '../utils/storage';
import { scheduleReminder } from '../utils/notifications';

export default function SettingsPage() {
  const config = useMemo(() => getConfig(), []);
  const [reminderHours, setReminderHours] = useState(config.reminderHours);
  const [dailyGoal, setDailyGoal] = useState(config.dailyGoal);
  const [pricePerPack, setPricePerPack] = useState(config.pricePerPack);
  const [cigsPerPack, setCigsPerPack] = useState(config.cigarettesPerPack);
  const [toast, setToast] = useState(null);
  const [showReset, setShowReset] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const saveSettings = (updates) => {
    const newConfig = setConfig(updates);
    if (updates.reminderHours !== undefined) {
      scheduleReminder();
    }
    showToast('ذخیره شد');
  };

  const handleReset = () => {
    localStorage.removeItem('cigi_smoking_logs');
    localStorage.removeItem('cigi_user_config');
    setShowReset(false);
    showToast('تمام اطلاعات پاک شد');
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="page">
      {toast && (
        <motion.div
          className={`toast ${toast.type}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {toast.msg}
        </motion.div>
      )}

      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="page-title">تنظیمات</h1>
      </motion.div>

      <motion.div
        className="setting-group"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="setting-group-title">یادآوری</div>
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label">
              <Clock size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 6, color: 'var(--accent)' }} />
              فاصله یادآوری
            </div>
            <div className="setting-desc">هر چند ساعت یادآوری بده</div>
          </div>
          <div className="setting-value">
            <button
              className="counter-btn"
              onClick={() => {
                const v = Math.max(1, reminderHours - 1);
                setReminderHours(v);
                saveSettings({ reminderHours: v });
              }}
            >
              -
            </button>
            <span className="counter-value">{reminderHours}</span>
            <button
              className="counter-btn"
              onClick={() => {
                const v = Math.min(12, reminderHours + 1);
                setReminderHours(v);
                saveSettings({ reminderHours: v });
              }}
            >
              +
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="setting-group"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="setting-group-title">هدف گذاری</div>
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label">
              <Target size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 6, color: 'var(--success)' }} />
              هدف روزانه
            </div>
            <div className="setting-desc">حداکثر سیگار در روز (0 = بدون محدودیت)</div>
          </div>
          <div className="setting-value">
            <button
              className="counter-btn"
              onClick={() => {
                const v = Math.max(0, dailyGoal - 1);
                setDailyGoal(v);
                saveSettings({ dailyGoal: v });
              }}
            >
              -
            </button>
            <span className="counter-value">{dailyGoal}</span>
            <button
              className="counter-btn"
              onClick={() => {
                const v = dailyGoal + 1;
                setDailyGoal(v);
                saveSettings({ dailyGoal: v });
              }}
            >
              +
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="setting-group"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="setting-group-title">هزینه</div>
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label">
              <DollarSign size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 6, color: 'var(--warning)' }} />
              قیمت هر پاکت
            </div>
            <div className="setting-desc">قیمت به تومان</div>
          </div>
          <div className="setting-value">
            <button
              className="counter-btn"
              onClick={() => {
                const v = Math.max(5000, pricePerPack - 5000);
                setPricePerPack(v);
                saveSettings({ pricePerPack: v });
              }}
            >
              -
            </button>
            <span className="counter-value" style={{ fontSize: 14 }}>
              {(pricePerPack / 1000).toFixed(0)}k
            </span>
            <button
              className="counter-btn"
              onClick={() => {
                const v = pricePerPack + 5000;
                setPricePerPack(v);
                saveSettings({ pricePerPack: v });
              }}
            >
              +
            </button>
          </div>
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label">
              <Cigarette size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 6, color: 'var(--accent)' }} />
              تعداد در پاکت
            </div>
          </div>
          <div className="setting-value">
            <button
              className="counter-btn"
              onClick={() => {
                const v = Math.max(10, cigsPerPack - 1);
                setCigsPerPack(v);
                saveSettings({ cigarettesPerPack: v });
              }}
            >
              -
            </button>
            <span className="counter-value">{cigsPerPack}</span>
            <button
              className="counter-btn"
              onClick={() => {
                const v = Math.min(30, cigsPerPack + 1);
                setCigsPerPack(v);
                saveSettings({ cigarettesPerPack: v });
              }}
            >
              +
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="setting-group"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="setting-group-title">مدیریت داده</div>
        {!showReset ? (
          <button className="btn btn-danger" onClick={() => setShowReset(true)}>
            <RotateCcw size={18} />
            پاک کردن تمام اطلاعات
          </button>
        ) : (
          <div className="card" style={{ borderColor: 'var(--danger)' }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                مطمئنی؟
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                تمام لاگ‌ها و تنظیمات پاک می‌شوند
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn btn-danger"
                style={{ flex: 1 }}
                onClick={handleReset}
              >
                بله، پاک کن
              </button>
              <button
                className="btn"
                style={{
                  flex: 1,
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}
                onClick={() => setShowReset(false)}
              >
                لغو
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: 12 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Info size={14} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
        سیگی v1.0 — همراه ترک سیگار
      </motion.div>
    </div>
  );
}
