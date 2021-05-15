const database = require('../database');
const Sequelize = require('sequelize');


const Category = database.define('Category',{
    id:{            //主键
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    name:{                     // 目录名
        type:Sequelize.STRING(30),
        allowNull: false
    }
},{
    underscored:true,       // 是否支持驼峰
    tableName:'category',           // 数据表名
})

module.exports = Category;