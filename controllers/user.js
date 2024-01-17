const User = require('../models/user');
const Exercise = require('../models/exercise');

module.exports.getAllUsers = async (req, res) =>{
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
};

module.exports.getUserExerciseLogs = async (req, res) =>{
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
};

module.exports.createUser = async (req, res) => {
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
};