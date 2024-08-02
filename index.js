const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12723469',
  password: 'KtuuxGcAk1',
  database: 'sql12723469'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sanskargawade85@gmail.com',
    pass: 'bhnawafvmlpubhey'
  }
});

app.post('/subscribe', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send('Email is required');
  }

  db.query('SELECT * FROM student WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Database selection error:', err);
      return res.status(500).send('An error occurred. Please try again later.');
    }
    if (results.length > 0) {
      return res.status(400).send('You are already subscribed.');
    }

    db.query('INSERT INTO student (email) VALUES (?)', [email], (err) => {
      if (err) {
        console.error('Database insertion error:', err);
        return res.status(500).send('An error occurred. Please try again later.');
      }

      const mailOptions = {
        from: 'sanskargawade85@gmail.com',
        to: email,
        subject: 'Subscription Confirmation',
        text: 'Thank you for subscribing!'
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error('Email sending error:', error);
          return res.status(500).send('An error occurred. Please try again later.');
        }
        res.send('Subscribed successfully!');
      });
    });
  });
});

app.post('/unsubscribe', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send('Email is required');
  }

  db.query('SELECT * FROM student WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Database selection error:', err);
      return res.status(500).send('An error occurred. Please try again later.');
    }
    if (results.length === 0) {
      return res.status(400).send('You are not subscribed.');
    }

    db.query('DELETE FROM student WHERE email = ?', [email], (err) => {
      if (err) {
        console.error('Database deletion error:', err);
        return res.status(500).send('An error occurred. Please try again later.');
      }

      const mailOptions = {
        from: 'sanskargawade85@gmail.com',
        to: email,
        subject: 'Unsubscribed Successfully',
        text: 'Sorry to see you go!'
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error('Email sending error:', error);
          return res.status(500).send('An error occurred. Please try again later.');
        }
        res.send('Unsubscribed successfully!');
      });
    });
  });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
