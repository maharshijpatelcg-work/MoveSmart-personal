// MoveSmart — Route Controller
import Route from '../models/Route.js';

// @desc    Get all routes
// @route   GET /api/routes
export const getRoutes = async (_req, res) => {
  try {
    const routes = await Route.find().sort('-createdAt');
    res.json({ success: true, count: routes.length, routes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a route
// @route   POST /api/routes
export const createRoute = async (req, res) => {
  try {
    const route = await Route.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, route });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single route
// @route   GET /api/routes/:id
export const getRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ success: false, message: 'Route not found' });
    res.json({ success: true, route });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
