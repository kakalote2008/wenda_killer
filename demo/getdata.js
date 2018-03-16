var request = require('request')
var redis = require("redis"),
    client = redis.createClient('6379','wenda-redis');
client.on("error", function (err) {
    console.log("Error " + err);
});
client.on("connect", function (err) {
    console.log("Error " + err);
});
var fs = require('fs');

var uc_xigua = ''
var options_xigua = {
    url: 'http://140.143.49.31/api/ans2?key=xigua',
    headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C202 Sogousearch/Ios/5.9.7',
        'referer': 'http://nb.sa.sogou.com/',
        'Host': '140.143.49.31'
    }
};
var options_huajiao = {
    url: 'http://140.143.49.31/api/ans2?key=huajiao',
    headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C202 Sogousearch/Ios/5.9.7',
        'referer': 'http://nb.sa.sogou.com/',
        'Host': '140.143.49.31'
    }
};
var options_cddh = {
    url: 'http://140.143.49.31/api/ans2?key=cddh',
    headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C202 Sogousearch/Ios/5.9.7',
        'referer': 'http://nb.sa.sogou.com/',
        'Host': '140.143.49.31'
    }
};
var options_zscr = {
    url: 'http://140.143.49.31/api/ans2?key=zscr',
    headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C202 Sogousearch/Ios/5.9.7',
        'referer': 'http://nb.sa.sogou.com/',
        'Host': '140.143.49.31'
    }
};

function callback_xigua(error, response, body) {
    if (!error && response.statusCode == 200) {
        var start = body.indexOf("(")
        var end = body.lastIndexOf(")")
        client.set("sg_xigua", body.substring(start + 1, end), redis.print)
    }
}
function callback_huajiao(error, response, body) {
    if (!error && response.statusCode == 200) {
        var start = body.indexOf("(")
        var end = body.lastIndexOf(")")
        client.set("sg_huajiao", body.substring(start + 1, end), redis.print)
    }
}
function callback_cddh(error, response, body) {
    if (!error && response.statusCode == 200) {
        var start = body.indexOf("(")
        var end = body.lastIndexOf(")")
        client.set("sg_cddh", body.substring(start + 1, end), redis.print)
    }
}
function callback_zscr(error, response, body) {
    if (!error && response.statusCode == 200) {
        var start = body.indexOf("(")
        var end = body.lastIndexOf(")")
        client.set("sg_zscr", body.substring(start + 1, end), redis.print)
    }
}

setInterval(() => {
    request(options_xigua, callback_xigua);
    request(options_huajiao, callback_huajiao);
    request(options_cddh, callback_cddh);
    request(options_zscr, callback_zscr);
    request('http://crop-answer.sm.cn/answer/curr?format=json&activity=million', function (error1, response1, body1) {
        if (!error1 && response1.statusCode == 200) {
            var info11 = JSON.parse(body1)
            if (info11.data.round && uc_xigua != info11.data.round && info11.data.title && info11.data.correct) {
                //     var result11 = info11.data.options[parseInt(info11.data.correct)].title
                //     fs.writeFile('uc.txt',body1+"\n"+info11.data.title+"\n"+result11+"\n", {
                //         flag: 'a'
                //     });
                //     uc_xigua = info11.data.round
                client.set("uc_xigua", body1, redis.print)
            }
        }
    })
}, 500)
