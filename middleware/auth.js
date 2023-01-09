const { response } = require("express")
const jwt = require("jsonwebtoken")
const db = require('../models')
const User = db.users

const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, process.env.JWT_AUTH_SCRETEKEY)
        const userValue = await User.findOne({where:{token:token,id:decode._id}})
        if(!userValue){
            res.status(401).send({status:0,message:"You are not authorized to perfome this action"})
        }else{
            req.user = userValue
            next()
        }
    } catch(e) {
        res.status(401).send({status:0,error:'You are not authorized to perfome this action'})
    }
}

module.exports = auth