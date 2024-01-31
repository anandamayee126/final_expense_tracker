const mongo= require('mongodb');
const mongoClient= mongo.MongoClient;

const mongoConnect= (callback)=>{
        mongoClient.connect('mongodb+srv://ghoshanandamayee:andy@12AB@nosqlcluster.aykufoh.mongodb.net/?retryWrites=true&w=majority').then((client) => {
        callback(client);
        console.log("Connected!!");
    }).catch((err) => {
        console.log(err);
    })
}

module.exports=mongoConnect;