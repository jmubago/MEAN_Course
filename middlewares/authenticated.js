'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';

exports.ensureAuth = function(req, res, next) {
    if(!req.headers.authorization){
        return res.status(403).send({ message: 'Petition is not autenticated'});
    }

    var token = req.headers.authorization.replace(/['"]+/g, ''); // delete ""  and '' that might come with the token
    
    try{
        var payload = jwt.decode(token, secret);

        if(payload.exp <= moment().unix()){
            return res.status(401).send({ message: 'Token has expired'});
        }
    }catch(ex){
        return res.status(404).send({ message: 'Token not valid'});
    }

    req.user = payload;

    next();
}

