import * as nodeMailer from 'nodemailer';
import { getEnvironmentVariables } from '../environments/environment';
export class NodeMailer {
    private static initiateTransport() {
        return  nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: getEnvironmentVariables().gmail_auth.user, 
                pass: getEnvironmentVariables().gmail_auth.pass
            },
        });
    }

    static sendMail(data: { to: [string], subject: string, html: string }): Promise<any> {
        return NodeMailer.initiateTransport().sendMail({
            from: 'sachinvermaa1234@gmail.com',
            to: data.to,
            subject: data.subject,
            html: data.html
        })
    }

}