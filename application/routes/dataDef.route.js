const express = require('express');

const router = express.Router();
const dataDefController = require('../controllers/data-def-ctrl');
const { requiredFieldValidator } = require('../middleware/validators');

router.post('/define', requiredFieldValidator(['providerId', 'fields']), dataDefController.addDataDefinition);
router.put('/', requiredFieldValidator(['fields']), dataDefController.updateDataDefinition);
router.get('/', dataDefController.getDataDefinition);
router.get('/all', dataDefController.allModels);
router.delete('/', dataDefController.dropDataDefinition);

module.exports = router;
