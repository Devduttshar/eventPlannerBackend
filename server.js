require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/database');
const authRoutes = require('./routers/auth');
const eventRoutes = require('./routers/event');
const rsvpRoutes = require('./routers/rsvp');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/events',rsvpRoutes);
app.get("/", (req, res) => {
    console.log('coming inside')
  res.status(200).json({
    success: true,
    message: "Event planner backend is running",
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  res.status(statusCode).json({
    status: status,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
