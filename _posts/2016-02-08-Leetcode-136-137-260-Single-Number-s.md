title: 'Leetcode 136, 137, 260 "Single Number"-s'
comments: true
toc: true
date: 2016-02-08 21:44:43
categories: 编程
tags: [Leetcode,算法]
---
LeetCode 136, 137, 260 的题解

UPDATE 2016/06/23: 我数电修炼有成，回来改了我原先写的自己都看不懂的解答。
<!-- more -->

## Leetcode 136 Single Number

> Given an array of integers, every element appears twice except for one. Find that single one.
>
> **Note**:
> Your algorithm should have a linear runtime complexity. Could you implement it without using extra memory?

由于大多数的数都出现了两次，我们希望将这些数都成对消去。此时就会想到异或运算的两条性质：

1. `(a^b)^b=a`.

2. `0^a=a`.

使用异或，所有重复的数都能成对消去，因此解法如下：

```C
int singleNumber(int* nums, int numsSize) {
    int res=0;
    for(int i=0;i<numsSize;i++)
        res^=nums[i];
    return res;
}
```

该解法实质是要寻找这样的一个二元运算$\oplus$, 使得：

1. $ (a \oplus b) \oplus b = a $ .

2. $ \exists X \forall a, X \oplus a = a $ .

正好异或运算就满足这样的性质，其中X=0. 

## Leetcode 137 Single Number II

> Given an array of integers, every element appears *three* times except for one. Find that single one.
>
> **Note**:
> Your algorithm should have a linear runtime complexity. Could you implement it without using extra memory?

### 解法1

参照I的思路，我们需要寻找一个二元运算$\oplus$, 使得：

1. $ ((a \oplus b) \oplus b) \oplus b = a $.

2. $ \exists X \forall a, X \oplus a = a $.

三进制的不进位加法可满足这些要求，其中X=0. 现在使用二进制来模拟一位的这种三进制加法。模拟一个三进制位需要三个状态，至少需要两个二进制位，而两个二进制位能表示00, 01, 10, 11四个状态。我们舍去状态11, 在三进制下不断加一应该出现如下循环：`00->01->10->00->...`。记输入为$D$，原状态的两个位分别为$A_n$（高位）和$B_n$（低位），将其列出真值表如下：

|$D$|$A_n$|$B_n$|$A_{n+1}$|$B_{n+1}$|
|:------:|:-------:|:---------:|:-------:|:---------:|
|0|0|0|0|0|
|0|0|1|0|1|
|0|1|0|1|0|
|0|1|1|X|X|
|1|0|0|0|1|
|1|0|1|1|0|
|1|1|0|0|0|
|1|1|1|X|X|

其中`X`表示输入出现了不应出现的状态，可作为无关项用于化简。根据真值表使用卡诺图大法化简得到逻辑表达式如下：

* $A_{n+1} = D B_n + \overline{D} A_n$

* $B_{n+1} = D \overline{A_n} \overline{B_n} + \overline{D} B_n$

此即为所求的运算。放在题中的`int`上，一个数的各位计算所得$A_n B_n$与其他位的值无关，只与$A_n B_n$原状态和对应位的值有关。因此我们直接用两个`int`数`a`, `b`来保存$A_n B_n$, `a`, `b` 的第i位分别表示将给定数的第i位作为$D$输入后$A_n B_n$的计算结果。回到题目中来，出现三次的数会使$A_n B_n$进行一个周期，因此这些数对$A_n B_n$的值没有任何影响；对于只出现一次的那个数，在$A_n B_n$初始值为00的情况下，一次操作后只有$B_n$由0变到1, 换句话说此时`b`每个位的内容和要找的数每个位的内容相同，即`b`为所求。

写成代码就是：
```C
int singleNumber(int* nums, int numsSize) {
    int a=0,b=0;
    for(int i = 0; i < numsSize; ++i){
        int tmp=a;
        a=(nums[i]&a)|((~nums[i])&a);
        b=(nums[i]&(~tmp)&~b)|((~nums[i])&b);
    }
    return b;
}

```

简直丑出新高度……卡诺图化简能达到与或的最简表达，但对要到达形式最简没有任何帮助。

下面是来自[Leetcode讨论区](https://leetcode.com/discuss/6632/challenge-me-thx)的仙法，一看到就给人一种美的享受，一种视觉上的冲击。

```C
int singleNumber(int* nums,int numsSize) {
    int ones = 0, twos = 0;
    for(int i = 0; i < numsSize; i++){
        ones = (ones ^ nums[i]) & ~twos;
        twos = (twos ^ nums[i]) & ~ones;
    }
    return ones;
}
```

下面按照我上面的思路瞎扯一二：上面我的丑极的代码选择忽略状态11，选择循环`00->01->10->00->...`。在此我们照样忽略11，但选择的循环是`00->10->01->00->...`，列出真值表如下：

|$D$|$A_n$|$B_n$|$A_{n+1}$|$B_{n+1}$|
|:------:|:-------:|:---------:|:-------:|:---------:|
|0|0|0|0|0|
|0|0|1|0|1|
|0|1|0|1|0|
|0|1|1|X|X|
|1|0|0|1|0|
|1|0|1|0|0|
|1|1|0|0|1|
|1|1|1|X|X|

得到逻辑表达式：

* $ A_{n+1} = D \overline{A_n} \overline{B_n} + \overline{D} A_n \overline{B_n} = (D \overline{A_n} + \overline{D} A_n) \overline{B_n} = (D \oplus A_n) \overline{B_n} $

* $ B_{n+1} = \overline{D} \overline{A_n} B_n + D A_n \overline{B_n} = \ldots = (D \oplus B\_n) \overline{ A_{n+1} }  $

其中$B_{n+1}$的逻辑式我只能验证而不是化简到对应结果，这里面一定隐藏了什么我不知道的变换方法。

由于从状态00到状态10变换的是$A_n$, 因此我们应该返回的值是`a`, 在上面的代码里就是`ones`.

### 解法2

该解法来自于这篇[帖子](http://www.1point3acres.com/bbs/forum.php?mod=viewthread&tid=111563&page=1#pid1954331)。

我们可以统计所有第`i`位是`1`的数（二进制表示）的个数，该结果对3求余结果只可能是0和1(重复三次的数对应`i`位上的`1`的个数一定是三的倍数。如果单次出现的数第`i`位上是`0`, 取余会得到0; 如果单次出现的数第`i`位上是`1`, 那么结果是三的倍数+1, 取余结果为1), 正好就是要求的数二进制表示的第`i`位。把数的`sizeof(int)*8`位都如此处理，然后将结果按顺序组合起来就能得到要求的数。

```C
#define K 3

int singleNumber(int* nums,int numsSize) {
    int len = sizeof(int) * 8 , res = 0;
    for (int i = 0; i < len; i++) {
        int sum = 0;
        for (int j = 0; j < numsSize; j++) 
            sum += (nums[j] >> i) & 0x01;
        res += (sum % K) << i;
    }
    return res;
}
```

在本题中`K`为3(大部分数出现三次), 如果题目变动的话可以据此修改`K`值而不用更改其他。

## Leetcode 260 Single Number III

> Given an array of numbers `nums`, in which exactly two elements appear only once and all the other elements appear exactly twice. Find the two elements that appear only once.
>
> For example:
>
> Given `nums = [1, 2, 1, 3, 2, 5]`, return `[3, 5]`.
>
> **Note**:
> 1. The order of the result is not important. So in the above example, `[5, 3]` is also correct.
> 2. Your algorithm should run in linear runtime complexity. Could you implement it using only constant space complexity?

使用I的思路，一遍异或下来我们能够得到`A^B`(记为`bit`). 因此下面要做的就是把`A`和`B`使用某种方法区分出来（`A`, `B`为我们要求的两个数）。

由于`A`与`B`是不同的数，因此`bit`里面至少有一位二进制位是`1`. 我们使用小技巧`bit&(~(bit-1))`(或`bit&(-bit)`)来将它的最低位的`1`取出来，从而将整组数分成两组，`A`,`B`肯定在不同的组里面，这样就变成了我们在[Single Number](#leetcode-136-single-number)里面解决过的问题了。

代码如下：

```C++
class Solution {
public:
    vector<int> singleNumber(vector<int>& nums) {
        vector<int> result(2,0);
        int bit=0;
        for(auto num:nums)
            bit^=num;
        int lowest=bit&(~(bit-1));
        for(auto num:nums){
            if((lowest&num)==0)
                result[0]^=nums[i];
            else
                result[1]^=nums[i];
        }
        return result;
    }
};
```

其极简版：

```C++
class Solution {
public:
    vector<int> singleNumber(vector<int>& nums) {
        int bit=0;
        for(auto num:nums)
            bit^=num;
        bit&=(~(bit-1));
        vector<int> result(2,0);
        for(auto num:nums)
            result[!(num&bit)]^=num;
        return result;
    }
};
```
