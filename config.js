const config = {
    DEBUG:true,

    MYSQL:{
        host:'127.0.0.1',
        database:'blog',
        username:'root',
        password:'123456'
    },
    curInfo : 1,
};

if (process.env.NODE_ENV === 'production'){
    config.MYSQL = {
        host: '',
        database: '',
        username: '',
        password: ''
    }
}

module.exports = config;