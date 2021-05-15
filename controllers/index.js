// 引入公共方法
const Common = require ('./common');
// 引入async
const async = require ('async');
// 引入dateformat模块
const dateFormat = require ('dateformat');
// 引入cate表的model实例
const CateModel = require ('../models/category');
// 引入article表的model实例
const ArticleModel = require ('../models/article');
// 引入info表的model实例
const InfoModel = require ('../models/info');
// 引入常量constant
const Constant = require ('../constants/constant');
// 引入配置文件
const Config = require('../config')

let exportObj = {
    index,
    cate,
    article,
    about,
}

module.exports = exportObj;

/**
 * 首页方法
 * @param req 请求
 * @param res 结果
 */
function index(req,res){
    let returnObj = {};
    let rows = 5;
    let page = req.query.page || 1;
    let tasks = {
        queryArticle : cb => {
            let offset = rows * (page - 1);
            ArticleModel
                .findAndCountAll({
                    offset : offset,
                    limit : rows,
                    order : [['created_at','DESC']],
                    include: [{
                        model: CateModel
                    }]
                })
                .then(function (result){
                    let list = [];
                    result.rows.forEach((v,i) => {
                        let obj = {
                            id: v.id,
                            title: v.title,
                            desc: v.desc,
                            cate: v.cate,
                            cateName: v.Category.name,
                            createdAt: dateFormat (v.createdAt, 'yyyy-mm-dd HH:MM:ss')
                        };
                        list.push (obj);
                    });
                    returnObj.template = 'index';
                    // 请求的路径
                    returnObj.path = 'index';
                    // 页面渲染数据
                    returnObj.data = {
                        // 列表数据
                        list: list,
                        // 当前页码
                        page: Number (page),
                        // 总页数
                        pageCount: Math.ceil (result.count / rows)
                    };

                    // 继续后续操作
                    cb (null);
                })
                .catch(function (err){
                    console.log(err);
                    cb(Constant.DEFAULT_ERROR)
                })
        }
    }
    Common.autoFn(tasks,res,returnObj);
}

/**
 * 分类页面方法
 * @param req
 * @param res
 */
function cate(req,res){
    let returnObj = {};
    let rows = 5;
    let page = req.query.page || 1;
    let curCate = req.params.categoryId;            // 路由参数，详见../routes/index.js
    let tasks = {
        queryArticle : cb => {
            let offset = rows * (page - 1);
            ArticleModel
                .findAndCountAll({
                    where:{
                        category: curCate
                    },
                    offset : offset,
                    limit:rows,
                    order:[['created_at','DESC']],
                    include:[{
                        model:CateModel
                    }]
                })
                .then(function (result){
                    let list = [];
                    // 设定变量，保存当前分类名称
                    let curCateName = '';
                    // 遍历SQL查询出来的结果，处理后装入list
                    result.rows.forEach ((v, i) => {
                        // 查询出当前分类对应的分类名称
                        if(v.cate == curCate){
                            curCateName = v.Category.name
                        }
                        // 将结果的每一项，给数组list每一项赋值
                        let obj = {
                            id: v.id,
                            title: v.title,
                            desc: v.desc,
                            cate: v.cate,
                            cateName: v.Category.name,
                            createdAt: dateFormat (v.createdAt, 'yyyy-mm-dd HH:MM:ss')
                        };
                        list.push (obj);
                    });
                    // 推给公共方法的参数
                    // 要渲染的模板
                    returnObj.template = 'cate';
                    // 请求的路径
                    returnObj.path = 'cate';
                    // 当前分类
                    returnObj.curCate = curCate;
                    // 当前分类名称
                    returnObj.title = curCateName;
                    // 页面渲染数据
                    returnObj.data = {
                        // 列表数据
                        list: list,
                        // 当前页码
                        page: Number (page),
                        // 总页数
                        pageCount: Math.ceil (result.count / rows)
                    };

                    // 继续后续操作
                    cb (null);
                })
                .catch(function (err){
                    console.log(err);
                    cb(Constant.DEFAULT_ERROR);
                })
        }
    }
    Common.autoFn(tasks,res,returnObj)
}

/**
 * 文章详情页
 * @param req
 * @param res
 */
function article(req,res){
    let returnObj = {};
    let tasks = {
        queryArticle : cb => {
            ArticleModel
                .findByPk(
                    req.params.articleId,           // 路由参数，详见../routes/index.js
                    {
                        include:[{
                            model:CateModel
                        }]
                    })
                .then(function (result){
                    let obj = {
                        id : result.id,
                        title : result.title,
                        name : result.name,
                        content : result.content,
                        category: result.category,
                        cateName: result.Category.name,
                        createdAt : dateFormat(result.createdAt,'yyyy-mm-dd HH:MM:ss')

                    }
                    returnObj.template = 'article';
                    // 当前文章所属分类
                    returnObj.curCate = obj.cate;
                    // 当前文章所属分类名称
                    returnObj.title = obj.cateName;
                    // 请求的路径
                    returnObj.path = 'article';
                    // 页面标题title
                    returnObj.title = obj.title;
                    // 查询结果赋值
                    returnObj.data = obj;
                    // 继续后续操作
                    cb (null);
                })
                .catch(function (err){
                    console.log(err);
                    cb(Constant.DEFAULT_ERROR)
                })
        }
    }
    Common.autoFn (tasks, res, returnObj)
}

/**
 *
 * @param req
 * @param res
 */
function about(req,res){
    let returnObj = {};
    let tasks = {
        query : cb => {
            InfoModel
                .findByPk(Config.curInfo)
                .then(function (result){
                    let obj = {
                        id: result.id,
                        title: result.title,
                        subtitle: result.subtitle,
                        about: result.about,
                        createdAt: dateFormat (result.createdAt, 'yyyy-mm-dd HH:MM:ss')
                    };
                    // 推给公共方法的参数
                    // 要渲染的模板
                    returnObj.template = 'about';
                    // 请求的路径
                    returnObj.path = 'about';
                    // 查询结果赋值
                    returnObj.data = obj;
                    // 继续后续操作
                    cb (null);
                })
                .catch(function (err){
                    console.log(err);
                    cb(Constant.DEFAULT_ERROR)
                })
        }
    }
    Common.autoFn (tasks, res, returnObj)
}