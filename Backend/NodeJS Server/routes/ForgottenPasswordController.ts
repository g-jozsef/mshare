import {StatusCodes} from "../core/StatusCodes";
import {BaseController} from "../core/BaseController";
import {Email} from "../utils/Email";
import {ForgottenPasswordResponse} from "../core/Responses/ForgottenPasswordResponse";

const nodemailer = require('nodemailer');

export class ForgottenPasswordController extends BaseController{

    emailSender : Email;

    public registerRoutes() {
        super.registerRoutes();

        this.router.route('/forgotpass')
            .post(async (req, res) => {
                const email: string = req.get('email');
                if(email == null){
                    res.status(StatusCodes.InternalError).send();
                    return;
                }
                if (email){
                    async (error, result) => {
                        this.emailSender.sendMailText(email,"Forgotten Password", this.getEmailContent());
                        if(error) {
                            res.status(StatusCodes.InternalError).send(new ForgottenPasswordResponse('0'));
                            return;
                        }

                        if(result){
                            res.status(StatusCodes.OK).send(new ForgottenPasswordResponse('1'));
                        }
                    }
                }
            });

        this.router.route('/resetpass')
            .post(async (req, res) => {
                const email: string = req.get('email');
                const password: string = req.get('newpassword');
                const token: string = req.get('token');
                if(email == null || password == null || token == null){
                    res.status(StatusCodes.InternalError).send();
                    return;
                }
                const hashedPassword: string = hasher(password);

                await this.getDb().collection('users').updateOne(
                    {$and: [
                            {email: email}
                        ]},
                    {
                        $set: {password: hashedPassword}
                    },
                    async (err, user) =>{
                        if(err) {
                            res.status(StatusCodes.InternalError).send(err);
                            return;
                        }
                        if (user){
                            res.status(StatusCodes.OK).send();
                        } else {
                            res.status(StatusCodes.Forbidden).send();
                        }
                    }
                );
        });
               //check token valid
        //         vagyis van egy modellunk email + token + valid-e + datum
        //         await this.getDb().collection('resetedmails').findOne(
        //             { $and: [
        //                     {email: email},
        //                     {token: token},
        //                     {valid: 1},
        //                     {created: '2019-01-01'}//datumot
        //                 ] },async (err, resetedmail) => {
        //                 if(err) {
        //                     res.status(StatusCodes.InternalError).send(err);
        //                     return;
        //                 }
        //                 if (resetedmail){
        //                     //itt kell a modositast a resetedben
        //
        //                     res.status(StatusCodes.OK).send()
        //                     );
        //                 } else {
        //                     //Itt kell az updatet letolni
        //                     res.status(StatusCodes.BadRequest).send()
        //                     );
        //                 }
        //             });
        //         //menteni a user passwordot
        //
        //         //ha minden ok akkor return ok
        //
        //
        //         if (email){
        //             async (error, result) => {
        //                 this.emailSender.sendMailText(email,"Forgotten Password", "Test");
        //                 if(error) {
        //                     res.status(StatusCodes.InternalError).send(error);
        //                     return;
        //                 }
        //
        //                 if(result){
        //                     res.status(StatusCodes.OK).send(result);
        //                 }
        //             }
        //         }
        //     });
    }

    private makeString() : string {
        let outString: string = '';
        let inOptions: string = 'abcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 20; i++) {

            outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));
        }
        return outString;
    }

    private getEmailContent() : string {
        return 'Az alábbi linkre kattintva módosíthatja jelszavát: ' + this.config.site_url_for_user + 'resetpass?token='+this.makeString();
    }
}
