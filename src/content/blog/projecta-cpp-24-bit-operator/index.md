---
title: "重启RestArt ProjectA｜24.Bit Operator"
description: "一、什么是位运算想象你在玩一个RPG游戏，角色有8种不同的状态： 中毒、眩晕、灼烧、冰冻、沉默、缓慢、虚弱、流血如果用传统方式，你需要8个bool变量： bool isPoisoned = false…"
category: tools
tags: ['C++', 'ProjectA', '编程基础']
date: 2025-11-05
readTime: 4
heroImage: "./cover.webp"
published: true
---
## 一、什么是位运算

想象你在玩一个RPG游戏，角色有8种不同的状态：中毒、眩晕、灼烧、冰冻、沉默、缓慢、虚弱、流血

如果用传统方式，你需要8个bool变量：

```cpp
bool isPoisoned = false;
bool isStunned = false;
bool isBurning = false;
bool isFrozen = false;
bool isSilenced = false;
bool isSlowed = false;
bool isWeakened = false;
bool isBleeding = false;

```

占用了8个字节（每个bool通常1字节），而且代码看起来很臃肿！

但如果用位运算，你只需要1个字节（8位）就能表示所有状态！

```cpp
二进制: 0  0  0  0  0  0  0  0
        │ │ │ │ │ │ │ └─ 中毒
        │ │ │ │ │ │ └─── 眩晕
        │ │ │ │ │ └───── 灼烧
        │ │ │ │ └─────── 冰冻
        │ │ │ └───────── 沉默
        │ │ └─────────── 缓慢
        │ └───────────── 虚弱
        └─────────────── 流血
```

这就是位运算的优势——用二进制的每一位来存储信息！

## 二、六大位运算符（Bit Oprator）

### Part1. 按位与(&)——都是1才是1

规则： 两个位都是1，结果才是1

```cpp
  1010  (10)
& 1100  (12)
------
  1000  (8)
```

Code Instance

```cpp
int a = 10;  // 二进制: 1010
int b = 12;  // 二进制: 1100
int result = a & b;  // 结果: 8 (1000)

std::cout << result << std::endl;  // 输出: 8

```

如果不使用位运算，我们会如何判断奇偶数

大概是这样

```cpp
bool isEven(int num)
{
	return num % 2 == 0;
}

```

而如果我们使用位运算则是

```cpp
bool isEven(int num) 
{
    return (num & 1) == 0;  // 最后一位是0则为偶数
}

```

### Part2. 按位或(|)——有1就是1

规则： 只要有一个位是1，结果就是1

```cpp
  1010  (10)
| 1100  (12)
------
  1110  (14)
```

Code Instance

```cpp
int a = 10;  // 二进制: 1010
int b = 12;  // 二进制: 1100
int result = a | b;  // 结果: 14 (1110)

std::cout << result << std::endl;  // 输出: 14

```

在一般应用条件下，赋予状态用“或”，检查状态用“与”

```cpp
// 定义状态常量
const int STATUS_POISONED = 1 << 0;  // 0001
const int STATUS_STUNNED  = 1 << 1;  // 0010
const int STATUS_BURNING  = 1 << 2;  // 0100
const int STATUS_FROZEN   = 1 << 3;  // 1000

int playerStatus = 0;  // 初始无状态

// 添加中毒状态
playerStatus |= STATUS_POISONED;

// 同时添加灼烧和冰冻
playerStatus |= STATUS_BURNING | STATUS_FROZEN;

// 现在playerStatus = 0001 | 0100 | 1000 = 1101

```

### Part3. 按位异或(^)——不同为1

规则： 两个位不同，结果为1；相同则为0

```cpp
  1010  (10)
^ 1100  (12)
------
  0110  (6)
```

Code Instance

```cpp
int a = 10;  // 二进制: 1010
int b = 12;  // 二进制: 1100
int result = a ^ b;  // 结果: 6 (0110)

std::cout << result << std::endl;  // 输出: 6

```

如果我们想将两个变量交换赋值，没有位运算我们会怎么办？

```cpp
void Swap(int &a, int &b)
{
	int t = a;
	a = b;
	b = t;
}

```

这种算法添加了中间变量，用位运算会更快更简单

```cpp
void Swap(int& a, int& b) 
{
    a = a ^ b;
    b = a ^ b;  // b = (a^b) ^ b = a
    a = a ^ b;  // a = (a^b) ^ a = b
}

// 使用
int x = 5, y = 10;
Swap(x, y);
std::cout << "x=" << x << ", y=" << y << std::endl;  // x=10, y=5

```

> 注意，这里是一个很重要的规律：异或有个神奇特性——a ^ b ^ b = a

### Part4. 按位取反(~)——0变1，1变0

规则： 每一位都取反

```cpp
~1010 = 0101  (简化表示)
```

Code Instance

```cpp
unsigned char a = 10;  // 二进制: 00001010
unsigned char result = ~a;  // 结果: 11110101 (245)

std::cout << (int)result << std::endl;  // 输出: 245

```

⚠️ 注意： 对于有符号数，取反涉及补码，会有点复杂：

```cpp
int a = 10;
int result = ~a;  // 结果是 -11（不是245）

```

### Part5. 左移(&lt;&lt;)——向左移动，低位补0

规则： 所有位向左移动，右边补0，相当于乘以2的n次方

```cpp
原始:  0101  (5)
左移1: 1010  (10)  相当于 5 * 2
左移2: 0100  (20)  相当于 5 * 4
```

代码示例：

```cpp
int num = 5;
std::cout << (num << 1) << std::endl;  // 10
std::cout << (num << 2) << std::endl;  // 20
std::cout << (num << 3) << std::endl;  // 40

```

有发现规律吗？移动几位其实就是2的n次方

所以我们以2为底的幂次运算也就更简单了

```cpp
int power = 10;
int result = 1 << power;  // 2^10 = 1024

std::cout << result << std::endl;  // 1024

```

### Part6. 右移(&gt;&gt;)——向右移动，高位补0或1

所有位向右移动，相当于除以2的n次方

```cpp
原始:  1010  (10)
右移1: 0101  (5)   相当于 10 / 2
右移2: 0010  (2)   相当于 10 / 4

```

Code Instance

```cpp
int num = 20;
std::cout << (num >> 1) << std::endl;  // 10
std::cout << (num >> 2) << std::endl;  // 5
std::cout << (num >> 3) << std::endl;  // 2

```

⚠️ 重要区别：

```cpp
// 无符号右移：高位补0
unsigned int a = 8;
a >> 1;  // 结果: 4

// 有符号右移：高位补符号位（算术右移）
int b = -8;
b >> 1;  // 结果: -4（保持负数）
```

## 三、位运算符优先级

从高到低：

```cpp
1. ~           (按位取反)
2. << >>       (移位)
3. &           (按位与)
4. ^           (按位异或)
5. |           (按位或)
```

重要提示： 当不确定时，加括号！

```cpp
// ❌ 可能出错
if (status & FLAG == FLAG)  // 先执行 FLAG == FLAG

// ✅ 正确
if ((status & FLAG) == FLAG)  // 先执行 status & FLAG

```

## 四、游戏案例

### 案例1：角色状态管理系统

```cpp
// 定义所有可能的状态（每个占1位）
enum CharacterStatus 
{
    STATUS_NONE     = 0,        // 0000 0000
    STATUS_POISONED = 1 << 0,   // 0000 0001
    STATUS_STUNNED  = 1 << 1,   // 0000 0010
    STATUS_BURNING  = 1 << 2,   // 0000 0100
    STATUS_FROZEN   = 1 << 3,   // 0000 1000
    STATUS_SILENCED = 1 << 4,   // 0001 0000
    STATUS_SLOWED   = 1 << 5,   // 0010 0000
    STATUS_WEAKENED = 1 << 6,   // 0100 0000
    STATUS_BLEEDING = 1 << 7    // 1000 0000
};

class Character 
{
private:
    unsigned char statusFlags = STATUS_NONE;  // 只用1字节！
    
public:
    // 添加状态
    void AddStatus(CharacterStatus status) 
    {
        statusFlags |= status;
    }
    
    // 移除状态
    void RemoveStatus(CharacterStatus status) 
    {
        statusFlags &= ~status;
    }
    
    // 检查是否有某状态
    bool HasStatus(CharacterStatus status) const 
    {
        return (statusFlags & status) != 0;
    }
    
    // 清除所有状态
    void ClearAllStatus() 
    {
        statusFlags = STATUS_NONE;
    }
    
    // 切换状态（有则去除，无则添加）
    void ToggleStatus(CharacterStatus status) 
    {
        statusFlags ^= status;
    }
};

// 使用示例
int main() 
{
    Character player;
    
    // 玩家被毒和灼烧
    player.AddStatus(STATUS_POISONED);
    player.AddStatus(STATUS_BURNING);
    
    // 检查状态
    if (player.HasStatus(STATUS_POISONED)) 
    {
        std::cout << "玩家中毒了！" << std::endl;
    }
    
    // 解除中毒
    player.RemoveStatus(STATUS_POISONED);
    
    // 同时添加多个状态
    player.AddStatus((CharacterStatus)(STATUS_STUNNED | STATUS_FROZEN));
    
    return 0;
}

```

### 案例2：权限系统

```cpp
// 游戏管理员权限系统
enum AdminPermission 
{
    PERM_NONE         = 0,
    PERM_KICK         = 1 << 0,  // 踢人
    PERM_BAN          = 1 << 1,  // 封禁
    PERM_MUTE         = 1 << 2,  // 禁言
    PERM_SPAWN_ITEMS  = 1 << 3,  // 生成物品
    PERM_TELEPORT     = 1 << 4,  // 传送
    PERM_GOD_MODE     = 1 << 5,  // 无敌
    PERM_MODIFY_WORLD = 1 << 6,  // 修改世界
    PERM_SUPER_ADMIN  = 1 << 7   // 超级管理员
};

class AdminUser 
{
private:
    int permissions = PERM_NONE;
    
public:
    // 授予权限
    void GrantPermission(int perm) 
    {
        permissions |= perm;
    }
    
    // 撤销权限
    void RevokePermission(int perm) 
    {
        permissions &= ~perm;
    }
    
    // 检查权限
    bool HasPermission(int perm) const 
    {
        return (permissions & perm) == perm;
    }
    
    // 授予多个权限
    void GrantMultiplePermissions(int perms) 
    {
        permissions |= perms;
    }
};

// 使用
int main() 
{
    AdminUser moderator;
    
    // 授予基础管理员权限
    moderator.GrantMultiplePermissions(
        PERM_KICK | PERM_MUTE | PERM_TELEPORT
    );
    
    // 检查权限
    if (moderator.HasPermission(PERM_KICK)) 
    {
        std::cout << "可以踢人" << std::endl;
    }
    
    if (!moderator.HasPermission(PERM_BAN)) 
    {
        std::cout << "没有封禁权限" << std::endl;
    }
    
    return 0;
}

```

### 案例3：图形渲染标志

```cpp
// 渲染标志位
enum RenderFlags 
{
    RENDER_NONE          = 0,
    RENDER_SHADOWS       = 1 << 0,   // 渲染阴影
    RENDER_REFLECTIONS   = 1 << 1,   // 渲染反射
    RENDER_PARTICLES     = 1 << 2,   // 渲染粒子
    RENDER_POST_PROCESS  = 1 << 3,   // 后处理
    RENDER_ANTI_ALIASING = 1 << 4,   // 抗锯齿
    RENDER_BLOOM         = 1 << 5,   // 泛光
    RENDER_MOTION_BLUR   = 1 << 6,   // 动态模糊
    RENDER_DEPTH_OF_FIELD = 1 << 7   // 景深
};

// 预设配置
const int LOW_QUALITY = RENDER_NONE;

const int MEDIUM_QUALITY = 
    RENDER_SHADOWS | 
    RENDER_PARTICLES;

const int HIGH_QUALITY = 
    RENDER_SHADOWS | 
    RENDER_REFLECTIONS | 
    RENDER_PARTICLES | 
    RENDER_POST_PROCESS | 
    RENDER_ANTI_ALIASING;

const int ULTRA_QUALITY = 
    HIGH_QUALITY | 
    RENDER_BLOOM | 
    RENDER_MOTION_BLUR | 
    RENDER_DEPTH_OF_FIELD;

class Renderer 
{
private:
    int renderFlags = MEDIUM_QUALITY;
    
public:
    void SetQuality(int quality) 
    {
        renderFlags = quality;
    }
    
    void EnableFeature(int feature) 
    {
        renderFlags |= feature;
    }
    
    void DisableFeature(int feature) 
    {
        renderFlags &= ~feature;
    }
    
    bool IsFeatureEnabled(int feature) const 
    {
        return (renderFlags & feature) != 0;
    }
    
    void Render() 
    {
        if (IsFeatureEnabled(RENDER_SHADOWS)) 
        {
            RenderShadows();
        }
        
        if (IsFeatureEnabled(RENDER_PARTICLES)) 
        {
            RenderParticles();
        }
        
        // ... 其他渲染逻辑
    }
};

```

### 案例4：碰撞层级系统

```cpp
// 物理碰撞层（类似Unity的Layer）
enum CollisionLayer 
{
    LAYER_NONE        = 0,
    LAYER_DEFAULT     = 1 << 0,
    LAYER_PLAYER      = 1 << 1,
    LAYER_ENEMY       = 1 << 2,
    LAYER_PROJECTILE  = 1 << 3,
    LAYER_WALL        = 1 << 4,
    LAYER_TRIGGER     = 1 << 5,
    LAYER_ITEM        = 1 << 6,
    LAYER_GROUND      = 1 << 7
};

class GameObject 
{
private:
    int collisionLayer = LAYER_DEFAULT;
    int collisionMask = ~0;  // 默认与所有层碰撞
    
public:
    void SetLayer(int layer) 
    {
        collisionLayer = layer;
    }
    
    void SetCollisionMask(int mask) 
    {
        collisionMask = mask;
    }
    
    // 检查是否应该与另一个对象碰撞
    bool ShouldCollideWith(const GameObject& other) const 
    {
        return (collisionMask & other.collisionLayer) != 0;
    }
};

// 使用示例
int main() 
{
    GameObject player;
    player.SetLayer(LAYER_PLAYER);
    
    // 玩家只与敌人、墙壁、地面碰撞
    player.SetCollisionMask(
        LAYER_ENEMY | 
        LAYER_WALL | 
        LAYER_GROUND
    );
    
    GameObject bullet;
    bullet.SetLayer(LAYER_PROJECTILE);
    
    // 子弹只与敌人和墙壁碰撞
    bullet.SetCollisionMask(LAYER_ENEMY | LAYER_WALL);
    
    return 0;
}

```

### 案例5：优化——快速颜色处理

```cpp
// 用一个32位整数存储RGBA颜色
struct Color32 
{
    unsigned int value;  // RGBA打包在一起
    
    // 构造函数
    Color32(unsigned char r, unsigned char g, 
            unsigned char b, unsigned char a = 255) 
    {
        value = (a << 24) | (b << 16) | (g << 8) | r;
    }
    
    // 提取各通道
    unsigned char GetR() const { return value & 0xFF; }
    unsigned char GetG() const { return (value >> 8) & 0xFF; }
    unsigned char GetB() const { return (value >> 16) & 0xFF; }
    unsigned char GetA() const { return (value >> 24) & 0xFF; }
    
    // 设置各通道
    void SetR(unsigned char r) 
    {
        value = (value & 0xFFFFFF00) | r;
    }
    
    void SetG(unsigned char g) 
    {
        value = (value & 0xFFFF00FF) | (g << 8);
    }
    
    void SetB(unsigned char b) 
    {
        value = (value & 0xFF00FFFF) | (b << 16);
    }
    
    void SetA(unsigned char a) 
    {
        value = (value & 0x00FFFFFF) | (a << 24);
    }
};

// 使用
int main() 
{
    Color32 color(255, 128, 64, 255);  // 红、绿、蓝、透明度
    
    std::cout << "R: " << (int)color.GetR() << std::endl;  // 255
    std::cout << "G: " << (int)color.GetG() << std::endl;  // 128
    std::cout << "B: " << (int)color.GetB() << std::endl;  // 64
    
    color.SetA(128);  // 设置半透明
    
    return 0;
}

```

## 五、位运算基础算法

### 技巧1：判断是否为2的幂

```cpp
bool IsPowerOfTwo(int n) 
{
    return n > 0 && (n & (n - 1)) == 0;
}

// 原理：
// 8  = 1000
// 7  = 0111
// &  = 0000 ✓

// 6  = 0110
// 5  = 0101
// &  = 0100 ✗

```

### 技巧2：计算二进制中1的个数

```cpp
int CountOnes(int n) 
{
    int count = 0;
    while (n) 
    {
        n &= (n - 1);  // 每次去掉最右边的1
        count++;
    }
    return count;
}

// 使用
std::cout << CountOnes(7) << std::endl;   // 3 (0111)
std::cout << CountOnes(15) << std::endl;  // 4 (1111)

```

### 技巧3：获取最右边的1

```cpp
int GetRightmostOne(int n) 
{
    return n & (-n);
}

// 原理：
// n   = 0110 1000
// -n  = 1001 1000 (补码)
// &   = 0000 1000 (最右边的1)

```

### 技巧4：清除最右边的1

```cpp
int ClearRightmostOne(int n) 
{
    return n & (n - 1);
}

// 使用
int x = 12;  // 1100
x = ClearRightmostOne(x);  // 1000 (8)

```

### 技巧5：设置第n位为1

```cpp
int SetBit(int num, int n) 
{
    return num | (1 << n);
}

// 设置第3位为1
int x = 5;    // 0101
x = SetBit(x, 3);  // 1101 (13)

```

### 技巧6：清除第n位为0

```cpp
int ClearBit(int num, int n) 
{
    return num & ~(1 << n);
}

// 清除第2位
int x = 7;    // 0111
x = ClearBit(x, 2);  // 0011 (3)

```

### 技巧7：切换第n位

```cpp
int ToggleBit(int num, int n) 
{
    return num ^ (1 << n);
}

// 切换第1位
int x = 5;    // 0101
x = ToggleBit(x, 1);  // 0111 (7)
x = ToggleBit(x, 1);  // 0101 (5) 切换回来

```

### 技巧8：检查第n位是否为1

```cpp
bool TestBit(int num, int n) 
{
    return (num & (1 << n)) != 0;
}

// 检查第2位
int x = 6;  // 0110
std::cout << TestBit(x, 1) << std::endl;  // true
std::cout << TestBit(x, 0) << std::endl;  // false

```

### 技巧9：获取两数的平均值（避免溢出）

```cpp
int Average(int a, int b) 
{
    return (a & b) + ((a ^ b) >> 1);
}

// 传统方法可能溢出
int BadAverage(int a, int b) 
{
    return (a + b) / 2;  // a+b可能超过int最大值
}

```

### 技巧10：快速模运算（n为2的幂）

```cpp
int FastMod(int x, int n) 
{
    return x & (n - 1);  // 等价于 x % n，但更快
}

// 只在n是2的幂时有效
int result = FastMod(19, 8);  // 等价于 19 % 8 = 3

```

## 六、新手常见五大错误

### 错误1：忘记括号导致优先级错误

```cpp
// ❌ 错误
if (status & FLAG == FLAG)  // 先执行 FLAG == FLAG (true=1)
                            // 再执行 status & 1

// ✅ 正确
if ((status & FLAG) == FLAG)  // 先执行位运算，再比较

```

### 错误2：对负数进行位运算

```cpp
int a = -5;
int result = a >> 1;  // ⚠️ 算术右移，保留符号位

// 如果要逻辑右移，使用unsigned
unsigned int b = 5;
unsigned int result = b >> 1;  // ✅ 逻辑右移，高位补0

```

### 错误3：移位数量超过位宽

```cpp
int x = 1;
int result = x << 32;  // ❌ 未定义行为！int只有32位

// 正确做法
if (shift < 32) 
{
    result = x << shift;
}

```

### 错误4：混淆按位与(&)和逻辑与(&&)

```cpp
// ❌ 错误：用了逻辑与
if (status && FLAG)  // 只要status和FLAG都非0就是true

// ✅ 正确：用按位与
if ((status & FLAG) != 0)  // 检查FLAG位是否设置

```

### 错误5：忘记使用unsigned避免符号问题

```cpp
// ❌ 可能出错
char bits = 0xFF;
bits = bits >> 1;  // 可能是算术右移，结果还是负数

// ✅ 安全
unsigned char bits = 0xFF;
bits = bits >> 1;  // 逻辑右移，结果是0x7F

```

## 七、最佳实践指南

### 原则一：用枚举定义标志位，提高可读性

```cpp
// ❌ 难以理解
int permissions = 37;  // 这是什么权限？

// ✅ 清晰明确
enum Permission 
{
    READ    = 1 << 0,
    WRITE   = 1 << 1,
    EXECUTE = 1 << 2,
    DELETE  = 1 << 3
};
int permissions = READ | WRITE | DELETE;  // 一目了然

```

### 原则二：用宏简化常见操作

```cpp
// 定义辅助宏
#define SET_FLAG(var, flag)     ((var) |= (flag))
#define CLEAR_FLAG(var, flag)   ((var) &= ~(flag))
#define TOGGLE_FLAG(var, flag)  ((var) ^= (flag))
#define HAS_FLAG(var, flag)     (((var) & (flag)) != 0)

// 使用
int status = 0;
SET_FLAG(status, STATUS_POISONED);
if (HAS_FLAG(status, STATUS_POISONED)) 
{
    CLEAR_FLAG(status, STATUS_POISONED);
}

```

### 原则三：位标志用unsigned类型

```cpp
// ❌ 可能有符号问题
int flags = 0;

// 避免符号问题
unsigned int flags = 0;
// 或者
uint32_t flags = 0;  // 更明确的位数

```

### 原则四：注释说明每个位的含义

```cpp
// 良好的注释
enum RenderFlags 
{
    RENDER_SHADOWS       = 1 << 0,   // Bit 0: 渲染阴影
    RENDER_REFLECTIONS   = 1 << 1,   // Bit 1: 渲染反射
    RENDER_PARTICLES     = 1 << 2,   // Bit 2: 渲染粒子
    RENDER_POST_PROCESS  = 1 << 3    // Bit 3: 后处理效果
};

```

### 原则五：使用static_assert验证标志不重叠

```cpp
enum Flags 
{
    FLAG_A = 1 << 0,
    FLAG_B = 1 << 1,
    FLAG_C = 1 << 2
};

// 编译期检查标志不重叠
static_assert((FLAG_A & FLAG_B) == 0, "Flags overlap!");
static_assert((FLAG_B & FLAG_C) == 0, "Flags overlap!");

```

## 八、性能对比——为什么要用位运算？

### 内存节省对比

```cpp
// 传统方式：8个bool = 8字节
struct CharacterStatus_Old 
{
    bool isPoisoned;
    bool isStunned;
    bool isBurning;
    bool isFrozen;
    bool isSilenced;
    bool isSlowed;
    bool isWeakened;
    bool isBleeding;
};  // 总计: 8 bytes

// 位运算方式：1个字节
struct CharacterStatus_New 
{
    unsigned char statusFlags;
};  // 总计: 1 byte（节省87.5%内存！）

```

### 速度对比

```cpp
// 传统方式
bool hasAnyDebuff = 
    isPoisoned || isStunned || isBurning || 
    isFrozen || isSilenced || isSlowed;
// 需要6次内存访问 + 6次逻辑判断

// 位运算方式
bool hasAnyDebuff = (statusFlags != 0);
// 只需1次内存访问 + 1次比较！

```

## 九、二进制数可视化

```cpp
// 辅助函数：打印二进制表示
void PrintBinary(int num, int bits = 8) 
{
    for (int i = bits - 1; i >= 0; i--) 
    {
        std::cout << ((num >> i) & 1);
        if (i % 4 == 0 && i != 0) 
            std::cout << " ";  // 每4位加空格
    }
    std::cout << std::endl;
}

// 使用
int status = 0b10110101;
PrintBinary(status);  // 输出: 1011 0101

```

## 十、简单拓展

### 位域(Bit Fields)

C++还支持结构体中的位域，可以指定成员占用的位数：

```cpp
struct PackedData 
{
    unsigned int health : 10;      // 10位：0-1023
    unsigned int mana : 10;        // 10位：0-1023
    unsigned int stamina : 10;     // 10位：0-1023
    unsigned int level : 7;        // 7位：0-127
    unsigned int team : 3;         // 3位：0-7
    // 总共40位，只占5字节（编译器可能对齐到8字节）
};

PackedData data;
data.health = 100;
data.level = 50;
data.team = 2;

```

⚠️ 注意： 位域不可移植（字节序问题），谨慎使用！

### 位运算与SIMD优化

现代CPU的SIMD指令可以同时处理多个位运算：

```cpp
#include <immintrin.h>  // Intel intrinsics

// 同时处理8个32位整数的位运算
__m256i a = _mm256_set1_epi32(10);
__m256i b = _mm256_set1_epi32(12);
__m256i result = _mm256_and_si256(a, b);  // 并行按位与
```

今天的知识点你都有Get到吗~

有没有什么疑问，我们在评论区见哦~

你们也可以告诉我有什么是你们想知道的

![](./image-1.jpg)

![](./image-2.jpg)
