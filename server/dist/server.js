"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require('dotenv');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();
console.log(PORT);
