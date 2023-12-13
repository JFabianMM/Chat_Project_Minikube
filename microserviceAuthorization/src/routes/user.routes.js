const express = require('express');
const bcrypt = require ('bcryptjs');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const findByCredentials = async function (identification, password) {
    let user = await User.findOne({ identification });
    if (!user){
        user = 'Do not exist';
        return user
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch){
        user = 'Do not match';
        return user
    }
    return user
};

const generateAuthToken = async function (user){
    const token =jwt.sign({_id: user.identification }, 'thisisthechatproject');
    user.tokens = user.tokens.concat({ token });
    user.save(); 
    return token;
}

const tokenValidation = async function (token) {
    const decoded = jwt.verify(token, 'thisisthechatproject');
    const user = await User.findOne({ identification: decoded._id, 'tokens.token': token });
    return user
}

router.post('/register', async (req, res)=>{ 
    const identification= req.body.identification;
    const password = req.body.input.password;
    const user = new User({identification,password});
    user.save();
    try { 
        res.send({user});
    } catch (e){
        res.status(400).send(e)
    }  
});

router.post('/update', async (req, res)=>{ 
    const identification= req.body.identification;
    const password = req.body.password;
    let user = await User.findOne({ identification });
    const result = /^(?=.*[0-9])(?=.*[A-Z])(?!.* ).{6,80}$/.test(password);
    if (result==true){
        user.password=password;;
    }
    user.save();
    try { 
        res.send({user});
    } catch (e){
        res.status(400).send(e)
    }  
});
router.post('/login', async (req, res)=>{
    const password= req.body.password; 
    const identification= req.body.identification;
    try{
        const user = await findByCredentials(identification, password);
        const token = await generateAuthToken(user);
        res.send({token});
    }catch(e){
        res.status(400).send(e)
    }    
});
router.post('/validation', async (req, res)=>{
    const token= req.body.token; 
    try{
        const user= await tokenValidation(token);
        const identification = user.identification;
        res.send({identification});
    }catch(e){
        res.status(400).send(e)
    }    
});

module.exports=router;