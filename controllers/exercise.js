const User = require('../models/user');
const Exercise = require('../models/exercise');

module.exports.createExercise = async(req, res) =>{
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
};