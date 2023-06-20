import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserValidators } from "../validators/UserValidators";
import { GlobalMiddleware } from "../middlewares/GlobalMiddlewares";

class UserRouter{
    public router:Router;

    constructor(){
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.putRoutes();
        this.deleteRoutes();
    }

    getRoutes(){
        this.router.get('/send/verification/email',UserValidators.verifyUserForResendEmail(),GlobalMiddleware.checkError,UserController.resendVerificationEmail);
    }
    
    postRoutes(){
        this.router.post('/login',UserController.login)
        this.router.post('/signup',UserValidators.signup(),GlobalMiddleware.checkError,UserController.signup)
    }
    patchRoutes(){
        this.router.patch('/verify',UserValidators.verifyUserEmail(),GlobalMiddleware.checkError,UserController.verify)
    }
    putRoutes(){

    }
    deleteRoutes(){

    }
}


export default new UserRouter().router;