import User from '../models/User.js';

export const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: `Welcome, ${user.name}!`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
