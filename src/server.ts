import * as express from 'express'
import * as mongoose from 'mongoose'
import * as cors from 'cors'
import { getEnvironmentVariables } from './environments/environment';
import UserRouter from './routers/UserRouter';

export class Server{
    public app: express.Application = express();

    constructor(){
        this.setConfig();
        this.setRoutes();
        this.error404Handler();
        this.handleErrors();
    }

    setConfig(){
        this.connectMongoDB();
        this.configBodyParser();
        this.allowCors();
    }

    connectMongoDB(){
        mongoose.connect(getEnvironmentVariables().db_uri)
        .then(()=> {
            console.log("Mongo connected")
        })
    }

    configBodyParser(){
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:true}));
    }

    allowCors(){
        this.app.use(cors());
    }

    setRoutes(){
        this.app.use('/api/user',UserRouter);
    }

    error404Handler(){
        this.app.use((req,res)=>{
            res.status(404).json({
                message: 'Not found',
                status_code: 404
            })
        })
    }

    handleErrors(){
        this.app.use((error,req,res,next)=>{
            console.log(req,"req.errorStatus",req.errorStatus);
            const errorStatus = req.errorStatus || 500
            res.status(errorStatus).json({
                message: error.message || 'Something went wrong',
                status_code: errorStatus
            })
        })
    }
}