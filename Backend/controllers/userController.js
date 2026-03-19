const User = require("../models/User");
const bcrypt = require("bcryptjs")

exports.getProfile = async (req, res) => {
    try {
      const user = req.user;
  
      return res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profileImage: user.profileImage,
        },
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to get profile",
        error: error.message,
      });
    }
  };


exports.updateProfile = async (req, res) => {
    try{
           //1. Get firstName, lastName from req.body
           const { firstName, lastName } = req.body;
           if (!firstName || !lastName) {
             return res.status(400).json({
               success: false,
               message: "All fields are required",
             });
           }

           const userID = req.user.id;
           // 2. Update user in MongoDB
           const updatedUser = await User.findByIdAndUpdate(
            userID,
            { firstName, lastName },
            { new: true }
          ).select("-password");
           // 3. Return updated user info
           return res.status(200).json({
            success: true,                         
            message: "Profile updated successfully",
            user: {
              id: updatedUser._id,
              firstName: updatedUser.firstName,
              lastName: updatedUser.lastName,
              email: updatedUser.email,
              profileImage: updatedUser.profileImage,
            }
          })
    } catch(error){
        console.error(error);
        return res.status(500).json({
        success: false,
        message: "Failed to update profile",
        error: error.message,
      });
    }
}

exports.changePassword = async (req, res) => {
    try{
         // 1. Get oldPassword, newPassword from req.body
         const { oldPassword, newPassword } = req.body;
         if (!oldPassword || !newPassword) {
            return res.status(400).json({
              success: false,
              message: "All fields are required",
            });
          }
         // 2. Find user by id (with password this time)
         const userID = req.user._id;
         const user = await User.findById(userID);
         // 3. Compare oldPassword with bcrypt
         const isMatch = await bcrypt.compare(oldPassword, user.password);
         // 4. If wrong → return 401 error
         if (!isMatch) {
            return res.status(401).json({
              success: false,
              message: "Old password is incorrect",
            });
          }
         // 5. Hash newPassword
         const hashedPassword = await bcrypt.hash(newPassword, 10);
         // 6. Save new password to MongoDB
         user.password = hashedPassword;
         await user.save();
         // 7. Return success message
         return res.status(200).json({
            success: true,
            message: "Password changed successfully",
          });
    } catch(error){
        console.error(error);
        return res.status(500).json({
        success: false,
        message: "Failed to change password",
        error: error.message,
      });
    }
}


exports.deleteProfile = async (req , res) => {
    try{
          // 1. Get userID from req.user._id
          const userID = req.user._id;
          // 2. Delete user from MongoDB
          await User.findByIdAndDelete(userID);
          // 3. Return success message
          return res.status(200).json({
            success: true,
            message: "Profile Deleted Successfully"
          })
    } catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete profile",
            error: error.message,
        });
    }
}


exports.updateAvatar = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image file provided",
        });
      }
  
      const imageUrl = req.file.path;
      const userID = req.user._id;
  
      const updatedUser = await User.findByIdAndUpdate(
        userID,
        { profileImage: imageUrl },
        { new: true }
      ).select("-password");
  
      return res.status(200).json({
        success: true,
        message: "Profile image updated successfully",
        user: {
          id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          profileImage: updatedUser.profileImage,
        },
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to update profile image",
        error: error.message,
      });
    }
  };