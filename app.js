import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});
// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

const corsOptions = {
  origin: '*',
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Additional CORS header setting to cover all bases
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Preflight OPTIONS request handling
app.options('*', cors(corsOptions));

app.use('/api', routes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});