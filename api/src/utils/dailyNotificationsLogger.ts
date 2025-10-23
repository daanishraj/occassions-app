import * as fs from 'fs';
import * as path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
const logFileName = `daily-notifications-${timestamp}.log`;
const logFilePath = path.join(logsDir, logFileName);

// format log messages
const formatLogMessage = (level: string, ...params: any[]): string => {
  const timestamp = new Date().toISOString();
  const message = params.map(param => 
    typeof param === 'object' ? JSON.stringify(param, null, 2) : String(param)
  ).join(' ');
  return `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
};

const info = (...params: any) => {
  const message = formatLogMessage('info', ...params);
  
  console.log(...params);
  
  fs.appendFileSync(logFilePath, message);
};

const error = (...params: any) => {
  const message = formatLogMessage('error', ...params);
  
  console.error(...params);
  
  fs.appendFileSync(logFilePath, message);
};

export const dailyNotificationsLogger = {
  info,
  error,
  logFilePath
};
