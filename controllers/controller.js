const { Model } = require('sequelize')
const {User, Course, Category, Profile, UserCourse} = require('../models')
const bcrypt = require('bcryptjs')
const { Op } = require("sequelize")

class Controller {
    static async home(req, res){
        try {
            const {level} = req.query
            let courses
            if (level){
                courses = await Course.findAll({
                    include: {
                        model: Category,
                        where: {
                            name: `${level}`
                        }
                    }
                })
            } else {
                courses = await Course.findAll()
            }
            res.render('homepage', {courses})
        } catch (error) {
            res.send(error.message)
        }
    }

    static async getRegForm(req,res){
        try {
            const{errors} = req.query
            // console.log(errors);
            res.render('formRegist', {errors})
        } catch (error) {
            res.send(error.message)
        }
    }
    static async postReg(req,res){
        try {
            const {username,firstName, lastName, email, password, dateOfBirth, role} = req.body
            
            let newAge = new Date().getFullYear - new Date(dateOfBirth).getFullYear

            User.create({username,firstName, lastName, email, password, dateOfBirth, role})
            Profile.create({firstName,lastName,age: dateOfBirth})
            res.redirect('/login')
        } catch (error) {
            // console.log(error);
            // if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
            //     error = error.errors.map(el => {

            //         return el.message
            //     })
            //     res.redirect(`/register?errors=${error}`)
            // } else {
                res.send(error.message)
            // }
        }
    }
    static async getLoginForm(req,res){
        try {
            const {error} = req.query
            res.render('loginForm', {error})
        } catch (error) {
            res.send(error.message)
        }
    }
    static async postLogin(req,res){
        try {
            
            const{username, password} = req.body
           
            let data = await User.findOne({
                where: {username}
            })
            if (data){
                const isValidPassword = bcrypt.compareSync(password, data.password)

                req.session.userId = data.id
                req.session.role = data.role

                if (isValidPassword){

                    if(data.role === "Teacher"){

                        return res.redirect(`/home/teachers/${data.id}`)
                        
                    }else if (data.role === "Student") {
                        
                        return res.redirect(`/home/students/${data.id}`)
                    }

                } else {
                    const error = "invalid password / username"
                    return res.redirect(`/login?error=${error}`)
                }
                
            } else {
                const error = "username not found"
                return res.redirect(`/login?error=${error}`)  
            }
            
        } catch (error) {
            res.send(error.message)
        }
    }

    static async homeStudent(req,res){
        try {
            const {id} = req.params
            let userData = await User.findByPk(id)
            let courses = await Course.findAll()

            res.render("studentHome",{userData, courses})
        } catch (error) {
            res.send(error)
        }
    }
    
    static async homeTeacher(req,res){
        try {
            
            const {id} = req.params

            let userData = await User.findByPk(id)

            res.render("teacherHome",{userData})

        } catch (error) {
            
        }
    }

    static async studentProfile(req,res){
        try {
            const {id} = req.params
            const{search} = req.query
            let userData
            if (search){
                userData = await User.findByPk(id, {
                    include: {
                        model: Course,
                        where: {
                            title: {
                                [Op.iLike]: `%${search}%`
                            }
                        },
                        include: Category,
                    }  
                })
            } else {
                userData = await User.findByPk(id, {
                    include: {
                        model: Course,
                        include: Category
                        }
                })
            }
            res.render('studentProfile', {userData})
        } catch (error) {
            res.send(error.message)
        }
    }
    static async editStudent (req, res){

    }
    static async postEditStudent (req, res){

    }
    static async addStudentCourse (req, res){
        try {
            const{UserId, CourseId} = req.params
            await UserCourse.create({CourseId , UserId})
            res. redirect(`/students/${UserId}`)
        } catch (error) {
            res.send(error.message)
        }
    }
    static async postStudentCourse (req, res){

    }
    static async deleteCourse (req, res){
        try {
            const {UserId, CourseId} = req.params
            await UserCourse.destroy({
                where: {CourseId , UserId}
            })
            res.redirect(`/students/${UserId}`)
        } catch (error) {
            res.send(error.message)
        }
    }


    static async teacherProfile(req,res){
        try {

            res.render('teacherProfile')
        } catch (error) {
            res.send(error.message)
        }
    }

    static async getCourseForm(req,res){
        try {
            let cat = await Category.findAll()
            res.render('formAddCourse', {cat})
        } catch (error) {
            res.send()
        }
    }

    static async postCourse(req,res){
        try {
            // console.log(req.body);
            const {title, description, imageURL, CategoryId} = req.body
    
            await Course.create({title, description, imageURL, CategoryId})
            res.redirect('/')
        } catch (error) {
            
        }
    }
    static async getLogOut(req, res){
        try {
            req.session.destroy((err) => {
                if (err) res.send(err); 
                else {
                    res.redirect('/')
                }
            })
        } catch (error) {
           res.send(error.message)
        }
    }
    
}

module.exports = Controller