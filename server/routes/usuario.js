const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')
const app = express();

app.get('/usuario', [verificaToken, verificaAdminRole], (req, res) => {

    return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
    })

    let desde = req.query.desde || 5;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado gogle img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {

                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            })

        })

});

app.post('/usuario', [verificaToken, verificaAdminRole], function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password=null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })

});

app.put('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {
    let id = req.params.id;
    //pick retorna una copia del objeto, filtando solo los valores que uno quiere
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
});

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {

    let id = req.params.id;

    let cambiaEstado = {
        estado: false,
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (usuarioBorrado === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })
});

module.exports = app;