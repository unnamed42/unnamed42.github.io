---
title: OpenWrt与华中科大有线校园网
toc: true
comments: true
date: 2018-09-06 21:47:53
categories: 学习
tags: [配置, 路由器]
---

保了个研，人生进入了一个短暂的新阶段。从我的生活质量考虑，高速，畅通的无线网络是必不可少的。

<!-- more -->

## 偷懒

现在华科提供了`HUST_WIRELESS_AUTO`这个热点，连接进去，配置好用户名和密码，完事。这个热点覆盖率还是挺高的，而且附带IPv6能力，缺点就是带宽感人。

## 凭本事买的路由器，凭什么不能用？

我科宿舍内的有线网是用了万恶的锐捷做认证，因此要配置好路由器开启WiFi不是件那么容易的事情。要在路由器上配置好锐捷认证，你需要[MentoHUST](https://github.com/hyrathb/mentohust)。要在路由器上运行这个程序，Linux环境必不可少，因此不能刷OpenWrt/DD-WRT的用户洗洗睡吧。

我的路由器是[D-Link DIR-859 A3](http://us.dlink.com/products/connect/ac1750-wi-fi-router-2/)，当时大二为了给自己的无线网也弄个IPv6，脑子一热买了个这个，价格高得一🍺，然而官方固件并不能自动配置好无线网络的IPv6。好在它能刷DD-WRT，不然五百多就白花了。

<p>{% spoiler 我当时自己买来的时候是A1，更新到DD-WRT的某个beta版本的时候它就砖了，后来去售后假装萌新啥也不懂才免费以旧换新，换了个A3回来。不过我那个时候还不知道D-Link路由器有急救模式救砖，要是知道的话这一趟也不用跑了。 %}</p>

但是我那个DD-WRT完全无法使用第三方程序，而且DD-WRT固件体积奇大无比，放个认证程序和依赖包也放不下，也没有找到合适的MentoHUST成品，陷入绝望.jpg

之后OpenWrt论坛的某dalao发现[^1]，DIR-869的硬件和859相差无几，因此他大胆给859刷了个869的固件，奇迹般地能用。有个小问题就是869的LED灯比859的多三个，根据我刷过之后的体验，电源灯根本不亮，WAN口常亮（可能是错位成电源灯了），WiFi指示灯完全不亮，LAN口灯正常。不过这种小瑕疵不太影响使用就是了。

我的路由器CPU是`ar71xx`，网上还有不少现成的成果，所以能够光明正大地偷懒。CPU型号不对的同学只能自己开启交叉编译自己弄包了。我们需要如下几个包：

1. MentoHUST依赖库[libpcap_1.7.4-1_ar71xx.ipk.ipk](https://archive.openwrt.org/snapshots/trunk/ar71xx/generic/packages/base/libpcap_1.7.4-1_ar71xx.ipk)
2. 加密库[libsodium_1.0.12-1_ar71xx.ipk](https://raw.githubusercontent.com/viseator/mentohust_for_ar71xx/master/libsodium_1.0.12-1_ar71xx.ipk)
3. MentoHUST本体[mentohust](https://www.viseator.com/file/mentohust)
4. MentoHUST网页管理程序[luci-app-mentohust_trunk+svn-1_ar71xx.ipk](https://raw.githubusercontent.com/viseator/mentohust_for_ar71xx/master/luci-app-mentohust_trunk%2Bsvn-1_ar71xx.ipk)

感谢[viseator](https://www.viseator.com)做出的[杰出贡献](https://github.com/viseator/mentohust_for_ar71xx)。在他的仓库里面虽然有一个[MentoHUST的ipk包](https://raw.githubusercontent.com/viseator/mentohust_for_ar71xx/master/mentohust_0.3.1-1_ar71xx.ipk)，但是安装后那个可执行文件死活无法运行，因此只好下载好本体之后覆盖`/usr/sbin/mentohust`。

安装包的时候可能会出现像下面这样的错误提示：

    Packages for libpcap found, but incompatible with the architectures configured

在`/etc/opkg.conf`里面加入下面这几句话就能解决了。

```plain
arch all 100
arch mips_24kc 200
arch ar71xx 300
```

之后在LuCI界面里面，会出现Services-MentoHUST这个条目，进去配置就完事了。

### 给无线网开启IPv6

参考 http://www.right.com.cn/forum/thread-253712-1-1.html 就行了。

### DD-WRT用户开启IPv6

参考 https://www.polarxiong.com/archives/%E6%95%99%E8%82%B2%E7%BD%91DD-WRT-OpenWrt%E7%94%A8%E4%B8%8AIPv6-%E4%BB%A5%E5%8D%97%E4%BA%AC%E5%A4%A7%E5%AD%A6%E4%B8%BA%E4%BE%8B.html

[^1]: https://forum.openwrt.org/t/d-link-dir-859-a3-ac1750-works-with-dir-869-a1-image/9226
