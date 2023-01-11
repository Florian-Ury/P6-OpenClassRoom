const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require("../middleware/multer-config");

const sauceCtrl = require("../controllers/sauces");

router.post('/sauces', auth, multer, sauceCtrl.createSauce);
router.put('/sauces/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/sauces/:id', auth, sauceCtrl.deleteSauce);
router.get('/sauces/:id', auth, sauceCtrl.getOneSauce);
router.get('/sauces',auth, sauceCtrl.getAllSauce);
router.post('/sauces/:id/like', sauceCtrl.getLike);

module.exports = router;
