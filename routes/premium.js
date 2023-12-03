"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const premium = express();
const middleware = require('../middleware/auth');
const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('sequelize');
const AWS = require('aws-sdk');
const dot_env = require('dotenv');
dot_env.config();
const { Op } = require('sequelize');
premium.get('/showLeaderboard', middleware, async (req, res) => {
    const result = await User.findAll({
        attributes: [
            'id',
            'name',
            [sequelize.fn('COALESCE', sequelize.literal('SUM(`expenses`.`amount`)'), 0), 'total_expense'],
        ],
        include: [
            {
                model: Expense,
                attributes: []
            }
        ],
        group: [`User.id`],
        order: [[sequelize.literal('total_expense'), 'DESC']]
    });
    return res.json(result);
});
premium.get('/checkPremium', middleware, async (req, res) => {
    try {
        return res.json({ success: true, isPremiumUser: req.user.isPremiumUser });
    }
    catch (e) {
        return res.status(500).json({ success: false, msg: "Intenal server error" });
    }
});
function uploadToS3(data, fileName) {
    const BUCKET_NAME = "expensetrackerandy123";
    const IAM_USER_KEY = process.env.AWS_ANDY_ACCESS_KEY;
    const IAM_USER_SECRET = process.env.AWS_ANDY_SECRET_ACCESS_KEY;
    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    });
    var params = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: data,
        ACL: 'public-read'
    };
    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3Response) => {
            if (err) {
                console.log("Something is Wrong", err);
                reject(err);
            }
            else {
                console.log("Success", s3Response);
                resolve(s3Response.Location);
            }
        });
    });
}
premium.post('/downloadExpense', middleware, async (req, res) => {
    try {
        console.log("hiiiiiiiiiiii");
        const expenses = await req.body.data;
        const name = await req.user.name;
        const random = Math.random();
        console.log("expenses are: ", expenses);
        const stringifiedExpenses = JSON.stringify(expenses);
        console.log("stringifiedExpenses ", stringifiedExpenses);
        const fileName = `${name}_${random}.txt`;
        const fileUrl = await uploadToS3(stringifiedExpenses, fileName);
        return res.status(200).json({ fileUrl, success: true });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});
premium.post('/getdaily', middleware, async (req, res) => {
    try {
        if (req.user.isPremiumUser) {
            console.log("date: ", req.body.date);
            const data = await req.user.getExpenses({ where: { date: req.body.date } });
            return res.json(data);
        }
        else {
            return res.status(403).json({ success: false, msg: "you are not a premium user" });
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ success: false, msg: "Internal server error" });
    }
});
premium.post('/getweekly', middleware, async (req, res) => {
    try {
        // return res.json({message: "test"});
        if (req.user.isPremiumUser) {
            const endDate = new Date(req.body.date); //21
            var startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 7);
            console.log(startDate);
            // startDate= String(startDate);
            // const arr= startDate.split('T');
            // console.log(arr);
            const result = await req.user.getExpenses({
                where: {
                    date: {
                        [Op.gte]: startDate,
                        [Op.lte]: endDate
                    }
                }
            });
            return res.json(result);
        }
        else {
            return res.status(403).json({ success: false, msg: "you are not a premium user" });
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ success: false, msg: "Internal server error" });
    }
});
premium.post('/getMonthly', middleware, async (req, res) => {
    try {
        if (req.user.isPremiumUser) {
            const month = req.body.date;
            const startDate = new Date(month);
            const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
            const result = await req.user.getExpenses({
                where: {
                    date: {
                        [Op.gte]: startDate,
                        [Op.lt]: endDate
                    }
                }
            });
            return res.json(result);
        }
        else {
            return res.status(403).json({ success: false, msg: "you are not a premium user" });
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ success: false, msg: "Internal server error" });
    }
});
premium.get('/pagination/:pageNo', middleware, async (req, res) => {
    try {
    }
    catch (err) {
    }
});
exports.default = premium;
