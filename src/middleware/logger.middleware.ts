const { createLogger, format, transports } = require("winston");
import * as winston from 'winston';
const moment = require("moment");
var date = new Date();
date = moment(date).format("YYYY-MM-DD");
const logFormat = format.printf(( {timestamp, level, message} ) => {
  return JSON.stringify( {timestamp, level, message} );
});
function logger(req,res,next){
 interface LogObject {
    timestamp:String,
    path:String,
    method:String,
    request?:any,
    response?:any
  }
      const startTime = new Date();
      const logObject:LogObject = {
        timestamp: startTime.toLocaleString(),
        path: req.path,
        method: req.method,
        request:req.body
      };
    const oldSend = res.send;
    res.send = function (data:any) {
    logObject.response=JSON.parse(data);
    uploadLogs.info(logObject);
    oldSend.apply(res, arguments);
  };
  next();
}
const uploadLogs= createLogger({
   format: winston.format.combine(
    winston.format.json(),
    logFormat
  ),
  transports: [new transports.File({ filename: `Daily_log/${date}.log` })],
})

export default logger;