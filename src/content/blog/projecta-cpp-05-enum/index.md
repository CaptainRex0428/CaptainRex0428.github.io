---
title: "重启RestArt ProjectA｜05.enum枚举"
description: "一、什么是枚举我们都知道计算机并不能直接理解什么是游戏中的角色，更不可能知道角色身上佩戴者什么类型的武器，对于程序来说只知道数值，或者更激进一点，只知道0和1，那为了跟计算机合作开发游戏，我们就需要为…"
category: tools
tags: ['C++', 'ProjectA', '编程基础']
date: 2025-04-16
readTime: 4
heroImage: "./cover.webp"
published: true
---
## 一、什么是枚举

我们都知道计算机并不能直接理解什么是游戏中的角色，更不可能知道角色身上佩戴者什么类型的武器，对于程序来说只知道数值，或者更激进一点，只知道0和1，那为了跟计算机合作开发游戏，我们就需要为每一种类型的武器赋予一个对应的数值，就比如这样

```cpp
int weaponType = 2; 
switch(weaponType) 
{
    case 0: // 剑？
    case 1: // 弓？
    case 2: // 法杖？ 
}

```

可是，这样的代码有任何可读性吗？如果我在一个不起眼的地方声明weaponType = 6 那我还能知道这是个什么类型的武器吗？我这样做程序还能正常运行吗？一切都是不确定的。

所以正是为了应对这种情况，我们就需要enum（枚举）来帮助我们在代码中直接标示含义——给数字穿上马甲。理解这一点非常重要，为什么说是马甲——因为enum在计算机中存储的本质依然是数字，但是其可以显示为我们可以自定义的变量名。

```cpp
// 优雅代码：用枚举自解释
enum class SaveStatus 
{
    Success,   // 0 → 保存成功
    Failed,    // 1 → 保存失败  
    Corrupted  // 2 → 存档损坏
};

SaveStatus currentStatus = SaveStatus::Success;

```

这样是不是就简洁明了了？而且直接声明currentStatus = 100; 类似的语句会直接报错，编译不通过，这样就避免了让我们的程序看起来没有可读性。

## 二、枚举的高级定义

同时，枚举还有一个非常有意思的地方，你可以定义其以什么样的方式存储，以及可以定义每一个枚举所代表的值，甚至在循环语句中，enum是可以直接被循环的（这一点会在循环篇章中提及）

```cpp
enum class SaveStatus ：uint8_t // 声明枚举用uint8_t存储（8位存储的正整数）
{
    Success = 0,   // 0 → 保存成功
    Failed = 1,    // 1 → 保存失败  
    Corrupted = 2  // 2 → 存档损坏
};

```

这样的定义可以让我们的枚举值之间有一定的顺序，在使用的时候甚至可以直接转换为相应的变量进行使用

```cpp
SaveStatus currentStatus = SaveStatus::Success;
uint8_t currentStatusValue = (uint8_t)currentStatus; // 这个值就是0

```

## 三、枚举和二进制权限

我们再假想另一种情况，当程序打开一个文件的时候，我们可以以“只读”的模式打开，也可以以“只写”的模式打开，但是不是也可以以“读写”的方式打开呢？

所以“读”和“写”是不是就像两种权限，可以单独赋予，也可以同时赋予，那我们如何在enum中实现呢？难道要遍历三种可能？那如果是10种或者20种权限排列组合呢？（有的同学可能已经想到了我们说过的union，没错，union也是可以解决的，我们放在进阶部分去说）

这里我们使用Enum配合二进制来实现

```cpp
enum class FileState : uint8_t
{
    read  = 0b00000001,
    write = 0b00000010
}

```

这里的0b就是以二进制的方式来标识值，read的权限在第一位，write的权限在第二位，互不干扰。

而使用的时候，我们就可以利用二进制的计算来赋予权限（这里参考二进制计算一篇）

```cpp
FileState openFileState = FileState::read | FileState::write;

```

这样我们就将read和write权限同时赋予了openFileState

如果需要做逻辑判断，我们就可以使用下面的方法

```cpp
if (openFileState & FileState::read)
{
    // ......
}

```

到目前位置我们就知道了大部分情况下枚举的使用方式啦~

## 四、 为什么要用枚举？三大核心优势

1. 代码即文档：AttackType::Fire比2直观100倍

1. 编译器保护：避免手滑写错数字

1. 智能提示：IDE自动补全枚举值

## 五、 ️ 枚举的四种高级玩法

### Part1.游戏角色状态机（State Machine）

```cpp
enum class PlayerState 
{
    Idle,       // 待机
    Running,    // 奔跑
    Jumping,    // 跳跃
    Attacking,  // 攻击
    Dead        // 死亡
};

void updatePlayer(PlayerState state) 
{
    switch(state) {
        case PlayerState::Idle: playIdleAnim(); break;
        case PlayerState::Attacking: checkHitBox(); break;
        // ...其他状态处理
    }
}

```

### Part2.RPG游戏技能系统

```cpp
// 自定义枚举值方便网络同步
enum class SkillID : uint8_t 
{
    Fireball = 101,  // 火球术
    Heal     = 102,  // 治疗术
    Stealth  = 203   // 潜行术
};

struct SkillData {
    SkillID id;
    float cooldown;
    int manaCost;
};

```

### Part3.游戏控制器按键映射

```cpp
// 用枚举管理输入设备
enum class GamepadButton 
{
    A, B, X, Y,
    L1, R1,
    DpadUp, DpadDown
};

void handleInput(GamepadButton btn) 
{
    if(btn == GamepadButton::A) 
    {
        playerJump();
    }
}

```

### Part4.游戏成就系统

```cpp
// 位标志枚举（C++11）
enum class Achievement : unsigned int 
{
    None        = 0,
    FirstBlood  = 1 << 0, // 1
    SpeedRun    = 1 << 1, // 2 
    PerfectDodge= 1 << 2, // 4
    All         = ~0u
};

// 解锁成就
Achievement myAchieves = Achievement::FirstBlood | Achievement::SpeedRun;

```

### Part5.利用好enum和switch

switch中使用enum可以有效针对enum中的所有枚举设定其逻辑，代码更有可读性。

```cpp
const char* AchievementToString(Achievement a) 
{
    switch(a) 
    {
        case Achievement::FirstBlood: return "首杀";
        case Achievement::SpeedRun: return "速通";
        // ...其他成就
        default: return "未知";
    }
}

```

## 六、 新手避雷指南

### 错误1：跨枚举比较

```cpp
enum Weapons { Sword, Bow };
enum Armors { Leather, Plate };

if(Sword == Leather) 
{ // 编译器居然不报错！
    // 逻辑错误炸弹 
}

```

正确做法：使用enum class

```cpp
enum class Weapons { Sword, Bow };
enum class Armors { Leather, Plate };

if(Weapons::Sword == Armors::Leather) 
{ // ❌ 编译错误！
    // 安全第一！
}

```

### 错误2：忘记处理所有case

```cpp
switch(state) 
{
    case PlayerState::Idle: ... break;
    case PlayerState::Running: ... break;
    // 忘记处理其他状态 → 运行时崩溃 
}

```

正确做法：开启编译器警告

```cpp
// GCC/Clang编译选项
-Wswitch-enum // 强制处理所有枚举case

// MSVC编译选项
/W4

```

## 七、 游戏开发最佳实践

1. 命名规范：用EnumName::Value格式（如Color::Red）

1. 作用域控制：优先用enum class代替普通enum

1. 底层类型：网络同步时显式指定类型

```cpp
// 综合案例：游戏事件系统
enum class GameEvent 
{
    EnemySpawned,
    PlayerLevelUp,
    BossDefeated
};

void handleGameEvent(GameEvent event) 
{
    switch(event) {
        case GameEvent::EnemySpawned: 
            spawnEnemy();
            break;
        case GameEvent::PlayerLevelUp:
            playLevelUpEffect();
            break;
        case GameEvent::BossDefeated:
            triggerEnding();
            break;
    }
}

```

今天的知识点你都有Get到吗~

有没有什么疑问，我们在评论区见哦~

你们也可以告诉我有什么是你们想知道的

![](./image-1.jpg)

![](./image-2.jpg)
