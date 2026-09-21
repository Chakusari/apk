import { getConfig, getLastLog } from './storage';

let reminderTimeout = null;

export async function requestNotificationPermission() {
  if ('Notification' in window) {
    const result = await Notification.requestPermission();
    return result === 'granted';
  }
  return false;
}

export function sendNotification(title, body, options = {}) {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notif = new Notification(title, {
      body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
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
      'زمان آزاده! 🔔',
      'اگه هنوز نکشیدی، دمت گرم! بهتره ادامه بدی.'
    );
    return;
  }

  reminderTimeout = setTimeout(() => {
    sendNotification(
      'زمان آزاده! 🔔',
      `${config.reminderHours} ساعت از آخرین سیگارت گذشت. اگه نکشیدی، آفرین!`
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
