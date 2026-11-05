---
title: "重启RestArt ProjectA｜18.Virtual Destructor"
description: "虚析构函数（Virtual Destructor）似乎是一个很容易被遗漏，但却又非常重要的习惯。 我们已经知道析构函数是在类被回收的时候调用的，用来清理类中所占用的内存。 [文章: 图灵重启RestA…"
category: tools
tags: ['C++', 'ProjectA', '编程基础']
date: 2025-05-28
readTime: 2
heroImage: "./cover.webp"
published: true
---
虚析构函数（Virtual Destructor）似乎是一个很容易被遗漏，但却又非常重要的习惯。

我们已经知道析构函数是在类被回收的时候调用的，用来清理类中所占用的内存。

那我们给析构函数加一个Virtual意味着什么呢？

这可以确保第一，多态删除时子类的清理工作不被漏掉（一个很形象的比喻，就像拆房子时，不仅要拆主楼，还要记得拆地下室和阁楼）

第二，在父级释义下的子集声明中，调用可能的子集的析构函数（这一点更加重要）

## 一、经典翻车案例

```cpp
class Character {
public:
    ~Character() {  // ❌ 普通析构函数
        cout << "销毁角色基体" << endl;
    }
};

class Warrior : public Character {
public:
    ~Warrior() { 
        cout << "销毁战士的盔甲和武器" << endl; 
    }
};

// 使用场景
Character* player = new Warrior();
delete player;  // 只输出"销毁角色基体"！武器盔甲泄露！

```

在案例中，声明了一个角色类和一个战士类，战士类继承了角色类

接下来在声明战士new Warrior()的时候，我们使用其父类(Character)来进行释义，到这里代码都没有问题，且能良好运行。

但当我们主动析构堆中的内存时，却只运行了父类(Character)的析构函数，却没有运行子类(Warrior)的析构函数，导致子类(Warrior)中需要被析构的内存悬置了

如果一个项目中大量存在类似的问题就会让整个系统的内存失去管理，最后导致崩溃

对于这个问题最好的解决办法就是给基类析构函数加virtual关键字（当然，为了方便协同开发，建议在写析构的时候习惯性加上virtual关键字）

```cpp
class Character {
public:
    virtual ~Character() { 
        cout << "销毁角色基体" << endl;
    }
};

Character* player = new Warrior();
delete player;  

/* 输出：
销毁战士的盔甲和武器  
销毁角色基体
*/

```

## 二、一些示例

这里针对于虚析构函数我们再举一些综合的例子

```cpp
#include <iostream>

class BaseA{
public:
    BaseA(){std::cout << "BaseA Constructed" << std::endl;}
    ~BaseA(){std::cout << "BaseA Deconstructed" << std::endl;}
};

class ChildA : public BaseA{
public:
    ChildA(){std::cout << "ChildA Constructed" << std::endl;}
    ~ChildA(){std::cout << "ChildA Deconstructed" << std::endl;}
};

class BaseB{
public:
    BaseB(){std::cout << "BaseB Constructed" << std::endl;}
    virtual ~BaseB(){std::cout << "BaseB Deconstructed" << std::endl;}
};

class ChildB : public BaseB{
public:
    ChildB(){std::cout << "ChildB Constructed" << std::endl;}
    ~ChildB(){std::cout << "ChildB Deconstructed" << std::endl;}
};

int main()
{
    std::cout << "BaseA--------------------------------------" << std::endl;

    BaseA * basementA = new BaseA();
    delete basementA;

    std::cout << "ChiA---------------------------------------" << std::endl;

    ChildA * childA = new ChildA();
    delete childA;

    std::cout << "ChiA As BaseA------------------------------" << std::endl;

    BaseA * childAASBaseA = new ChildA();
    delete childAASBaseA;

    std::cout << "BaseB--------------------------------------" << std::endl;

    BaseB * basementB = new BaseB();
    delete basementB;

    std::cout << "ChiB---------------------------------------" << std::endl;

    ChildB * childB = new ChildB();
    delete childB;

    std::cout << "ChiB As BaseB------------------------------" << std::endl;

    BaseB * childBASBaseB = new ChildB();
    delete childBASBaseB;
}

/* 输出
BaseA--------------------------------------
BaseA Constructed
BaseA Deconstructed
ChiA---------------------------------------
BaseA Constructed
ChildA Constructed
ChildA Deconstructed
BaseA Deconstructed
ChiA As BaseA------------------------------
BaseA Constructed
ChildA Constructed
BaseA Deconstructed
BaseB--------------------------------------
BaseB Constructed
BaseB Deconstructed
ChiB---------------------------------------
BaseB Constructed
ChildB Constructed
ChildB Deconstructed
BaseB Deconstructed
ChiB As BaseB------------------------------
BaseB Constructed
ChildB Constructed
ChildB Deconstructed
BaseB Deconstructed
*/

```

在案例中我们对比了两个不同基类的函数所释义的子类在析构时的情况

能很明显地发现ChildA As BaseA的情况下因为没有析构函数，导致ChildA子类被“遗忘”了，而相反的是，ChildB As BaseB的情况下，即使是使用BaseB进行的释义，但是依然可以调用子类ChildB的析构函数

## 三、 三大注意点

### 注意点1：父类有虚函数必须虚析构

```cpp
class GameObject {
public:
    virtual void Update() = 0;  // 有虚函数
    virtual ~GameObject() {}    // 必须配套虚析构！
};

```

### 注意点2：多态删除必用虚析构

```cpp
// 错误写法：内存泄漏
class Base {};                // 无虚析构
class Derived : public Base {  // 有资源需要释放
    int* data = new int[100];
    ~Derived() { delete[] data; }
};

Base* obj = new Derived();
delete obj;  // 只调用Base析构，Derived的data数组泄露！

```

### 注意点3：STL容器存储多态对象要当心

```cpp
// 危险操作：
vector<Enemy*> enemies { new Dragon(), new Goblin() };
enemies.clear();  // ❌ 需要先手动delete所有元素！

// 正确操作：
for(auto e : enemies) delete e;  // 确保调用正确析构
enemies.clear();

```

注意点3最为重要，当我们使用数字或者其他一些容器并在其中实例化类指针的时候，一定要注意主动析构，否则内存就会被泄漏，最终会导致崩溃

今天的知识点你都有Get到吗~

有没有什么疑问，我们在评论区见哦~

你们也可以告诉我有什么是你们想知道的

![](./image-1.jpg)

![](./image-2.jpg)
