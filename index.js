import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';

//components
import Connection from './database/db.js';
import Router from './routes/route.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', Router);

const PORT = 8000;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

Connection(username, password);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'divyanshsrathore13@gmail.com',
    pass: 'qqsh mgsi swmk iucw'
  }
});

app.post('/send-feedback', (req, res) => {
  const { name, email, message } = req.body;

  transporter.sendMail({
    from: 'your.email@gmail.com',
    to: 'divyanshsrathore13@gmail.com',
    subject: 'New Feedback',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  });

  transporter.sendMail({
    from: 'your.email@gmail.com',
    to: email,
    subject: 'Feedback Confirmation',
    text: 'Thank you for your feedback!'
  });

  res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));
