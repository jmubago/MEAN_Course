'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function saveUser(req, res) {
    var user = new User();

    var params = req.body;

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
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

function loginUser(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;

    if(!password && !email){
        res.status(200).send({message: 'Introduce your password or email'});
    }

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
                            res.status(200).send({
                                token: jwt.createToken(user)
                            })
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

function pruebaController (req, res) {
    res.status(200).send({ message: 'Probando accion de controlador de node + Mongo'});
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId, update, (err,userUpdated) => {
        if(err) {
            res.status(500).send({message: 'Error when updating the user'});
        }else{
            if(!userUpdated){
                res.status(404).send({message: 'User could not be updated'});
            }else{
                res.status(200).send({user: userUpdated});
            }

        }
    });
}

function uploadImage (req, res) {
    var userId = req.param.id;
    var file_name = 'Not uploaded';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2]; // recogemos solo el nombre del archivo

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1]; // recogemos solo la extensión del archivo

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
            User.findOneAndUpdate(userId, {image: file_name}, (err, userUpdated) => {
                if(!userUpdated){
                    res.status(404).send({message: 'User could not be updated'});
                }else{
                    res.status(200).send({user: userUpdated});
                }
            });
        }else{
            res.status(200).send({message: 'Only valid file extensions are: .png, .jpg, .jpeg, and .gif'})
        }

        console.log(file_path);
    }else{
        res.status(200).send({message: 'You have not uploaded any image'});
    }
}

function getImageFile (req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/' + imageFile;

    fs.exists(path_file, (exists) => {
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'Image does not exist'});
        }
    });
}

module.exports = {
    saveUser,
    loginUser,
    pruebaController,
    updateUser,
    uploadImage,
    getImageFile
}