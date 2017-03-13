export let config = {
    production: true,
    datastores: {
        mongo: {
            uri: 'mongodb://mongo:27017/cast_prod'
        }
    },
    logging: {
        path: '/logs'
    }
};