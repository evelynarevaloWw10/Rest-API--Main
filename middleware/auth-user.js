'use strict';

//middleware to authenticate name, email and password

//https://teamtreehouse.com/library/parse-the-authorization-header
const auth = require('basic-auth');
const bcrypt = require('bcrypt')
const { User } = require('../models');


// Middleware to authenticate the request using Basic Authentication.
exports.authenticateUser = async (req, res, next) => {
    // TODO
    let message; 
    const credentials = auth(req);

    if (credentials) {
        const user = await User.findOne({ where: {emailAddress: credentials.name} });

        if (user) {
            const authenticated = bcrypt
              .compareSync(credentials.pass, user.password);
              if (authenticated) { // If the passwords match
                console.log(`Authentication successful for email: ${user.emailAddress}`);

                // Store the user on the Request object.
                req.currentUser = user;
              } else {
                message = `Authentication failure for email: ${user.emailAddress}`;
              }
            } else {
              message = `User not found for email: ${credentials.emailAddress}`;
            }
          } else {
            message = 'Auth header not found';
          }   if (message) {
            console.warn(message);
            res.status(401).json({ message: 'Access Denied' });
          } else {
            next();
          }
           
        };

      

  
