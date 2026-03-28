require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// First connect to DB, then start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}).catch(err => {
  console.error("Failed to start server due to DB connection error:", err.message);
  process.exit(1);
});

// Handle unhandled rejections globally
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection! Shutting down...', err.message);
  server.close(() => {
    process.exit(1);
  });
});
