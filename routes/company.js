var express = require("express");
var router = express.Router();
const uploadXcl = require("../middlewares/uploadXcl");
const Company = require("../controllers/companyController");
const { requireAuthUser } = require("../middlewares/authMiddleware");

router.get('/companies',);

router.post('/companies', uploadXcl.single('excelFile'),);

router.put('/companies/:id',);

router.delete('/companies/:id',);
