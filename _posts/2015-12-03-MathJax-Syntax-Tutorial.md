title: MathJax Syntax Tutorial
toc: true
date: 2015-12-03 15:38:59
categories: 学习
tags: MathJax
---
本文翻译自这篇官网的[教程性质文章](http://meta.math.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference)。
<!-- more -->

要想知道一个问题或回复里的公式，以及本文的数学公式是怎么写成的，右键单击选择 "Show Math As > TeX Commands". (你看到公式的 Tex 语法时，'$'是不会显示在其中的，记得添上它，用法见下)

## 公式

对于行内公式，将其用`$...$`括起来。对于行间公式，使用`$$...$$`. 它们渲染出来的效果是不同的：$\sum_{i=0}^n i^2 = \frac{(n^2+n)(2n+1)}{6}$ (行内)  或者

$$
\begin{aligned}
\sum_{i=0}^n i^2 = \frac{(n^2+n)(2n+1)}{6}
\end{aligned}
$$
(行间)

## 希腊字母
使用 `\alpha`, `\beta`, …, `\omega`: $ \alpha, \beta, …, \omega $. 对于大写字母，使用 `\Gamma`, `\Delta`, …, `\Omega`: $ \Gamma, \Delta, …, \Omega $.

## 上标和下标

使用`^`和`_`. 比如，`x_i^2`: $ x_i^2 $.

## 组合

上标、下标及其他操作符只对下一个“组合”生效。一个“组合”可以是一个单独的符号或任何由花括号`{`…`}`括起来的公式。如果你写`10^10`你就会被亮瞎：$10^10$. 不过`10^{10}`就会给你你想要的：$10^{10}$. 使用花括号来将含上下标的公式的各部分区分开：`x^5^6`会报错；`{x^y}^z`是$ {x\^y}\^z $, `x^{y^z}`是$ x\^{y\^z} $. 好好看，好好学：`x_i^2`是$x_i^2$而 `x_{i^2}`是$x_{i^2}$.

## 括号

()[]分别表示括号和方括号：$ (2+3)[4+4] $. 使用`\{`和`\}`来表示花括号$ \{\} $.

上面那些括号，它们的大小不会自动适配其中的公式，所以你写`(\frac{\sqrt x}{y^3})`的话那公式就会显得特别小：$ (\frac{\sqrt x}{y^3}) $. 使用`\left(`…`\right)`就能自动适配大小： `\left(\frac{\sqrt x}{y^3}\right)`效果是$ \left(\frac{\sqrt x}{y^3}\right) $.

`\left`和`\right`对以下各种形式的括号有效：`(`和`)` $ (x) $, `[`和`]` $ [x] $, `\{`和`\}` $ \{x\} $, `|` $ |x| $, `\langle`和`\rangle`$ \langle x \rangle $, `\lceil`和`\rceil` $ \lceil x \rceil $, 以及`\lfloor`和`\rfloor` $ \lfloor x \rfloor $. 还有不可见的括号，以`.`表示：`\left.\frac12\right\rbrace`是$ \left.\frac12\right\rbrace $.

## 求和和积分

求和号和积分号分别是`\sum`和`\int`; 下标表示下界，上标表示上界，比如`\sum_1^n` $\sum_1^n$. 如果上下标不止一个符号的话，别忘了`{`…`}`. 比如`\sum_{i=0}^\infty i^2`是$\sum_{i=0}^\infty i^2$. 其他符号：`\prod` $\prod$, `\int` $\int$, `\bigcup` $\bigcup$, `\bigcap` $\bigcap$, `\iint` $\iint$.

## 分式

有两种方法表示分式。`\frac`作用到接下来的两个组合上，所以`\frac ab`就是$ \frac ab $. 复杂的分子和分母用`{`…`}`括起来：`\frac{a+1}{b+1}`就是$ \frac{a+1}{b+1} $. 如果分子分母再复杂点的话，你可能更喜欢`\over`,  它作用到前后两个组合上：`{a+1\over b+1}`就是${a+1\over b+1}$.

## 字体

* 使用`\mathbb`或`\Bbb`以表示"blackboard bold": $ \mathbb{CHNQRZ} $.
* 使用`\mathbf`以表示黑体(boldface)：$ \mathbf{ABCDEFGHIJKLMNOPQRSTUVWXYZ}$ $\mathbf{abcdefghijklmnopqrstuvwxyz} $.
* 使用`\mathtt`以表示打印体(typewritter)：$ \mathtt{ABCDEFGHIJKLMNOPQRSTUVWXYZ}$ $\mathtt{abcdefghijklmnopqrstuvwxyz} $.
* 使用`\mathrm`以表示roman font: $ \mathrm{ABCDEFGHIJKLMNOPQRSTUVWXYZ}$ $\mathrm{abcdefghijklmnopqrstuvwxyz} $.
* 使用`\mathsf`以表示无衬线字体(sans-serif)：$ \mathsf{ABCDEFGHIJKLMNOPQRSTUVWXYZ}$ $\mathsf{abcdefghijklmnopqrstuvwxyz} $.
* 使用`\mathcal`以表示书法字体(calligraphic)：$ \mathcal{ABCDEFGHIJKLMNOPQRSTUVWXYZ} $.
* 使用`\mathscr`以表示手写体(script)：$ \mathscr{ABCDEFGHIJKLMNOPQRSTUVWXYZ} $.
* 使用`\mathfrak`以表示德文黑体(Fraktur)：$ \mathfrak{ABCDEFGHIJKLMNOPQRSTUVWXYZ}$ $\mathfrak{abcdefghijklmnopqrstuvwxyz} $.

## 根号

根号使用`sqrt`, 根号的大小会随内容而变化：`\sqrt{x^3}` $ \sqrt{x^3} $; `\sqrt[3]{\frac xy}` $\sqrt[3]{\frac xy}$. 对于更复杂的表达式，请换用 `{...}^{1/2}`.

## 特殊函数

有些特殊函数，例如 "lim", "sin", "max", "ln", 以及其他，通常使用的是正常字体而不是斜体。其符号使用 `\lim`, `\sin`, 等等。要注意，是`\sin x` $\sin x$, 而不是`sin x` $sin x$. `\lim`的表示涉及到下标：`\lim_{x\to 0}` 

$$
\lim_{x\to 0}
$$.

## 特殊符号和特殊表示法

特殊符号和特殊表示法非常多，多到这里列不完；参见[简明列表](http://pic.plover.com/MISC/symbols.pdf)或是[详尽列表](http://mirror.math.ku.edu/tex-archive/info/symbols/comprehensive/symbols-a4.pdf)。最常用的一部分如下：

* `\lt \gt \le \ge \neq` $ \lt\, \gt\, \le\, \ge\, \neq $. 你可以用`\not`来给大部分符号加个斜杠：`\not\lt` $\not\lt$. 这种表示一般都不好看。
* `\times \div \pm \mp` $\times\, \div\, \pm\, \mp$. `\cdot`是一个点：$ x\cdot y $.
* `\cup \cap \setminus \subset \subseteq \subsetneq \supset \in \notin \emptyset \varnothing` $ \cup\, \cap\, \setminus\, \subset\, \subseteq \,\subsetneq \,\supset\, \in\, \notin\, \emptyset\, \varnothing $
* `{n+1 \choose 2k}`或`\binom{n+1}{2k}` $ {n+1 \choose 2k} $
* `\to \rightarrow \leftarrow \Rightarrow \Leftarrow \mapsto` $ \to\, \rightarrow\, \leftarrow\, \Rightarrow\, \Leftarrow\, \mapsto $
* `\land \lor \lnot \forall \exists \top \bot \vdash \vDash` $ \land\, \lor\, \lnot\, \forall\, \exists\, \top\, \bot\, \vdash\, \vDash $
* `\star \ast \oplus \circ \bullet` $ \star\, \ast\, \oplus\, \circ\, \bullet $
* `\approx \sim \simeq \cong \equiv \prec` $ \approx\, \sim \, \simeq\, \cong\, \equiv\, \prec $
* `\infty \aleph_0` $ \infty \, \aleph_0 $ `\nabla \partial` $ \nabla \, \partial $ `\Im \Re` $ \Im \, \Re $
* 带余除法，使用`\pmod`: `a\equiv b\pmod n` $ a\equiv b\pmod n $
* `\ldots`是$a_1, a_2, \ldots ,a_n$中的点，`\cdots`是$ a_1+a_2+\cdots+a_n $中的点。
* 某些希腊字母存在变体：`\epsilon \varepsilon` $ \epsilon \varepsilon $, `\phi \varphi` $ \phi \varphi $, 以及其他。手写体的小写l是`\ell` $\ell$.

[Detexify](http://detexify.kirelabs.org/classify.html) 能让你在网页上画个符号然后用 $\TeX$ 符号来拼凑它。我们并不保证它在 MathJax 里能用，但尝试一下也是不错的。要检测某个符号是否支持，参见 MathJax.org 维护的一个[目前支持的$\LaTeX$符号列表](http://docs.mathjax.org/en/latest/tex.html#supported-latex-commands)，也可以去看看 Dr. Carol JVF Burns 的 [$\TeX$ Commands Available in MathJax](http://www.onemathematicalcat.org/MathJaxDocumentation/TeXSyntax.htm) 页面。

## 空格

MathJax 会使用一套复杂的规则来自动处理公式内的空格。除此之外，多打几个空格也不会有什么奇效：`a␣b`和`a␣␣␣␣b`都表示$a b$(`␣`表示一个空格). 要强制添加空格的话，使用`\,`表示窄空格$a\, b$， 使用`\;`表示宽空格$a\;b$. `\quad`和`\qquad`是更宽的空格：$a\quad b$ $a \qquad b$.

要添加纯文本，使用`\text{…}`: $\{x\in s\mid x\text{ is extra large}\}$. `$…$`可嵌套于`\text{…}`内。

## 重音符和变音符

使用`\hat`用于单个符号上 $\hat x$, `\widehat`用在更复杂的公式上$\widehat{xy}$. 如果你把它拉得太长的话，那么看上去就很傻X. 类似地，还有`\bar` $\bar x$、`\overline` $\overline{xyz}$、`\vec` $\vec x$、`\overrightarrow` $\overrightarrow{xy}$和`\overleftrightarrow` $\overleftrightarrow{xy}$. 点类符号，比如$\frac d{dx}x\dot x =  \dot x^2 +  x\ddot x$里的，使用`\dot`和`\ddot`.

## 转义

MathJax 格式用到的符号也可以使用`\`来转义：`\$` $\$$, `\{` $\{$, `\_` $\_$, 等等。如果你需要`\`它本身的话，你应该用`\backslash` $\backslash$, 因为`\\`被拿来表示另起一行。
