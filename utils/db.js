const mongo= require('mongodb');
const mongoClient= mongo.MongoClient;
let _db;

const mongoConnect= (callback)=>{
        mongoClient.connect('mongodb+srv://andy:JuOupNWAcOMRmnAP@exp.1rbyylg.mongodb.net/').then((client) => {
            _db=client.db();
            callback();
            console.log("Connected!!");
    }).catch((err) => {
        console.log(err);
    })
}

const getDb= function(){
    if(_db){
        return _db;
    }
    throw "No database found";
}

exports.mongoConnect= mongoConnect;
exports.getDb=getDb;