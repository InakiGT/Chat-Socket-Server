const jwt = require('jsonwebtoken');

const generarJWT = uid => {

    // Se utiliza una promesa porque se debe hacer un await de la función y JWT utiliza Callbacks
    return new Promise( ( resolve, reject ) => {

        const payload = { uid };

        jwt.sign( payload, process.env.SECRETA, {
            expiresIn: '48h'
        }, ( err, token ) => {

            if( err ) {
                console.log(err)
                reject('No se pudo generar el JWT');
            } else {
                resolve(token);
            }

        } );

    });

}

const comprobarJWT = ( token = '' ) => {

    try {

        const { uid } = jwt.verify( token, process.env.SECRETA );

        return [ true, uid ];
        
    } catch (error) {
        return [ false, null ];
    }

}

module.exports = {
    generarJWT,
    comprobarJWT
};