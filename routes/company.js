var express = require('express')
var router = express.Router()
const uploadXcl = require('../middlewares/uploadXcl')
const Company = require('../controllers/companyController')
// const { requireAuthUser } = require("../middlewares/authMiddleware");

router.get('/companies', Company.getCompanies)

router.post('/companies', uploadXcl.single('excelFile'), Company.createCompany)

router.put('/companies/:id', Company.updateCompany)

router.delete('/companies/:id', Company.deleteCompany)

module.exports = router;
