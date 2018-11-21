'use strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');

function saveUser(req, res){
    var user = new User();

    var params = req.body;

    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_ADMIN';
    user.image = 'null';

    if(params.password){
        // encrypt password and save data
        bcrypt.hash(params.password, null, null, (error, hash) =>{
            user.password = hash;
            if(user.name != null && user.surname != null && user.email != null) {
                // save user in database
                user.save((err, userStored) => {
                    if(err){
                        res.status(500).send({message: 'Error when registering the user'});
                    }else{
                        if(!userStored){
                            res.status(404).send({ message: 'User has not been registered'})
                        }else{
                            res.status(200).send({ user: userStored});
                        }
                    }
                })
            }else{
                res.status(200).send({message: 'Please, fill up the form'});
            }
        });
    }else{
        res.status(500).send({message: 'Introduce password'});
    }
}

function loginUser(req, res){
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if(err) {
            res.status(500).send({message: 'Request error'});
        }else{
            if(!user){
                res.status(404).send({message: 'User does not exist'});
            }else{
                // check password
                bcrypt.compare(password, user.password, (err, check) =>{
                    if(check){
                        if(params.gethash){
                            // return a jwt token

                        }else{
                            res.status(200).send({user});
                        }
                    }else{
                        res.status(404).send({message: 'Password is incorrect'});
                    }
                })
            }
        }
    })
}

module.exports = {
    saveUser,
    loginUser
}