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
  data = {"ingrediente": json.ingrediente, "quantidade": json.quantidade};
  var Estoque = db.Mongoose.model('estoque', db.estoqueSchema, 'estoque');
  Estoque.findOneAndUpdate({ingrediente: json.ingrediente}, data, {upsert: true}, function(err, doc) {
    if (err) return res.send(500, {error: err});
    return res.send({code: 1});
});
})

app.post('/ConsultarIngredienteEstoque', (req, res) => {
  let json = JSON.parse(req.query[0])
  var Estoque = db.Mongoose.model('estoque', db.estoqueSchema, 'estoque');
  Estoque.findOne({ingrediente: json.ingrediente}).lean().exec(
    function (e, docs) {
      if(docs === null){
        res.send({code: 0})
      }else{
        res.send(docs)
      }
    })  
})

app.post('/ExcluirIngredienteEstoque', (req, res) => {
  let json = JSON.parse(req.query[0])
  var Estoque = db.Mongoose.model('estoque', db.estoqueSchema, 'estoque');
  Estoque.findOne({"ingrediente": json.ingrediente}).lean().exec(
    function (e, doc) {
      if(doc === null){
        res.send({code: 0})
      }else{
        const qtd = doc.quantidade - json.quantidade;
        if(qtd> 0){
          Estoque.findOneAndUpdate({"ingrediente": json.ingrediente}, {quantidade: qtd}, {new: true}, function (err, obj) {
              if (err){
                res.send(err)
              }
              else{
                res.send(obj)
              }
            })
        }else if(qtd === 0){
          Estoque.findOneAndDelete({ingrediente: "farinha"}, function(err, doc) {
            if (err) return res.send(500, {error: err});
            return res.send({code: -1});
        })
        }else{
          docs.code = -1
          res.send(doc)
        }
     }
    }) 
})

app.get('/', (req, res) => {
  json = {"message": "success", "people": [{"name": "Cai Xuzhe", "craft": "Tiangong"}, {"name": "Chen Dong", "craft": "Tiangong"}, {"name": "Liu Yang", "craft": "Tiangong"}, {"name": "Sergey Prokopyev", "craft": "ISS"}, {"name": "Dmitry Petelin", "craft": "ISS"}, {"name": "Frank Rubio", "craft": "ISS"}, {"name": "Nicole Mann", "craft": "ISS"}, {"name": "Josh Cassada", "craft": "ISS"}, {"name": "Koichi Wakata", "craft": "ISS"}, {"name": "Anna Kikina", "craft": "ISS"}], "number": 10}
res.send(json)
})




