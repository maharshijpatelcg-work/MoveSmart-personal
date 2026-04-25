// MoveSmart — User Controller
import User from '../models/User.js';

// @desc    Get current user profile
// @route   GET /api/users/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/me
export const updateMe = async (req, res) => {
  try {
    const { name, phone, trustedContacts } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, trustedContacts },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
