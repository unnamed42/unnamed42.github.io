title: Leetcode 268 Missing Number
date: 2016-02-02 22:30:47
categories: 编程
tags: [Leetcode,算法]
---
Leetcode 268 的题解
<!-- more -->

题目如下：

> Given an array containing n distinct numbers taken from 0, 1, 2, ..., n, find the one that is missing from the array.
>
> For example,
>  Given `nums = [0, 1, 3]` return `2`.
>
> **Note**:
>  Your algorithm should run in linear runtime complexity. Could you implement it using only constant extra space complexity?

******

**解法1**：

由等差数列求和可知，从$ 0 $到$ n $的自然数之和为$ {n(n+1)} \over 2 $. 我们求得给出数组的和，二者相减，就可得到缺失的那个数。

```C
int missingNumber(int* nums, int numsSize) {
    int sum_n=numsSize*(numsSize+1)/2,sum_nums=0;
    for(int i=0;i<numsSize;i++)
        sum_nums+=nums[i];
    return sum_n-sum_nums;
}
```

该方法有个缺点，就是当`numsSize`很大的时候，求出来的和可能会溢出。

**解法2**：

该方法用到了按位异或运算的几个性质：

1. 假设`a`与`b`均为整数，则`(a^b)^b=a`.

2. `0^a=a`.

考虑到一次遍历过程中，下标`i`的可能取值为$ 0 $到$ numsSize-1 $, 数组里`numsSize`个数的范围则是$ 0 $到$ numsSize $. 使用变量`res`来存放结果，如果让`res`每次都与`i`和`nums[i]`进行异或，则最终能够成对消去大部分的数，剩下来的结果则是我们真正要求的那个数。下面我们来探讨`res`的初值。

由于`i`始终小于`numsSize`, 因此如果将`res`初始化为`0`则会出错：正好缺失$ numsSize $时，遍历一次数组，异或完毕后所有的数全部成对消去，`res`必定为0. 因此我们需要将`res`初始化为$ numsSize $, 则不缺$ numsSize $时其他的数能够成对消去，结果为所缺的那个数；缺$ numsSize $时其他的数全部消去，剩下的就是$ numsSize $. 

代码如下：

```C
int missingNumber(int* nums, int numsSize) {
    int res=numsSize;
    for(int i=0;i<numsSize;i++){
        res^=i;
        res^=nums[i];
    }
    return res;
}
```

该解法能够避免解法1中潜在的溢出风险。
