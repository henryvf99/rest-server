const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const app = express();
const fs = require('fs');
const path = require('path');

//ejemplo https://github.com/richardgirges/express-fileupload/tree/master/example
// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        })
    }


    //tipos validos
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', ')
            }
        })

    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    //extensiones permitidaas
    let extensionesValidas = ['PNG', 'JPG', 'JPEG', 'GIF', 'jpg'];

    if (extensionesValidas.indexOf(extension) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', ')
            }
        })
    }

    //cambiar nombre del archivo
    //12345ABD-100.JPG
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            })

        }

        //aqui ya se cargó la img

        imagenUsuario(id, res, nombreArchivo);

    });

});

function imagenUsuario(id, res, nombreArchivo) {

    let imgCat = {
        img: nombreArchivo
    }

    Usuario.findByIdAndUpdate(id, imgCat, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no existe'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    });

};

function imagenProduto() {

}

function borrarArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}

module.exports = app;