
import path from 'path';
import { createLogger,transports,format } from 'winston'

const logDir = path.join(__dirname,"../../logs")

export const logger = createLogger({
    level: "debug",
    format: format.combine(
        format.colorize(),
        format.timestamp({ format: "HH:mm:ss" }),
        format.errors({ stack: true }),
        format.printf(({ level, message, timestamp, stack } )=> {
    return stack ? `${timestamp} ${level}:${message} - stack: ${stack}`
        :`${timestamp} ${level}:${message}`;
        })
        
    ),
    transports: [
        new transports.Console(),
        new transports.File({
            level:"error",
            filename: path.join(logDir, "error.log"),
            maxsize: 10 * 1024 * 1024,
            maxFiles: 3,
            tailable:true,
        }),
        new transports.File({
            level: "debug",
            filename: path.join(logDir, "combined.log"),
            maxFiles: 3,
            maxsize: 10 * 1024 * 1024,
            tailable:true,
        })
    ],
    exitOnError:false
})