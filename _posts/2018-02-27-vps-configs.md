---
title: VPS的使用方式——配置篇
date: 2018-02-27 21:54:15
toc: true
comments: true
categories: 学习
tags: [VPS, 配置]
---
出于弄个完全在掌控之中的梯子的想法，我在一月时抢到了[搬瓦工中国大陆直连优化套餐](https://bwh1.net/aff.php?aff=3525&pid=53)，512M内存、10G SSD、1T流量/月、超高带宽、$19.99（￥120左右）/年，走过路过不要错过。在此感谢知乎[@冯硕](https://www.zhihu.com/people/feng-shuo-3)的回答[有哪些便宜稳定，速度也不错的Linux VPS 推荐？](https://www.zhihu.com/question/20800554/answer/71397836)搬瓦工价格亲民，支付方便（可以支付宝），还不快去买？

大陆特供套餐相比普通版据说是对大陆三网有优化，而且相比[通用套餐](https://bwh1.net/cart.php?a=add&pid=43)月流量翻了一倍，不过唯一的缺点是只有一个机房给你使用，也就是说出了事的话你的IP是换不了的，换句话说这个VPS你就砸手上了（购买30天内可退款，这样至少损失不大），所以且用且珍惜。[电信CN2特别版](http://www.bwh1.net/aff.php?aff=3525&pid=56)贵了10美金，除了电信用户速度提升之外，硬盘也给砍了5G。个人觉得不是那么值，毕竟走来回一趟洛杉矶100ms延迟是跑不了的。

对了，购买的时候尽量买KVM架构的，完全虚拟，可以玩的黑科技比OpenVZ架构的不知道多到哪里去了。

{% spoiler 搬瓦工6% off优惠码 BWH1ZBPVK %}

<!-- more -->

## 弄个域名

弄个个性域名方便自己造福他人。首先从域名服务商买个域名，推荐[godaddy](https://www.godaddy.com/)，那里甚至可以支付宝。要是心疼钱的话，上[freenom](http://freenom.com/)弄个一年免费的.tk域名，到期还可以免费续。免费域名的缺点是首先tk域名搜索引擎不会主动收录，其次如果你的域名价值升高的话服务商会悄悄地收回。最后，**千万千万不要买cn域名**。

弄到域名之后，上[DNSPod](https://www.dnspod.cn/)添加自己的域名解析记录，同时在域名提供商那里把自己域名的NS（nameserver）改成DNSPod的NS。这一部分的图文教程可以参考[少数派——免费域名申请及使用](https://sspai.com/post/40615)。DNSPod记录添加后最迟72小时后生效，生效之后的记录修改生效就飞快了。

## ssh密钥登录

搬瓦工在这方面做得好，默认ssh端口和默认root密码都是随机的。不过我们要在此基础上更进一步，使用密钥登录ssh并禁止密码登录。首先生成我们的ssh密钥，在本地或者服务器端都可以：

```bash
ssh-keygen -t rsa
```

截至2018/02/27，Windows 10的OpenSSH Beta版客户端依然不支持RSA格式密钥，只支持ED25519格式[^1]，所以使用密钥登录的话在Windows上还是得用[PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)。

完成之后应该会生成两个文件，`id_rsa`（私钥）和`id_rsa.pub`（公钥）。把公钥文件弄进服务器端的`~/.ssh/authorized_keys`文件里面就差不多了。在服务器端生成的就直接`mv`，记得把私钥弄下来；本地生成的就使用

```bash
cat ~/.ssh/id_rsa.pub | ssh <username>@<address> "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >>  ~/.ssh/authorized_keys"
```

将密钥送上去。

接下来配置本地和服务器端的ssh：

在服务器端，修改<code>/etc/ssh/ssh<strong>d</strong>_config</code>（注意是有`d`的那个）：

```plain
# 使用安全的二代协议
Protocol 2
# 修改服务器端ssh端口号
Port <port-number>
# 限制root只能密钥登录
PermitRootLogin without-password
# 启用密钥登录
PubkeyAuthentication yes
# no代表所有用户只能使用密钥登录，酌情使用
PasswordAuthentication no
```

之后`systemctl reload sshd`，服务器端就配置完了。接下来是本地，修改`~/.ssh/config`：

```plain
Host bwg
    # 服务器域名或者IP地址
    HostName <hostname>
    # 服务器端ssh端口号
    Port <port-number>
    # 用作登录的用户，搬瓦工默认只有root
    User <login-user>
    # 密钥私钥文件
    IdentityFile <private-key>
```

完成之后，你就能直接`ssh bwg`连接你的服务器了。

## 使用zsh

zsh配置好的话，在各种方面都比bash强不少。我个人是喜欢用zsh的，加上[grml-zsh-config](https://grml.org/zsh/)简直上天。

首先安装zsh：`apt install zsh`；然后切换默认shell为zsh：`chsh -s $(which zsh)`

然后下载grml-zshrc：

```bash
wget -O ~/.zshrc https://git.grml.org/f/grml-etc-core/etc/zsh/zshrc
```

## systemd everything!

有鉴于在使用Fedora时的糟糕体验，我果断把系统从CentOS换到了Debian 9{% spoiler 才不是嫌弃CentOS软件太老呢 %}。同时作为一名Archlinux老教徒，我觉得把系统全面systemd化挺好的。但是Debian里面有不少的sysvinit残留，因此只能做最大努力去办了。

下面这两条是参照文档`/usr/share/doc/systemd/README.Debian.gz`提取出来的。

### 用journald替换rsyslog

首先开启journald的persistent logging：

```bash
mkdir -p /var/log/journal
systemd-tmpfiles --create --prefix /var/log/journal
```

然后卸载rsyslog：

```bash
apt purge rsyslog
```

### 用networkd接管网络配置

在`/etc/systemd/network`创建文件`default.network`（文件名其实无所谓，重要的是扩展名`network`），内容如下：

```INI
[Match]
Name=eth0

[Network]
DHCP=yes
```

之后`stop` `disable`掉`networking.service`, 然后`systemctl enable systemd-networkd`, `systemctl start systemd-networkd`二连，顺便卸载掉`ifupdown`，`rm -r`掉`/etc/network`。

此外，文档中还建议networkd配合resolved使用：

```bash
systemctl enable systemd-resolved
ln -sf /run/systemd/resolve/resolv.conf /etc/resolv.conf
```

## 开启BBR算法

BBR是Google开发的TCP拥塞控制算法，目的是要尽量跑满带宽, 并且尽量不要有排队的情况, 效果并不比锐速差。开启主要是为了配合SS，给它提速用。BBR算法已经合并进了kernel 4.9，所以尊贵的Debian 9用户不需要编译内核，改配置就行了。OpenVZ玩家没法修改内核配置，所以……洗洗睡吧。

在`/etc/sysctl.d/`下新建一个`10-bbr.conf`文件，内容如下：

```plain
net.core.default_qdisc = fq
net.ipv4.tcp_congestion_control = bbr
```

然后`sysctl -p /etc/sysctl.d/10-bbr.conf`使更改生效。可以利用`lsmod | grep bbr`来检测BBR是否已启用，如果出现`tcp_bbr`则表示成功。

## 利用TunnelBroker使用IPv6

搬瓦工的KVM与OpenVZ主机相比，除了没有原生IPv6地址以外没有任何区别。但是作为一个校园网用户，走IPv6是完全免费的——我有一个大胆的想法。

以防万一，打开你内核的IPv6支持：修改`/etc/sysctl.conf`或者在`/etc/sysctl.d/`新建文件，完事后`sysctl -p`之。

```plain
net.ipv6.conf.all.disable_ipv6 = 0
net.ipv6.conf.default.disable_ipv6 = 0
net.ipv6.conf.lo.disable_ipv6 = 0
```

由于KVM是完全的虚拟，所以可以方便地借助tunnel的力量来使用IPv6。首先上[tunnelbroker](https://tunnelbroker.net/)注册个帐号，并创建一个Regular Tunnel。输入你的VPS的IP，再选择一个**距离VPS最近的**Tunnel Server（一般填好IP之后它会自动选择），整个过程完全免费。创建完成之后，在tunnel详细信息页面会给出四个重要的IP地址：`Server IPv4 Address`, `Server IPv6 Address`, `Client IPv4 Address`, `Client IPv6 Address`. 假设我们看到的信息是这样的：

```plain
Server IPv4 Address    1.1.1.1
Server IPv6 Address    aaaa:aaa:a:aa::a/64
Client IPv4 Address    2.2.2.2
Client IPv6 Address    bbbb:bbb:b:bb::b/64
```

如果你不像我一样使用`systemd-networkd`管理网络的话，去tunnel页面的`Example Configurations`页面选择你的网络管理类型，会自动为你生成tunnel的网络配置。我这里写的配置，是针对`systemd-networkd`的。OpenVZ玩家得去使用点[奇技淫巧](http://blog.throneclay.com/2015/07/05/bwg/#IPV6服务启动)，用这里写的网络配置是没用的。

在`/etc/systemd/network/`创建`he-ipv6.netdev`内容如下：

```INI
[Match]

[NetDev]
Name=he-ipv6
Kind=sit
MTUBytes=1480

[Tunnel]
# Client IPv4
Local=2.2.2.2
# Server IPv4
Remote=1.1.1.1
TTL=255
```

以及`he-ipv6.network`内容如下：

```INI
[Match]
Name=he-ipv6

[Network]
# Client IPv6
Address=bbbb:bbb:b:bb::b/64
# Server IPv6
Gateway=aaaa:aaa:a:aa::a
# Google IPv6 DNS, 可选配置
DNS=2001:4860:4860::8888
DNS=2001:4860:4860::4444
```

并对`default.network`做如下修改：
```INI
[Network]
DHCP=yes
Tunnel=he-ipv6
```

刷新`systemd-networkd`，使用`ping6 ipv6.google.com`试试，如果成功那么说明配置成功，你也可以用IPv6来访问VPS了。用于VPS的公网IPv6地址是提供给你的`Client IPv6 Address`，不要用错了。你可以通过VPS代理让全部流量走IPv6，这样一来校园网是完全的白嫖，想想还有点小激动呢。

如果你确定你的配置没有问题，但是就是使用不了IPv6，有可能是防火墙的问题，检查一下你的`ip6tables`配置吧。{% spoiler 我tm因为ip6tables没开导致IPv6包全部被屏蔽，被这个坑了好久 %}

## iptables

为了防止VPS被破坏，为了保卫网络和平，本人建议使用`iptables`来限制端口。使用前一定小心，别把ssh连接给屏蔽了。

使用下面的命令来清空`iptables`配置：

```bash
iptables -F
iptables -X
iptables -Z
```

接下来就是一通骚操作了：

```bash
# 允许本地回环接口(即允许本机访问本机)，一定要有
iptables -A INPUT -i lo -j ACCEPT
# 允许IPv6 tunnel，使用前面的IPv6配置的话一定要有
iptables -A INPUT -p ipv6 -j ACCEPT
# 允许已建立的或相关连的通行
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
# 允许所有本机向外的访问
iptables -A OUTPUT -j ACCEPT
# 允许访问http端口
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
# 允许访问https端口
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
# 允许访问ssh端口
iptables -A INPUT -p tcp --dport <ssh-port> -j ACCEPT
# 如果有其他端口的话，规则也类似，修改dport后的端口号就行
# 允许一个范围内的端口（下面的端口范围是常用BT端口）：
# iptables -A INPUT -p tcp -m multiport --dports 6881:6999 -j ACCEPT
# 允许ping
iptables -A INPUT -p icmp -m icmp --icmp-type 8 -j ACCEPT
# 禁止其他未允许的规则访问，在执行这条之前一定记得把服务器端的ssh端口
# 也放进允许规则中
iptables -A INPUT -j REJECT
iptables -A FORWARD -j REJECT
```

`iptables`规则如果没保存的话，重启即失效。可以使用`iptables-save`来保存，`iptables-restore`来读取，可以做成systemd service unit来自动执行。可以安装这个包，打好了systemd service配置：https://github.com/srdja/debian-systemd-iptables/releases/download/1.1.0/systemd-iptables1.1-0.deb

安装包之后，`enable` `start`二连，规则存储到`/etc/iptables/iptables.rules`即可。

## apt相关

### backports源

偶尔也会有想要新鲜软件的时候，怎么办？快去打开backports。把下面这行添加到`/etc/apt/sources.list`：

```plain
deb http://deb.debian.org/debian stretch-backports main contrib non-free
```

内有新版的ss-libev哦。

### 禁止自动安装推荐包

在硬盘吃紧的VPS上这个选项可以说是很重要了。在`/etc/apt/apt.conf.d`里新建个文件，并添加如下内容：

```plain
APT::Install-Recommends "0"; APT-Install-Suggests "0";
```

免得更新个内核都要装十几个没什么卵用的包。

[^1]: [SSH Client fails to use existing id_rsa key](https://github.com/PowerShell/Win32-OpenSSH/issues/973)
