title: Leetcode 70 Climbing Stairs
date: 2015-12-03 22:06:05
categories: 编程
tags: [Leetcode,算法]
---
Leetcode 70 的题解
<!-- more -->
题目如下：

> You are climbing a stair case. It takes n steps to reach to the top.
>
> Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

******

其实这个题以递归的思路来解的话，其实非常简单：

如果最后还剩下1步登顶的时候，所有可能的登顶方案就是台阶为$n - 1$时所有可能的方案；还剩下2步登顶的时候，所有可能的登顶方案就是台阶为$n - 2$时所有可能的方案。

因此，我们要求的$\mathrm{climbStairs}(n)=\mathrm{climbStairs}(n-1)+\mathrm{climbStairs}(n-2)$. 很容易求出，$\mathrm{climbStairs}(1)=1$, $\mathrm{climbStairs}(2)=2$. 因此，代码如下：

```C
int climbStairs(int n){
    if(n<=2)
        return n;
    int a=1,b=2,c=0;
    for(int i=2;i<n;i++){
        c=a+b;
        a=b;
        b=c;
    }
    return c;
}
```
