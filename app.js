const express = require('express')
const dotenv = require('dotenv').config()
const errorHandler = require('./Middleware/errorHandler')
const connectDb = require('./Config/dbConnection')


const app = express()


//connection to database
connectDb();


//json parser
app.use(express.json())

//error handler middleware
app.use(errorHandler)

app.use('/api/users', require('./Routes/userRoute'))


//listen for port
const port = process.env.PORT || 4001

app.listen(port, () => {
    console.log(`listening on ${port}`)
})