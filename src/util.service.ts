import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UtilService {
  generateSixDigitCode = () => {
    // Generate a random number between 100000 and 999999 (inclusive)
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  generateJWTToken = (payload) => {
    return jwt.sign(payload, 'secretKey', {
      expiresIn: '1h',
    });
  };

  utcToLocal = (utcDateStr) => {
    const date = new Date(utcDateStr);
    const options = { timeZone: 'Asia/Colombo', hour12: false };
    return date.toLocaleString('en-US', options);
  };
}
