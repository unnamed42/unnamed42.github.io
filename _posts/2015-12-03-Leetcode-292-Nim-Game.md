title: Leetcode 292 Nim Game
date: 2015-12-03 13:28:56
categories: 编程
tags: [Leetcode,算法]
---
Leetcode 292 的题解，想当年我还是too young too simple连这样的题都要看讨论区才做得出来
<!-- more -->
题目如下：
> You are playing the following Nim Game with your friend: There is a heap of stones on the table, each time one of you take turns to remove 1 to 3 stones. The one who removes the last stone will be the winner. You will take the first turn to remove the stones.
>
> Both of you are very clever and have optimal strategies for the game. Write a function to determine whether you can win the game given the number of stones in the heap.
>
> For example, if there are 4 stones in the heap, then you will never win the game: no matter 1, 2, or 3 stones you remove, the last stone will always be removed by your friend.

******

题目的条件是我是先手。那么，当石头堆只有四颗石头的时候我必输，因为无论我怎么拿石头总有剩下的，且剩余数目小于三，被对方一次性取完，输掉游戏。

现在假设石头的数目是$ 4k + i, k \in \mathbb N, 1 \le i \le 3 $，在刚开始的时候我拿走$ i $个，此后无论对方怎么取，轮到我的时候保证我取走的数目满足我们两个人在这一轮取走的石头数为4. 这样，在最后还剩下4个石头的时候能够保证我取完剩下的全部，赢得游戏。

那么当有$ 4k $个石头的时候，对方可以采取上面的策略，保证两个人一轮取走4个石头，最后剩下的石头可被他取完，从而他获胜。

因此，给定石头数目n, 判断是否胜利的程序如下：

```C++
bool canWinNim(int n){
    return n%4!=0;
}
```
