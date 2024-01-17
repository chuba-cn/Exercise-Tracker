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

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/exercise-tracker';

mongoose.connect(dbUrl);

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.once('open', () => {
    console.log('Database connection established');
});

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/api/users', async(req, res) =>{
    try{
        const response = [];
        const users = await User.find({});

        for (let user of users) {
          response.push({username: user.username, id: user._id});
        }
        res.status(200).json(response);
    }catch(error){
        console.error(error);
        res.status(500).json({error: error.message});
    }
});

app.post('/api/users', async(req, res) => {
    try{
        const {username} = req.body;
        const user = new User({username});
        await user.save();
        
        const response = {
            username: user.username,
            _id: user._id
        };
    
        res.status(200).json(response);  
    }catch(error){
        console.error(error);
        res.status(500).json({error: error.message});
    }
});

app.post('/api/users/:id/exercises', async(req, res) => {
    try{
        const {id} = req.params;
        const {description, duration} = req.body;
        const dateInput = req.body.date || Date.now();
        const dateObject = new Date(dateInput);

        if(dateObject === 'Invalid Date'){
            return res.status(400).json({error: 'Invalid Date'});
        }

        const user = await User.findById(id);
        
        if(user){
            const newExercise = new Exercise({ description, date: dateObject, duration });
            newExercise.author = id;
            newExercise.save();

            const response = {
              username: user.username,
              description: newExercise.description,
              duration: newExercise.duration,
              date: newExercise.date.toDateString(),
              _id: id
            };
            res.status(200).json(response);
        }else{res.status(400).json({error: 'No user found with given ID!!'})};

    }catch(error){
        console.error(error);
        res.status(500).json({error: error.message});
    } 
});

app.get('/api/users/:id/logs', async(req, res) => {
    try{
        const {id} = req.params;
        const {from, to, limit} = req.query;

        //Constructing the query based on optional parmeters
        const query = {author: id};
        if(from || to){
            query.date = {};
            if(from) {query.date.$gte = new Date(from)};
            if(to) {query.date.$lte = new Date(to)};
        }
        
        //Retrieving the user and populating the exercise log
        const user = await User.findById(id);

        if(!user){
            return res.status(400).json({error: 'No user found with given ID!!'})
        }
        
        const log = await Exercise.find(query).limit(parseInt(limit)).exec();

        //Formatting the log array items
        const formattedLog = log.map((exercise) => {
            return {
                description: exercise.description,
                duration: exercise.duration,
                date: exercise.date.toDateString()
            }
        });

        //Creating the response object
        const response = {
            _id: user._id,
            username: user.username,
            count: log.length,
            log: formattedLog
        };

        //Sending the response
        res.status(200).json(response);

    }catch(error){
        console.error(error);
        res.status(500).json({error: error.message});
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});