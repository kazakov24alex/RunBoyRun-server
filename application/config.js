
const config = {
    // General options
    server: {
        defaultPort : 8000,
        staticPath  : 'public'
    },

    db: {
        host     : 'k236.net',
        port     : 8871,
        user     : 'kazakov24alex',
        password : 'uta8Z0NzXTdgv9l1',
        database : 'runboyrun_db',
        dialect  : 'mysql'
    },

    role: {
        user  : 'user',
        admin : 'admin'
    },

    token: {
        secret: '2AK',
        options : { session: false},
        life : {
            amount : 7,
            unit : 'days'
        }
    },

    hash: {
        saltRound: 10
    },

    vk: {
        name      : 'vk',
        appId     : '5944334',
        appSecret : '3LfvjuUCjH1gcp3iUUkI',
        prefix    : 'vk.com/id'
    },

    google: {
        name    : 'google'
    },

    facebook: {
        name    : 'facebook'
    }

};

module.exports = config;

