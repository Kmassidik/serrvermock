var express = require('express');
var router = express.Router();
const apiController = require('../controller/apiController')

router.get('/',apiController.home)
router.post('/register', apiController.register);
router.post('/login', apiController.login);
router.post('/addTodo', apiController.addTodo);
router.get('/list/:username',apiController.listTodo)
router.put('/list/:username/:id',apiController.completedTodo)

module.exports = router;
