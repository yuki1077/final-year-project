const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findAuthByEmail, createUser, findUserById } = require('../services/userService');
const { sendRegistrationEmail } = require('../services/emailService');
const { uploadImage } = require('../services/cloudinaryService');

const generateToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

const register = async (req, res, next) => {
  try {
    const { name, email, password, role, organizationName, phone } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const requiresDocument = ['publisher', 'school'].includes(role);
    if (requiresDocument && !req.file) {
      return res.status(400).json({ message: 'Verification document is required' });
    }

    const existingUser = await findAuthByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const status = role === 'school' ? 'approved' : 'pending';
    let documentUrl = null;

    if (req.file) {
      const uploaded = await uploadImage(req.file.buffer, `verifications/${role}`);
      documentUrl = uploaded.secure_url;
    }

    const user = await createUser({
      name,
      email,
      role,
      organizationName,
      phone,
      password: hashedPassword,
      status,
      documentUrl,
    });

    sendRegistrationEmail({ to: email, name, role });

    res.status(201).json({
      message: 'Registration successful',
      user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findAuthByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({ message: 'Your account has been rejected' });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: await findUserById(user.id),
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await findUserById(req.user.id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
};

