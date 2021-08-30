const Mensaje = require('../models/mensaje');

const obtenerChat = async ( req, res ) => {

    const miId = req.uid;
    const mensajesDe = req.params.de;

    try {
        
        const last30 = await Mensaje.find({
            // Condución OR
            $or: [
                { de: miId, para: mensajesDe },
                { de: mensajesDe, para: miId }
            ]
        })
        .sort({ createdAt: 'asc' }) // Traer los mensajes creados de manera descendiente
        .limit(30); // Sólo traer 30
    
        res.json({
            ok: true,
            miId,
            mensajes: last30
        });

    } catch (error) {
        console.log(error);

        res.status(400).json({
            ok: false,
            msg: 'Comuniquese con el administrador'
        })
    }

}

module.exports = {
    obtenerChat
}