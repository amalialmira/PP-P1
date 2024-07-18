const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')


router.get('/', Controller.home) // ini untuk home


router.get('/register', Controller.getRegForm)
router.post('/register', Controller.postReg)

router.get('/login', Controller.getLoginForm)
router.post('/login', Controller.postLogin)

router.use(function (req, res, next){
    if (!req.session.userId){
        const error = 'Please log in first!'
        res.redirect(`/login?error=${error}`)
    }
    else {
        next()
    }
}) 

const isStudent = function (req, res, next){
    if (req.session.role === "Student"){
        next()
    }
}

const isTeacher = function (req, res, next){
    if (req.session.role === "Teacher"){
        next()
    }
}

router.get('/students', isStudent, Controller)
router.get('students/:id/edit', isStudent, Controller)
router.post('students/:id/edit', isStudent, Controller)

router.get('teachers/:id', isTeacher, Controller)
router.get('teachers/:id/edit', isTeacher, Controller)
router.post('teachers/:id/edit', isTeacher, Controller)

router.get("/courses")

router.get("/courses/add", isTeacher, Controller.getCourseForm)
router.post("/courses/add", isTeacher, Controller)

router.get('/logout', Controller.getLogOut)





//get register

//post register








module.exports = router
