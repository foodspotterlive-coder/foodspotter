const express = require('express');
const { setupAdmin, loginAdmin } = require('../Controllers/adminController');

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/setup', setupAdmin); // Temporary for initial setup

module.exports = router;
