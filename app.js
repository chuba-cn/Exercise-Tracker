if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
};
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const path = require('path');
const User = require('./models/user');
const Exercise = require('./models/exercise');
const userRoutes = require('./routes/userRoute');
const exerciseRoutes = require('./routes/exerciseRoute');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/exercise-tracker';

mongoose.connect(dbUrl);

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.once('open', () => {
    console.log('Database connection established');
});

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

app.use('/api/users', userRoutes);
app.use('/api/users/', exerciseRoutes);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});