'use strict';



const express = require('express');
const router = express.Router(); // Construct a router instance.
const User = require('./models').User;
const Course  = require('./models').Course;

 // defining a protected route
const { authenticateUser } = require('./middleware/auth-user');



function asyncHandler(cb){
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  }
}


//route returns all properties and values for the currently authenticated user
router.get('/users', authenticateUser ,asyncHandler(async (req, res) => {
    const user = req.currentUser; // Store the user on the Request object
    res.status(200).json({ 
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddress: user.emailAddress,
     });
  }));


  // Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
    try {

     await User.create(req.body);
     // res.redirect("/"); //= maybe might need will leave not pass 
      res.location("/"); // == not sure if correct
      res.status(201).end();
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') { //validation to ensure that the following required values are properly submitted 
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }
    }
  }));


//source for attributes: https://sequelize.org/docs/v6/advanced-association-concepts/eager-loading/#fetching-all-associated-elements
router.get('/courses', asyncHandler(async(req, res) =>{
  const course = await Course.findAll({
      include: [ 
          {
            model: User,
            attributes: ['firstName', 'lastName', 'emailAddress'] 
          },
        ],through: {
          attributes: ['title', 'description']   
        }
      })
      res.status(200).json({course});
  }  
));


//attributes exclude resource: https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
router.get('/courses/:id', asyncHandler(async(req,res) =>{
  const course = await Course.findByPk(req.params.id, {
   
      attributes: { exclude: ['createdAt', 'updatedAt', 'password'] }, 
      include: [ 
          {
            model: User,
          
          },
        ]
  });
  res.status(200).json({course})
  }));


///api/courses POST route that will create a new course, for the newly created course, and return a 201 HTTP status code and no content.
router.post('/courses', authenticateUser, asyncHandler(async(req,res) =>{
 
    try{
      const course = await Course.create(req.body);

       res.location(`/courses/${course.id}`);
        res.status(201).end();
       
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
          
            res.status(400).json({message: "title and description required."});
            // res.status(400).json({message: "title and description required."});
        } else{
            throw error;
        }    
    }
}));

//api/courses/:id PUT route that will update the corresponding course and return a 204 HTTP status code and no content.
router.put('/courses/:id', authenticateUser,  asyncHandler(async(req,res) =>{
// add a try catch -- using a find by pk, course.update 
let course ;
    try {
        course = await Course.findByPk(req.params.id); //async call
        if (course) {
                await course.update(req.body);
                res.status(204).json({message: "Course has been updated!"}).end();
        } else {
        res.sendStatus(404);
        }
    } catch (error) {
        if ( error.name === "SequelizeValidationError" || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
        } else {
           throw error;
        }
}}));

//api/courses/:id DELETE route that will delete the corresponding course and return a 204 HTTP status code and no content.
router.delete('/courses/:id',authenticateUser, asyncHandler(async(req,res) =>{ // use from project 
    const course = await Course.findByPk(req.params.id);
    if (course) {
      if (req.currentUser.id === course.userId){
        await course.destroy();
        res.status(204).end();
      } else {
        res.status(400).end();
      }
    } else {
      res.sendStatus(404);
    }}
    ))

 module.exports = router;