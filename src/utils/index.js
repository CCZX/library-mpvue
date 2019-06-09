// 工具函数库

import config from './../config'

function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

/**
 * http工具函数库
 */
function request(url, method, data) {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '加载中...'
    })
    wx.request({
      data,
      method,
      url: config.host + url,
      success: res => {
        wx.hideLoading()
        if (res.data.code === 0) {
          resolve(res.data.data)
        } else {
          // showModal('提示', '操作失败，请')
          reject(res)
        }
      },
      fail(err) {
        showModal('提示', err)
      }
    })
  })
}

function get(url, data = "") {
  return request(url, 'GET', data)
}

function post(url, data) {
  return request(url, "POST", data)
}

/**
 * 弹窗交互
 */
function showSuccess(text) {
  wx.showToast({
    title: text,
    icon: 'success',
  })
}
function showModal (title, content) {
  wx.showModal({
    title,
    content,
    showCancel: false
  })
}

export default {
  formatNumber,
  formatTime,
  get,
  post,
  showSuccess,
  showModal
}
