const express = require('express')
const serveStatic = require('serve-static')
const SseStream = require('ssestream')
var redis = require("redis"),
client = redis.createClient();
client.on("error", function (err) {
console.log("Error " + err);
});

const app = express()
app.use(serveStatic(__dirname))
app.get('/sse', (req, res) => {
  console.log('new connection')

  const sseStream = new SseStream(req)
  sseStream.pipe(res)
  var id_xigua = ''
  var uc_xigua = ''
  var id_huajiao = ''
  var id_cddh = ''
  var id_zscr = ''
  var result11 = ''

  const pusher = setInterval(() => {
    
    client.get("sg_xigua", function (err, reply) {
      var info1 = JSON.parse(reply.toString())
      var result1 = JSON.parse(info1.result[1])
      if (result1.result == "啊呀，这题汪仔还在想") {
        result1.result = "这题我不会，靠你了"
      }
      if (id_xigua == '' || id_xigua != result1.cd_id) {
        sseStream.write({
          event: 'xigua',
          data: result1.title + '\n【答案1】:' + '【' + result1.result + '】'
          // data:result1.title.split('.')[0]+"."+result1.result
        })
        id_xigua = result1.cd_id
      }
    })

     client.get("uc_xigua", function (err, reply) {
       var info11 = JSON.parse(reply.toString())
       if (info11.data.round) {
         result11 = info11.data.options[parseInt(info11.data.correct)].title
       }
       if (info11.data.round && uc_xigua != info11.data.round) {
         sseStream.write({
           event: 'xigua',
           data: info11.data.round + '. ' + info11.data.title + '【答案2】:【' + result11 + '】'
          // data: info11.data.round+"."+result11
         })
         uc_xigua = info11.data.round
       }
     })

    client.get("sg_huajiao", function (err, reply) {
      var info2 = JSON.parse(reply.toString())
      var result2 = JSON.parse(info2.result[1])
      if (result2.result == "啊呀，这题汪仔还在想") {
        result2.result = "这题我不会，靠你了"
      }
      if (id_huajiao == '' || id_huajiao != result2.cd_id) {
        sseStream.write({
          event: 'huajiao',
          data: result2.title + '\n【答案】:【' + result2.result + '】'
          // data:result2.title.split('.')[0]+"."+result2.result
        })
        id_huajiao = result2.cd_id
      }
    })

    client.get("sg_cddh", function (err, reply) {
      var info3 = JSON.parse(reply.toString())
      var result3 = JSON.parse(info3.result[1])
      if (result3.result == "啊呀，这题汪仔还在想") {
        result3.result = "这题我不会，靠你了"
      }
      if (id_cddh == '' || id_cddh != result3.cd_id) {
        sseStream.write({
          event: 'cddh',
          data: result3.title + '\n【答案】:【' + result3.result + '】'
          // data:result3.title.split('.')[0]+"."+result3.result
        })
        id_cddh = result3.cd_id
      }
    })

    client.get("sg_zscr", function (err, reply) {
      var info4 = JSON.parse(reply.toString())
      var result4 = JSON.parse(info4.result[1])
      if (result4.result == "啊呀，这题汪仔还在想") {
        result4.result = "这题我不会，靠你了"
      }
      if (id_zscr == '' || id_zscr != result4.cd_id) {
        sseStream.write({
          event: 'zscr',
          data: result4.title + '\n【答案】:【' + result4.result + '】'
          // data:result4.result
        })
        id_zscr = result4.cd_id
      }
    })

  }, 500)

  res.on('close', () => {
    console.log('lost connection')
    clearInterval(pusher)
    sseStream.unpipe(res)
  })
})

app.listen(80, (err) => {
  if (err) throw err
  console.log('server ready on http://localhost:80')
})
