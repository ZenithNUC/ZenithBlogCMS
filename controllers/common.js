const async = require("async");
const database = require("../database");
const Constant = require("../Constants/constant");
const dateFormat = require("dateformat");
const CateModel = require("../models/category");
const ArticleModel = require("../models/article");
const InfoModel = require("../models/info");

const exportObj = {
    autoFn,
    getNavigation,
    getRandomArticle,
    getBlogInfo
};

module.exports = exportObj;

/**
 * 返回公共方法
 * @param tasks     当前controller执行的task
 * @param res       当前controller的response
 * @param returnObj 当前controller返回的json对象
 */
function autoFn(tasks,res,returnObj){
    async.auto(tasks,function (err){
        if(err){
            console.log(err);
            res.render('error',{
                msg:'出现错误！'
            })
        } else{
            /*---定义子任务---*/
            let _tasks = {
                getNavigation: cb => {
                    getNavigation(cb)
                },
                getRandomArticle: cb=> {
                    getRandomArticle(cb)
                },
                getBlogInfo: cb => {
                    getBlogInfo(cb)
                }
            };
            async.auto(_tasks,function (err,result){
                if(err){
                    console.log(err);
                    res.render('error',{
                        msg:'出现错误！'
                    })
                }else{
                    res.render(returnObj.template,{
                        //导航分类列表
                        cateList:result['getNavigation'],
                        //侧边栏随机文章列表
                        randomArticleList:result['getRandomArticle'],
                        //博客基本信息
                        blogInfo:result['getBlogInfo'],
                        //当前分类
                        curCate:returnObj.curCate,
                        //当前路径
                        path:returnObj.path,
                        //页面标题
                        title:returnObj.title,
                        //页面数据
                        data: returnObj.data
                    })
                }
            })
        }
    })
}

/**
 * 获取导航栏分类方法
 * @param cb 回调函数
 */
function getNavigation(cb){
    CateModel
        .findAll()
        .then(function (result){
            let list = [];
            result.forEach((v,i) => {
                let obj = {
                    id: v.id,
                    name: v.name,
                    path: v.path
                };
                list.push(obj);
            });
            cb(null,list);
        })
        .catch(function (err){
            console.log(err);
            cb(Constant.DEFAULT_ERROR);
        });
}

/**
 * 获取侧边栏随机文章方法
 * @param cb 回调函数
 */
function getRandomArticle(cb){
    ArticleModel
        .findAll({
            limit:5,
            order:database.random()
        })
        .then(function (result){
            let list = [];
            result.forEach((v,i) => {
                let obj = {
                    id:v.id,
                    title:v.title,
                };
                list.push(obj)
            });
            cb(null,list);
        })
        .catch(function (err){
            console.log(err);
            cb(Constant.DEFAULT_ERROR);
        })
}

/**
 * 获取博客基本信息方法
 * @param cb 回调函数
 */
function getBlogInfo(cb){
    InfoModel
        .findByPk(1)
        .then(function (result){
            let obj = {
                id: result.id,
                title: result.title,
                subtitle: result.subtitle,
                about: result.about,
                createdAt: dateFormat (result.createdAt, 'yyyy-mm-dd HH:MM:ss')
            };
            cb(null,obj);
        })
        .catch(function (err){
            console.log(err);
            cb(Constant.DEFAULT_ERROR)
        })
}