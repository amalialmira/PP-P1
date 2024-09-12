const { Model } = require('sequelize')
const {User, Course, Category, Profile, UserCourse} = require('../models')
const bcrypt = require('bcryptjs')
const { Op } = require("sequelize")
const getJoinDate = require('../helpers/getJoinDate')
const nodemailer = require('nodemailer');

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
            res.render('formRegist', {errors})
        } catch (error) {
            res.send(error.message)
        }
    }
    static async postReg(req,res){
        try {
            const {username,firstName, lastName, email, password, dateOfBirth, role} = req.body
            
            let newAge = new Date(dateOfBirth)

            await User.create({username,firstName, lastName, email, password, dateOfBirth, role})
            let dataUser = await User.findOne({
                where: {username}
            })
           
            await Profile.create({firstName,lastName,age: newAge, UserId: dataUser.id})
            
            let transporter = nodemailer.createTransport({
                host: 'smtp.office365.com',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                user: 'alifbaaeducation@outlook.com', // Your Outlook email
                pass: 'azo0oz100' // Your Outlook password
                }
            });
            
            let mailOptions = (email) => {
                const option ={
                    from: 'alifbaaeducation@outlook.com', 
                    to: email , 
                    subject: 'Subject of your email', 
                    text: 'اهلا وسهلا! your accout is set, get started to master arabic with AlifBaa', 
                    
                }
                transporter.sendMail(option , (error, info) => {
                    if (error) {
                    return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                });
            };
            
            mailOptions(email)
            
            res.redirect('/login')
        } catch (error) {
            
            if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
                error = error.errors.map(el => {

                    return el.message
                })
                res.redirect(`/register?errors=${error}`)
            } else {
                res.send(error.message)
            }
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
            res.send(error.message)
        }
    }

    static async studentProfile(req,res){
        try {
            const {id} = req.params
            const{search} = req.query
            let userData = await User.searchTitle(id, search)
            let profiles = await Profile.findOne({
                where: {
                    UserId: userData.id
                }
            })
            console.log(profiles.umur);
            res.render('studentProfile', {userData, getJoinDate, profiles})
        } catch (error) {
            res.send(error.message)
        }
    }
    static async editStudent (req, res){
        try {
            const {id} = req.params
            let userData = await User.findByPk(id)
            res.render('formEditStudent', {userData})
        }   
         catch (error) {
            res.send(error.message)
        }
    }
    static async postEditStudent (req, res){
        const {username, firstName, lastName, email, password} = req.body
        const {id} = req.params
        await User.update({username, firstName, lastName, email, password},{
            where: {id}
        })
        res.redirect(`/students/${id}`)
    }
    static async editTeacher (req, res){
        try {
            const {id} = req.params
            let userData = await User.findByPk(id)
            res.render('formEditTeacher', {userData})
        }   
         catch (error) {
            res.send(error.message)
        }
    }
    static async postEditTeacher (req, res){
        const {username, firstName, lastName, email, password} = req.body
        const {id} = req.params
        await User.update({username, firstName, lastName, email, password},{
            where: {id}
        })
        res.redirect(`/teachers/${id}`)
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
    static async readCourse (req, res){
        try {
            const{UserId, CourseId} = req.params
            let userData = await User.findByPk(UserId)
            let course = await Course.findByPk(CourseId)
            res.render('materials', {course, userData})

        } catch (error) {
            res.send(error.message)
        }
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
            let {id} = req.params
            let userData = await User.findByPk(id)
            res.render('teacherProfile', {userData, getJoinDate})
        } catch (error) {
            res.send(error.message)
        }
    }

    static async getCourseForm(req,res){
        try {
            let {id} = req.params
            let userData = await User.findByPk(id)
            let cat = await Category.findAll()
            res.render('formAddCourse', {cat, userData})
        } catch (error) {
            res.send()
        }
    }

    static async postCourse(req,res){
        try {
            // console.log(req.body);
            const {title, description, imageURL, CategoryId} = req.body
    
            await Course.create({title, description, imageURL, CategoryId})
            res.redirect('/') //redirect ke home teacher
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