const express = require('express')
const app = express()
const port = process.env.PORT || 8080
var db = require("./db");


app.get('/DefinirTempoForno' , (req, res) => {
  json = {"message": "success", "people": [{"name": "Cai Xuzhe", "craft": "Tiangong"}, {"name": "Chen Dong", "craft": "Tiangong"}, {"name": "Liu Yang", "craft": "Tiangong"}, {"name": "Sergey Prokopyev", "craft": "ISS"}, {"name": "Dmitry Petelin", "craft": "ISS"}, {"name": "Frank Rubio", "craft": "ISS"}, {"name": "Nicole Mann", "craft": "ISS"}, {"name": "Josh Cassada", "craft": "ISS"}, {"name": "Koichi Wakata", "craft": "ISS"}, {"name": "Anna Kikina", "craft": "ISS"}], "number": 10}
   console.log("req:"+req)
  res.send(req)  
  // const topicName = 'Car_input';

  // let json = JSON.parse(req.query[0])
  // const data = JSON.stringify( json);
  // const dataBuffer = Buffer.from(data);
  // publishMessage(topicName, dataBuffer)
  
  // res.setHeader('Access-Control-Allow-Origin', '*');

  // return res.json({ success: false});
})
app.get('/', (req, res) => {
  json = {"message": "success", "people": [{"name": "Cai Xuzhe", "craft": "Tiangong"}, {"name": "Chen Dong", "craft": "Tiangong"}, {"name": "Liu Yang", "craft": "Tiangong"}, {"name": "Sergey Prokopyev", "craft": "ISS"}, {"name": "Dmitry Petelin", "craft": "ISS"}, {"name": "Frank Rubio", "craft": "ISS"}, {"name": "Nicole Mann", "craft": "ISS"}, {"name": "Josh Cassada", "craft": "ISS"}, {"name": "Koichi Wakata", "craft": "ISS"}, {"name": "Anna Kikina", "craft": "ISS"}], "number": 10}
res.send(json)
})
// app.get('/', (req, res) => {
//     // json = {"message": "success", "people": [{"name": "Cai Xuzhe", "craft": "Tiangong"}, {"name": "Chen Dong", "craft": "Tiangong"}, {"name": "Liu Yang", "craft": "Tiangong"}, {"name": "Sergey Prokopyev", "craft": "ISS"}, {"name": "Dmitry Petelin", "craft": "ISS"}, {"name": "Frank Rubio", "craft": "ISS"}, {"name": "Nicole Mann", "craft": "ISS"}, {"name": "Josh Cassada", "craft": "ISS"}, {"name": "Koichi Wakata", "craft": "ISS"}, {"name": "Anna Kikina", "craft": "ISS"}], "number": 10}
//     json = {"nomePro": "bolo de cenoura", "hora": "10", "tempo": "t"};
//     var ProdutoNoForno = db.Mongoose.model('produtoNoForno', db.produtoNoFornoSchema, 'produtoNoForno');
//     var info = new ProdutoNoForno(json);
//     info.save(function (err) {
//       if (err) {
//           console.log("Error! " + err.message);
//           return err;
//         }
//       else {
//           console.log("Post saved");
        
//         }
//       });
//     var ProdutoNoForno = db.Mongoose.model('produtoNoForno', db.produtoNoFornoSchema, 'produtoNoForno');
//     ProdutoNoForno.find({}).lean().exec(
//       function (e, docs) {
//     console.log(docs)
//       })
//     // res.send(docs)   
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function getInfos(){
  var ProdutoNoForno = db.Mongoose.model('produtoNoForno', db.produtoNoFornoSchema, 'produtoNoForno');
  const docs =  ProdutoNoForno.find({}).lean().exec();
  console.log(docs)
  res.send(docs)
}

