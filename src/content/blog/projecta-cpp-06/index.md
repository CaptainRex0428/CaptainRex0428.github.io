---
title: "重启RestArt ProjectA｜06.循环"
description: "一、为什么需要循环我们假设在一个FPS游戏中，你像敌方扔出一颗手雷，手雷爆照造成了群体伤害，现在我们要在代码中为这些受到伤害的敌方扣除血量，如果是我们手动一个一个删除血量 EnemyA.blood -…"
category: tools
tags: ['C++', 'ProjectA', '编程基础']
date: 2025-04-17
readTime: 4
heroImage: "./image-1.jpg"
published: true
---
## 一、为什么需要循环

我们假设在一个FPS游戏中，你像敌方扔出一颗手雷，手雷爆照造成了群体伤害，现在我们要在代码中为这些受到伤害的敌方扣除血量，如果是我们手动一个一个删除血量

```cpp
EnemyA.blood -= 10;
EnemyB.blood -= 10;
EnemyC.blood -= 10;
EnemyD.blood -= 10;
......

```

这样做有问题吗？

1. 如果有成百上前的敌人怎么办？

1. 受到手雷伤害的敌人并不是固定的，这要取决于他们的位置，甚至更精细的判断会考虑手雷爆炸的距离，那我们如何确定谁应该扣血，谁不应该呢？

这时候就需要我们使用循环——重复批量执行特定操作

循环（Loop）的威力——用简洁的代码让计算机自动处理重复任务

## 二、三大循环

### Part1.for loop

适用场景：明确知道要循环多少次（如遍历数组、固定次数操作）

语法结构：

```cpp
for (初始化; 循环条件; 每次循环后操作) 
{ 
    // 循环体 
}

```

案例：批量攻击敌人

```cpp
// 假设 enemies 是存储敌人对象的数组
for (int i = 0; i < 100; ++i) 
{
    enemies[i].TakeDamage(10); // 每个敌人扣10血
    PlayHitEffect(enemies[i].position); // 播放受击特效
}

```

这里enemies 是存储敌人对象的数组，涉及到两个知识点，其一是数组（可以参考我在数组中的内容），其二是对象，即一个类（可以参考我在class类中的内容），其中包含了一个敌人常用的方法，在这里调用了其中TakeDamage的方法，这个方法中可以包含受击后敌人应该实现的操作。

特殊用法（&gt; C++11）：foreach loop

```cpp
// 遍历背包所有物品
for (const auto& item : playerBackpack) 
{
    if (item.durability <= 0) 
   {
        item.Break(); // 耐久度为0时破坏物品
    }
}

```

在C++11之后，我们的for loop有了新特性，就是foreach loop，这里的语义理解起来也更简单，const auto& item定义了每一次从数字中按顺序取出来的元素的变量名，可以在循环内容反复使用。

这里有一个特殊的就是auto，auto是C++中的一个通用变量，在可以识别的情况下，会自动转换为其返回类型。（但是不建议频繁使用auto，过多auto会导致代码的可读性降低）

这里还有一个需要关注的地方，我们使用的是引用获取，使用了符号&，不是复制获取，这样不仅能保证取出来的值地址没有发生变化，还能在const的前提下最大可能保护值本身不被篡改

### Part2.while 循环

适用场景：不确定循环次数，但先检查条件（如等待玩家输入）

语法结构：

```cpp
while (条件表达式) 
{ 
    // 循环体 
}

```

案例：等待玩家按下开始键

```cpp
bool isGameStarted = false;

while (!isGameStarted) 
{
    // 持续检测输入
    if (CheckKeyPress(KEY_ENTER)) 
   {
        isGameStarted = true;
        PlayStartSound();
    }

    RenderLoadingScreen(); // 显示加载界面
}

```

while循环是游戏中最常见的循环，从整体框架上看，循环一次，游戏就更新一帧，这一帧包括了处理输入、更新组件以及渲染组件三个大板块的内容，每个板块又可以分为若干小事件，整个游戏在一帧一帧的更新中就运行了起来。

这样我们就理解了经常提到游戏性能所说的帧率到底是什么了，while循环一次为一帧，每一秒钟可以循环的次数就是帧率了，所以提升游戏性能我们最简单的理解就是降低while循环内程序和算法的复杂程度。（说起来容易，接触起来确实是有各种内容需要去学）

### Part3.do-while循环：先执行再检查

适用场景：至少执行一次，再根据条件决定是否继续

语法结构：

```cpp
do 
{ 
    // 循环体 
}
while (条件表达式);

```

案例：角色升级动画

```cpp
int levelUpCount = 3; // 连升3级

do 
{
    PlayLevelUpAnimation(); // 必须至少播放一次
    ShowSparklesEffect();
    levelUpCount--;
} 
while (levelUpCount > 0); // 直到升级次数用完

```

### Part4.循环间的核心差异

| 特性 | for循环 | while循环 | do-while循环 |
| --- | --- | --- | --- |
| 执行顺序 | 先检查条件，再执行 | 先检查条件，再执行 | 先执行，再检查条件 |
| 适用场景 | 已知循环次数 | 未知次数但需前置条件检查 | 必须至少执行一次 |
| 代码可读性 | 循环变量控制集中，结构清晰 | 适合复杂条件 | 明确表达「先做后判」逻辑 |
| 典型游戏应用 | 遍历数组/集合 | 游戏主循环、输入监听 | 技能连击计数、重试机制 |

### Part5.enum和循环的妙用

关于enum的基础可以看这一篇

enum其实也可以参与循环，甚至可以定义循环次数

我们假设一个场景：玩家有4种基础属性（力量、敏捷、智力、耐力），需要批量初始化属性值。

```cpp
// 定义属性类型（本质是整数）
enum class AttributeType : int 
{
    Strength = 0,  // 力量
    Agility,       // 敏捷（自动=1）
    Intelligence,  // 智力（自动=2）
    Stamina,       // 耐力（自动=3）
    Count          // 总数量（Count = 4）
};

// 遍历所有属性类型初始化
for (int i = 0; i < static_cast<int>(AttributeType::Count); ++i) 
{
    auto type = static_cast<AttributeType>(i);
    player.SetAttribute(type, 10); // 初始值设为10
    PlayAttributeGlowEffect(type); // 播放属性激活特效
}

```

- 通过添加Count成员自动统计枚举项数量

- 用static_cast安全转换类型（避免直接强转）

- 确保枚举值连续且从0开始（否则需要额外处理）

## 三、循环常见误区

### 无限循环：忘记更新条件变量

```cpp
int count = 5;
while (count > 0) 
{ 
    // 忘记写 count-- 
    ShootArrow(); // 会无限射箭！
}

```

### 范围for循环中修改容器

```cpp
for (auto& enemy : enemies) 
{
    if (enemy.IsDead()) 
    {
        enemies.erase(&enemy); // 危险！可能导致迭代器失效
    }
}

```

### do-while滥用

```cpp
do 
{
    SaveGame(); // 存档操作本不需要强制执行一次
} while (false); // 多此一举！

```

今天的知识点你都有Get到吗~

有没有什么疑问，我们在评论区见哦~

你们也可以告诉我有什么是你们想知道的

![](./image-1.jpg)

![](./image-2.jpg)
