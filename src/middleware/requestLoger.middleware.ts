import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

const logDir = path.join(__dirname, '..', 'logs');
const logFile = path.join(logDir, 'api-requests.log');

export function requestLogger(req: Request, _res: Response, next: NextFunction) {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip;

  const logMessage = `[${timestamp}] ${method} ${url} - IP: ${ip}\n`;
  
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  fs.appendFile(logFile, logMessage, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });

  next();
}