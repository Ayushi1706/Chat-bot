const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // ✅ Generate token after signup
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,  // ← token added!
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    });

  } catch (error) {
    console.error("SIGNUP ERROR", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req , res) => {
    try{
          // 1. Get email, password from req.body
          const {email, password} = req.body;
          // 2. Check if both fields are filled
          if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
          }
          // 3. Find user by email → User.findOne({ email })
          const existingUser = await User.findOne({ email });
          // 4. If user not found → return 404 error
          if(!existingUser){
            return res.status(404).json({
                success: false,
                message: "User doesn't exist"
            });
          }
          // 5. Compare password → bcrypt.compare(password, user.password)
          const isMatch = await bcrypt.compare(password, existingUser.password);
          
          // 6. If password wrong → return 401 error
          if(!isMatch){
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
          }
          // 7. Generate JWT token → jwt.sign()
          const token = jwt.sign(
            { id: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
          )
         // 8. Return token + user info
         return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
              id: existingUser._id,
              firstName: existingUser.firstName,
              lastName: existingUser.lastName,
              email: existingUser.email,
            },
    })
    } catch (error) {
        console.error("LOGIN ERROR", error);
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
 }
