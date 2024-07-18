const {User} = require('../models')
const bcrypt = require('bcryptjs')

class Controller {
    static async home(req, res){
        try {
            res.render('homepage')
        } catch (error) {
            
        }
    }

    static async getRegForm(req,res){
        try {
            res.render('formRegist')
        } catch (error) {
            
        }
    }
    static async postReg(req,res){
        try {
            console.log(req.body);
            const {username, email, password, dateOfBirth, role} = req.body
            User.create({username, email, password, dateOfBirth, role})
            res.redirect('/login')
        } catch (error) {
            res.send(error.message)
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
                    return res.redirect('/')
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


    static async studentProfile(req,res){
        try {
            res.render('studentProfile')
        } catch (error) {
            
        }
    }
    static async teacherProfile(req,res){
        try {
            res.render()
        } catch (error) {
            
        }
    }

    static async course(req,res){
        try {
            res.render()
        } catch (error) {
            
        }
    }

    static async getCourseForm(req,res){
        try {
            res.render('formAddCourse')
        } catch (error) {
            
        }
    }
    static async postCourse(req,res){
        try {
            res.render()
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