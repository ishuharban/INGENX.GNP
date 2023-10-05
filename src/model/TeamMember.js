const bcrypt = require('bcrypt');
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: { type: String, required: true },
  assignedDeals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DealRegister' }],
});

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('TeamMember', userSchema);
