import { getConfig, getLastLog } from './storage';

let reminderTimeout = null;

export function requestNotificationPermission() {
  if (!('Notification' in window)) {
    return Promise.resolve(false);
  }
  if (Notification.permission === 'granted') {
    return Promise.resolve(true);
  }
  if (Notification.permission === 'denied') {
    return Promise.resolve(false);
  }
  return Notification.requestPermission();
}

export function sendNotification(title, body, options = {}) {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notif = new Notification(title, {
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [200, 100, 200],
      tag: 'cigi-reminder',
      renotify: true,
      ...options,
    });
    notif.onclick = () => {
      window.focus();
      notif.close();
    };
  }
}

export function scheduleReminder() {
  clearReminder();

  const config = getConfig();
  const lastLog = getLastLog();

  if (!lastLog) return;

  const lastTime = new Date(lastLog.timestamp);
  const intervalMs = config.reminderHours * 60 * 60 * 1000;
  const nextReminder = lastTime.getTime() + intervalMs;
  const now = Date.now();
  const delay = Math.max(0, nextReminder - now);

  if (delay === 0) {
    sendNotification(
      "Time's up!",
      "You haven't smoked. Keep it up!"
    );
    return;
  }

  reminderTimeout = setTimeout(() => {
    sendNotification(
      "Time's up!",
      `${config.reminderHours}h since your last cigarette. Great job!`
    );
  }, delay);
}

export function clearReminder() {
  if (reminderTimeout) {
    clearTimeout(reminderTimeout);
    reminderTimeout = null;
  }
}

export function getTimeSinceLastSmoke() {
  const lastLog = getLastLog();
  if (!lastLog) return null;

  const now = new Date();
  const last = new Date(lastLog.timestamp);
  const diffMs = now - last;

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, totalMs: diffMs };
}

export function getNextReminderTime() {
  const config = getConfig();
  const lastLog = getLastLog();
  if (!lastLog) return null;

  const lastTime = new Date(lastLog.timestamp);
  const intervalMs = config.reminderHours * 60 * 60 * 1000;
  return new Date(lastTime.getTime() + intervalMs);
}
