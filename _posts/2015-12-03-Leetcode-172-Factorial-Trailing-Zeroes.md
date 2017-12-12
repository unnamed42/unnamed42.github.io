title: Leetcode 172 Factorial Trailing Zeroes
date: 2015-12-03 14:50:47
categories: 编程
tags: [Leetcode,算法]
---
Leetcode 172 的题解，非脑筋急转弯式的算法优化
<!-- more -->
题目如下：

> Given an integer n, return the number of trailing zeroes in n!.
>
> **Note**: Your solution should be in logarithmic time complexity.

******

1\. 简单粗暴的解法：求出$ n! $, 然后不断除以10去掉末尾的0, 并统计个数。对于C\C++ 这种静态类型语言来说，数字稍大就会溢出，因此这种方法不可取。

2\. 从数学角度分析

将我们要求的结果记为$x$.

阶乘$ n! $末尾0的个数由其中因数2和因数5的个数决定。因此，我们只需求出因数2的个数和因数5的个数，取其中最小值就是我们所要的$x$.

而$ n! $又可以写成$ A\cdot 2^x \cdot 5^y $, 显然因数2的个数大于因数5的个数，因此我们只需要求出因数5的个数就可以了。

$ n! $是从1到$n$这$n$个数的乘积，其中从1开始每5个数中一定会有一个是5的倍数，这个数目是$ x_1 =  \lfloor {n \over 5} \rfloor $. 而$x_1$不一定是我们要求的$x$, 因为这些数中不一定只含有一个因数5，比如多了一个因数5的25及其倍数，其数目是$ x_2 = \lfloor {n \over 5^2} \rfloor $; 而同理$x_1 + x_2$不一定是我们要求的$x$, 因为还有125及其倍数，其数目是$ x_3 = \lfloor {n \over 5^3} \rfloor $. 而……

因此我们要求的$x = x_1 + x_2 + x_3 + ... = \lfloor {n \over 5} \rfloor + \lfloor {n \over 5^2} \rfloor + \lfloor {n \over 5^3} \rfloor + ...$
($ \lfloor a \rfloor $代表不大于$a$的最大整数)

写成代码如下：
```C++
int trailingZeroes(int n) {
    int five=0;
    while(n>0){
        five+=n/5;
        n/=5;
    }
    return five;
}
```

时间复杂度为$ O(\log n) $.
