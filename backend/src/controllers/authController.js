const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/jwt');
const { db } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');
const { HTTP_STATUS } = require('../utils/constants');
const { logger } = require('../utils/logger');

const signup = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        logger.error('Database error during signup:', err);
        return errorResponse(res, 'Database error', HTTP_STATUS.INTERNAL_SERVER_ERROR);
      }

      if (row) {
        return errorResponse(res, 'User with this email already exists', HTTP_STATUS.CONFLICT);
      }

      try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        db.run(
          'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
          [email, hashedPassword, role],
          function(err) {
            if (err) {
              logger.error('Error creating user:', err);
              return errorResponse(res, 'Failed to create user', HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }

            // Generate JWT token
            const token = generateToken({
              id: this.lastID,
              email,
              role
            });

            logger.info(`New user created: ${email} with role: ${role}`);

            return successResponse(res, {
              user: {
                id: this.lastID,
                email,
                role
              },
              token
            }, 'User created successfully', HTTP_STATUS.CREATED);
          }
        );
      } catch (hashError) {
        logger.error('Password hashing error:', hashError);
        return errorResponse(res, 'Failed to process password', HTTP_STATUS.INTERNAL_SERVER_ERROR);
      }
    });
  } catch (error) {
    logger.error('Signup error:', error);
    return errorResponse(res, 'Signup failed', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        logger.error('Database error during login:', err);
        return errorResponse(res, 'Database error', HTTP_STATUS.INTERNAL_SERVER_ERROR);
      }

      if (!user) {
        return errorResponse(res, 'Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
      }

      try {
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return errorResponse(res, 'Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
        }

        // Generate JWT token
        const token = generateToken({
          id: user.id,
          email: user.email,
          role: user.role
        });

        logger.info(`User logged in: ${email}`);

        return successResponse(res, {
          user: {
            id: user.id,
            email: user.email,
            role: user.role
          },
          token
        }, 'Login successful');
      } catch (compareError) {
        logger.error('Password comparison error:', compareError);
        return errorResponse(res, 'Authentication failed', HTTP_STATUS.INTERNAL_SERVER_ERROR);
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    return errorResponse(res, 'Login failed', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  signup,
  login
};

