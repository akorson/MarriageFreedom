const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['client', 'staff', 'cfaClient'],
    default: 'client'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Hash the password before saving the user model
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

// Compare the hashed password in the database with the provided password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', userSchema)
