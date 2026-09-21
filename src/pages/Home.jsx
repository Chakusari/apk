import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, Trash2, Clock } from 'lucide-react';
import { addLog, deleteLastLog, getTodayLogs, getConfig } from '../utils/storage';
import { scheduleReminder, clearReminder, getTimeSinceLastSmoke, requestNotificationPermission, getNextReminderTime } from '../utils/notifications';

export default function HomePage() {
  const [todayCount, setTodayCount] = useState(0);
  const [timeSince, setTimeSince] = useState(null);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [toast, setToast] = useState(null);
  const [nextReminder, setNextReminder] = useState(null);
  const [ripples, setRipples] = useState([]);
  const notifRef = useRef(false);

  const refresh = useCallback(() => {
    setTodayCount(getTodayLogs().length);
    setTimeSince(getTimeSinceLastSmoke());
    setNextReminder(getNextReminderTime());
    setNotificationEnabled(
      'Notification' in window && Notification.permission === 'granted'
    );
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 1000);
    return () => clearInterval(interval);
  }, [refresh]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      notifRef.current = true;
    }
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleSmoke = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600);

    addLog();
    clearReminder();
    scheduleReminder();
    refresh();
    showToast('Logged!');
  };

  const handleUndo = () => {
    if (deleteLastLog()) {
      clearReminder();
      scheduleReminder();
      refresh();
      showToast('Last entry removed');
    } else {
      showToast('Nothing to undo', 'error');
    }
  };

  const handleNotificationToggle = () => {
    if (notificationEnabled) {
      setNotificationEnabled(false);
      return;
    }
    requestNotificationPermission().then((granted) => {
      setNotificationEnabled(granted);
      if (granted) {
        scheduleReminder();
        showToast('Reminders enabled');
      }
    });
  };

  const config = getConfig();
  const hours = timeSince?.hours || 0;
  const minutes = timeSince?.minutes || 0;
  const seconds = timeSince?.seconds || 0;

  return (
    <div className="page">
      {toast && (
        <motion.div
          className={`toast ${toast.type}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {toast.msg}
        </motion.div>
      )}

      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="page-title">Cigi</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: 2, fontWeight: 500 }}>
            Your quit companion
          </p>
        </div>
        <button
          onClick={handleNotificationToggle}
          style={{
            marginLeft: 'auto',
            background: notificationEnabled ? 'var(--accent-glow)' : 'none',
            border: 'none',
            color: notificationEnabled ? 'var(--accent-light)' : 'var(--text-muted)',
            cursor: 'pointer',
            padding: 10,
            borderRadius: '50%',
            transition: 'all 0.2s ease',
          }}
        >
          {notificationEnabled ? <Bell size={22} /> : <BellOff size={22} />}
        </button>
      </motion.div>

      {!notificationEnabled && (
        <motion.div
          className="notification-banner"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <span style={{ fontSize: 20 }}>🔔</span>
          <span className="notification-banner-text">
            Enable reminders to get notified when it's time to stay smoke-free
          </span>
          <button
            className="notification-banner-btn"
            onClick={handleNotificationToggle}
          >
            Enable
          </button>
        </motion.div>
      )}

      <motion.div
        className="stats-grid"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="stat-box">
          <div className="stat-value">{todayCount}</div>
          <div className="stat-label">Today</div>
        </div>
        <div className="stat-box">
          <div className="stat-value" style={{ color: 'var(--success)' }}>
            {timeSince ? `${hours}:${String(minutes).padStart(2, '0')}` : '--:--'}
          </div>
          <div className="stat-label">Since Last</div>
        </div>
      </motion.div>

      {timeSince && (
        <motion.div
          className="card"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          <div style={{ textAlign: 'center', marginBottom: 8, fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <Clock size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
            Time Since Last Cigarette
          </div>
          <div className="timer-display">
            <div className="timer-unit">
              <motion.span
                className="timer-number"
                key={hours}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {String(hours).padStart(2, '0')}
              </motion.span>
              <span className="timer-label">Hours</span>
            </div>
            <span className="timer-sep">:</span>
            <div className="timer-unit">
              <motion.span
                className="timer-number"
                key={minutes}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {String(minutes).padStart(2, '0')}
              </motion.span>
              <span className="timer-label">Min</span>
            </div>
            <span className="timer-sep">:</span>
            <div className="timer-unit">
              <motion.span
                className="timer-number"
                key={seconds}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ color: 'var(--text-muted)', fontSize: 32 }}
              >
                {String(seconds).padStart(2, '0')}
              </motion.span>
              <span className="timer-label">Sec</span>
            </div>
          </div>

          {nextReminder && notificationEnabled && (
            <div className="next-reminder">
              <Bell size={15} className="next-reminder-icon" />
              <span className="next-reminder-text">
                Next reminder at{' '}
                <span className="next-reminder-time">
                  {nextReminder.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </span>
            </div>
          )}
        </motion.div>
      )}

      <motion.div
        className="smoke-btn-container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        <button className="smoke-btn" onClick={handleSmoke}>
          {ripples.map(r => (
            <span
              key={r.id}
              className="btn-ripple"
              style={{ left: r.x, top: r.y, width: 10, height: 10 }}
            />
          ))}
          <span className="smoke-btn-emoji">🚬</span>
          <span>Log Cigarette</span>
        </button>
      </motion.div>

      {todayCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button className="btn btn-danger" onClick={handleUndo}>
            <Trash2 size={18} />
            Undo Last
          </button>
        </motion.div>
      )}

      {todayCount > 0 && (
        <motion.div
          className="card"
          style={{ marginTop: 16 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12, textAlign: 'center', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Today's Log
          </div>
          <div className="log-list">
            {getTodayLogs()
              .slice()
              .reverse()
              .map((log, i) => {
                const t = new Date(log.timestamp);
                return (
                  <div key={log.id} className="log-item">
                    <div>
                      <div className="log-time">
                        {t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {i > 0 && (
                        <div className="log-date">
                          {(() => {
                            const prev = getTodayLogs().slice().reverse();
                            if (prev[i - 1]) {
                              const diff = new Date(log.timestamp) - new Date(prev[i - 1].timestamp);
                              const h = Math.floor(diff / 3600000);
                              const m = Math.floor((diff % 3600000) / 60000);
                              return h > 0 ? `${h}h ${m}m ago` : `${m}m ago`;
                            }
                            return null;
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
