import express from 'express';
import './database';
import customerRouter from './routes/customer';
import adminRouter from './routes/admin';
import cookieParser from 'cookie-parser';

const app = express();

// setup
app.use(express.json());
app.use(express.urlencoded());

app.use('/api/customers', customerRouter);
app.use('/api/admin', adminRouter);

app.get('/', (req, res) => {
  const name = ((req as any).name = 'bob');
  res.send(name);
});

app.listen(process.env.PORT, () => {
  console.log('Server started at ' + process.env.PORT);
});
