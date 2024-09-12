const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')


router.get('/', Controller.home) // ok


router.get('/register', Controller.getRegForm) // ok
router.post('/register', Controller.postReg) // ok

router.get('/login', Controller.getLoginForm) // ok
router.post('/login', Controller.postLogin) // ok

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

router.get("/home/students/:id",Controller.homeStudent) // ok
router.get('/students/:id', isStudent, Controller.studentProfile)
router.get('/students/:id/edit', isStudent, Controller.editStudent)
router.post('/students/:id/edit', isStudent, Controller.postEditStudent)
router.get('/students/:UserId/add/:CourseId', isStudent, Controller.addStudentCourse)
router.get('/students/:UserId/read/:CourseId', isStudent, Controller.readCourse)



router.get('/students/:UserId/delete/:CourseId', isStudent, Controller.deleteCourse)


router.get("/home/teachers/:id",Controller.homeTeacher)  // ok
            
router.get('/teachers/:id', isTeacher, Controller.teacherProfile)
router.get('/teachers/:id/edit', isTeacher, Controller.editTeacher)
router.post('/teachers/:id/edit', isTeacher, Controller.home)


router.get("/teachers/:id/courses/add", isTeacher, Controller.getCourseForm) // ok
router.post("/teachers/:id/courses/add", isTeacher, Controller.postCourse) // ok

router.get('/logout', Controller.getLogOut) // ok







module.exports = router
