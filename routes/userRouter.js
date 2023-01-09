// import controllers review, products
const userController = require('../controllers/userController')
const auth = require('../middleware/auth')

// router
const router = require('express').Router()

// use routers
router.post('/createUser', userController.createUser)
router.post('/createUserProfile', auth, userController.createUserProfile)
router.put('/createUser', auth, userController.updateUser)
router.get('/getAllUsers/:id', userController.getAllUsers)
router.post('/login', userController.login)
router.get('/approveUser/:id', auth, userController.approveUser)
router.get('/removeUser/:id', auth, userController.removeUser)
router.post('/resetPasswordLink', userController.resetPasswordLink)
router.post('/resetPassword', userController.resetPassword)
router.post('/changeUserPassword', auth, userController.changeUserPassword)
router.post('/logout', auth, userController.logout)

module.exports = router