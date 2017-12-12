title: hexo spoiler插件
toc: false
comments: true
date: 2016-06-25 19:23:32
categories: 杂项
tags: Hexo
---
这是个新手做的非常简单的插件。

UPDATE 2016/06/27: 添加点击可见功能

UPDATE 2017/03/13: 更正一些错误知识
<!--more-->
由于看到了萌娘百科和Steam的黑幕插件，我就萌生了在博客上也用上这个功能的想法。之前想表达一些嘿嘿嘿的信息的时候，要么使用自带的划线，或者是使用[hexo-ruby-character](https://github.com/JamesPan/hexo-ruby-character)。但这些还不够喜感，像萌娘百科的那种才有喜感，然而它在手机上十分蛋疼（手机上就算选中了也看不到内容，而且那个黑条也不是点击消失的）。我的小伙伴也做了个黑幕插件，在此打个[广告](https://github.com/MaoKwen/hexo-black-cover){% spoiler 我没用过，不知道怎样，效果不好不要打我 %}。

今天做制作准备工作的时候（其实就是在各网站搜刮css和脚本），偶然间发现了[这个网站](https://meta.discourse.org/t/folding-spoilers/16123/2)，他自带的spoiler是类似高斯模糊效果，点击可消失，我一下就心动了，仿照他们的做了这么个插件。

## 安装与使用
安装：
```bash
npm install hexo-spoiler --save
```
使用：
```
{% spoiler text %}
```

## 成果展示

可以遮蔽正常文本：{% spoiler text %}

可以遮蔽带格式的文本：{% spoiler *text* **text** ~~text~~ %}

可以遮蔽行内代码，但是效果非常差：{% spoiler `code` %}

## 缺点

1. 当内部有代码块的时候效果非常糟糕

2. <del>只是鼠标划过的时候显示文本，而不是像原网站那样点击显示文本，再点击隐藏 {% spoiler 我觉得他们肯定用了js脚本 %}</del>点击可隐藏，再点击消失<del>，但缺少动画效果</del>。

3. 目前它产生的HTML代码是`<span>`包起来的，而且我去除了它渲染时生成的`<p>`, 所以如果你需要换行的话也许需要自己手动加上`<br>`

4. <del>在手机上会有点卡，因为它似乎先触发`hover`效果再触发`click`事件。</del>已经无所谓了

## 背后的故事

实际上是抄袭那个网站的css, 在每个文章的正文中都植入这个css. css长这样：

```css
span.spoiler {
    color: rgba(0, 0, 0, 0);
    background-color: rgba(0, 0, 0, 0);
    text-shadow: grey 0px 0px 10px;
    cursor: pointer;
}
span.spoiler:hover {
    text-shadow: grey 0px 0px 5px;
}
span.spoiler.revealed {
    text-shadow: grey 0px 0px 0px;
}
```

然后给每个需要遮蔽的文本渲染后用`<span class="spoiler">`框起来。使用jQuery或者是DOM API来处理它的点击事件，通过加上`revealed`来使马赛克消失或显示：

```javascript
(function(){
    var spoiler = document.getElementsByClassName("spoiler");
    for(var i = 0; i < spoiler.length; ++i) {
        spoiler[i].addEventListener("click", function() {
            this.classList.toggle("revealed");
        });
    }
})();
```

就是这么简单。为什么我（初版）做了一天呢？{% spoiler 因为你智障啊 %}
