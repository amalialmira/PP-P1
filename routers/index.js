const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')


router.get('/', Controller.home) // ini untuk home


router.get('/register')
router.post('/register')

router.get('/studentLogin')
router.post('/studentLogin')
router.get('students/:id')
router.get('students/:id/edit')
router.post('students/:id/edit')

router.get('/teacherLogin')
router.post('/teacherLogin')
router.get('teachers/:id')
router.get('teachers/:id/edit')
router.post('teachers/:id/edit')

router.get("/courses")

router.get("/addCourse")
router.post("/addCourse")





//get register

//post register








module.exports = router
