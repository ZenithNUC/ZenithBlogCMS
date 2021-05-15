const Sequelize = require('sequelize');
const database = require('../database');
const CateModel = require('./category');

const Article = database.define('Article',{
    id:{            //主键
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    title:{                     // 管理员用户名
        type:Sequelize.STRING(30),
        allowNull: false
    },
    description:{                     // 管理员用户名
        type:Sequelize.STRING(255),
        allowNull: false
    },
    content:{                     // 管理员用户名
        type:Sequelize.TEXT,
        allowNull: false
    },
    category:{                      // 管理员真实姓名
        type:Sequelize.INTEGER,
        allowNull: false
    }
},{
    underscored:true,       // 是否支持驼峰
    tableName:'article',           // 数据表名
})

module.exports = Article;

Article.belongsTo(CateModel, {foreignKey: 'category', constraints: false});