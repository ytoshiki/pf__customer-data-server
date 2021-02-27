import mongoose from 'mongoose';

const dbUrl = process.env.DB_CONN;

mongoose.connect(dbUrl as string, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('MongoDB Connected');
});
