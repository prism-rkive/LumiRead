const cors = require('cors'); 
const morgan = require('morgan');
const express = require('express');
const routes = require('./routes');
const connectDB = require('./config/database');
connectDB();

const app = express();
const server = require('http').Server(app);

// CORS Configuration - UPDATED
app.use(cors({
  origin: 'http://localhost:3000',  // Frontend URL
  credentials: true,                 // Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);

module.exports = server;