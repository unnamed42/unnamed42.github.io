---
title: VPS的使用方式——服务篇
date: 2018-02-28 00:56:59
toc: true
comments: true
categories: 学习
tags: [VPS]
---
作为一名有着Google刚需的编程界人士，应该有随时随地都能访问Google等404服务的手段。除了给自己打开一扇世界之窗之外，VPS还有其他各种各样的打开方式。<!--nginx的玩法有点复杂，所以我决定单独开一篇出来，就不在这里写了。-->

如果你使用了`iptables`等防火墙，记得配置完之后开放对应的端口。

<!-- more -->

## 科学上网

相信大多数人买个VPS的目的就是为了科学上网。Debian 9默认源里就有`shadowsocks-libev`，不过我还是推荐从`stretch-backports`里安装最新版。

```bash
apt -t stretch-backports install shadowsocks-libev
# 利用systemd开启shadowsocks
systemctl enable shadowsocks-libev-server@config.service && systemctl start shadowsocks-libev-server@config.service
```

之后创建`/etc/shadowsocks-libev/config.json`：

```JSON
{
    "server": "0.0.0.0",
    "server_port": <ss-port-number>,
    "local_address": "127.0.0.1",
    "local_port": 1080,
    "password": "<ss-password>",
    "timeout": 60,
    "method": "aes-256-cfb",
    "fast_open": false,
    "workers": 1
}
```

如果你需要IPv4和IPv6双栈的SS，那么针对`shadowsocks-libev`来说`server`得设置成`["[::0]","0.0.0.0"]`。网上其他文章里说设置成`"[::0]"`就行的，那是针对其他SS服务器端，在`shadowsocks-libev`就得这么设置。

`server_port`是给SS服务器端分配的端口号，记得选个不那么常用的（被各大教程使用的8080端口由于使用人数太多导致极其容易被监测）。如果你没有建站的需求，可以考虑占用https的443端口假装是在上网。

`fast_open`不建议开启，会增大你被发现的机率[^1]。

`method`指定一个加密算法，最简单、计算速度最快的是`rc4-md5`但是容易被查出来（RC4和MD5算法都已经被攻破了）；普世性好的是`aes-256-cfb`；新潮的就使用`chacha20`系列（计算量来说对移动客户端友好），但是可能部分SS客户端不支持这系列算法。在这里要强调一点：SS的加密算法设计出来并不是为了保证数据安全，而是为了增加方校长他们的监测难度。加密算法在网络速度中占不了太大比重，反倒是服务器带宽最重要。

iOS的SS客户端我使用[FirstWingy](https://itunes.apple.com/us/app/firstwingy/id1316416848?mt=8)（不支持SSR），Wingy国区弄不到，小火箭又要钱……

如果你担心自己的SS被查出来，那么可以去使用SSR；如果你觉得你的SS速度太慢，可以外面套一层[kcptun](https://github.com/xtaci/kcptun)加速（kcptun是通过多发包消耗流量来换取速度，慎用）。

如果你想给SS配置多个用户的话，那么删掉`server_port`和`password`，改成如下内容：

```JSON
{
    ...
    "port_password": {
        "<port1>": "<password1>",
        "<port2>": "<password2>",
        ...
    },
    ...
}
```

不过据说SS给多人使用会增加被发现的机率。

## aria2离线下载

百度云的离线下载容易被查，离线完了下载速度还有限制，超烦的。都有了自己的服务器为什么不自己弄一个离线下载呢？

[aria2](https://aria2.github.io/)是一个轻量级的下载器，还支持多线程下载、BT/磁力下载，还提供了JSON/XML的远程控制方式，超强。

首先来一发`apt install aria2`安装好。之后创建文件`/etc/aria2/aria2.conf`作为aria2的配置：

```bash
# 下载目的地，自己选个路径吧
dir=/var/www/files
# 开启断点续传
continue=true
# 保存/读取未完成任务，需要创建一个空文件/etc/aria2/aria2.session
input-file=/etc/aria2/aria2.session
save-session=/etc/aria2/aria2.session
# 日志路径，需要创建空文件/var/log/aria2.log
log=/var/log/aria2.log
# 日志等级
log-level=warn

# 最大下载线程
max-concurrent-downloads=10
max-connection-per-server=5
# 文件分块下载最小大小
min-split-size=10M

# 开启RPC
enable-rpc=true
# 为了使用Web端控制台，必须开启这两项
rpc-allow-origin-all=true
rpc-listen-all=true
# RPC端口，默认6800
rpc-listen-port=6800
# RPC控制的密码，最好是开启
rpc-secret=PyaM9DBv
# 使用SSL加密，可选
rpc-secure=true
rpc-certificate=<certificate-file>
rpc-private-key=<private-key-file>

# 磁力下载到种子之后暂停，而不是自动下载全部文件
pause-metadata=true
# 保存DHT的路径，需要创建空文件/etc/aria2/dht{,6}.dat
dht-file-path=/etc/aria2/dht.dat
dht-file-path6=/etc/aria2/dht6.dat
# 伪装为Transmission客户端
peer-id-prefix=-TR2770-
user-agent=Transmission/2.77
# BT断点续传需要，可以开启
bt-seed-unverified=true
# 保存磁力下载到的种子文件
bt-save-metadata=true
```

之后写一个`aria2c.service`来配置aria2后端，可以放在`/etc/systemd/system/`或者`/lib/systemd/system/`里：

```INI
[Unit]
Description=Aria2 download manager
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/aria2c --console-log-level=warn --enable-rpc --rpc-listen-all --conf-path=/etc/aria2/aria2.conf

[Install]
WantedBy=multi-user.target
```

之后`systemctl daemon-reload && systemctl enable aria2c && systemctl start aria2c`就行了。

如果你需要BT作种，得开放对应的端口。在VPS上其实不推荐使用BT下载，因为盗版大多数是BT，VPS服务商为了避免版权纠纷在这方面查得比较严，稍有不慎你的VPS就可能会被封掉。

配置好aria2后端之后推荐使用一个WebUI配套。我个人推荐使用[AriaNG](https://github.com/mayswind/AriaNg)，还有很多其他的可以用。你可以把WebUI放到自己的VPS上自己弄，也可以用别人做好的。这些是比较有名的WebUI：

* AriaNG - [source](https://github.com/mayswind/AriaNg) - [WebUI](http://ariang.mayswind.net/latest/)
* webui-aria2 - [source](https://github.com/ziahamza/webui-aria2) - [WebUI](https://ziahamza.github.io/webui-aria2/)
* yaaw - [source](https://github.com/binux/yaaw) - [WebUI](http://binux.github.io/yaaw/demo/)

## KMS服务器

KMS是用于激活微软批量授权产品的技术，网上很多Windows/Office授权破解其实是自己弄了个KMS服务器，然后每180天上这里来刷新一下授权状态。网上流传很多KMS破解工具，但是用起来实在不放心，带毒没带毒你也说不好，不如自己弄一个KMS省心。

要弄自己的KMS的话你得使用[vlmcsd](https://github.com/Wind4/vlmcsd)，它是一个KMS模拟器，支持许多代协议。从vlmcsd [Releases](https://github.com/Wind4/vlmcsd/releases)下载编译好的二进制（目前最新的版本是[svn1111](https://github.com/Wind4/vlmcsd/releases/download/svn1111/binaries.tar.gz)），再写一个systemd unit，差不多就配置完了。

KMS服务的端口号是TCP的`1688`，记得打开。

压缩包里包含了所有平台所有OS的二进制，我们这个64位Debian 9就选择`Linux/intel/glibc/vlmcsd-x64-glibc`就行了（注意有个`d`），解压之后放到`/usr/local/bin/`。

创建`vlmcsd.service`如下：

```INI
[Unit]
Description=KMS Emulator
After=network.target

[Service]
Type=simple
User=nobody
ExecStart=/usr/local/bin/vlmcsd -D -e

[Install]
WantedBy=multi-user.target
```

（可选）创建`vlmcsd.socket`如下：

```INI
[Unit]
Description=KMS Emulator socket

[Socket]
ListenStream=1688
Accept=yes

[Install]
WantedBy=sockets.target
```

`daemon-reload`, `enable`, `start`三连，OK。

### KMS激活Windows

开一个管理员权限的cmd，然后：

```batch
# 设置对应Windows版本的批量授权序列号
slmgr -ipk xxxxx-xxxxx-xxxxx-xxxxx
# 设置KMS服务器地址
slmgr /skms <VPS IP或域名>
# 执行激活
slmgr /ato
```

有关序列号，访问[Appendix A: KMS Client Setup Keys](https://technet.microsoft.com/en-us/library/jj612867.aspx)找到自己系统对应的序列号。

### KMS激活Office

此方法仅支持VOL版Office，零售版是不支持的。

开一个管理员权限的cmd，进入你的Office目录（比如Office 2016 64位就需要进入`C:\Program Files\Microsoft Office\Office16`，如果目录正确的话应该有个`OSPP.VBS`的文件），然后：

```batch
# 配置KMS服务器
cscript ospp.vbs /sethst:<VPS IP或域名>
# 开始激活
cscript ospp.vbs /act
# 检查激活状态
cscript ospp.vbs /dstatus
```

如果激活状态中出现`LICENSE STATUS:  —LICENSED—`说明成功了。

## 私有云盘服务

神奇的8秒教育视频把你的小姐姐给替换没了，好气啊，怎么办？自己弄一个云盘服务啊！

出现得早的[ownCloud](https://owncloud.org/)和它的fork [nextCloud](https://nextcloud.com/)都需要LAMP环境，我这种小门小户的小鸡支撑不起。[Seafile](https://www.seafile.com/home/)是Python开发、可以使用SQLite做MySQL的替代，就它了。其实还有其他更加轻量级的私有云方案，比如[Syncthing](https://syncthing.net/)，但它没有好用的iOS客户端，只好忍痛放弃了。



[^1]: [tcp fast open可能会导致ss被发现？](https://github.com/shadowsocks/shadowsocks-libev/issues/1552)
