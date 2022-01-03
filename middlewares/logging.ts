import { Request, Response, NextFunction } from "express";
import { logParam } from "../dataTypes/common";
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logger = async ({ message, logFileName }: logParam) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  try {
    if (!fs.existsSync(path.join(__dirname, "../logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "../logs"));
    }

    await fsPromises.appendFile(
      path.join(__dirname, "../logs", logFileName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

const reqLogger = (req: Request, res: Response, next: NextFunction) => {
  const logParam: logParam = {
    message: `${req.method}\t${req.headers.origin}\t${req.url}`,
    logFileName: "reqLog.txt",
  };
  logger(logParam);
  next();
};

module.exports = { reqLogger, logger };
