title: Leetcode 204 Count Primes
date: 2015-12-03 13:55:36
categories: 编程
tags: [Leetcode,算法]
---
Leetcode 204 的题解

本题解法~~抄袭~~参考自 Leetcode 给出的提示
<!-- more -->
题目如下：

> Count the number of prime numbers less than a non-negative number, n.

******

1\. 最简单粗暴的解法就是从$ 1 $到$ n-1 $对每一个数都判断一次是否是质数：

```C++
bool isPrime(int n){
    if(n<=1)
        return false;
    for(int i=2;i<n;i++){
        if(n%i==0)
            return false;
    }
    return true;
}

int countPrimes(int n){
    int count=0;
    for(int i=1;i<n;i++){
        if(isPrime(i))
            count++;
    }
    return count;
}
```
这个解法中，`isPrime(n)`是$ O(n) $级别的时间复杂度，那么`countPrimes(n)`就是$ O(n^2) $级别。还有没有优化的余地呢？

2\. 我们来看看12因数分解的结果：

$ 2 \times 6 = 12 $
$ 3 \times 4 = 12 $
$ 4 \times 3 = 12 $
$ 6 \times 2 = 12 $

其中$ 4 \times 3 $和$ 6 \times 2 $都是多余的。一般地，对一个正整数$ n $来说，按照上面`isPrime`的思路判断，循环条件只需$ i \le \sqrt{n} $. 这是因为，如果$ n $能被$ p $整除，那么$ n = p \times q $且$ p \le q $ ($ p \ge q $的话对调$ p $, $ q $即可)，所以$ p \le \sqrt{n} $.

那么`isPrime`改成：

```C++
bool isPrime(int n){
    if(n<=1)
        return false;
    /*使用i*i<=n而不是i<=sqrt(n)是为了避免反复调用靡费时间的sqrt*/
    for(int i=2;i*i<=n;i++){
        if(n%i==0)
            return false;
    }
    return true;
}
```

现在`countPrimes`的时间复杂度已经优化到了$ O(n\sqrt{n}) $, 还有更好的方法吗？

3\. [埃拉托斯特尼筛法](https://zh.wikipedia.org/zh-cn/埃拉托斯特尼筛法)

![维基百科偷来的图](https://upload.wikimedia.org/wikipedia/commons/b/b9/Sieve_of_Eratosthenes_animation.gif)

其算法是，给出要筛数值的范围$ n $, 找出$ \sqrt{n} $以内的素数$ p_1, p_2,...,p_k $. 先用2去筛，即把2留下，把2的倍数剔除掉；再用下一个素数，也就是3筛，把3留下，把3的倍数剔除掉；接下去用下一个素数5筛，把5留下，把5的倍数剔除掉；不断重复下去。

于是我们可以抛弃第一步和第二步的思路，打一张从2到$ n $的表，使用筛法来统计质数的个数。

```C++
int countPrimes(int n){
   bool isPrime[n];
   for(int i = 2; i < n; i++){
      isPrime[i] = true;
   }
   for(int i = 2; i*i < n; i++){
      if (!isPrime[i])
        continue;
      for(int j = i * i; j < n; j += i){
         isPrime[j] = false;
      }
   }
   int count = 0;
   for (int i = 2; i < n; i++) {
      if (isPrime[i]) count++;
   }
   return count;
}
```

现在`countPrimes`的时间复杂度是$ O(n\log{\log{n}}) $, 并使用了$ O(n) $的额外空间.
