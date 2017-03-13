export let config = {
    production: false,
    datastores: {
        mongo: {
            uri: 'mongodb://mongo:27017/cast_dev'
        }
    },
    logging: {
        path: './'
    }
};