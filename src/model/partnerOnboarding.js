const mongoose = require('mongoose');

const partnerboading = new mongoose.Schema({

    user_id:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "login",
    },

    companylegalname: {

        type: String,

        require: true,

        unique:true
  },

    companyregisteredaddress: {

        type: String,

        require: true,

    },

    companySize: {

        type: String,

        require: true,

    }, 
    companyRC: {

        type:String,

        require: true,

        // unique: true

    },

    companyGSTC: {

        type:String,

        require: true,

        unique: true

    }, companyPan: {

        type:String,

        require: true,

        unique: true

    },

    Nameonbank:{

        type:String,

        require:true

    },

    AccountNumber:{

        type:Number,

        require:true

    },

    bankName:{

         type:String,

         require:true

    },

    IFSCcode :{

        type:String,

        require:true,

       

    },

    BranchAddress :{

        type:String,

        require:true,

        // unique:true

    },
    CancelledCheque:{
        type:String,

        require: true,
    }

})



module.exports = mongoose.model("partnerOnboarding",partnerboading);