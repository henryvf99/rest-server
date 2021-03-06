const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categoriaShema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        require: [true, 'La descripción es obligatoria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

module.exports = mongoose.model('Categoria', categoriaShema);;