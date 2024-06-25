const express = require('express');
const router = express.Router();
const maintenanceController = require('../controller/maintenanceController');

router.post('/backup', maintenanceController.createBackup);
router.post('/restore', maintenanceController.restoreBackup);
router.get('/userlogs', maintenanceController.getUserLogs);
router.get('/backups', maintenanceController.listBackups);

module.exports = router;