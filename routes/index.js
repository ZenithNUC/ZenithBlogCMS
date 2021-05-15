var express = require('express');
var router = express.Router();

const IndexController  = require('../controllers/index');

/* GET home page. */
router.get('/',IndexController.index);
router.get('/category/:categoryId',IndexController.cate);
router.get('/article/:articleId',IndexController.article);
router.get('/about',IndexController.about);

module.exports = router;
