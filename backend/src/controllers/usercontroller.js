const User = require('../models/userModel')
const { generateToken } = require('../utils/auth')

exports.registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body

    const userExists = await User.findOne({ email })

    if (userExists) {
      res.status(400).json({
        status: 'fail',
        message: 'Email already in use'
      })
      return
    }

    const newUser = new User({
      email,
      password,
      role
    })

    const savedUser = await newUser.save()
    const token = generateToken(savedUser._id)

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          _id: savedUser._id,
          email: savedUser.email,
          role: savedUser.role
        },
        token
      }
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    })
  }
}

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      })
      return
    }

    const token = generateToken(user._id)

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          _id: user._id,
          email: user.email,
          role: user.role
        },
        token
      }
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    })
  }
}
