const STORAGE_KEYS = {
  SMOKING_LOGS: 'cigi_smoking_logs',
  USER_CONFIG: 'cigi_user_config',
  SETTINGS: 'cigi_settings',
};

const DEFAULT_CONFIG = {
  reminderHours: 2,
  dailyGoal: 0,
  pricePerPack: 50000,
  cigarettesPerPack: 20,
  startDate: new Date().toISOString(),
  remindersEnabled: false,
};

export function getLogs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SMOKING_LOGS)) || [];
  } catch {
    return [];
  }
}

export function addLog() {
  const logs = getLogs();
  const newLog = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
  };
  logs.push(newLog);
  localStorage.setItem(STORAGE_KEYS.SMOKING_LOGS, JSON.stringify(logs));
  return newLog;
}

export function deleteLastLog() {
  const logs = getLogs();
  if (logs.length === 0) return false;
  logs.pop();
  localStorage.setItem(STORAGE_KEYS.SMOKING_LOGS, JSON.stringify(logs));
  return true;
}

export function deleteLogById(id) {
  const logs = getLogs().filter(l => l.id !== id);
  localStorage.setItem(STORAGE_KEYS.SMOKING_LOGS, JSON.stringify(logs));
}

export function getTodayLogs() {
  const today = new Date().toLocaleDateString('en-CA');
  return getLogs().filter(log => log.timestamp.startsWith(today));
}

export function getLogsForDate(dateStr) {
  return getLogs().filter(log => log.timestamp.startsWith(dateStr));
}

export function getConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_CONFIG));
    return { ...DEFAULT_CONFIG, ...saved };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function setConfig(config) {
  const current = getConfig();
  const updated = { ...current, ...config };
  localStorage.setItem(STORAGE_KEYS.USER_CONFIG, JSON.stringify(updated));
  return updated;
}

export function getSettings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || {
      startText: 'سلام! همراه ترک سیگار شما آماده است.',
      theme: 'dark',
    };
  } catch {
    return { startText: 'سلام! همراه ترک سیگار شما آماده است.', theme: 'dark' };
  }
}

export function setSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function getLastLog() {
  const logs = getLogs();
  return logs.length > 0 ? logs[logs.length - 1] : null;
}

export function getWeeklyData() {
  const logs = getLogs();
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-CA');
    const count = logs.filter(l => l.timestamp.startsWith(dateStr)).length;
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    data.push({ date: dateStr, count, dayName });
  }
  return data;
}

export function getMonthlyData() {
  const logs = getLogs();
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-CA');
    const count = logs.filter(l => l.timestamp.startsWith(dateStr)).length;
    data.push({ date: dateStr, count, day: d.getDate() });
  }
  return data;
}

export function getTotalSaved() {
  const config = getConfig();
  const logs = getLogs();
  const startDate = new Date(config.startDate);
  const now = new Date();
  const daysSinceStart = Math.max(1, Math.floor((now - startDate) / (1000 * 60 * 60 * 24)));

  const avgDaily = logs.length / daysSinceStart;
  const avgPerDay = avgDaily || 0;

  const moneySaved = Math.max(0, (daysSinceStart * avgPerDay * config.pricePerPack) / config.cigarettesPerPack);
  const cigarettesNotSmoked = Math.max(0, daysSinceStart * config.dailyGoal - logs.length);

  return { moneySaved, cigarettesNotSmoked, daysSinceStart };
}
