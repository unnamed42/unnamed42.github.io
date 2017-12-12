title: Leetcode 26 Remove Duplicates from Sorted Array
date: 2015-12-05 23:28:29
categories: 编程
tags: [Leetcode,算法]
---
Leetcode 26 的题解
<!-- more -->
题目如下：

> Given a sorted array, remove the duplicates in place such that each element appear only once and return the new length.
>
> Do not allocate extra space for another array, you must do this in place with constant memory.
>
> For example,
> Given input array `nums = [1,1,2]`,
>
> Your function should return `length = 2`, with the first two elements of nums being 1 and 2 respectively. It doesn't matter what you leave beyond the new length.

******

最直接的做法是（如果能忽略掉不允许额外空间的题目要求的话）将每个独一无二的元素放入新数组中，然后将这些元素放回：
```C
int removeDuplicates(int* nums, int numsSize) {
    if(numsSize<=1)
        return numsSize;
    int unique[numsSize];
    unique[0]=nums[0];
    int index=1;    //表示下标，但同时我们也发现它表示unique数组的有效长度
    for(int i=0;i<numsSize;i++){
        if(nums[index]==nums[i])
            contiune;
        unique[index++]=nums[i];
    }
    for(int i=0;i<index;i++)
        nums[i]=unique[i];
    return index;
}
```
虽然这是个时间$O(n)$的算法，但我们同时也用了$O(n)$的空间。能不能不使用额外空间？

考虑到独一无二的元素个数总是不多于总元素个数，因此我们在`nums`里循环遍历的时候，把`nums`的前半部分当做这里的`unique`数组是可行的。修改如下：
```C
int removeDuplicates(int* nums, int numsSize) {
    if(numsSize <= 1)
        return numsSize;
    int index = 0;              //表示下标，但同时也表示有效长度
    int temp = nums[0] - 1;     //为保证nums[0]不被跳过处理
    for(int i = 0; i < numsSize ; i++){
        if(temp == nums[i]){
            continue;
        }
        temp = nums[i];
        nums[index++] = nums[i];
    }
    return index;
}
```
于是，我们满足了题目的要求，未使用额外空间。
