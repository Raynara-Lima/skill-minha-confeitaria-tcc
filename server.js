const express = require('express')
const app = express()
const port = process.env.PORT || 8080
var db = require("./db");

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.post('/DefinirTempoForno', (req, res) => {
  let json = JSON.parse(req.query[0])
  data = {"nomePro": json.nomePro, "hora": json.hora, "tempo": json.tempo};//JSON.stringify(json);
  var ProdutoNoForno = db.Mongoose.model('produtoNoForno', db.produtoNoFornoSchema, 'produtoNoForno');
  var info = new ProdutoNoForno(data);
    info.save(function (err, doc) {
      if (err) {
          console.log("Error! " + err.message);
          res.send(err)
        }
      else {
        res.send({code: 1})      
        }
      });
  
})

app.get('/ConsultarTempoRestante', (req, res) => {
  let json = JSON.parse(req.query[0]);
  var ProdutoNoForno = db.Mongoose.model('produtoNoForno', db.produtoNoFornoSchema, 'produtoNoForno');
  ProdutoNoForno.findOne({nomePro: json.produto}).lean().exec(
    function (e, docs) {
      if(docs === null){
        res.send({code: 0})
      }else{
        res.send(docs)
      }
    })  
})

app.post('/AdicionarIngredienteEstoque', (req, res) => {
  let json = JSON.parse(req.query[0])
//   data = {"ingrediente": json.ingrediente, "quantidade": json.quantidade};
//   var Estoque = db.Mongoose.model('estoque', db.estoqueSchema, 'estoque');
//   Estoque.findOneAndUpdate({ingrediente: json.ingrediente}, data, {upsert: true}, function(err, doc) {
//     if (err) return res.send(500, {error: err});
//     return res.send({code: 1});
// });
  return res.send(json)
})

app.get('/', (req, res) => {
  json = {"message": "success", "people": [{"name": "Cai Xuzhe", "craft": "Tiangong"}, {"name": "Chen Dong", "craft": "Tiangong"}, {"name": "Liu Yang", "craft": "Tiangong"}, {"name": "Sergey Prokopyev", "craft": "ISS"}, {"name": "Dmitry Petelin", "craft": "ISS"}, {"name": "Frank Rubio", "craft": "ISS"}, {"name": "Nicole Mann", "craft": "ISS"}, {"name": "Josh Cassada", "craft": "ISS"}, {"name": "Koichi Wakata", "craft": "ISS"}, {"name": "Anna Kikina", "craft": "ISS"}], "number": 10}
res.send(json)
})




