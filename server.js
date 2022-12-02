const express = require('express')
const app = express()
const port = process.env.PORT || 3000
var db = require("./db");

var Pedido = db.Mongoose.model('pedido', db.pedidoSchema, 'pedido');
var Forno = db.Mongoose.model('forno', db.fornoSchema, 'forno');
var ProdutoNoForno = db.Mongoose.model('produtoNoForno', db.produtoNoFornoSchema, 'produtoNoForno');
var Estoque = db.Mongoose.model('estoque', db.estoqueSchema, 'estoque');

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
app.get('/', (req, res) => {
        res.send("Seja bem vindo")
})
app.get('/ConsultarAgenda', (req, res) => {
  let json = JSON.parse(req.query[0])
  Pedido.find({dia: json.dia, "status": "agendado"}).lean().exec(
    function (e, docs) {
      if(docs === null){
        res.send({code: 0})
      }else{
        res.send(docs)
      }
    })  
})
app.post('/AgendarPedido', (req, res) => {
   let json = JSON.parse(req.query[0])
  data = {"nomeCli": json.nomeCli, "hora": json.hora, "dia": json.dia, "produto": json.produto, "quantidade": json.quantidade, "status": json.status};
  var pedido = new Pedido(data);
  pedido.save(function (err, doc) {
      if (err) {
          console.log("Error! " + err.message);
          res.send(err)
        }
      else {
        res.send({code: 1})      
        }
      });
})

app.get('/getPedidosCli', (req, res) => {
   let json = JSON.parse(req.query[0])
   let statusPedido;
  if(json.statusPedido === "finalizado"){
    statusPedido = "finalizado"
  }else{
    statusPedido = "agendado"
  }
  let  filtro = {nomeCli: json.nomeCli, status: statusPedido, dia: json.dia}
  if(json.dia === undefined || json.dia === null){
    filtro =  {nomeCli: json.nomeCli, status: statusPedido}
  }
   
  Pedido.find(filtro).lean().exec(
    function (e, docs) {
      if(docs === null){
        res.send({code: 0})
      }else{
         res.send(docs)

      }
    })  
})
app.post('/ExcluirPedido', (req, res) => {
   let json = JSON.parse(req.query[0])
  Pedido.findOneAndDelete( {_id: json.id}, function(err, doc) {
            if (err) return res.send(500, {error: err});
            return res.send({code: 1});
        })
})

app.post('/FinalizarPedido', (req, res) => {
   let json = JSON.parse(req.query[0])
  Pedido.findOneAndUpdate( {_id: json.id}, {status: "FINALIZADO"}, function(err, doc) {
            if (err) return res.send(500, {error: err});
            return res.send({code: 1});
        })
})

app.post('/DefinirTempoForno', (req, res) => {
  let json = JSON.parse(req.query[0])
  data = {"nomePro": json.nomePro, "hora": json.hora, "tempo": json.tempo};//JSON.stringify(json);
  var info = new ProdutoNoForno(data);
    info.save(function (err, doc) {
      if (err) {
          console.log("Error! " + err.message);
          res.send(err)
        }
      else {
        Forno.findOneAndUpdate({"id": 0}, {"statusForno": 1},{upsert: true}).exec()
        res.send({code: 1})      
        }
      });
  
})

app.get('/ConsultarTempoRestante', (req, res) => {
  let json = JSON.parse(req.query[0]);
  ProdutoNoForno.findOne({nomePro: json.produto}).lean().exec(
    function (e, docs) {
      if(docs === null){
        res.send({code: 0})
      }else{
        res.send(docs)
      }
    })  
})
app.get('/ConsultarProdutosForno', (req, res) => {
  ProdutoNoForno.find().lean().exec(
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
  Estoque.findOneAndUpdate({ingrediente: json.ingrediente}, data, {upsert: true}, function(err, doc) {
    if (err) return res.send(500, {error: err});
    return res.send({code: 1});
});
})

app.get('/ConsultarIngredienteEstoque', (req, res) => {
  let json = JSON.parse(req.query[0])
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
          Estoque.findOneAndDelete({ingrediente: json.ingrediente}, function(err, doc) {
            if (err) return res.send(500, {error: err});
            return res.send({code: 1});
        })
        }else{
          docs.code = -1
          res.send(doc)
        }
     }
    }) 
})

app.get('/LigarForno', (req, res) => {

  Forno.findOneAndUpdate({"id": 0}, {"statusForno": 1},{upsert: true}, function(err, doc) {
    if (err) return res.send({error: err});
    return res.send({code: 1});
  })
})

app.get('/DesligarForno', async (req, res) => {
 const count = await ProdutoNoForno.countDocuments({}).exec()
 if(count > 0){
     return res.send({code: 0});
 }else{
  Forno.findOneAndUpdate({"id": 0}, {"statusForno": 0},{upsert: true}, function(err, doc) {
    if (err) return res.send({error: err});
    return res.send({code: 1});
  })
 }
})

app.get('/setInfosForno', async (req, res) => {
 let dados;
  if(req.query.statusNotificacao !== undefined){
    dados =  {"statusNotificacao": req.query.statusNotificacao}
  }
  if(req.query.temperatura !== undefined){
    dados =  {"temperatura": req.query.temperatura}
  }
  Forno.findOneAndUpdate({"id": 0}, dados, {upsert: true}, function(err, doc) {
      if (err) return res.send({error: err});
      return res.send(dados);
 })
})
app.get('/getInfosForno', async (req, res) => {
  let count = 0, forno;
  var ProdutoNoForno = db.Mongoose.model('produtoNoForno', db.produtoNoFornoSchema, 'produtoNoForno');
   const docs = await ProdutoNoForno.find().exec();

    docs.forEach(
      async function (element) {
      let tempoRestante = calcularTempoRestante(element.hora, element.tempo)
      if(tempoRestante == 0){
        await Forno.findOneAndUpdate({"id": 0}, {"statusNotificacao": 1} ,{upsert: true}).exec()
        await ProdutoNoForno.findOneAndDelete({"nomePro": element.nomePro}).exec()
      }
      count = await ProdutoNoForno.countDocuments({}).exec()
      if(count === 0){
        Forno.findOneAndUpdate({"id": 0}, {"statusForno": 0} ,{upsert: true}).exec();  
      }
    })
 
    forno = await Forno.findOne().lean().exec();
    res.send({"statusForno": forno.statusForno, "statusNotificacao": forno.statusNotificacao, "temperatura": forno.temperatura })
})


const calcularTempoRestante = (hora, tempo) =>{
  const moment = require('moment');  
  const horaAtual = new Date().toLocaleTimeString("pt-BR", {timeZone: 'America/Fortaleza', hour12: false})
  let horaFormatada = moment(horaAtual, "HH:mm").format("HH:mm")
  const tempoPassado =  moment(horaFormatada, 'HH:mm').subtract(hora, 'HH:mm').format('HH:mm');
  let resultado;
  if(tempoPassado > moment(tempo, 'm').format('HH:mm')){
    resultado = 0;
  }else{
    resultado = moment(tempo, 'm').subtract(tempoPassado, 'm').format('m');
  }
  return resultado;
}
