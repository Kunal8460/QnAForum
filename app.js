const express = require('express')
const app = express()
/* Importing router */
const commonRouter = require('./routes/userRouter')
const uniRouter = require('./routes/uniRouter')
const questionRouter = require('./routes/questionRouter')
const answerRouter = require('./routes/answerRouter')
const otpRouter = require('./routes/otpRouter')
const classRouter = require('./routes/classRouter')
/* Importing connection module */
const connectDB = require('./db/connection')

/* importing dotenv module */
require('dotenv').config()

const port = process.env.PORT || 3300

/* middlewares */
app.use(express.static('./Assets/Pages'))
app.use(express.static('./Assets/'))
app.use(express.static('./Assets/JS'))
app.use(express.static('./Assets/images'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/v1/users', commonRouter)
app.use('/api/v1/universities', uniRouter)
app.use('/api/v1/questions', questionRouter)
app.use('/api/v1/answers', answerRouter)
app.use('/api/v1/otp', otpRouter)
app.use('/api/v1/class', classRouter)

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log(`Server is listening on port ${port}`))
  } catch (err) {
    console.log(err)
  }
}
start()
