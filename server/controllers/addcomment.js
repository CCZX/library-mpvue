/* eslint-disable */

const {mysql} = require('./../qcloud')

module.exports = async (ctx) => {
  const {bookid, openid, comment, location, phone} = ctx.request.body
  try {
    await mysql('comments').insert({bookid, openid, comment, location, phone})
    ctx.state.data = {
      code: 0,
      msg: 'success'
    }
  } catch (err) {
    ctx.state.data = {
      code: -1,
      msg: 'fail'
    }
  }
}
