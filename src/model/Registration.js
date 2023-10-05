//Registration Start

const mongoose = require('mongoose');
const { roles } = require('../utils/constants');


const usersSchema = new mongoose.Schema({

    newid: {
        type: String,
        require: true
    },

    Status: {
            type:String,
            enum:['New','Approved','Rejected','Pending'],
            default:'New'
    },
    profilePhoto: String,

    companyname: {
        type: String,
        require: true
    },
    firstname: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
        require: true
    },
    businessemail: {
        type: String,
        require: true,
        index: true,
        unique: true,
        sparse: true,
        lowercase:true,
    },
    Gstnno: {
        type: String,
        require: true,
        unique: true

    },
    phoneno: {
        type: Number,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    website: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        enum: [roles.admin, roles.superadmin, roles.client],
        default: roles.client
    },

    // usernametoken:{type:String},

    isVerified: {
        type: Number,
        default: 0

    },

    token: {
        type: String,
        default: ''
    },
    lastLogin: {
        type: Date,

    },
  
},
    { timestamps: true }
);







module.exports = mongoose.model('register', usersSchema);








