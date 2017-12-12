title: Leetcode 8 String to Integer(atoi)
date: 2015-12-06 00:09:09
categories: 编程
tags: [Leetcode,算法]
---
一个不难但是坑的题的题解——《论健壮性》
<!-- more -->

题目如下：

> Implement atoi to convert a string to an integer.
>
> **Hint**: Carefully consider all possible input cases. If you want a challenge, please do not see below and ask yourself what are the possible input cases.
>
> **Notes**: It is intended for this problem to be specified vaguely (ie, no given input specs). You are responsible to gather all the input requirements up front.

******

本题让我们实现标准库`stdlib.h`里的`atoi`函数。

收录这个题的解法并不是因为它有多么难，而是给大家展示一下要满足算法健壮性是多么地不容易。

首先，由于我以前写过一个简单版本的`atoi`, 因此第一版轻车熟路地就出来了：

```C
int myAtoi(const char* str) {
    int sign=1,l=strlen(str),res=0;    //使用l记录长度然后用 i<l 能够比使用 s[i]!='\0' 要快
    int i=0;
    if(str[0]=='-')
        sign=-1,i=1;
    for(;i<l;i++){
        if('0'<=str[i]&&str[i]<='9'){
            res*=10;
            res+=str[i]-'0';
        }
        else
            break;
    }
    return sign*res;
}
```
在这个版本里，考虑了各种因素：首位的符号可能是数字也可能是负号；`str`字符串里一些可能的乱七八糟非数字的字符，这种情况下我们只处理前面合法的数字部分。我信心满满地提交了，然后它告诉我：

`myAtoi("+1")==1`

…于是修改成了这个版本：

```C
int myAtoi(const char* str) {
    int sign=1,l=strlen(str),res=0;
    int i=0;
    switch(str[0]){
        case '-':sign=-1;
        case '+':i=1;break;    //无论str[0]是'+'还是'-' i都是1,就让case穿透吧，我少写一句
        default:break;
    }
    for(;i<l;i++){
        if('0'<=str[i]&&str[i]<='9'){
            res*=10;
            res+=str[i]-'0';
        }
        else
            break;
    }
    return sign*res;
}
```
然后它告诉我：

`myAtoi("      123")==123`

我之后做了个测试，发现数字之后的空格视为非法字符，比如`myAtoi(" 1 2 3 ")==1`.
……于是修改成了这个版本：
```C
int myAtoi(const char* str) {
    int sign=1,l=strlen(str),res=0;
    int i=0;
    switch(str[0]){
        case '-':sign=-1;
        case '+':i=1;break;
        case ' ':
            for(i=0;i<l-1;i++){
                if(str[i+1]!=' ')
                    return myAtoi(str+i+1);    //跳过开头所有的空格，然后递归处理
            }
        default:break;
    }
    for(;i<l;i++){
        if('0'<=str[i]&&str[i]<='9'){
            res*=10;
            res+=str[i]-'0';
        }
        else
            break;
    }
    return sign*res;
}
```

然后它告诉我：

`myAtoi("2147483648")==2147483647`

也就是说，如果正数溢出返回`INT_MAX`; 负数溢出返回`INT_MIN`. 

………于是改成了下面这个最终版本：
```C
int myAtoi(const char* str) {
    int sign=1,l=strlen(str),res=0;
    int i=0;
    switch(str[0]){
        case '-':sign=-1;
        case '+':i=1;break;
        case ' ':
            for(i=0;i<l-1;i++){
                if(str[i+1]!=' ')
                    return myAtoi(str+i+1);
            }
        default:break;
    }
    for(;i<l;i++){
        if('0'<=str[i]&&str[i]<='9'){
            /* In case that res*=10 overflows */
            if(res>INT_MAX/10&&res>0)
                return sign==1?INT_MAX:INT_MIN;
            else
                res*=10;
            /* In case that res+=str[i]-'0' overflows */
            int digit=str[i]-'0';//避免反复计算str[i]-'0'
            if(res>INT_MAX-digit&&res>0)
                return sign==1?INT_MAX:INT_MIN;
            else
                res+=digit;
        }
        else
            break;
    }
    return sign*res;
}
```

然后，提交，判断——终于通过了，不容易啊。
