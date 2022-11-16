

var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://raynara:Raynara17*@cluster0.chxp5i9.mongodb.net/?retryWrites=true', {  useNewUrlParser: true, useUnifiedTopology: true });

var pedidoSchema = new mongoose.Schema({
        nomeCli: String,
        hora: String, 
        dia: String,
        produto: String,
        quantidade: Number,
        status: String
}, {collection: 'pedido' }
);
var produtoNoFornoSchema = new mongoose.Schema({
        nomePro: {type: String, unique: true},
        hora: String, 
        tempo: String
}, {collection: 'produtoNoForno' }
);

var estoqueSchema = new mongoose.Schema({
        ingrediente: {type: String, unique: true},
        quantidade: Number, 
}, {collection: 'estoque' }
);
var fornoSchema = new mongoose.Schema({
        id: 0,
        isLigado: Number,
        notificacao: Number,
}, {collection: 'forno' }
);

module.exports = { Mongoose: mongoose, pedidoSchema: pedidoSchema, produtoNoFornoSchema: produtoNoFornoSchema, estoqueSchema: estoqueSchema, fornoSchema: fornoSchema} 

