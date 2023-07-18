var express = require('express')
var router = express.Router()
const uploadXcl = require('../middlewares/uploadXcl')
const Company = require('../controllers/companyController')
// const { requireAuthUser } = require("../middlewares/authMiddleware");

router.get('/', Company.getCompanies)

router.get('/error-log', Company.getErrorLogContent)

router.get('/:id', Company.getCompanieByid)

router.put('/Valider/:id', Company.Valider)

router.post('/Company', uploadXcl.fields([{ name: 'excelFile', maxCount: 1 }, { name: 'image_Compagne', maxCount: 1 }]), Company.createCompany)

// router.put('/Company/:id', Company.updateCompany)

router.delete('/Company/:id', Company.deleteCompany)

module.exports = router;
