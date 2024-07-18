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
            
        } catch (error) {
            
        }
    }


    static async getLoginForm(req,res){
        try {
            res.render('loginForm')
        } catch (error) {
            
        }
    }
    static async postLogin(req,res){
        try {
            res.render()
        } catch (error) {
            
        }
    }


    static async studentProfile(req,res){
        try {
            res.render()
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
            res.render()
        } catch (error) {
            
        }
    }
    static async postCourse(req,res){
        try {
            res.render()
        } catch (error) {
            
        }
    }
    
}

module.exports = Controller