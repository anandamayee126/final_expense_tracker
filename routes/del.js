const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
// import {sgMail} from '@sendgrid/mail';
const bcrypt = require('bcrypt');

import {User} from '../models/user.js';
import {FP} from '../models/forgotpassword.js';

const forgotpassword = async (req,res) => {
    try {
        const { email } =  req.body;
        const user = await User.find({email:email });
        if(user){
            const id = uuid.v4();   // mongoose automatically takes _id so wt to do?
            const fp= new FP({userId:req.user._id , isActive: true })
            await fp.save();
            sgMail.setApiKey(process.env.SENGRID_API_KEY)
            const msg = {
                to: email, // Change to your recipient
                from: 'yj.rocks.2411@gmail.com', // Change to your verified sender
                subject: 'Sending with SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: `<a href="http://54.91.64.16:3000/password/resetpassword/${id}">Reset password</a>`,
            }

            sgMail
            .send(msg)
            .then((response) => {

                // console.log(response[0].statusCode)
                // console.log(response[0].headers)
                return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})

            })
            .catch((error) => {
                console.log(error);
            })

            //send mail
        }else {
            console.log('User doesnt exist')
        }
    } catch(err){
        console.error(err)
        return res.json({ message: err, sucess: false });
    }

}

const resetpassword = (req,res) => {
    const id =  req.params.id;
    FP.find({_id:id}).then((forgotpasswordrequest) => {
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

const updatepassword = (req,res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        FP.find({ where : { id: resetpasswordid }}).then((resetpasswordrequest) => {
            User.findOne({where: { id : resetpasswordrequest.userId}}).then((user) => {
                // console.log('userDetails', user)
                if(user) {
                    //encrypt the password
                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            // console.log(err);
                            console.log(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
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
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}


module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
};
    
