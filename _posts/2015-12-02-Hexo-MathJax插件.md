title: Hexo MathJax插件
date: 2015-12-02 22:45:34
toc: true
categories: 杂项
tags: [Hexo,MathJax]
---

本文翻译自[这篇](https://github.com/akfish/hexo-math)文章。

UPDATE 2016/06/22: 增加“配置”部分
<!-- more -->
## 介绍

一个使用 MathJax 来渲染数学公式的 Hexo 插件，具有以下特点：

* 自动配置并添加到 MathJax 的引用
* 支持 MathJax 的行内公式语法和数学标签

## 安装

    npm install hexo-math --save

如果你是从旧版升级上来的，请参阅[迁移注意事项](#Migration)。

## 配置

在你的`_config.yml`里加上：

```text
plugins:
- hexo-math
```

## 使用

你可以直接使用 MathJax 的行内公式语法，但要记得在每个特殊符号前加一个`\`来将其转义。LaTeX包含大量的像`\`这样的特殊字符，这就给手动转义带来了极大的不便。这种情况下，你可以使用 hexo-math 的标签来让你解脱。

### MathJax Inline:

    Simple inline $a = b + c$.
    
### MathJax Block:

```markdown
$$\frac{\partial u}{\partial t}
= h^2 \left( \frac{\partial^2 u}{\partial x^2} +
\frac{\partial^2 u}{\partial y^2} +
\frac{\partial^2 u}{\partial z^2}\right)$$
```
    
### Tag:

单行内容会被解析成行内公式（如同使用`$...$`）：

```markdown
This equation {% math %}\cos 2\theta = \cos^2 \theta - \sin^2 \theta =  2 \cos^2 \theta - 1 {% endmath %} is inline.
```
    
多行内容会被解析成数学语句块（如同使用`$$...$$`）：

```markdown
{% math %}
\begin{aligned}
\dot{x} & = \sigma(y-x) \\
\dot{y} & = \rho x - y - xz \\
\dot{z} & = -\beta z + xy
\end{aligned}
{% endmath %}
```

> **自 2.0.0 被弃用的方式**
> **Tag Block:**
>
>```markdown
{% math_block %}
\begin{aligned}
\dot{x} & = \sigma(y-x) \\
\dot{y} & = \rho x - y - xz \\
\dot{z} & = -\beta z + xy
\end{aligned}
{% endmath_block %}
```

<h2 id="Migration">迁移注意事项</h2>

### 迁移至 2.0.0

* `math-block`已被弃用（但它仍然是稳定的，不会弄乱你的网站）
* 由于自 Hexo 3.x 以来的大量更新，`math`块用于处理行内公式和公式语句块（如果你使用`math`, 可能会弄乱你的网站）

自 Hexo 3.x 以来，标签引擎由 swig 换成了 nunjucks. 如下语法已经失效：

```markdown
{% math \frac{|ax + by + c|}{\sqrt{a^{2}+b^{2}}} %}
```
你应该使用开放标签和闭合标签来替换：

```markdown
{% math %}\frac{|ax + by + c|}{\sqrt{a^{2}+b^{2}}} {% endmath %}
```

请参照以上内容修改你的`math`标签。

### 迁移至 1.0.6

**！！注意！！**

自 1.0.6, hexo-math 更改了把 MathJax 插入网站的方式，有即时和按需两种，这意味着：

*  **你不必运行`hexo math install`**
*  MathJax 不会在没有 math 标签的页面上加载，以提高加载速度。

如果你以前运行过`hexo math install`, **请务必**：

    $ hexo math
    
这会清理掉以前的安装。如果这没有生效的话，尝试重新安装你的主题。

### 从 1.0.4 升级到 1.0.5 (支持 Hexo 3.0)

Hexo 3.0 引入了许多重大更新，hexo-math 1.0.5之前的版本与之不兼容。
我们做了如下更改以适配 3.0 的新 API:

* 公式块标签`math-block`更名为`math_block`

### 从 1.0.3 或更早的版本

自 1.0.4, MathJax 脚本会插入到`<body>`而不是`<head>`.
升级到新版本之前，你应该：

    $ hexo math uninstall
    
`hexo-math`更新之后，再运行：

    $ hexo math install
    
## 开发

### 测试

要运行测试套件，首先应该安装依赖：

```bash
$ cd .test-site
$ npm install
```

然后在`hexo-math`的根目录执行`npm test`.

#### 加入发贴规格

在`test-site/source/_post`文件夹里对每一个测试情况加上如下两个文件：

* [test-case-name].md
* [test-case-name].md.expected

`.md`文件包含了贴文的 Markdown 源文档，`.expected`文件包含了理论上渲染后的HTML文档。

如果添加了一个测试来强调某个问题的话，问题的id应该添加到`.md`文档的 front-matter 区域

```markdown
title: "Tag Escpae"
date: 2015-04-21 02:47:19
tags:
issues:
- 10
---
{% math %} |a|<1 {% endmath %}
```
