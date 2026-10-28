const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const authController = require('../controllers/authController');
const dataController = require('../controllers/dataController');
const authMiddleware = require('../middleware/authMiddleware');

const analyticsController = require('../controllers/analyticsController');
const complaintController = require('../controllers/complaintController');
const predictionController = require('../controllers/predictionController');

// Auth Routes
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.post('/auth/logout', authController.logout);

// Data Routes
router.post('/readings/upload', authMiddleware, upload.single('file'), dataController.uploadReadings);
router.post('/readings/manual', authMiddleware, dataController.addManualReading);

// ✅ NEW: GET readings for Energy Consumption page
router.get('/readings', authMiddleware, dataController.getReadings);

// Analytics Routes
router.get('/analytics/dashboard', authMiddleware, analyticsController.getDashboardStats);
router.get('/analytics/predictions', authMiddleware, predictionController.getPredictions);

// Complaint Routes
router.post('/complaints', authMiddleware, complaintController.createComplaint);
router.get('/complaints', authMiddleware, complaintController.getComplaints);

module.exports = router;

