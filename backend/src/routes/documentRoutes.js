'use strict';

const { Router } = require('express');
const documentController = require('../controllers/documentController');

const router = Router();
router.get('/documents', documentController.list);
router.get('/documents/:id/download', documentController.download);

module.exports = router;
