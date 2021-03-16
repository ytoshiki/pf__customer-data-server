import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import './database';
import customerRouter from './routes/customer';
import adminRouter from './routes/admin';
import categoryRouter from './routes/categoty';
import productRouter from './routes/product';
import purchaseRouter from './routes/purchase';
import reviewRouter from './routes/review';

const app = express();

// Setup
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(helmet());

// Routes
app.use('/api/customers', customerRouter);
app.use('/api/admin', adminRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/purchase', purchaseRouter);
app.use('/api/reviews', reviewRouter);

app.get('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route Not Allowed'
  });
});

app.listen(process.env.PORT, () => {
  console.log('Server started at ' + process.env.PORT);
});
