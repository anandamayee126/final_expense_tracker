const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
// import {sgMail} from '@sendgrid/mail';
const bcrypt = require('bcrypt');

import User from '../models/user';
const Forgotpassword = require('../models/forgotpassword');

const forgotpassword = async (req:any, res:any) => {
    try {
        const { email } =  req.body;
        const user = await User.findOne({where : { email }});
        if(user){
            const id = uuid.v4();
            user.createForgotpassword({ id , active: true })
                .catch((err:any) => {
                    console.log(err)
                })

            sgMail.setApiKey(process.env.SENGRID_API_KEY)
            const msg = {
                to: email, // Change to your recipient
                from: 'yj.rocks.2411@gmail.com', // Change to your verified sender
                subject: 'Sending with SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
            }

            sgMail
            .send(msg)
            .then((response:any) => {

                // console.log(response[0].statusCode)
                // console.log(response[0].headers)
                return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})

            })
            .catch((error:any) => {
                console.log(error);
            })

            //send mail
        }else {
            console.log('User doesnt exist')
        }
    } catch(err:any){
        console.error(err)
        return res.json({ message: err, sucess: false });
    }

}

const resetpassword = (req:any, res:any) => {
    const id =  req.params.id;
    Forgotpassword.findOne({ where : { id }}).then((forgotpasswordrequest:any) => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()
        }
    })
}

const updatepassword = (req:any, res:any) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({ where : { id: resetpasswordid }}).then((resetpasswordrequest:any) => {
            User.findOne({where: { id : resetpasswordrequest.userId}}).then((user:any) => {
                // console.log('userDetails', user)
                if(user) {
                    //encrypt the password
                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err:any, salt:any) {
                        if(err){
                            // console.log(err);
                            console.log(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err:any, hash:any) {
                            // Store hash in your password DB.
                            if(err){
                                // console.log(err);
                                console.log(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error:any){
        return res.status(403).json({ error, success: false } )
    }

}


module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
};
    
