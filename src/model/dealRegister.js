const mongoose = require("mongoose");
const dealregister = mongoose.Schema(
  {
    user_id:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "register",
    },
    dealname: {
      type: String,
      require: true,
    },
    customername: {
      type: String,
      require: true,
    },
    toi: {
      type: String,
     require:true ,
    },
    opptype: {
      type: String,
    },
    productname:  [{
      type: String,
  
    }],
    nou: {
      type: String,
      require: true,
    },

    currenterp: {
      type: String,
      require: true,
    },
    
estimatecost:{
         type:Number,
         require:true,
    },
    Status:{
      type:String,
      enum:['Approved','Rejected','Pending','Closed'],
      default:'Pending'
  },
  Stage:{
    type:String,
  enum:['0%','10%','20%','30%','40%','50%','60%','70%','80%','90%','100%'],
default:'0%'},
comment:{
  type : String ,
},
assignedTo: String

  
   
  },
  { timestamps: true }
);

dealregister.methods.saveData = async function () {
  try {
    return await this.save();
  } catch (err) {
    throw err;
  }
};

module.exports = mongoose.model("DealRegister", dealregister);
