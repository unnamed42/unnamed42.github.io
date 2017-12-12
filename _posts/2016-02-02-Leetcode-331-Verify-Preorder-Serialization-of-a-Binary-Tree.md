title: Leetcode 331 Verify Preorder Serialization of a Binary Tree
date: 2016-02-02 23:15:32
categories: 编程
tags: [Leetcode,算法]
---
Leetcode 331 的题解
<!-- more -->
题目如下：
{% blockquote %}
One way to serialize a binary tree is to use pre-order traversal. When we encounter a non-null node, we record the node's value. If it is a null node, we record using a sentinel value such as `#`.
{% codeblock lang:plain %}
     _9_
    /   \
   3     2
  / \   / \
 4   1  #  6
/ \ / \   / \
# # # #   # #
{% endcodeblock %}

For example, the above binary tree can be serialized to the string <code>"9,3,4,#,#,1,#,#,2,#,6,#,#"</code>, where <code>#</code> represents a null node.

Given a string of comma separated values, verify whether it is a correct preorder traversal serialization of a binary tree. Find an algorithm without reconstructing the tree.

Each comma separated value in the string must be either an integer or a character `'#'` representing null pointer.

You may assume that the input format is always valid, for example it could never contain two consecutive commas such as `"1,,3"`.

**Example 1**:<br/>
`"9,3,4,#,#,1,#,#,2,#,6,#,#"`<br/>
Return `true`

**Example 2**:<br/>
`"1,#"`<br/>
Return `false`

**Example 3**:<br/>
`"9,#,#,1"`<br/>
Return `false`
{% endblockquote %}
******

该解法来源于这篇[Discuss](https://leetcode.com/discuss/83824/7-lines-easy-java-solution).

在二叉树中，如果把空节点也当做叶子节点考虑的话，有如下性质：

* 除根节点外，所有非空节点有2个出度和1个入度（2个子节点，1个父节点）

* 所有空节点有0个出度和1个入度（0个子节点，1个父节点）

现在假设我们在根据先序遍历结果建立这棵树。建立过程中，用变量`diff`记录总的出度与入度之差(`diff=outdegree-indegree`)。读入下一个节点时，将`diff`减一，因为该节点具有一个入度。如果该节点非空，那么将`diff`加二，因为该节点具有两个出度。如果该先序序列是正确的话，那么`diff`不可能为负且结果应该为0.

代码如下：

```C
#include <string.h>

bool isValidSerialization(char* preorder) {
    char *iter=strtok(preorder,",");
    int diff=1;
    while(iter!=NULL){
        if(--diff<0)
            return false;
        if(strcmp(iter,"#")!=0)
            diff+=2;
        iter=strtok(NULL,",");
    }
    return diff==0;
}
```

`diff`初始化为`1`是为了刚开始处理根节点的时候不至于在第一步得到`false`, 并且这样能够使得根节点与其他节点是使用同一逻辑处理。
