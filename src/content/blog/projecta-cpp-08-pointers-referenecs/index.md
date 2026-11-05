---
title: "重启RestArt ProjectA｜08.Pointers & Referenecs"
description: "终于终于写到了这一章，开始有点C++该有的样子了。 大家如果能坚持到这里肯定也收获不少。 想起我三四年前我自己开始学习编程的时候，教程虽然多，但是想彻底搞懂教程中的内容还是要花很多时间去啃的，代码就是…"
category: tools
tags: ['C++', 'ProjectA', '编程基础']
date: 2025-04-18
readTime: 9
heroImage: "./cover.webp"
published: true
---
终于终于写到了这一章，开始有点C++该有的样子了。

大家如果能坚持到这里肯定也收获不少。

想起我三四年前我自己开始学习编程的时候，教程虽然多，但是想彻底搞懂教程中的内容还是要花很多时间去啃的，代码就是这样的，一开始看不懂，觉得是天书，但一旦当你看懂会有一种豁然开朗的感觉，这个过程很难熬，需要一些毅力，只要能熬过来，你的代码就算入门了，而且编程这件事情，其实是一通百通，尤其是像C++这些相对来说底层一些的语言。

当你学完C++，有一天再去看python或者C#，虽然你也会抓耳挠腮大概一两个星期，适应一下编程风格，但一旦你适应了新语言的编程风格，后面会学习的很快。包括有学生也想让我分享一下Processing之类的，还有OpenGL DX之类的，首先，这些个系列会有的，其次，先打好基础我们一步步来，当你通了C++的逻辑，Processiong的内容易如反掌，我们再补充一点数学以及图形学的知识，那OpenGL DX也都不在话下。

只要你每天花一点时间去学去思考，一年两年你会发现你和之前的你已经完全不在同一个知识Level了。所以呀~希望小伙伴们在学习编程的道路上可以坚持下去~

接下来我们言归正传，指针这一章才算是让大家真正接触到C++最有意思的东西了，但也是最磨人的东西。什么内存泄漏、指针空悬、野指针等等，这些独有的Bug都是在指针这一块引起的，但为什么不取消指针？因为指针正是C++的自由和魅力所在，指针可以直接访问内存，而不是单纯操作变量，这极大地方便了我们和操作系统之间的交互，同时对于性能要求极其高的游戏开发，有着得天独厚的优势。

## 一、Pointer（指针）

### Part1.什么是指针

要理解什么是指针先记住两个至关重要的特性

1.Pointer is an address of a value.（指针是值的地址）

2.Pointer is just an integer for all types.（所有类型的指针都只是整数类型）

指针的本质就是存储内存地址的变量（就像记录储物柜编号的纸条），而其最大的作用就是可以直接操作对应内存中的数据。

```cpp
// 示例：获取宝箱血量并修改
int treasureHP = 500; 
int* ptr = &treasureHP; // ptr存储treasureHP的地址

std::cout << "宝箱地址：" << ptr << std::endl; // 0x7ffee3d8
std::cout << "宝箱血量：" << *ptr << std::endl; // 500（解引用）

*ptr = 300; // 通过指针直接修改血量
std::cout << "新血量：" << treasureHP; // 输出300

```

### Part2.指针的核心操作

1）指针的声明和初始化

在任何一个类型的变量声明后加上* 我们就可以声明这个类型的指针

在任何一个类型的变量名前加上& 我们就可以获得指向这个变量存储地址的指针（一定要匹配类型！！）

```cpp
int enemyDamage = 50;
int* pDamage = &enemyDamage; // 必须匹配类型！

```

在这个案例中，enemyDamage就是一个整数变量，而pDamage就是整数指针，&enemeyDamage便是对enemyDamage这个变量的引用，返回的就是一个指针值，这个指针值就可以直接赋给pDamage进行使用

而当我们要使用指针的时候，直接对指针进行解引用就可以了，也就是在指针变量名之前加上*即可

```cpp
*pDamage = 100;

```

这里解引用就可以直接通过指针访问原始内存的地址，而不会重新生成一块内存来存储新内容

```cpp
int A = 100;
int B = A;
B = 50; // 这种情况下 A=100， B=50；

```

这种情况下B是A的复制，改变B并不能改变A

```cpp
int A = 100;
int * B = &A;
*B =50; // 这种情况下 A=50，*B=50， B是指向A内存地址的指针

```

这样的对比是不是更清楚，指针不会复制原来的值，而是存储下原来值的地址，等待对内存进行操作

2）指针运算

小伙伴们应该还记得我们在遍历数组的时候也可以使用指针，因为指针有自己的类型，所以程序可以理解数组指针和指针之间的跨度有多大，我们就可以利用这个特性来遍历数组。

```cpp
int enemies[3]{10, 20, 30};
int* p = enemies;

std::cout << *(p + 1); // 输出20（等效enemies[1]）
p++; // 指针移动到下一个敌人
std::cout << *p; // 输出20→30（注意位移后结果）

```

### Part3.void *特殊的指针

void大家应该不陌生，在函数返回值中，void代表不需要返回任何值

在指针的语境下，void指针可以指向任何类型的数据内存地址，但是因为其不知道存放的是什么类型的地址，所以不可以对其解引用。

如果要使用void指针，必须对其进行cast处理

> void指针在处理抽象对象时以及桥接时非常好用

```cpp
#include <iostream>

#define LOG(x) std::cout << x << std::endl

int main()
{

    void* ptr1 = nullptr;

    int i = 100;

    ptr1 = &i;
    int* ptr2 = &i;

    int * ptr3 = static_cast<int *>(ptr1);

    LOG(ptr1);
    LOG(ptr2);
    LOG(*ptr2);
    
    if(ptr3)
    {
        LOG(ptr3);
        LOG(*ptr3);
    }
    
    return 0;
}

```

> 图灵笔记1：void * 不能被解引用
图灵笔记2：The void keyword in C++ is used to indicate that a function does not return a value. It can also be used as a pointer type to indicate a generic pointer that can point to any type of data.
图灵笔记3：A void * pointer is a generic pointer that can point to any type of data. It is often used when the type of data being pointed to is not known at compile time. However, void * pointers cannot be deferenced, as the compiler does not know the size or type of the data being pointed to.

## 二、Reference（引用）

### Part1.什么是引用

引用是一个变量的“别名”，引用和指针指向同一个地址，节省资源

必须初始化、不可修改绑定对象！！

```cpp
int playerLevel = 5;
int& refLevel = playerLevel; // refLevel是playerLevel的别名

refLevel = 10; // 修改别名即修改原变量
std::cout << playerLevel << std::endl; // 输出10

```

### Part2.使用引用

(1) 函数参数传递（避免复制开销）

```cpp
// 用引用修改BOSS状态
void ApplyPoisonEffect(Boss& target) 
{ 
    target.health -= 50; // 直接修改原对象
}

Boss finalBoss(1000);
ApplyPoisonEffect(finalBoss); // 无需传指针，直接操作原BOSS

```

(2) 遍历容器别名（配合auto使用）

```cpp
int skillCooldowns[3]{5, 8, 12};
for (auto& cd : skillCooldowns) 
{ // cd是每个元素的引用
    cd *= 0.8; // 直接修改数组元素
}

```

这里的auto是C++11之后的新特性，至于auto到底要不要频繁使用，给大家推荐一篇文章，辩证看待auto

## 三、const声明的指针和const指针

（是的，这是一段绕口令~）

const声明的指针，指针不是const

const指针声明也不一定是const

that's it.

### 01.不同const修饰的指针

const修饰指针时根据位置不同会产生完全不同的保护效果：

| 类型 | 写法 | 保护对象 | 类比游戏场景 |
| --- | --- | --- | --- |
| 指向常量的指针 | const int* ptr | 数据不可变 | 只读的剧情对话脚本 |
| 指针常量（常量指针） | int* const ptr | 指针本身不可变 | 固定的NPC出生点坐标 |
| 双重锁定 | const int* const ptr | 数据和指针都不可变 | 不可修改的初始版本号 |

### 02.实战代码解析

1） 指向常量的指针（保护数据）

```cpp
// 场景：读取不可修改的玩家基础属性
const int* pBaseHP = &playerHP;

// 尝试修改数据 → 编译错误！
*pBaseHP = 200; // Error: read-only variable

// 允许切换指向其他常量
const int playerMP = 100;
pBaseHP = &playerMP; // 合法操作

```

应用：访问配置文件中只读的游戏参数

应用：获取其他系统的不可修改数据（如成就系统）

2.）指针常量（保护指针）

```cpp
// 场景：固定绑定某个BOSS的血量显示
int bossHP = 5000;
int* const pBossHP = &bossHP;

// 修改数据 → 允许
*pBossHP = 4000; 

// 尝试切换指向 → 编译错误！
int miniBossHP = 2000;
pBossHP = &miniBossHP; // Error: assignment of read-only variable

```

应用：持续追踪某个特定目标的属性（如主线任务BOSS）

应用：GUI界面固定显示某个角色的状态栏

3） 双重锁定（最强保护）

```cpp
// 场景：不可修改的引擎内置参数
const float* const PI_VALUE = &ENGINE_PI;

// 以下操作均非法：
*PI_VALUE = 3.15f;      // 修改数据 → Error
PI_VALUE = &otherValue; // 修改指针 → Error

```

应用：核心数学常数（π、重力加速度）

应用：版本号等元数据

### 关键总结

1. const在*左边 → 保护数据（只读模式）

1. const在*右边 → 保护指针（位置固定）

1. 双重const → 完全锁定（给变量焊死）

## 四、智能指针

### Part01.为什么需要智能指针

在游戏开发中，我们经常需要管理大量动态资源（角色、特效、音效等）。

传统裸指针容易出现以下问题：

| 问题类型 | 具体表现 | 游戏开发中的灾难场景 |
| --- | --- | --- |
| 内存泄漏 | 忘记delete | 玩家持续游戏后内存暴涨导致崩溃 |
| 野指针 | 访问已释放内存 | 读取到错误角色坐标引发瞬移BUG |
| 所有权混乱 | 多个指针操作同一对象 | 角色被重复释放导致存档损坏 |

智能指针通过自动化内存管理和明确所有权机制解决这些问题。

### Part02.三大智能指针核心特性

std::unique_ptr——唯一管家

1. 独占资源所有权（类似唯一传奇装备）

1. 不可复制，只能通过std::move转移所有权

1. 零额外开销，性能与裸指针几乎相同

```cpp
// 加载唯一BOSS模型
std::unique_ptr<MonsterModel> bossModel = 
    std::make_unique<MonsterModel>("Boss_Final.fbx");

// 转移模型所有权到渲染系统
RenderSystem::SubmitModel(std::move(bossModel)); 

```

生命周期

```cpp
void LoadWeapon() {
    auto weapon = std::make_unique<Weapon>("Sword_01");
    weapon->Attack(); // 有效操作
    
} // 离开作用域自动销毁武器

```

std::shared_ptr——共享管家

1. 通过引用计数实现共享所有权

1. 每复制一次引用计数+1，析构时-1

1. 计数归零时自动释放资源

```cpp
// 多个技能共享同一个音效资源
std::shared_ptr<SoundClip> fireSound = 
    std::make_shared<SoundClip>("FireExplosion.wav");

SkillSystem::PlaySound(fireSound);  // 引用计数+1=2
UISystem::PlaySound(fireSound);     // 引用计数+1=3

```

生命周期

```cpp
auto pNPC = std::make_shared<NPC>("Merchant"); // 计数=1

{
    auto pQuestNPC = pNPC; // 计数=2
    pQuestNPC->StartDialog();
    
} // 离开作用域计数=1

pNPC->MoveToMarket(); // 计数仍为1

// 当最后一个shared_ptr销毁时NPC自动消失

```

std::weak_ptr——观察者管家

1. 不增加引用计数

1. 需要时可通过lock()升级为shared_ptr

1. 解决循环引用问题

```cpp
class GameLevel {
    std::weak_ptr<Player> mObservedPlayer; // 观察玩家但不拥有

    void Update() 
   {
        if(auto player = mObservedPlayer.lock()) 
        {
            // 安全使用玩家数据
        }
    }
};

```

生命周期

```cpp
class Hero {
    std::shared_ptr<Pet> mPet; 
};

class Pet {
    std::weak_ptr<Hero> mOwner; // 关键点！
};

// 使用weak_ptr后，Hero和Pet能正确释放

```

### Part03.智能指针的使用法则

01.优先使用make_shared/make_unique

02.类型转换必须显式

03.跨系统传递使用明确语义

04.性能敏感区慎用shared_ptr

### 智能指针在游戏引擎中的典型应用案例

| 智能指针类型 | 使用场景 | 典型案例 |
| --- | --- | --- |
| unique_ptr | 独占资源管理 | 物理碰撞体、渲染上下文 |
| shared_ptr | 共享资源池 | 材质、音效、动画蒙皮数据 |
| weak_ptr | 缓存系统 | 最近使用的地形区块、过场动画控制器 |

## 五、避坑指南：指针的陷阱

### 01.野指针（指向已释放内存）

```cpp
int* pDead;
{
    int localVar = 42;
    pDead = &localVar; // localVar已销毁
}
std::cout << *pDead; // 崩溃！

```

### 02.引用未初始化

```cpp
int& ref; // 编译错误！引用必须绑定对象

```

### 03.混淆指针和引用

```cpp
int a = 5, b = 10;
int* p = &a;
p = &b; // 合法（指针可改指向）
int& r = a;
r = b;  // 实际是 a = b，不是改引用目标

```

## 六、推荐阅读

关于指针这一篇的内容只是冰山一角，还有很多内容可以探索

有时间和精力的话可以看看《C和指针》和《More Effective C++》，其中有很多关于指针的经典案例，以及在性能上优化的案例

在对性能和内存有要求的时候，一定要记得，好好管理指针~

今天的知识点你都有Get到吗~

有没有什么疑问，我们在评论区见哦~

你们也可以告诉我有什么是你们想知道的

![](./image-1.jpg)

![](./image-2.jpg)
