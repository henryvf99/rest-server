const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const app = express();
const jwt = require('jsonwebtoken');
require('../config/config');

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });
        }

        //si el usuario no fue encontrado no existe = !
        if (!usuarioDB) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: '(usuario) o contraseña incorrectos'
                }
            });
        }
        //si no son iguales las contraseñas
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario o (contraseña) incorrectos'
                }
            });
        }

        var token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    })


})



module.exports = app;