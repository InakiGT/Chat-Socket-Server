const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

// Models
const Usuario = require('../models/usuario');

// Nuevo Usuario
const crearUsuario = async ( req, res = response ) => {
    // response sólo para acceder al tipado
    
    try {
        
        const { email, password } = req.body;

        // Verificar que el email no exista
        const existEmail = await Usuario.findOne({ email });

        if( existEmail ) {

            return res.status(400).json({
                ok: false,
                msg: 'Correo ya existe'    
            });

        }


        const usuario = new Usuario( req.body );

        // Encriptar el Password
        const salt = bcrypt.genSaltSync();

        usuario.password = bcrypt.hashSync( password, salt );

        // Guardar en BD
        await usuario.save();

        // Generar nuevo JWT
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

// Login
const login = async ( req, res = response ) => {

    const { email, password } = req.body;

    try {
        
        const usuarioBD = await Usuario.findOne({ email });

        // Verificar si el correo existe
        if( !usuarioBD ){

            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });

        }

        // Validar el password
        const validPassword = bcrypt.compareSync( password, usuarioBD.password );

        if( !validPassword ) {

            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            });

        }

        // Crear el jwt
        const token = await generarJWT( usuarioBD.id );

        res.json({
            ok: true,
            usuario: usuarioBD,
            token
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
    
}

// Revalidar Token
const renewToken = async ( req, res = response ) => {

    const uid = req.uid;

    // Generar un nuevo JWT
    const token = await generarJWT(uid);

    // Obtener el usuario por uid
    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        usuario,
        token
    });

}


module.exports = {
    crearUsuario,
    login,
    renewToken
};