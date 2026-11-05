---
title: "重启RestArt ProjectA｜04.条件判断"
description: "一、什么是条件判断想象你在玩一个探索游戏，你可以搜索宝箱，可以攻击敌人，也可以使用道具。 但是我们会碰见一个问题，我如何通过代码确定我的状态呢？以及我触发了相应的状态我应该如何去做？ 这个时候我们就需…"
category: tools
tags: ['C++', 'ProjectA', '编程基础']
date: 2025-04-14
readTime: 5
heroImage: "./image-1.jpg"
published: true
---
## 一、什么是条件判断

想象你在玩一个探索游戏，你可以搜索宝箱，可以攻击敌人，也可以使用道具。

但是我们会碰见一个问题，我如何通过代码确定我的状态呢？以及我触发了相应的状态我应该如何去做？

这个时候我们就需要对角色的状态进行判断。（我们用伪代码先做个演示）

```cpp
if (遇到宝箱) 
{
    打开宝箱();
} 
else if (遇到敌人) 
{
    发起战斗();
} 
else {
    继续探索();
}

```

这里我们已经看到了第一种逻辑判断的方式，就是使用if else if else

有了这些组件我们就能随时随地判断角色所处的状态并给与其一定的逻辑。

## 二、if else基础语法三大件 🧱

1. if语句（单条件分支）

```cpp
// 检查玩家是否死亡
int playerHealth = 0;
if (playerHealth <= 0) 
{ // 判断条件
    showGameOverScreen(); // 条件成立时执行
}

```

2. else语句（否则分支）

```cpp
// 判断玩家能否购买道具
int gold = 50;
int itemPrice = 100;
if (gold >= itemPrice) 
{
    buyItem();
    gold -= itemPrice;
} 
else 
{ // 当if条件不满足时执行
    showMessage("金币不足！");
}

```

3. else if（多重条件）

```cpp
// 根据得分评级
int score = 85;
if (score >= 90) 
{
    rank = "SSS";
} 
else if (score >= 80) 
{ // 前一个条件不满足时检查
    rank = "A";
} 
else if (score >= 70) 
{
    rank = "B";
} 
else 
{ // 所有条件都不满足
    rank = "C";
}

```

这就是我们最常见的if判断语句，未来会时时刻刻出现在我们的代码中

我们也很容易发现，目前为止我们用到的符号无非是&gt; &gt;= &lt; &lt;= == ，这里要格外注意区分的是== 和我们的赋值符号= 一不注意就会写错，写的时候要小心哦

## 三、逻辑与、或、非门

但其实if语句并不是只限制于这些符号，一切bool返回值都可以作为其条件，也就是说只要判断语句中的结果为0，那么就是false，如果语句中的结果不为0，那么就是true

```cpp
int state = 0;

if(state)
{
    std::cout << "state is valid." << std::endl;
}

if(!state)
{
    std::cout << "state is invalid." << std::endl;
}

```

这里state是可以直接作为判断条件的

### 逻辑非！（Not）

这里出现了一个新的符号就是! ，这个符号的含义很简单，就是将true变成false，将false变成true，我们叫取反符号，所以上面的state 本为0，本身应该是false，但是加上了取反符号，就变成了true，就会执行!state下面的逻辑

那还有没有其他的符号呢？当然有，往下看

### 逻辑与&&（AND）

逻辑与&&（AND）,可以连接两个条件判断，只有其两边的判断结果都为true的时候，才会返回true，否则就会返回false

其短路特性——左边为false时右边不执行

```cpp
int mp = 100;
bool isCoolDown = false;

// 同时满足MP充足且不在冷却
if (mp >= 50 && !isCoolDown) 
{
    launchUltimateSkill();
    mp -= 50;
    isCoolDown = true;
}

```

再比如游戏中开启宝箱的复合条件

```cpp
bool hasKey = true;
bool isTrapDisarmed = false;

// 必须同时满足两个条件
if (hasKey && isTrapDisarmed) 
{ 
    openTreasureChest();
} 
else 
{
    showMessage("需要钥匙并解除陷阱！");
}
```

但是有一些错误用法一定要警惕❌

```cpp
// 想表达"等级在10到20之间"

if (10 < level < 20)          // ❌ 错误写法！
if (level > 10 && level < 20) // ✓ 正确
```

### 逻辑或||（OR）

逻辑或 ||（OR）,可以连接两个条件判断，只要其两边任意一边的判断结果为true的时候，就会返回true，只有当两边均为false的时候，才会返回false

其短路特性——左边为true时右边不执行

比如游戏中的开门机制

```cpp
bool hasKeycard = false;
bool knowPassword = true;

// 满足任一条件即可开门
if (hasKeycard || knowPassword) 
{
    unlockDoor();
} 
else 
{
    activateAlarm();
}

```

再比如游戏中的跳跃判定

```cpp
bool isGrounded = true;
bool hasDoubleJump = false;

// 在地面或拥有二段跳能力
if (isGrounded || hasDoubleJump) 
{
    executeJump();
    if (!isGrounded) hasDoubleJump = false;
}

```

| 运算符 | 示例 | 游戏应用场景 |
| --- | --- | --- |
| && | a && b (与) | 同时满足多个条件 |
| \|\| | a \|\| b (或) | 多个条件满足其一 |
| ! | !a (非) | 条件取反 |

### 常见误区 🚨

错误1：错误组合条件

```cpp
// 想判断等级不在20-30之间 ❌
if (level < 20 || level > 30) // ✓ 正确
if (20 > level > 30)          // ❌ 错误语法

```

错误2：忽略运算优先级

```cpp
// && 优先级高于 || 
if (a || b && c)  // 实际是 a || (b && c)
if (a || (b && c)) // 推荐显式写括号

```

### 最佳实践 ✅

1.用括号明确优先级

```cpp
// 清晰的条件分组
if ((isDaytime && hasTorch) || (isNight && hasNightVision)) 

```

2.拆分复杂条件

```cpp
// 更易读的写法
bool canAttack = hasWeapon && !isReloading;
bool hasSpecial = isCritical || isElementalBoosted;

if (canAttack && hasSpecial) 
{
    launchSpecialAttack();
}

```

3.利用短路特性优化

```cpp
// 安全访问指针
if (player != nullptr && player->isAlive()) 
{
    // 当player非空时才调用isAlive()
}

```

黄金法则

- 当需要同时满足多个条件 → &&

- 当只需满足其一 → ||

- 遇到复杂判断 → 画真值表理清逻辑关系！

## 四、switch语句：游戏开发必杀技🕹️

switch是另一种条件判断的语句，是处理固定选项的最佳选择

```cpp
// 游戏主菜单选择
enum MenuOption 
{ NewGame, Load, Settings, Quit };

MenuOption choice = Load;

switch(choice) 
{ 
    // 判断变量
    case NewGame:  // 对应枚举值
        startNewGame();
        break;     // 必须break！
    case Load:
        loadSaveFile();
        break;
    case Settings:
        openSettings();
        break;
    case Quit:
        exitGame();
        break;
    default:      // 处理未预料的值
        showError();
}

```

这里使用了switch语句来处理enum中的一些数值

每一个enum声明的一些数值在switch中被一一枚举出来，并配上了固定的处理方式，这样我们就可以在函数中只传递一个enum的值便可以自由控制函数的结果。

> 不过这里只针对于enum较少的情况，如果enum中的值非常多，那可能会导致代码过于冗长。所以我们就要么对enum进行分级处理，要么就使用类的多态特性来构建对象，而不是强制使用非常复杂的enum

## 五、三元运算符

如果一个判断不是a就是b，尤其是当逻辑简单的时候，还直接把if else都写明出来，有没有感觉会有点扰乱代码呢？所以为了简化，我们在赋值时就可以使用三元运算符

```cpp
// 显示玩家/敌人血条
int hp = (isPlayer) ? playerHP : enemyHP;

// 等效于：
int hp;
if (isPlayer) 
{
    hp = playerHP;
} 
else 
{
    hp = enemyHP;
}

```

对比一下两种写法，是不是第一种明显要简洁得多？

```cpp
int 变量 = 条件 ? 条件为true的返回值 : 条件为false的返回值 ;

```

## 六、新手避坑指南 ⚠️

### 错误1：赋值(=) vs 比较(==)

```cpp
int x = 5;
if (x = 10) 
{ 
    // 错误！把10赋给x，行为未定义，具体结果取决于编译器
}

```

### 错误2：浮点数精确比较

关于精度的问题，可以翻看图灵技术手记：图灵重启RestArt ProjectA｜02.认识C++基础变量

```cpp
float a = 0.1f + 0.2f;
if (a == 0.3f)  // ❌ 可能不成立！
{......}

 // 应该使用范围判断：
 if (fabs(a - 0.3f) < 0.00001f)
{......}

```

### 错误3：switch遗漏break语句

```cpp
switch(weaponType) 
{
    case Sword: 
        attackPower = 50;
                // 忘记break！
    case Bow:   // 会继续执行到这里！直到遇见break为止
        attackPower = 30;
        break;
}

```

## 七、性能优化小贴士 🚀

1.优先处理常见情况：把高频条件放前面

```cpp
// 90%的情况是普通攻击
if (isNormalAttack) 
{
    handleNormal();
} 
else if (isCritical) 
{
    handleCritical();
}

```

### 2.减少嵌套层级：使用早期返回

```cpp
// 优化前
if (conditionA) 
{
    if (conditionB) {
        // 业务代码...
    }
}

// 优化后
if (!conditionA) return;
if (!conditionB) return;
// 业务代码...

```

### 3.慎用复杂条件：拆分可读性更好

```cpp
// 优化前
if ((a && b) || (c && !d)) { ... }

// 优化后
bool case1 = a && b;
bool case2 = c && !d;
if (case1 || case2) { ... }

```

今天的知识点你都有Get到吗~

有没有什么疑问，我们在评论区见哦~

你们也可以告诉我有什么是你们想知道的

![](./image-1.jpg)

![](./image-2.jpg)
