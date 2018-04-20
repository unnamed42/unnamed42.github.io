---
title: jquery.min.js的async加载
date: 2018-04-02 01:43:55
toc: true
comments: true
categories: 编程
tags: [jQuery]
---

作为有点强迫症的人，看见站点速度评测网站给你的博客加载扣了分，原因是`jquery.min.js`导致了一大票js是同步加载，这怎么能忍？

<!-- more -->

## 试试defer

`defer`属性表示，这个脚本将在页面解析完毕之后，`DOMContentLoaded`触发之前执行（[MDN][mdn]是这么说的，粗略扫了一下[HTML5 spec][html5spec]并没有提到`defer`执行顺序的事情）。看起来很美好，但是其支持不如`async`广泛，而且内嵌`script`也没法用了。除此之外，你得清楚地知道`script`间的依赖关系，否则会和`async`一样出现`xxx is undefined`这样的事情。

## SO大法好！

以下代码源自SO的[这篇回答](https://stackoverflow.com/a/46808443)。

如果直接把`jquery.min.js`和相关脚本打上`async`，那么：

```plain
Uncaught ReferenceError: $ is not defined
    at blahblah.html:3
```

原来`async`脚本的执行顺序没有任何保障，惨痛的教训。

作为本博客主题的维护者，我拥有全部javascript代码的控制权，因此我知道我的代码只是依赖`$(function() {...})`的。既然只用到了`$(...)`，那么我们就做一个假的`$`出来，把传给它的参数保存起来，到真正的jQuery加载完成之后再再`apply`给真正的jQuery，岂不美哉？

保证这段代码在所有使用到了`$`的脚本之前执行：

```javascript
if(!("jQuery" in window)) {
    window._jqQ = []; // jQuery call queue
    window.jQuery = window.$ = function() {
        _jqQ.push(arguments);
    };
}
```

然后想办法让jQuery加载完成时执行这段脚本（我选择使用`script`的`onload`）：

```javascript
_jqQ.forEach(function(args) {
    $.apply($,args);
});

delete window._jqQ;
```

### 本方法的缺点

首先，所有jQuery的调用都得包装在`$(function() {...})`里面，这个无所谓了，但是`$(document).ready`这种写法是不行的，因为我们的假`$`对象中没有任何jQuery的API。

其次，还是因为API的缘故，那种使用`prototype`来做jQuery扩展的方法就废掉了（`jQuery.fn`就是它的`prototype`），你只能找个替代品。{% spoiler 我的Bootstrap scrollspy啊，就这么说再见了 %}

### 好孩子不要学

从炫技的角度出发，丧心病狂地使用`bind`来避免在`forEach`部分写个`function`，one liner万岁！

```javascript
_jqQ.forEach($.apply.bind($, $));
```

<p>{% spoiler 其实C++出身的我为了想明白上面那段js代码的`this`问题，头都炸了 %}</p>

然后看了一篇关于`function`, `call`和`bind`的[benchmark评测](https://jsperf.com/bind-vs-closure-setup/32)，以及从可读性角度考虑，果断放弃炫技代码，朴素才是真啊。

## 参考文献

1. [\<script\>: The Script element][mdn]
2. [The script element][html5spec]

[mdn]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script
[html5spec]: https://www.w3.org/TR/html5/semantics-scripting.html#element-attrdef-script-defer
