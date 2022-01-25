const express = require('express');

const router = express.Router();
const dataController = require('../controllers/data-ctrl');
const { requiredFieldValidator } = require('../middleware/validators');

router.post('/load', requiredFieldValidator(['providerId', 'data']), dataController.loadData);
router.get('/:providerId', dataController.getData);

module.exports = router;
