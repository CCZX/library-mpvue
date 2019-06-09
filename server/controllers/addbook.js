/**
 * 新增图书
 * 1. 获取豆瓣信息
 * 2. 添加到数据库
 * https://book.douban.com/subject_search?search_text=text&cat=1001
 * https://api.douban.com/v2/book/isbn/:ISBN
 */
/* eslint-disable */
const https = require('https')
const {mysql} = require('./../qcloud')
let pulldb = require('./../plugin/pulldouban')
module.exports = async (ctx) => {
  const {isbn, openid} = ctx.request.body
  if (isbn && openid) {
    // let url = 'https://api.douban.com/v2/book/isbn/' + ISBN
    const isEarly = await mysql("books").select().where('isbn', isbn)
    if (isEarly.length) {
      ctx.state.data = {
        code: -1,
        msg: "图书已存在"
      }
      return
    }
    let url = `https://book.douban.com/subject_search?search_text=${isbn}&cat=1001`
    let res = await getJSON(url)
    let bookinfo = res.payload.items[0]
    let abstractArr = bookinfo.abstract.split(' / ')
    let author = abstractArr[0] // 作者
    let price = abstractArr[abstractArr.length - 1] // 价格
    let publisher = abstractArr[abstractArr.length - 3] // 出版社
    // let publishTime = abstractArr[abstractArr.length - 2] // 出版时间
    let {title, cover_url:image} = bookinfo // 标题&封面
    let rate = bookinfo.rating.value // 评分
    let alt = bookinfo.url // 图书地址
    let summary = "图书简介"
    let tags = '图书标签'
    try {
      await mysql('books').insert({
        isbn, openid, title, image, alt, publisher, summary, price, rate, tags, author
      })
      ctx.state.data = {
        code: 0,
        title,
        msg: 'success'
      }
    } catch (error) {
      ctx.state.data = {
        code: -1,
        msg: `fail${error.sqlMessage}`
      }
    }
  }
}

function getJSON(url){
  return new Promise((reslove,reject)=>{
    https.get(url,res=>{
      let urlData = ''
      res.on('data', data=>{
        urlData += data
      })
      res.on('end', data=>{
        const bookinfo = String(urlData)
        const DATA = bookinfo.split('window.__DATA__ = "')
        let q = DATA[1].split('"')[0]
        reslove(pulldb.serach(q))
        // reslove(DATA[1].split('"')[0])
        // if(bookinfo.title){
        //   reslove(bookinfo)
        // } 
        // reject(bookinfo)
      })
    })
  })
}
