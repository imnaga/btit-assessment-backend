const db = require('../models')
const bcrypt = require('bcrypt')
// image Upload
const multer = require('multer')
const path = require('path')
const { response } = require('express')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

// create main Model
const User = db.users
const UserProfile = db.userProfiles

//Login 
const login = async (req, res) => {
    try{
        const user = await User.findOne({where: {
                    email: req.body.email,
                    deletedAt:null
                }
            })
        if(!user){
            res.status(400).send({status:0,message:"Please check your username or password."})
        } else { 
            const hashedPassword = bcrypt.compareSync(req.body.password, user['password'])
            if(!hashedPassword)
                res.status(400).send({"status":0,"message":"Please check your username or password."});
            else{
                const authUser = await generateToken(user);
                res.status(200).send({status:1,data:authUser})
            }
        }
    } catch(err) {
        res.status(400).send({status:0,message:err.message || "Some error occring!"})
    }
}

const generateToken = async (user) => {
    const token = jwt.sign({_id:user['id'].toString() },process.env.JWT_AUTH_SCRETEKEY,{expiresIn:"2h"})
    if(!token)
        res.status(400).send({"status":0,"message":"Token was not generated."})
    await User.update({ token: token },{ where: { id: user['id'] } })
    const userModel = await User.findOne({where:{id:user['id']},
        include: [
            {
                model: UserProfile,
                as: 'userprofile',
                where: {user_id: user['id']},
                required: false
            }
        ]
    })
    return userModel;
}

//create user
const createUser = async (req, res) => {
    try{
        const emailExists = await User.findOne({where: {email: req.body.email}})
        if(emailExists)
            res.status(400).send({"status":0,"message":"Email address already in use. Please pick different one."})
        else{
            let info = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password:req.body.password,
                age: req.body.age,
                role:1
            }
            user = await User.create(info)
            //Token generation
            if(user){
                const authUser = await generateToken(user);
                res.status(200).send({status:1,data:authUser})
            }else
                res.status(400).send({status:0,message:err.message || "Some thing went wrong!"})
        }
    } catch(err) {
        res.status(400).send({status:0,message:err.message || "Some thing went wrong!"})
    }

}

//Update user
const updateUser = async (req, res) => {
    try{
        var user = await User.findOne({where: {email: req.body.email}, 
            include: [
                {
                    model: UserProfile,
                    as: 'userprofile',
                    required: false
                }
            ]
        })
        if(!user)
            res.status(400).send({"status":0,"message":"User does not exists."})
        else{
            let info = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                age: req.body.age,
                "userprofile.address": req.body.address,
                "userprofile.phone_number": req.body.phone_number,
                "userprofile.qualification":req.body.qualification
            }
            const updateUser = await User.update(info,{where:{id:user.id},
                include: [
                    {
                        model: UserProfile,
                        as: 'userprofile',
                        where: {user_id: user.id},
                        required: false
                    }
                ]
            }) 
            var userUpdated = await User.findOne({where: {id: user.id}, 
                include: [
                    {
                        model: UserProfile,
                        as: 'userprofile',
                        required: false
                    }
                ]
            })
            res.send(userUpdated)
        }

    } catch(err) {
        res.status(400).send({status:0,message:err.message || "Some thing went wrong!"})
    }

}

//Add user profile info.
const createUserProfile = async (req, res) => {
    try{
        const user_id = req.user.id;
        let info = {
            user_id: user_id,
            address: req.body.address,
            phone_number: req.body.phone_number,
            qualification:req.body.qualification
        }
        const recordExists = await UserProfile.findOne({where:{user_id:user_id}}) 
        if(recordExists){
            await UserProfile.update(info,{where:{user_id:user_id}}) 
        }else{
            await UserProfile.create(info)
        }
        const userPval = await User.findOne({where:{id:user_id}, 
            include: [
                {
                    model: UserProfile,
                    as: 'userprofile',
                    where: {user_id: user_id},
                    required: false
                }
            ]
        })
        if(userPval)
            res.status(200).send({status:1,data:userPval})
        else
            res.status(400).send({status:0,message:"Profile has not been added. Please check your inputs."})
    } catch(err) {
        res.status(400).send({status:0,message:err.message || "Some thing went wrong!"})
    }
}


//Get all users from Admin only
const getAllUsers = async (req, res) => {

    try{
        // if(req.user.role == process.env.ROLE_ADMIN){
        //     let users = await User.findAll({where:{deletedAt:null},
        //         include: [
        //             {
        //                 model: UserProfile,
        //                 as: 'userprofile',
        //                 required: false
        //             }
        //         ]
        //     })
        //     res.status(200).send(users)
        // } else
        // if(req.user.role == process.env.ROLE_CADIDATE){
            let users = await User.findAll({where:{id:req.params.id,deletedAt:null},
                include: [
                    {
                        model: UserProfile,
                        as: 'userprofile',
                        required: false
                    }
                ]
            })
            res.status(200).send(users)
        // } else
        //     res.status(400).send({status:0,message:"You are not authorized to perfome this action."})
    } catch(err) {
        res.status(400).send({status:0,message:err.message || "Some thing went wrong!"})
    }
}

//Approve user from Admin only
const approveUser = async (req, res) => {
    try{
        if(req.user.role == process.env.ROLE_ADMIN){
            const userId = req.params.id;
            const info = {
                status_id: "3"
            }
            const user = await User.findOne({where:{id:userId}})
            if(!user)
                res.status(400).send({status:0,message:"Please check your input details."})
            else{
                const updateStatus = await User.update(info,{where:{id:userId}});
                if(updateStatus)
                    res.status(200).send({status:1,message:"User approved successfully."})
                else
                    res.status(400).send({status:0,message:"User has not approved."})
            } 
        } else {
            res.status(400).send({status:0,message:"You do not have authorized to perfome this action."})
        }
    } catch(err) {
        res.status(400).send({status:0,message:err.message || "Some thing went wrong!"})
    }
}

//Remove user from Admin only
const removeUser = async (req, res) => {
    try{
        if(req.user.role == 2){
            var datetime = new Date();
            const userId = req.params.id;
            const approveUser = await User.update({deletedAt: datetime},{where:{id:userId}})
            res.status(200).send({status:1,message:"User removed successfully."})
        } else {
            res.status(400).send({status:0,message:"You are not authorized to perfome this action."})
        }
    } catch(err) {
        res.status(400).send({status:0,message:err.message || "Some thing went wrong!"})
    }

}

//Logout user
const logout = async (req, res) => {
    try{
        if(req.user){
            var datetime = new Date();
            const userId = req.user.id;
            const approveUser = await User.update({token: ""},{where:{id:userId}})
            res.status(200).send({status:1,message:"User logged out successfully."})
        } else {
            res.status(400).send({status:0,message:"You are not authorized to perfome this action."})
        }
    } catch(err) {
        res.status(400).send({status:0,message:err.message || "Some thing went wrong!"})
    }

}

//Reset password
const resetPasswordLink = async (req, res) => {
    try{
        const email = req.body.email
        const emailExists = await User.findOne({where:{email:email}})
        if(emailExists){
            const user = await generateResetPassToken(emailExists);
            const link = `${process.env.CLIENT_URL}/resetPassword/${user.reset_link}` 
            //Send reset password link to mail
            // sendPassMail(user.email, link)
            res.status(200).send({status:1,message:"Reset password link has been sent successfully.",   
                token:`${user.reset_link}` 
            })
        } else {
            res.status(400).send({status:0,message:"The given email address was not exists."})
        }
    } catch(err) {
        res.status(400).send({status:0,message:err.message || "Some thing went wrong!"})
    }

}

const generateResetPassToken = async (user) => {
    const token = jwt.sign({_id:user['id'].toString() },process.env.JWT_REST_PASSWORD_KEY,{expiresIn:"2h"})
    if(!token)
        res.status(400).send({"status":0,"message":"Token was not generated."})
    await User.update({ reset_link: token },{ where: { id: user['id'] } })
    const userModel = await User.findOne({where:{id:user['id']},
        include: [
            {
                model: UserProfile,
                as: 'userprofile',
                where: {user_id: user['id']},
                required: false
            }
        ]
    })
    return userModel;
}

const resetPassword = async (req, res) => {
    try{
        const resetPass = await changePassword(1,req.body.token, req.body.new_password);
        if(resetPass)
            res.status(200).send({status:1,message:"Your password has changed successfully."})
        else 
            res.status(400).send({status:0,message:"Your token got expired."})
        
    } catch(err) {
        res.status(400).send({status:0,message:err.message || "Some thing went wrong!"})
    }
}

const changeUserPassword = async (req, res) => {
    try{
        const hashedPassword = bcrypt.compareSync(req.body.old_password, req.user.password)
        if(!hashedPassword){
            res.status(400).send({"status":0,"message":"Your password has not been updated please check your existing password."})
        } else {
            const changePass = await changePassword(null,null, req.body.new_password, req.user);
            if(changePass)
                res.status(200).send({status:1,message:"Your password has changed successfully."})
            else 
                res.status(400).send({status:0,message:"Your token got expired."})
        }
    }catch(err) {
        res.status(400).send({status:0,message:err.message || "Some thing went wrong!"})
    }
}

const changePassword = async (isResetpassword, token, newPassword, user) => {
    const salt = await bcrypt.genSaltSync(10, 'a');
    const encryptPassword = bcrypt.hashSync(newPassword, salt);
    if(isResetpassword){
        const decode = jwt.verify(token, process.env.JWT_REST_PASSWORD_KEY)
        if(!decode)
            return 0
        const user = await User.findOne({where:{reset_link:token,id:decode._id}})
        if(user){
            const updateUser = await User.update({password:encryptPassword,reset_link:null},{where:{id:user.id}})
            if(updateUser[0])
                return await User.findOne({where:{id:user.id}})
            else
                return 0
        }else
            return 0
    }else if(user){    
            const updateUser = await User.update({password:encryptPassword,reset_link:null},{where:{id:user.id}})
            if(updateUser[0])
                return await User.findOne({where:{id:user.id}})
            else
                return 0
    } else
        return 0  
}

//Email configuration
const sendPassMail = async (mailTo, mailMessage) => {
    let transporter1 = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });
    // var transporter = nodemailer.createTransport({
    //     host: process.env.MAIL_HOST, // hostname
    //     secure: false, // use SSL
    //     port: process.env.MAIL_PORT, // port for secure SMTP
    //     auth: {
    //         user: process.env.MAIL_USERNAME,
    //         pass: process.env.MAIL_PASSWORD
    //     },
    //     tls: {
    //         rejectUnauthorized: false
    //     }
    // });

    // Message object
    let message = {
        from: 'winston.altenwerth@ethereal.email',
        to: mailTo,
        subject: 'Your reset password link ✔',
        text: 'Hello!',
        html: `<p><b>Hello</b><br><br> 
        Please click this <a href=${mailMessage}>link</a> for reset password.
        </p>`
    };
    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log('testmessage')
            console.log('Error occurred. ' + err.message);
            return process.exit(1);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
}



module.exports = {
    createUser,
    createUserProfile,
    updateUser,
    getAllUsers,
    login,
    approveUser,
    removeUser,
    resetPasswordLink,
    resetPassword,
    changeUserPassword,
    logout
}