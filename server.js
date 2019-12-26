const express = require('express')
const app = express()
const sha1 = require('sha1')

app.use(express.static('./'))

   app.post('/api', (req, res) => {
    const request = require('request')
    
    const grant_type = 'client_credential'
    const appid = 'wx4820a7d540a0296b'
    const secret = '37d9498f369830fc23e04c8c95780c66'
    
    request('https://api.weixin.qq.com/cgi-bin/token?grant_type=' + grant_type + '&appid=' + appid + '&secret=' + secret, (err, response, body) => {
     let access_token = JSON.parse(body).access_token
     request('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + access_token + '&type=jsapi', (err, response, body) => {
       let jsapi_ticket = JSON.parse(body).ticket
       let nonce_str = '123456'  // 密钥，字符串任意，可以随机生成
       let timestamp = new Date().getTime() // 时间戳
       console.log('timestamp',timestamp)
       let url = req.query.url  // 使用接口的url链接，不包含#后的内容
    
       // 将请求以上字符串，先按字典排序，再以'&'拼接，如下：其中j > n > t > u，此处直接手动排序
       let str = 'jsapi_ticket=' + jsapi_ticket + '&noncestr=' + nonce_str + '&timestamp=' + timestamp + '&url=' + 'http://3s.dkys.org:29802/index1.html'
    
       // 用sha1加密
       let signature = sha1(str)
    
       res.send({
        appId: appid,
        timestamp: timestamp,
        nonceStr: nonce_str,
        signature: signature,
       })
     })
    })
   })
 

app.listen(6666, err => {
 if(!err) console.log('connect succeed')
})