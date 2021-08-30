
const { usuarioConectado, usuarioDesconectado, getUsuarios, grabarMensaje } = require("../controllers/sockets");
const { comprobarJWT } = require("../helpers/jwt");

class Sockets {

    constructor( io ) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on( 'connection', async socket => {
            
            // Extrae el valor del query mandado por sockets desde el cliente
            const tokenCliente = socket.handshake.query['x-token'];
            
            const [ valido, uid ] = comprobarJWT(tokenCliente);

            if( !valido ) {
                console.log('Socket no identificado');

                return socket.disconnect();
            }

            await usuarioConectado(uid);

            // Unir al usuario a una sala de socket.io
            socket.join( uid ); // uid es el nombre de la sala

            // TODO: Validar JWT
            // Si el token no es válido, desconectar

            // TODO: Saber qué usuario está acrivo

            // Emitir todos los usuarios conectados
            this.io.emit( 'lista-usuarios', await getUsuarios() );

            // TODO: Socket Join, uid

            // Escuchar cuando el cliene manda un mensaje
            // mensaje-personal
            socket.on( 'mensaje-personal', async payload => {
                // Graba el mensaje en la BD
                const mensaje = await grabarMensaje(payload);
                
                // Emite el socket a todos los que estén unidos a la sala especificada
                this.io.to( payload.para ).emit( 'mensaje-personal', mensaje );
                // Para que el usuario que mandó el mensaje lo reciba, también se puede hacer desde react para no consumir servidor
                this.io.to( payload.de ).emit( 'mensaje-personal', mensaje );
            });

            // Disconnect
            // Marcar en la BD que el usuario se desconectó
            socket.on( 'disconnect', async () => {
                await usuarioDesconectado(uid);
                this.io.emit( 'lista-usuarios', await getUsuarios() );
            });

        });
    }


}


module.exports = Sockets;