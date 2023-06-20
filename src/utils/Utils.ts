import * as Bcrypt from 'bcrypt';

export class Utils {
    public MAX_TOKEN_TIME = 10 * 60 * 1000; 
    static generateVerificationToken(digit:number = 6){
        const digits = '0123456789'
        let otp = '';
        for(let i=0; i<digit; i++){ 
            otp += Math.floor(Math.random()*10);
        }
        return parseInt(otp);
    }

    static encryptPassword(password) {
        return new Promise((resolve, reject) => {
            Bcrypt.hash(password, 10, (e, hash) => {
                if (e) {
                    reject(e);
                } else {
                    resolve(hash);
                }
            });
        })
    }
}