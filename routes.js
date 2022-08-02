'use strict';


// async middleware for to use asyncHandler 
const express = require('express');

//async handler in middleware folder
const { asyncHandler } = require('./middleware/async-handler');
const course = require('./Rest-API--Main/models/course');
'use strict';

const express = require('express');
const { restart } = require('nodemon');

const router = express.Router(); // Construct a router instance.
const {User, Course} = require('./models');


//route returns all properties and values for the currently authenticated user
router.get('/users', asyncHandler(async (req, res) => {
    const user = req.currentUser; // Store the user on the Request object
    res.status(200).json({ 
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
     });
    res.json(user);
  }));


  // Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.redirect("/");
      res.status(201).json({ "message": "Account successfully created!" });
    } catch (error) {
      console.log('ERROR: ', error.name);
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') { //validation to ensure that the following required values are properly submitted 
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }
    }
  }));

//app/courses/GET route that will return all courses including the User associated with each course and a 200 HTTP status code.
//source: https://teamtreehouse.com/library/data-relationships-with-sql-and-sequelize-2/retrieve-related-data-in-sequelize-queries/retrieve-data-with-findall
//source for attributes: https://sequelize.org/docs/v6/advanced-association-concepts/eager-loading/#fetching-all-associated-elements
router.get('/courses', asyncHandler(async(req, res) =>{
    const courses = await Course.findAll({
        include: [ 
            {
              model: User,
              as: 'userId', //courses and user associated with the course
              //do not include created at and updated at for users
              attributes: ['firstName', 'lastName', 'email']
              
            },
          ],through: {
            attributes: ['title', 'description'] //don't include created at and updated at for courses    
          }
        });
        // Set the status to 201 Created and end the response.
        res.status(200).json({courses});
    }  
));

///api/courses/:id GET route that will return the corresponding course including the User associated with that course and a 200 HTTP status code.
//attributes exclude resource: https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
router.get('/courses/:id', asyncHandler(async(req,res) =>{
    const courses = await Course.findByPk(req.params.id, {
        //do not include created at and updated at for users and courses 
        attributes: { exclude: ['createdAt', 'updatedAt'] }, 
        include: [ 
            {
              model: User,
              as: 'userId', //courses and user associated with the course
            },
          ]
    });
    res.status(200).json({
        title: courses.title,
        description: courses.description,
        estimatedTime: courses.estimatedTime,
        materialsNeeded: courses.materialsNeeded
    })
    }));


///api/courses POST route that will create a new course, for the newly created course, and return a 201 HTTP status code and no content.
router.post('/courses/:id'), asyncHandler(async(req,res) =>{
    try{
        const course = await records.createCourse({
            title: req.body.title,
            description: req.body.description
        });
        res.status(201).json(course).end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
            // res.status(400).json({message: "title and description required."});
        } else{
            throw error;
        }    
    }
});

//api/courses/:id PUT route that will update the corresponding course and return a 204 HTTP status code and no content.
router.put('/courses/:id'), asyncHandler(async(req,res) =>{
// add a try catch -- using a find by pk, course.update 
const course = await Course.findByPk(req.params.id); //async call
    try {
        if (course) {
            if(req.currentUser.id === course.userId) {
                await course.update(req.body);
                res.redirect("/");
                res.status(204).json({message: "Course has been updated"}).end();
            } else {
                res.sendStatus(404);
            }
        } else {
        res.sendStatus(404);
        }
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
        } else{
            throw error;
        }
}})

//api/courses/:id DELETE route that will delete the corresponding course and return a 204 HTTP status code and no content.
router.delete('/courses/:id'), asyncHandler(async(req,res) =>{ // use from project 
    const course = await Course.findByPk(req.params.id);
    if (course) {
      if (req.currentUser.id === course.userId){
        await course.destroy();
        res.redirect("/");
        res.status(204).json({message: "Course has been deleted"}).end();
      } else {
        res.status(400).json({message: "Course can't be deleted"})
      }
    } else {
      res.sendStatus(404);
    }})

 module.exports = router;