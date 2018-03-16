# wenda_killer

各大撒币平台AI答案预测


# 思路

汇聚各家AI预测计算结果，通过SSE(Server Sent Events)技术轻量级分发给客户端

# 目录结构

server    |	sse服务实现代码

autoRun   |	adb&wda等挂机自动答题（开发中）

# 部署安装
yum update

yum install npm node


npm install 

npm install -g forever

yum install redis 

systemctl start redis.service (centos7)

service redis start (centos6)

forever start demo/sse-server.js

# 参考项目
[eventsource](https://github.com/EventSource/eventsource)
