import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { getConfig, getLastLog } from './storage';

const REMINDER_ID = 1;
const isNative = Capacitor.isNativePlatform();

let reminderTimeout = null;
let instantIdCounter = 100;

function nextInstantId() {
  return instantIdCounter++;
}

function reminderTitle() {
  return "Time's up!";
}

export async function arePermissionsGranted() {
  if (isNative) {
    try {
      const perm = await LocalNotifications.checkPermissions();
      return perm.display === 'granted';
    } catch {
      return false;
    }
  }
  return 'Notification' in window && Notification.permission === 'granted';
}

export async function isReminderEnabled() {
  return getConfig().remindersEnabled === true && (await arePermissionsGranted());
}

export async function requestNotificationPermission() {
  if (isNative) {
    try {
      const perm = await LocalNotifications.requestPermissions();
      return perm.display === 'granted';
    } catch {
      return false;
    }
  }

  // Web fallback
  if (!('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission === 'denied') {
    return false;
  }
  return Notification.requestPermission();
}

async function scheduleNative(id, title, body, at) {
  await LocalNotifications.schedule({
    notifications: [
      {
        id,
        title,
        body,
        schedule: { at, allowWhileIdle: true },
        isExactNotification: false,
        iconColor: '#6366f1',
        smallIcon: 'ic_stat_icon',
        sound: 'default',
        autoCancel: true,
        foreground: true,
      },
    ],
  });
}

async function sendNotification(title, body, options = {}) {
  if (isNative) {
    await scheduleNative(nextInstantId(), title, body, new Date(Date.now() + 1000));
    return;
  }

  // Web fallback
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

export async function scheduleReminder() {
  clearReminder();

  const config = getConfig();
  if (config.remindersEnabled !== true) return;

  const lastLog = getLastLog();
  if (!lastLog) return;

  const lastTime = new Date(lastLog.timestamp);
  const intervalMs = config.reminderHours * 60 * 60 * 1000;
  const nextReminder = new Date(lastTime.getTime() + intervalMs);
  const delay = nextReminder.getTime() - Date.now();

  const body =
    delay <= 0
      ? "You haven't smoked. Keep it up!"
      : `${config.reminderHours}h since your last cigarette. Great job!`;

  if (isNative) {
    const at = delay <= 0 ? new Date(Date.now() + 1000) : nextReminder;
    await scheduleNative(REMINDER_ID, reminderTitle(), body, at);
    return;
  }

  if (delay <= 0) {
    sendNotification(reminderTitle(), body);
    return;
  }

  reminderTimeout = setTimeout(() => {
    sendNotification(reminderTitle(), body);
  }, delay);
}

export async function clearReminder() {
  if (isNative) {
    try {
      await LocalNotifications.cancel({ notifications: [{ id: REMINDER_ID }] });
    } catch {
      // No pending reminder to cancel
    }
  }
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