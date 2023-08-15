import logger from 'pino';
import dayjs from 'dayjs';
require('dotenv').config();

{/* I like having nice logs so just a small util for logging */}
const level = process.env.LOG_LEVEL || 'info';

const log = logger({
  level,
  transport: {
    target: 'pino-pretty',
  },
  base: { pid: false },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

export default log;
