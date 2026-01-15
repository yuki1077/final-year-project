const { getAllUsers, updateUserStatus, getPublishers, updateProfileImage, updatePassword } = require('../services/userService');
const { uploadImage } = require('../services/cloudinaryService');
const { sendApprovalEmail, sendPasswordChangeConfirmation } = require('../services/emailService');
const { notifyAccountApproval } = require('../services/notificationService');
const bcrypt = require('bcryptjs');

const listUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.json({ data: users });
  } catch (error) {
    next(error);
  }
};

const changeUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const user = await updateUserStatus(req.params.id, status);
    
    // Send email notification and create in-app notification
    if (user) {
      sendApprovalEmail({
        to: user.email,
        name: user.name,
        status: status,
      });
      
      // Create notification for user
      await notifyAccountApproval(user.id, status);
    }
    
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
};

const listPublishers = async (req, res, next) => {
  try {
    const publishers = await getPublishers();
    const filtered =
      req.user && req.user.role === 'school'
        ? publishers.filter((publisher) => publisher.status === 'approved')
        : publishers.filter((publisher) => publisher.status === 'approved'); // Public endpoint shows only approved
    res.json({ data: filtered });
  } catch (error) {
    next(error);
  }
};

const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Profile image is required' });
    }

    const uploaded = await uploadImage(req.file.buffer, 'profile-images');
    const profileImage = uploaded.secure_url;

    const updatedUser = await updateProfileImage(req.user.id, profileImage);
    res.json({ data: updatedUser, message: 'Profile image updated successfully' });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }

    // Verify current password
    const { findAuthByEmail } = require('../services/userService');
    const user = await findAuthByEmail(req.user.email);
    
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updatePassword(req.user.id, hashedPassword);

    // Send confirmation email
    sendPasswordChangeConfirmation({
      to: user.email,
      name: user.name,
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listUsers,
  changeUserStatus,
  listPublishers,
  uploadProfileImage,
  changePassword,
};

