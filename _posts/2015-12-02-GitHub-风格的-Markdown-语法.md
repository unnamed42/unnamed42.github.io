title: GitHub 风格的 Markdown 语法
date: 2015-12-02 22:00:17
toc: true
categories: 学习
tags: [Markdown,GitHub]
---
本文转载自[此](https://github.com/baixing/FE-Blog/issues/6)。
<!-- more -->
>  * Original: [GitHub Flavored Markdown - GitHub Help](https://help.github.com/articles/github-flavored-markdown/)
>  * Translated by: [@cssmagic](https://github.com/cssmagic)
>  声明：原文版权属于 GitHub。中文翻译部分并非官方文档，仅供参考。

GitHub 全站支持 “GitHub 风格的 Markdown 语法”（简称 GFM），你可以用它来书写 issue、pull request（以下简称 “PR”）和各种评论。它和标准 Markdown 语法（SM）相比，存在一些值得注意的差异，并且增加了一些额外功能。

如果你对 Markdown 还不是很熟悉，可以先看一眼 [Markdown 语法基础](https://help.github.com/articles/markdown-basics)。如果你想了解在书写 issue、评论和 PR 描述时有哪些技巧（比如任务清单这样的高级功能），你应该读一下 [GitHub 上的书写方式](https://github.com/baixing/FE-Blog/issues/5)。

## 与传统 Markdown 的差异

### 单词中的多个下划线

Markdown 会把所有成对的下划线（`_`）转换为斜体，但 GFM 不会处理单词内的那些下划线，比如这些：

* wow_great_stuff
* do_this_and_do_that_and_another_thing.

这样一来，那些采用下划线作为分隔符的代码或名字就可以正确渲染了。如果你确实要把单词中的某一部分设置为斜体，可以使用星号（`*`）。

### 链接自动识别

GFM 会自动为标准的 URL 加上链接，因此，如果你只想链接到一个 URL（而不想设置链接文字），那你直接输入这个 URL 就可以了，它将被自动转换为一个链接。（译注：Email 地址也适用于此特性。）

    http://example.com

将被渲染为：

http://example.com

### 删除线

GFM 增加了删除线语法，补上了标准 Markdown 在这方面的不足。

    ~~Mistaken text.~~
    
将被渲染为：

~~Mistaken text.~~

### 围栏式代码块

标准 Markdown 会把每行前面空四格的文本块转换为代码块；GFM 同时还支持围栏式代码块。只要把你的代码块包裹在三个`` ` ``之间就行了（如下所示），你再也不需要通过无休止的缩进来标记代码块了。请注意，虽然围栏式代码块语法并不需要在头部插入空行（缩进式代码块语法是需要的），但我们仍然建议你留出空行，因为这样可以令 Markdown 源码的可读性更好。

````markdown
        Here's an example:

        ```
        function test() {
            console.log("notice the blank line before this function?");
        }
        ```
````
    
请留意，列表中的代码块需要缩进 8 个空格，才会被正确地渲染。

### 语法高亮

关于代码块的技巧还不止于此，你还可以为代码块指定语法着色效果。在围栏式代码块中，你可以指定一个可选的语言标识符，然后我们就可以为它启用语法着色了。比如说，这样可以为一段 Ruby 代码着色：

````markdown
        ```ruby
        require 'redcarpet'
        markdown = Redcarpet.new("Hello World!")
        puts markdown.to_html
        ```
````

我们使用 [Linguist](https://github.com/github/linguist) 来进行语言识别和语法着色。你可以在 [语言 YAML 文件](https://github.com/github/linguist/blob/master/lib/linguist/languages.yml) 中查证哪些语言标识符是有效的。

### 表格

把一系列文本精心组织起来，我们甚至可以得到一个表格。我们需要把表头的那一行用一串横杠（`-`）隔出来，然后把每一列用竖杠（`|`）隔开：

```markdown
First Header  | Second Header
------------- | -------------
Content Cell  | Content Cell
Content Cell  | Content Cell
```

出于美观的考虑，你也可以在表格的两端都加上竖杠：

```markdown
| First Header  | Second Header |
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |
```

请注意，用于分隔列的竖杠并不需要跟表头严格对齐：

```markdown
| Name | Description          |
| ------------- | ----------- |
| Help      | Display the help window.|
| Close     | Closes a window     |
```

同时，你也可以在单元格内使用那些行内 Markdown 语法，比如加链接、加粗、加斜体或加删除线等等：

```markdown
| Name | Description          |
| ------------- | ----------- |
| Help      | ~~Display the~~ help window.|
| Close     | _Closes_ a window     |
```

最后别忘了，给表头下的各段横线加上冒号（`:`），还可以指定各列文本的对齐方式：

```markdown
| Left-Aligned  | Center Aligned  | Right Aligned |
| :------------ |:---------------:| -----:|
| col 3 is      | some wordy text | $1600 |
| col 2 is      | centered        |   $12 |
| zebra stripes | are neat        |    $1 |
```

在横线**最左侧**加冒号表示该列一律左对齐；在横线**最右侧**加冒号表示该列一律右对齐；在横线**两端**加冒号表示该列一律居中对齐。

### HTML

在 README、issue 和 PR 中，你还可以使用有限的一些 HTML 语法。

关于可用的标签和属性有哪些，你可以在 [github/markup](https://github.com/github/markup) 这个项目中找到一份完整的清单。

## 相关阅读

* [Markdown 语法基础](https://help.github.com/articles/markdown-basics)
