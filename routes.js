'use strict';


// async middleware for to use asyncHandler 
const { asyncHandler } = require('./middleware/async-handler');
const express = require('express');
const Users = require('./models').Users;
const course = require('./Rest-API--Main/models/course');
const Course = require('./models').Course;

//Express middleware, when request comes in will be sent through this function 
//expecting request to come in as JSON 
app.use(express.json());



// Construct a router instance.

const router = express.Router();



  //https://teamtreehouse.com/library/create-a-new-quote

// Route that returns a list of users.
router.get('/users', asyncHandler(async (req, res) => {
  const users = req.currentUser; // Store the user on the Request object
  res.status(200).json({ 
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          password: users.password
   });
  res.json(users);
}));


// Route that creates a new user. Needs Password security
router.post('/users', asyncHandler(async (req, res) => {
  try {
    await Users.create(req.body);
    res.redirect("/");
    res.status(201).json({ "message": "Account successfully created!" });
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

//Course Routes 
 
//https://teamtreehouse.com/library/create-a-new-quote
// /api/courses GET
router.get('/courses', (req,res) => {
  const courses = await courses.findAll({
    include: [
      {
        model: Users,
        as: userId,
      },
    
    ],     

  });
      
  
  res.status(200).end();
});

// /api/courses/:id GET
router.get('/courses/:id', (async(req,res) => {
  const courses = await Course.findByPk(req.params.id);
  res.status(200).json({courses});


}));


// /api/courses POST
router.post('/courses/:id'), asyncHandler(async(req,res) =>{
  try {
      let course = await Course.create(req.body);
      res.redirect("/");
    } catch (error) {
      if(error.name === "SequelizeValidationError") {
         course = await Course.build(req.body);
      //   res.render({ Courses, error: error.errors})
      } else {
        throw error;
      }  
}})

// /api/courses/:id PUT 
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
              // const course = await Course.build(req.body);
              course.id = req.body.id; // make sure correct course gets updated  
              res.status(400);
          } else{
              throw error;
          }
  }})
  



// /api/courses/:id DELETE
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