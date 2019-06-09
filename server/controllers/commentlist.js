/* eslint-disable */
const {mysql} = require('./../qcloud')

module.exports = async (ctx) => {
  const {bookid, openid} = ctx.request.query
  const mysqlSelect = mysql('comments')
                          .select('comments.*', 'cSessionInfo.user_info')
                          .join('cSessionInfo', 'comments.openid', 'cSessionInfo.open_id')
                          // .where('bookid', bookid)
  // console.log(comments, typeof comments[0].user_info)
  let comments
  if (bookid) {
    comments = await mysqlSelect.where("bookid", bookid)
  } else if (openid) {
    comments = await mysqlSelect.where("openid", openid)
  }
  ctx.state.data = {
    list: comments.map( v => {
      const info = JSON.parse(v.user_info)
      return Object.assign({}, v, {
        title: info.nickName, 
        image: info.avatarUrl
      })
    })
  }
}
