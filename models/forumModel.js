const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true
    },
    universityID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'University is required'],
        trim: true
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        trim: true
    },
    semester: {
        type: Number,
        required: [true, 'Semester is required'],
        trim: true
    },
    graduationYear: {
        type: String,
        required: [true, 'Require graduation year'],
        trim: true
    },
    profileImage: {
        type: String
    }
})

const uniSchema = new mongoose.Schema({
    emailPostfix: String,
    name: String
});

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title of the question is mandatory'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    /*classID:{
        type:String,
        required:true,
        trim: true
    },*/
    timestamp: {
        type: Date,
        default: Date.now,
        trim: true
    },
    answered: {
        type: Boolean,
        default: false,
        trim: true
    },
    anonymous: {
        type: Boolean,
        default: false,
        trim: true
    },
    universityID:{
        type:mongoose.Schema.Types.ObjectId
    }

})

const answerSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Describe the answer'],
        trim: true
    },
    questionID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        trim: true
    },
    goodAnswer: {
        type: Boolean,
        default: false,
        trim: true
    },
    anonymous: {
        type: Boolean,
        required: true,
        default: false
    }

})

const classroomSchema = new mongoose.Schema({

    userID: {
        type: Array,
        trim: true
    },
    className: {
        type: String,
        required:true,
        trim:true
    },
    classCode:{
        type:Number,
        required:true,
        trim:true
    },
    universityID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        trim:true
    }


})

const users = mongoose.model('users', userSchema);
const university = mongoose.model('universities', uniSchema);
const question = mongoose.model('questions', questionSchema);
const answer = mongoose.model('answers', answerSchema);
const classroom = mongoose.model('classroom', classroomSchema);
module.exports = { users, university, question, answer,classroom };