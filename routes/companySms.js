var express = require('express')
var router = express.Router()
const uploadXcl = require('../middlewares/uploadXcl')
const companySms = require('../controllers/companySmsController')
// const { requireAuthUser } = require("../middlewares/authMiddleware");

router.get('/', companySms.getCompanies)

router.get('/error-log', companySms.getErrorLogContent)

router.get('/:id', companySms.getCompanieByid)

router.put('/Valider/:id', companySms.Valider)

router.post('/Company', uploadXcl.fields([{ name: 'excelFile', maxCount: 1 }, { name: 'image_Compagne', maxCount: 1 }]), companySms.createCompany)

// router.put('/Company/:id', companySms.updateCompany)

router.delete('/Company/:id', companySms.deleteCompany)

module.exports = router;
