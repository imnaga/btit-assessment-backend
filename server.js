const express = require('express')
const cors = require('cors')
const app = express()
const corsOpts = {
    origin: '*',
    methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
    allowedHeaders: [
      'Content-Type','Authorization'
    ],
    credentials:true
};
  
app.use(cors(corsOpts));
// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routers
const router = require('./routes/userRouter')
app.use('/api', router)

//static Images Folder
app.use('/Images', express.static('./Images'))

//port
const PORT = process.env.PORT || 9000

//server
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})