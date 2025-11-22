const express = require('express');
const cors = require('cors');
const translateRoutes = require('./routes/translate.routes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Translator API is running' });
});

app.use('/api/translate', translateRoutes);

// Error handling
app.use(errorHandler);

module.exports = app;
