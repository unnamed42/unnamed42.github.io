title: Leetcode 102 Binary Tree Level Order Traversal
date: 2015-12-05 23:50:00
categories: 编程
tags: [Leetcode,算法]
---
Leetcode 102 的题解
<!-- more -->
题目如下：
{% blockquote %}
Given a binary tree, return the level order traversal of its nodes' values. (ie, from left to right, level by level).

For example:
Given binary tree `{3,9,20,#,#,15,7}`,
{% codeblock lang:plain %}
     3
    / \
   9  20
     /  \
    15   7
{% endcodeblock %}
return its level order traversal as:
{% codeblock lang:plain %}
 [
   [3],
   [9,20],
   [15,7]
 ]
{% endcodeblock %}
{% endblockquote %}
******

由于C语言写出来更加复杂，需要开辟动态数组存放结果，所以我选用了C++, 因为它有`std::vector`.

如果只是涉及到树的层次遍历，那我还是会的；但本题不光涉及到层次遍历，还要在输出里面包含“层次”的信息，这就有点麻烦了。刚开始，我想到的是设计一个计数变量`i`, 如果$2^{n-1}-1 \lt i \le 2^n-1$, 那么就位于第$n$层（尽管不一定是满二叉树，但让`i`把空指针数也记录进去就可以了），但这样显然把问题弄得更复杂了。

后来，考虑到层次遍历入队的时候，当前层的节点数等于队列中的节点数，那么这个问题就好办了：

```C++
/**
 * 树节点是这样的：
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
using std::vector;
using std::queue;

vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> res;queue<TreeNode*> q;
        if(root==NULL)
            return res;
        q.push(root);
        while(!q.empty()){
            vector<int> lvl;int size=q.size();
            for(;size>0;size--){
                root=q.front();
                lvl.push_back(root->val);
                q.pop();
                if(root->left!=NULL)
                    q.push(root->left);
                if(root->right!=NULL)
                    q.push(root->right);
            }
            res.push_back(lvl);
        }
        return res;
    }
};
```
Over.
