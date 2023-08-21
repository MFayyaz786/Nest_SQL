import { HttpStatus } from '@nestjs/common';
import asyncHandler from "express-async-handler"
import { Request,Response } from "express";
import {decryptObject, encryptObject} from "../utils/encryptionService";
const encryptionMiddleware = asyncHandler((req:Request, res:Response, next:Function) => {
  // Decrypt request body if it exists
  if (req.body && req.body.cipher) {
    try {
      const decrypted = decryptObject(req.body.cipher);
      req.body = decrypted;
      console.log("req.body: ", req.body);
      
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.BAD_REQUEST).json("invalid request body")
     //res.status(400).json({ error: "Invalid request body" });
    }
  }

  // Encrypt response data
  if (res.json) {
    const originalJson = res.json;
    res.json = function (data) {
      const encrypted = encryptObject(data);
      return originalJson.call(this, encrypted);
    };
  }

  next();
});
export default encryptionMiddleware;
