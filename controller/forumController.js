const Cryptr = require('cryptr')
const nodemailer = require('nodemailer')
const {
  users,
  university,
  question,
  answer,
  classroom,
} = require('../models/forumModel')
const cryptr = new Cryptr('RegistartionPassword')
require('dotenv').config()
//!--- User access
const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await users.find({})
    res.status(200).json({ allUsers })
  } catch (err) {
    res.status(500).json({ msg: err })
  }
}
const getUser = async (req, res, next) => {
  try {
    const { email: userEmail } = req.params
    const singleUser = await users.findOne({ email: userEmail })
    if (!singleUser) {
      return res
        .status(404)
        .json({ error: `No user found with email ${userEmail}` })
    }
    const passDec = cryptr.decrypt(singleUser.password)
    singleUser.password = passDec
    res.status(200).json({ singleUser })
  } catch (err) {
    res.status(500).json({ error: err })
  }
}
const getUserById = async (req, res, next) => {
  try {
    const { id: userID } = req.params
    const singleUserById = await users.findOne({ _id: userID })
    if (!singleUserById) {
      return res.status(404).json({ error: `No user found with ID ${userID}` })
    }
    const passDec = cryptr.decrypt(singleUserById.password)
    singleUserById.password = passDec
    res.status(200).json({ singleUserById })
  } catch (err) {
    res.status(500).json({ error: err })
  }
}

const createUser = async (req, res, next) => {
  try {
    const passEnc = cryptr.encrypt(req.body.password)
    req.body.password = passEnc
    const user = await users.create(req.body)
    res.status(201).json({ user })
  } catch (err) {
    res.status(500).json({ msg: err })
  }
}
const deleteUser = async (req, res, next) => {
  try {
    const { id: userID } = req.params
    const userDel = await users.findOneAndDelete({ _id: userID })
    if (!userDel) {
      return res.status(404).json({ error: `No user found with ID ${userID}` })
    }
    res
      .status(200)
      .json({ success: true, msg: `Response deleted successfully` })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}
const updateUser = async (req, res, next) => {
  try {
    const { id: userID } = req.params
    if (req.body.password) {
      encPass = cryptr.encrypt(req.body.password)
      req.body.password = encPass
    }
    const newData = req.body
    const userUpd = await users.findByIdAndUpdate({ _id: userID }, newData, {
      new: true,
      runValidators: true,
    })
    if (!userUpd) {
      return res.status(404).json({ error: `No user found with ID ${userID}` })
    }
    res.status(200).json({ userUpd })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

//!--- University access
const getUniversity = async (req, res, next) => {
  try {
    const { emailPostfix } = req.params
    // console.log(emailPostfix);
    const uni = await university.findOne({ emailPostfix: emailPostfix })
    if (!uni) {
      return res
        .status(404)
        .json({ error: `No user found with ID ${emailPostfix}` })
    }
    res.status(200).json({ uni })
  } catch (err) {
    res.status(500).json({ msg: err })
  }
}

//!--- questions access

const getAllQuestions = async (req, res) => {
  try {
    const questions = await question.find({}).sort({ timestamp: -1 })
    if (!questions) {
      return res.status(404).json({ error: `No questions found` })
    }
    res.status(200).json({ questions })
  } catch (err) {
    res.status(500).json({ msg: err })
  }
}

const createQuestion = async (req, res) => {
  try {
    const ques = await question.create(req.body)
    res.status(201).json({ ques })
  } catch (err) {
    res.status(500).json({ msg: err })
  }
}

const deleteQuestion = async (req, res) => {
  try {
    const { id: questionID } = req.params
    const quesDel = await question.findOneAndDelete({ _id: questionID })
    if (!quesDel) {
      return res
        .status(404)
        .json({ error: `No question found with ID ${questionID}` })
    }
    res
      .status(200)
      .json({ success: true, msg: `Response deleted successfully` })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

const updateQuestion = async (req, res) => {
  try {
    const { id: questionID } = req.params
    const newData = req.body
    const questionUpdate = await question.findByIdAndUpdate(
      { _id: questionID },
      newData,
      {
        new: true,
        runValidators: true,
      }
    )
    if (!questionUpdate) {
      return res
        .status(404)
        .json({ error: `No question found with ID ${questionID}` })
    }
    res.status(200).json({ questionUpdate })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

const getQuestionByUserId = async (req, res) => {
  try {
    const { id: userID } = req.params
    const ques = await question.find({ userID: userID })
    if (!ques) {
      res.status(404).json({ msg: `no answers found for ID: ${userID}` })
    }
    res.status(200).json({ ques })
  } catch (err) {
    res.status(500).json({ msg: err })
  }
}
const getQuestionByUni = async (req, res) => {
  try {
    const { uniId: uniId } = req.params
    const quesByUni = await question.find({ universityID: uniId })
    if (!quesByUni) {
      res.status(404).json({ msg: `no answers found for ID: ${uniId}` })
    }
    res.status(200).json({ quesByUni })
  } catch (err) {
    res.status(500).json({ msg: err })
  }
}

//! ---answer controller
const getAllAnswers = async (req, res) => {
  try {
    const answers = await answer.find({})
    if (!answers) {
      return res.status(404).json({ error: `No answer found` })
    }
    res.status(200).json({ answers })
  } catch (err) {
    res.status(500).json({ msg: err })
  }
}

const getAnswerByQuesId = async (req, res) => {
  try {
    const { id: quesID } = req.params
    const ans = await answer.find({ questionID: quesID })
    if (!ans) {
      res.status(404).json({ msg: `no answers found for ID: ${quesID}` })
    }
    res.status(200).json({ ans })
  } catch (err) {
    res.status(500).json({ msg: err })
  }
}

const createAnswer = async (req, res) => {
  try {
    const ans = await answer.create(req.body)
    res.status(201).json({ ans })
  } catch (err) {
    res.status(500).json({ msg: err })
  }
}

const deleteAnswer = async (req, res) => {
  try {
    const { id: answerID } = req.params
    const ansDel = await answer.findOneAndDelete({ _id: answerID })
    if (!ansDel) {
      return res
        .status(404)
        .json({ error: `No answer found with ID ${answerID}` })
    }
    res
      .status(200)
      .json({ success: true, msg: `Response deleted successfully` })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

const updateAnswer = async (req, res) => {
  try {
    const { id: answerID } = req.params
    const newData = req.body
    const answerUpdate = await answer.findByIdAndUpdate(
      { _id: answerID },
      newData,
      {
        new: true,
        runValidators: true,
      }
    )
    if (!answerUpdate) {
      return res
        .status(404)
        .json({ error: `No answer found with ID ${answerID}` })
    }
    res.status(200).json({ answerUpdate })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

//! --- otp controller
const getOtp = async (req, res, next) => {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000)
    const { email } = req.params
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SYSTEM_MAIL,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
    const mailOptions = {
      from: process.env.SYSTEM_MAIL,
      to: String(email),
      subject: 'Cube: OTP for resetting password',
      text: `Your one time passwrord is ${otp}. Please do not share it with anyone.`,
    }

    transporter.sendMail(mailOptions, (err, success) => {
      if (err) {
        res.status(404).json({ msg: `No such user found with email${email}` })
      } else {
        res.status(200).json({ otp })
      }
    })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

const createClassroom = async (req, res, next) => {
  try {
    const classrooms = await classroom.create(req.body)
    res.status(201).json({ classrooms })
  } catch (err) {
    res.status(500).json({ msg: err })
  }
}
const createUniversity = async (req, res, next) => {
  try {
    const universities = await university.create(req.body)
    res.status(201).json({ universities })
  } catch (error) {
    res.status(500).json({ msg: error })
  }
}

const getAllUniversity = async (req, res, next) => {
  try {
    const universities = await university.find({})
    if (!universities) {
      return res.status(404).json({ error: `No universities found` })
    }
    res.status(200).json({ universities })
  } catch (err) {
    res.status(500).json({ msg: err })
  }
}

module.exports = {
  getAllUsers,
  getUser,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  getUniversity,
  getAllQuestions,
  getQuestionByUserId,
  getQuestionByUni,
  createQuestion,
  deleteQuestion,
  updateQuestion,
  getAllAnswers,
  createAnswer,
  deleteAnswer,
  updateAnswer,
  getAnswerByQuesId,
  getOtp,
  createClassroom,
  createUniversity,
  getAllUniversity,
}
