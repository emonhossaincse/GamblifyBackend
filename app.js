const express = require('express');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const createError = require('http-errors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const userRouter = require('./routers/UserRouter');
const seedRouter = require('./routers/seedRouter');
const walletrouter = require('./routers/WalletRouter');
const { GameRouter } = require('./routers/GameRouter');
const cors = require('cors');
const helmet = require('helmet');
const faqRouter = require('./routers/FaqRouter');
const logosRoute = require('./routers/LogosRoute');
const path = require('path');
const generalRouter = require('./routers/GeneralRouter');
const { connectDB } = require('./config/db');
const { serverPort } = require('./secret');

const app = express();
app.use(xss());
app.use(morgan('dev'));
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// Define CORS middleware to allow requests from any origin
app.use(cors({
    origin: '*', // Change this to specific origins if needed
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add other methods if necessary
    allowedHeaders: ['Content-Type'] // Add other headers if necessary
  }));

const rateLimiter = rateLimit({
    windowMS: 1 * 60 * 1000, // 1 min
    max: 5,
    message: 'Too Many Request',
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

// Define the path to the 'uploads' directory
const uploadsPath = path.join(__dirname, './uploads');

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(uploadsPath));

// Define routes
app.use('/users', userRouter);
app.use('/seed', seedRouter);
app.use('/place-balance', walletrouter);
app.use('/faq', faqRouter);
app.use('/logos', logosRoute);
app.use('/game-list', GameRouter);

app.use('/general', generalRouter);

// Error handling middleware
app.use((req, res, next) => {
    next(createError(404, 'Page not Found!'));
});

app.use((err, req, res, next) => {
    return res.status(err.status || 500).json({
        success: false,
        message: err.message,
    });
});

// Connect to the database
connectDB();

// Start the server
app.listen(serverPort, () => {
    console.log(`Server is running at http://localhost:${serverPort}`);
});

module.exports = app;
