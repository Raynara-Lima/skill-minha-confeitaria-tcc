

var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://raynara:Raynara17*@cluster0.chxp5i9.mongodb.net/?retryWrites=true', {  useNewUrlParser: true, useUnifiedTopology: true });


var produtoNoFornoSchema = new mongoose.Schema({

        nomePro: String,
        hora: String, 
        tempo: String
}, {collection: 'produtoNoForno' }
);
 
module.exports = { Mongoose: mongoose, produtoNoFornoSchema: produtoNoFornoSchema } 
