const database = require('../database');
const Sequelize = require('sequelize');

const Info = database.define('Info',{
    id:{            //主键
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    title:{                     // 目录名
        type:Sequelize.STRING(20),
        allowNull: false
    },
    subtitle:{                     // 目录名
        type:Sequelize.STRING(30),
        allowNull: false
    },
    about:{                     // 目录名
        type:Sequelize.TEXT,
        allowNull: false
    }
},{
    underscored:true,       // 是否支持驼峰
    tableName:'Info',           // 数据表名
})

module.exports = Info;