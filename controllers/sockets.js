// Acciones que se dispararán cuando algo relacionado a los sockets suceda

const Usuario = require('../models/usuario');
const Mensaje = require('../models/mensaje');

const usuarioConectado = async uid => {

    const usuario = await Usuario.findById(uid);

    // Modificamos el valor de online en la BD
    usuario.online = true;
    await usuario.save();

    return usuario;

}

const usuarioDesconectado = async uid => {

    const usuario = await Usuario.findById(uid);

    usuario.online = false;
    await usuario.save();

    return usuario;

}

const getUsuarios = async () => {

    const usuarios = await Usuario
        .find()
        .sort('-online'); // Ordenará primero los que estén online

    return usuarios;

}

const grabarMensaje = async payload => {

    try {
        
        const mensaje = new Mensaje(payload);
        await mensaje.save();

        return mensaje;

    } catch (error) {
        console.log(error);
        return false;
    }

}

module.exports = {
    usuarioConectado,
    usuarioDesconectado,
    getUsuarios,
    grabarMensaje
}