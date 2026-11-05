---
title: "重启RestArt ProjectA｜33.Stack & Heap（栈与堆）"
description: "一、什么是栈和堆1.1 内存布局 [文章: 图灵重启RestArt ProjectA｜09.字符串] 这篇文章中我们提到过什么是内存布局 程序运行时，一般来说内存总共分为这么几个部分，我们比较熟悉的堆…"
category: tools
tags: ['C++', 'ProjectA', '编程基础']
date: 2025-11-11
readTime: 4
heroImage: "./image-1.jpg"
published: true
---
## 一、什么是栈和堆

### 1.1 内存布局

这篇文章中我们提到过什么是内存布局

程序运行时，一般来说内存总共分为这么几个部分，我们比较熟悉的堆栈，还有代码段、只读数据段、数据段和bss段

```cpp
+---------------------+
|  代码段（.text）     | ← 可执行指令
+---------------------+
|  只读数据段（.rodata）| ← 只读常量存储在此处
+---------------------+
|  数据段（.data）     | ← 已初始化的全局变量
+---------------------+
|  BSS段（.bss）       | ← 未初始化的全局变量
+---------------------+
|  堆（heap）          | ← 动态分配的内存
+---------------------+
|  栈（stack）         | ← 局部变量
+---------------------+
```

.bss是指那些没有初始化的和初始化为0的全局变量，BSS段不存放在程序文件中。

.data段（数据段）的名字就暗示着里面存放着数据，是那些已经被初始化之后的数据。如果数据全是零，为了优化考虑，编译器把它当作.bss处理。通俗的说，.data存储那些初始化过（非零）的非const的全局变量。

.rodata段，ro代表read only，即只读数据(const)，但是！！！常量不一定就放在rodata里，有的立即数直接编码在指令里，存放在代码段(.text)中。对于字符串常量，编译器会自动去掉重复的字符串，保证一个字符串在一个可执行文件(EXE/SO)中只存在一份拷贝，所以我们的字面量就存储在了这里。

.rodata是在多个进程间是共享的，这可以提高空间利用率。在有的嵌入式系统中，.rodata放在ROM(如norflash)里，运行时直接读取ROM内存，无需要加载到RAM内存中。

### 1.2 核心概念

栈（Stack）：

- 自动管理（编译器负责）

- 遵循LIFO（后进先出）原则

- 速度快，容量小

堆（Heap）：

- 手动管理（程序员负责）

- 自由分配和释放

- 速度慢，容量大

## 二、栈和堆的核心区别

| 特性 | 栈（Stack） | 堆（Heap） |
| --- | --- | --- |
| 分配方式 | 自动分配 | 手动分配（new/malloc） |
| 释放方式 | 自动释放 | 手动释放（delete/free） |
| 分配速度 | 极快（移动指针） | 较慢（查找空闲块） |
| 访问速度 | 快（缓存友好） | 较慢（缓存不友好） |
| 大小限制 | 小（通常1-8MB） | 大（取决于系统） |
| 生命周期 | 函数作用域 | 程序员控制 |
| 碎片问题 | 无 | 有 |
| 线程安全 | 每线程独立 | 需要同步 |
| 增长方向 | 向下（高→低） | 向上（低→高） |

## 三、栈内存的使用

### 3.1 基础栈变量

```cpp
#include <iostream>

void StackExample() 
{
    // 所有这些变量都在栈上
    int a = 10;           // 4字节
    float b = 3.14f;      // 4字节
    char c = 'A';         // 1字节
    double d = 2.718;     // 8字节
    
    int array[5] = {1, 2, 3, 4, 5};  // 20字节
    
    std::cout << "变量地址（注意递减）：" << std::endl;
    std::cout << "&a = " << &a << std::endl;
    std::cout << "&b = " << &b << std::endl;
    std::cout << "&c = " << (void*)&c << std::endl;
    std::cout << "&d = " << &d << std::endl;
    std::cout << "&array = " << array << std::endl;
    
    // 函数结束时，所有变量自动销毁
}

int main() 
{
    StackExample();
    
    // 此时StackExample中的变量已经不存在了
    
    return 0;
}

/* 典型输出（地址递减，说明栈向下增长）:
变量地址（注意递减）：
&a = 0x7ffc8b2e3e4c
&b = 0x7ffc8b2e3e48
&c = 0x7ffc8b2e3e47
&d = 0x7ffc8b2e3e38
&array = 0x7ffc8b2e3e20
*/

```

### 3.2 栈上的对象

```cpp
#include <iostream>

class Entity 
{
private:
    int id;
    float health;
    
public:
    Entity(int i, float h) : id(i), health(h) 
    {
        std::cout << "创建Entity " << id << " (栈)" << std::endl;
    }
    
    ~Entity() 
    {
        std::cout << "销毁Entity " << id << " (栈)" << std::endl;
    }
    
    void Print() 
    {
        std::cout << "Entity " << id << ", Health: " << health << std::endl;
    }
};

void FunctionScope() 
{
    std::cout << "进入FunctionScope" << std::endl;
    
    Entity e1(1, 100.0f);  // 在栈上创建
    Entity e2(2, 50.0f);   // 在栈上创建
    
    e1.Print();
    e2.Print();
    
    std::cout << "离开FunctionScope" << std::endl;
    // e1和e2在这里自动销毁（析构函数调用）
}

int main() 
{
    std::cout << "=== 测试栈对象 ===\n" << std::endl;
    
    FunctionScope();
    
    std::cout << "\n函数返回后，对象已销毁" << std::endl;
    
    return 0;
}

/* 输出:
=== 测试栈对象 ===

进入FunctionScope
创建Entity 1 (栈)
创建Entity 2 (栈)
Entity 1, Health: 100
Entity 2, Health: 50
离开FunctionScope
销毁Entity 2 (栈)
销毁Entity 1 (栈)

函数返回后，对象已销毁
*/

```

### 3.3 栈上的数组

```cpp
#include <iostream>

void StackArrayExample() 
{
    // 固定大小的数组在栈上
    int numbers[10];
    
    // 初始化
    for (int i = 0; i < 10; i++) 
    {
        numbers[i] = i * i;
    }
    
    // 打印地址（连续的内存）
    std::cout << "数组元素地址：" << std::endl;
    for (int i = 0; i < 10; i++) 
    {
        std::cout << "&numbers[" << i << "] = " << &numbers[i] 
                  << " 值: " << numbers[i] << std::endl;
    }
    
    // 多维数组也在栈上
    int matrix[3][3] = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };
    
    std::cout << "\n矩阵大小: " << sizeof(matrix) << " 字节" << std::endl;
}

int main() 
{
    StackArrayExample();
    return 0;
}

/* 输出（地址连续，相差4字节）:
数组元素地址：
&numbers[0] = 0x7ffc8b2e3e10 值: 0
&numbers[1] = 0x7ffc8b2e3e14 值: 1
&numbers[2] = 0x7ffc8b2e3e18 值: 4
&numbers[3] = 0x7ffc8b2e3e1c 值: 9
...
矩阵大小: 36 字节
*/

```

### 3.4 栈溢出示例

```cpp
#include <iostream>

// ❌ 危险：递归过深导致栈溢出
void RecursiveFunction(int depth) 
{
    int localArray[1000];  // 每次调用分配4KB
    
    std::cout << "递归深度: " << depth << std::endl;
    
    RecursiveFunction(depth + 1);  // 无限递归
}

// ❌ 危险：栈上分配过大的数组
void LargeStackArray() 
{
    int hugeArray[10000000];  // 40MB - 可能超过栈大小！
    hugeArray[0] = 1;
}

// ✅ 正确：使用堆
void SafeLargeArray() 
{
    int* hugeArray = new int[10000000];  // 在堆上分配
    hugeArray[0] = 1;
    delete[] hugeArray;
}

int main() 
{
    // RecursiveFunction(0);  // ⚠️ 取消注释会导致栈溢出崩溃
    // LargeStackArray();     // ⚠️ 取消注释可能导致栈溢出
    
    SafeLargeArray();  // ✅ 安全
    
    return 0;
}

```

## 四、堆内存的使用

### 4.1 基础堆分配

```cpp
#include <iostream>

void HeapExample() 
{
    // 在堆上分配单个变量
    int* p1 = new int;          // 未初始化
    int* p2 = new int(42);      // 初始化为42
    int* p3 = new int{100};     // C++11初始化
    
    std::cout << "堆上的整数: " << *p2 << std::endl;
    
    // 必须手动释放
    delete p1;
    delete p2;
    delete p3;
    
    // 在堆上分配数组
    int* array = new int[100];  // 100个整数
    
    for (int i = 0; i < 100; i++) 
    {
        array[i] = i;
    }
    
    std::cout << "数组第10个元素: " << array[10] << std::endl;
    
    // 必须使用delete[]
    delete[] array;
    
    std::cout << "堆内存已释放" << std::endl;
}

int main() 
{
    HeapExample();
    return 0;
}

```

### 4.2 堆上的对象

```cpp
#include <iostream>

class Player 
{
private:
    std::string name;
    int health;
    int* inventory;  // 动态数组
    int inventorySize;
    
public:
    Player(const std::string& n, int h, int invSize) 
        : name(n), health(h), inventorySize(invSize) 
    {
        inventory = new int[inventorySize];  // 在堆上分配
        std::cout << "创建玩家: " << name << " (堆)" << std::endl;
    }
    
    ~Player() 
    {
        delete[] inventory;  // 释放堆内存
        std::cout << "销毁玩家: " << name << " (堆)" << std::endl;
    }
    
    void AddItem(int index, int itemId) 
    {
        if (index >= 0 && index < inventorySize) 
        {
            inventory[index] = itemId;
        }
    }
    
    void PrintInfo() 
    {
        std::cout << "玩家: " << name << ", 血量: " << health 
                  << ", 背包大小: " << inventorySize << std::endl;
    }
};

int main() 
{
    std::cout << "=== 栈上的对象 ===\n" << std::endl;
    {
        Player stackPlayer("StackHero", 100, 10);
        stackPlayer.PrintInfo();
        // 作用域结束，自动调用析构函数
    }
    
    std::cout << "\n=== 堆上的对象 ===\n" << std::endl;
    {
        Player* heapPlayer = new Player("HeapHero", 100, 20);
        heapPlayer->PrintInfo();
        
        // 必须手动删除
        delete heapPlayer;
    }
    
    std::cout << "\n程序结束" << std::endl;
    
    return 0;
}

/* 输出:
=== 栈上的对象 ===

创建玩家: StackHero (堆)
玩家: StackHero, 血量: 100, 背包大小: 10
销毁玩家: StackHero (堆)

=== 堆上的对象 ===

创建玩家: HeapHero (堆)
玩家: HeapHero, 血量: 100, 背包大小: 20
销毁玩家: HeapHero (堆)

程序结束
*/

```

### 4.3 动态大小的数据结构

```cpp
#include <iostream>
#include <vector>

// ❌ 栈：大小必须在编译时确定
void StackArrayBad(int size) 
{
    // int array[size];  // C++不允许（VLA是C99特性）
}

// ✅ 堆：大小可以在运行时确定
void HeapArrayGood(int size) 
{
    int* array = new int[size];  // ✅ 运行时确定大小
    
    for (int i = 0; i < size; i++) 
    {
        array[i] = i * 2;
    }
    
    std::cout << "动态数组创建成功，大小: " << size << std::endl;
    
    delete[] array;
}

// ✅ 更好：使用std::vector（内部使用堆）
void VectorGood(int size) 
{
    std::vector<int> vec(size);  // 自动管理堆内存
    
    for (int i = 0; i < size; i++) 
    {
        vec[i] = i * 3;
    }
    
    std::cout << "Vector创建成功，大小: " << vec.size() << std::endl;
    
    // 不需要手动delete，析构函数自动处理
}

int main() 
{
    int userInput;
    std::cout << "请输入数组大小: ";
    std::cin >> userInput;
    
    HeapArrayGood(userInput);
    VectorGood(userInput);
    
    return 0;
}

```

### 4.4 内存分配的可视化

```cpp
#include <iostream>

void MemoryVisualization() 
{
    // 栈上的变量
    int stackInt = 42;
    int stackArray[3] = {1, 2, 3};
    
    // 堆上的变量
    int* heapInt = new int(100);
    int* heapArray = new int[3]{10, 20, 30};
    
    std::cout << "=== 栈内存地址 ===" << std::endl;
    std::cout << "&stackInt    = " << &stackInt << std::endl;
    std::cout << "&stackArray  = " << stackArray << std::endl;
    std::cout << "&stackArray[0] = " << &stackArray[0] << std::endl;
    std::cout << "&stackArray[1] = " << &stackArray[1] << std::endl;
    std::cout << "&stackArray[2] = " << &stackArray[2] << std::endl;
    
    std::cout << "\n=== 堆内存地址 ===" << std::endl;
    std::cout << "&heapInt     = " << &heapInt << " (指针本身在栈上)" << std::endl;
    std::cout << "heapInt      = " << heapInt << " (指向堆)" << std::endl;
    std::cout << "*heapInt     = " << *heapInt << std::endl;
    
    std::cout << "\n&heapArray   = " << &heapArray << " (指针本身在栈上)" << std::endl;
    std::cout << "heapArray    = " << heapArray << " (指向堆)" << std::endl;
    std::cout << "heapArray[0] = " << heapArray[0] << " at " << &heapArray[0] << std::endl;
    std::cout << "heapArray[1] = " << heapArray[1] << " at " << &heapArray[1] << std::endl;
    std::cout << "heapArray[2] = " << heapArray[2] << " at " << &heapArray[2] << std::endl;
    
    delete heapInt;
    delete[] heapArray;
}

int main() 
{
    MemoryVisualization();
    return 0;
}

/* 典型输出（注意地址范围的巨大差异）:
=== 栈内存地址 ===
&stackInt    = 0x7ffc8b2e3e4c     (栈地址，较高)
&stackArray  = 0x7ffc8b2e3e40
&stackArray[0] = 0x7ffc8b2e3e40
&stackArray[1] = 0x7ffc8b2e3e44
&stackArray[2] = 0x7ffc8b2e3e48

=== 堆内存地址 ===
&heapInt     = 0x7ffc8b2e3e38     (指针在栈上)
heapInt      = 0x55e8a9c6feb0     (数据在堆上，较低)
*heapInt     = 100

&heapArray   = 0x7ffc8b2e3e30     (指针在栈上)
heapArray    = 0x55e8a9c6fee0     (数据在堆上)
heapArray[0] = 10 at 0x55e8a9c6fee0
heapArray[1] = 20 at 0x55e8a9c6fee4
heapArray[2] = 30 at 0x55e8a9c6fee8
*/

```

## 五、实战案例

### 案例1：游戏实体管理系统

```cpp
#include <iostream>
#include <vector>
#include <string>

// 小型组件：适合栈
struct Transform 
{
    float x, y, z;
    float rotX, rotY, rotZ;
    
    Transform(float px = 0, float py = 0, float pz = 0) 
        : x(px), y(py), z(pz), rotX(0), rotY(0), rotZ(0) {}
};

// 大型资源：必须用堆
class Mesh 
{
private:
    float* vertices;      // 顶点数据（大量）
    int* indices;         // 索引数据
    int vertexCount;
    int indexCount;
    
public:
    Mesh(int vCount, int iCount) 
        : vertexCount(vCount), indexCount(iCount) 
    {
        vertices = new float[vertexCount * 3];  // x,y,z
        indices = new int[indexCount];
        
        std::cout << "分配Mesh内存: " 
                  << (vertexCount * 3 * sizeof(float) + indexCount * sizeof(int)) / 1024 
                  << "KB" << std::endl;
    }
    
    ~Mesh() 
    {
        delete[] vertices;
        delete[] indices;
        std::cout << "释放Mesh内存" << std::endl;
    }
    
    // 禁用拷贝
    Mesh(const Mesh&) = delete;
    Mesh& operator=(const Mesh&) = delete;
};

class GameObject 
{
private:
    std::string name;
    Transform transform;     // 小对象，值类型
    Mesh* mesh;              // 大对象，指针（堆）
    
public:
    GameObject(const std::string& n, int vertexCount) 
        : name(n), transform(0, 0, 0) 
    {
        mesh = new Mesh(vertexCount, vertexCount * 3);
        std::cout << "创建GameObject: " << name << std::endl;
    }
    
    ~GameObject() 
    {
        delete mesh;
        std::cout << "销毁GameObject: " << name << std::endl;
    }
    
    void SetPosition(float x, float y, float z) 
    {
        transform.x = x;
        transform.y = y;
        transform.z = z;
    }
    
    void PrintInfo() 
    {
        std::cout << "对象: " << name 
                  << " 位置: (" << transform.x << ", " 
                  << transform.y << ", " << transform.z << ")" << std::endl;
    }
};

class Scene 
{
private:
    std::vector<GameObject*> objects;  // 指针数组
    
public:
    void AddObject(GameObject* obj) 
    {
        objects.push_back(obj);
    }
    
    void UpdateAll() 
    {
        for (auto* obj : objects) 
        {
            obj->PrintInfo();
        }
    }
    
    ~Scene() 
    {
        std::cout << "\n清理场景..." << std::endl;
        for (auto* obj : objects) 
        {
            delete obj;
        }
    }
};

int main() 
{
    Scene scene;
    
    // 在堆上创建游戏对象（因为很大，且生命周期由Scene管理）
    scene.AddObject(new GameObject("Player", 10000));
    scene.AddObject(new GameObject("Enemy1", 5000));
    scene.AddObject(new GameObject("Enemy2", 5000));
    
    scene.UpdateAll();
    
    std::cout << "\n程序结束，Scene析构会自动清理所有对象" << std::endl;
    
    return 0;
}

/* 输出:
分配Mesh内存: 156KB
创建GameObject: Player
分配Mesh内存: 78KB
创建GameObject: Enemy1
分配Mesh内存: 78KB
创建GameObject: Enemy2
对象: Player 位置: (0, 0, 0)
对象: Enemy1 位置: (0, 0, 0)
对象: Enemy2 位置: (0, 0, 0)

程序结束，Scene析构会自动清理所有对象

清理场景...
释放Mesh内存
销毁GameObject: Player
释放Mesh内存
销毁GameObject: Enemy1
释放Mesh内存
销毁GameObject: Enemy2
*/

```

### 案例2：粒子系统

```cpp
#include <iostream>
#include <vector>

struct Particle 
{
    float x, y, z;
    float vx, vy, vz;
    float lifetime;
    
    Particle() : x(0), y(0), z(0), vx(0), vy(0), vz(0), lifetime(1.0f) {}
};

class ParticleSystem 
{
private:
    Particle* particles;  // 堆上的大数组
    int maxParticles;
    int activeCount;
    
public:
    ParticleSystem(int maxCount) : maxParticles(maxCount), activeCount(0) 
    {
        // 在堆上分配大量粒子
        particles = new Particle[maxParticles];
        
        std::cout << "粒子系统创建: " << maxParticles << " 个粒子" << std::endl;
        std::cout << "内存占用: " << (maxParticles * sizeof(Particle)) / 1024 
                  << "KB" << std::endl;
    }
    
    ~ParticleSystem() 
    {
        delete[] particles;
        std::cout << "粒子系统销毁" << std::endl;
    }
    
    void Emit(float x, float y, float z) 
    {
        if (activeCount < maxParticles) 
        {
            particles[activeCount].x = x;
            particles[activeCount].y = y;
            particles[activeCount].z = z;
            particles[activeCount].lifetime = 1.0f;
            activeCount++;
        }
    }
    
    void Update(float deltaTime) 
    {
        for (int i = 0; i < activeCount; i++) 
        {
            particles[i].x += particles[i].vx * deltaTime;
            particles[i].y += particles[i].vy * deltaTime;
            particles[i].z += particles[i].vz * deltaTime;
            particles[i].lifetime -= deltaTime;
        }
    }
    
    void PrintStats() 
    {
        std::cout << "活跃粒子: " << activeCount << "/" << maxParticles << std::endl;
    }
};

int main() 
{
    // ❌ 错误：栈上分配10000个粒子（太大！）
    // Particle stackParticles[10000];  // 280KB - 可能栈溢出
    
    // ✅ 正确：在堆上分配
    ParticleSystem* system = new ParticleSystem(10000);
    
    // 发射一些粒子
    for (int i = 0; i < 100; i++) 
    {
        system->Emit(i * 0.1f, 0, 0);
    }
    
    system->PrintStats();
    
    // 更新
    system->Update(0.016f);  // 一帧
    
    delete system;
    
    return 0;
}

/* 输出:
粒子系统创建: 10000 个粒子
内存占用: 280KB
活跃粒子: 100/10000
粒子系统销毁
*/

```

### 案例3：字符串与缓冲区

```cpp
#include <iostream>
#include <cstring>

// 小字符串优化（SSO）示例
void StringExample() 
{
    // 短字符串：可能在栈上（SSO优化）
    std::string shortStr = "Hello";  // 通常<=15字符会优化到栈上
    
    // 长字符串：在堆上
    std::string longStr = "This is a very long string that definitely won't fit in SSO buffer";
    
    std::cout << "短字符串地址: " << (void*)shortStr.c_str() << std::endl;
    std::cout << "长字符串地址: " << (void*)longStr.c_str() << std::endl;
}

// C风格字符串管理
class DynamicString 
{
private:
    char* buffer;
    size_t length;
    
public:
    DynamicString(const char* str) 
    {
        length = strlen(str);
        buffer = new char[length + 1];  // 堆分配
        strcpy(buffer, str);
        
        std::cout << "创建动态字符串: \"" << buffer << "\" (堆)" << std::endl;
    }
    
    ~DynamicString() 
    {
        std::cout << "释放动态字符串: \"" << buffer << "\"" << std::endl;
        delete[] buffer;
    }
    
    void Print() 
    {
        std::cout << "内容: " << buffer << " (长度: " << length << ")" << std::endl;
    }
};

// 固定缓冲区（栈）
class FixedBuffer 
{
private:
    char buffer[256];  // 栈上的固定缓冲区
    
public:
    FixedBuffer(const char* str) 
    {
        strncpy(buffer, str, 255);
        buffer[255] = '\0';
        
        std::cout << "创建固定缓冲区: \"" << buffer << "\" (栈)" << std::endl;
    }
    
    void Print() 
    {
        std::cout << "内容: " << buffer << std::endl;
    }
};

int main() 
{
    std::cout << "=== std::string 示例 ===\n" << std::endl;
    StringExample();
    
    std::cout << "\n=== 动态字符串（堆）===\n" << std::endl;
    {
        DynamicString dynStr("This is a dynamically allocated string on the heap");
        dynStr.Print();
    }
    
    std::cout << "\n=== 固定缓冲区（栈）===\n" << std::endl;
    {
        FixedBuffer fixStr("This is on the stack with fixed size");
        fixStr.Print();
    }
    
    return 0;
}

```

### 案例4：临时对象 vs 持久对象

```cpp
#include <iostream>
#include <vector>

class Texture 
{
private:
    int width, height;
    unsigned char* data;
    
public:
    Texture(int w, int h) : width(w), height(h) 
    {
        data = new unsigned char[width * height * 4];  // RGBA
        std::cout << "加载纹理 " << width << "x" << height 
                  << " (" << (width * height * 4) / 1024 << "KB)" << std::endl;
    }
    
    ~Texture() 
    {
        delete[] data;
        std::cout << "卸载纹理 " << width << "x" << height << std::endl;
    }
};

// ❌ 返回栈对象的指针（危险！）
Texture* CreateTextureBad() 
{
    Texture tex(512, 512);  // 栈上创建
    return &tex;            // ⚠️ 返回栈对象的地址！
}  // tex在这里被销毁，返回的指针悬空！

// ✅ 返回堆对象的指针（正确）
Texture* CreateTextureGood() 
{
    Texture* tex = new Texture(512, 512);  // 堆上创建
    return tex;  // ✅ 安全，对象仍然存在
}

// ✅✅ 最佳：使用智能指针
std::unique_ptr<Texture> CreateTextureBest() 
{
    return std::make_unique<Texture>(512, 512);
}

int main() 
{
    std::cout << "=== 错误示例（已注释，会崩溃）===\n" << std::endl;
    // Texture* bad = CreateTextureBad();  // ⚠️ 悬空指针
    // bad->...  // 💥 使用悬空指针会崩溃
    
    std::cout << "=== 正确示例1：手动管理 ===\n" << std::endl;
    {
        Texture* good = CreateTextureGood();
        // 使用纹理...
        delete good;  // 手动释放
    }
    
    std::cout << "\n=== 正确示例2：智能指针 ===\n" << std::endl;
    {
        auto best = CreateTextureBest();
        // 使用纹理...
        // 自动释放，无需delete
    }
    
    std::cout << "\n=== 临时对象示例 ===\n" << std::endl;
    {
        // 临时对象：栈上创建，作用域结束后自动销毁
        Texture tempTexture(256, 256);
        // 使用...
    }  // tempTexture在这里自动销毁
    
    std::cout << "\n=== 持久对象示例 ===\n" << std::endl;
    std::vector<Texture*> persistentTextures;
    
    // 需要长期存在的对象：堆
    persistentTextures.push_back(new Texture(1024, 1024));
    persistentTextures.push_back(new Texture(2048, 2048));
    
    // 使用纹理...
    
    // 清理
    for (auto* tex : persistentTextures) 
    {
        delete tex;
    }
    
    return 0;
}

```

## 六、性能对比

### 6.1 分配速度测试

```cpp
#include <iostream>
#include <chrono>
#include <vector>

class Timer 
{
private:
    std::chrono::high_resolution_clock::time_point start;
    const char* name;
    
public:
    Timer(const char* n) : name(n) 
    {
        start = std::chrono::high_resolution_clock::now();
    }
    
    ~Timer() 
    {
        auto end = std::chrono::high_resolution_clock::now();
        auto duration = std::chrono::duration_cast<std::chrono::microseconds>(end - start);
        std::cout << name << ": " << duration.count() << " μs" << std::endl;
    }
};

const int ITERATIONS = 1000000;

void StackAllocationTest() 
{
    Timer timer("栈分配100万次");
    
    for (int i = 0; i < ITERATIONS; i++) 
    {
        int a = i;           // 栈分配
        int b = i * 2;       // 栈分配
        int c = a + b;       // 栈分配
        (void)c;  // 避免优化掉
    }
}

void HeapAllocationTest() 
{
    Timer timer("堆分配100万次");
    
    for (int i = 0; i < ITERATIONS; i++) 
    {
        int* a = new int(i);        // 堆分配
        int* b = new int(i * 2);    // 堆分配
        int* c = new int(*a + *b);  // 堆分配
        
        delete a;
        delete b;
        delete c;
    }
}

void MixedAllocationTest() 
{
    Timer timer("混合分配100万次");
    
    for (int i = 0; i < ITERATIONS; i++) 
    {
        int stack = i;              // 栈
        int* heap = new int(i * 2); // 堆
        int result = stack + *heap;
        delete heap;
        (void)result;
    }
}

int main() 
{
    std::cout << "=== 性能对比测试 ===\n" << std::endl;
    
    StackAllocationTest();
    HeapAllocationTest();
    MixedAllocationTest();
    
    return 0;
}

/* 典型输出（性能差异巨大）:
=== 性能对比测试 ===

栈分配100万次: 2000 μs      (2毫秒)
堆分配100万次: 250000 μs    (250毫秒)
混合分配100万次: 125000 μs  (125毫秒)

结论：堆分配比栈分配慢约 125倍！
*/

```

### 6.2 访问速度测试

```cpp
#include <iostream>
#include <chrono>
#include <vector>

const int SIZE = 10000000;  // 1000万
const int ITERATIONS = 10;

void StackAccessTest() 
{
    int sum = 0;
    
    auto start = std::chrono::high_resolution_clock::now();
    
    for (int iter = 0; iter < ITERATIONS; iter++) 
    {
        // 在栈上（但会很快溢出，所以用vector模拟连续内存）
        std::vector<int> data(SIZE);
        for (int i = 0; i < SIZE; i++) 
        {
            sum += data[i];
        }
    }
    
    auto end = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start);
    
    std::cout << "连续内存访问: " << duration.count() << " ms (sum=" << sum << ")" << std::endl;
}

void HeapFragmentedAccessTest() 
{
    int sum = 0;
    
    // 创建碎片化的堆内存
    std::vector<int*> pointers;
    for (int i = 0; i < SIZE; i++) 
    {
        pointers.push_back(new int(i));  // 每个整数单独分配
    }
    
    auto start = std::chrono::high_resolution_clock::now();
    
    for (int iter = 0; iter < ITERATIONS; iter++) 
    {
        for (int i = 0; i < SIZE; i++) 
        {
            sum += *pointers[i];  // 跳跃访问
        }
    }
    
    auto end = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start);
    
    std::cout << "碎片化内存访问: " << duration.count() << " ms (sum=" << sum << ")" << std::endl;
    
    // 清理
    for (auto* p : pointers) 
    {
        delete p;
    }
}

int main() 
{
    std::cout << "=== 内存访问性能测试 ===\n" << std::endl;
    
    StackAccessTest();
    HeapFragmentedAccessTest();
    
    return 0;
}

/* 典型输出:
=== 内存访问性能测试 ===

连续内存访问: 450 ms (sum=0)
碎片化内存访问: 2800 ms (sum=0)

结论：碎片化的堆内存访问比连续内存慢约 6倍！
原因：缓存命中率低
*/

```

## 七、内存泄漏与管理

### 7.1 常见内存泄漏场景

```cpp
#include <iostream>

// ❌ 内存泄漏案例1：忘记delete
void MemoryLeak1() 
{
    int* p = new int(42);
    // 忘记 delete p;
}  // p的内存泄漏

// ❌ 内存泄漏案例2：异常导致跳过delete
void MemoryLeak2() 
{
    int* p = new int(42);
    
    // 如果这里抛出异常...
    // throw std::runtime_error("error");
    
    delete p;  // 这行代码不会执行
}

// ❌ 内存泄漏案例3：循环中不断分配
void MemoryLeak3() 
{
    for (int i = 0; i < 1000; i++) 
    {
        int* p = new int(i);
        // 每次循环都泄漏4字节
    }
}

// ❌ 内存泄漏案例4：重新赋值前未删除
void MemoryLeak4() 
{
    int* p = new int(10);
    p = new int(20);  // 泄漏：第一个int(10)的内存丢失
    delete p;  // 只删除了int(20)
}

// ✅ 正确做法1：使用智能指针
void NoLeak1() 
{
    std::unique_ptr<int> p = std::make_unique<int>(42);
    // 自动delete
}

// ✅ 正确做法2：RAII（析构函数自动清理）
class ResourceManager 
{
private:
    int* data;
    
public:
    ResourceManager(int size) 
    {
        data = new int[size];
    }
    
    ~ResourceManager() 
    {
        delete[] data;  // 自动清理
    }
};

void NoLeak2() 
{
    ResourceManager rm(100);
    // rm析构时自动清理
}

int main() 
{
    std::cout << "演示内存泄漏（实际项目中避免这些写法）" << std::endl;
    
    // MemoryLeak1();  // 泄漏4字节
    // MemoryLeak3();  // 泄漏4000字节
    
    NoLeak1();  // ✅ 无泄漏
    NoLeak2();  // ✅ 无泄漏
    
    return 0;
}

```

### 7.2 内存泄漏检测工具使用

```cpp
#include <iostream>
#include <memory>

// 使用Valgrind检测内存泄漏的示例

class LeakyClass 
{
private:
    int* data;
    
public:
    LeakyClass() 
    {
        data = new int[1000];
        std::cout << "分配内存" << std::endl;
    }
    
    // ❌ 忘记定义析构函数
};

class CorrectClass 
{
private:
    int* data;
    
public:
    CorrectClass() 
    {
        data = new int[1000];
        std::cout << "分配内存" << std::endl;
    }
    
    // ✅ 正确的析构函数
    ~CorrectClass() 
    {
        delete[] data;
        std::cout << "释放内存" << std::endl;
    }
};

int main() 
{
    std::cout << "=== 创建有泄漏的对象 ===" << std::endl;
    {
        LeakyClass* leak = new LeakyClass();
        delete leak;  // 泄漏：LeakyClass的data没有被delete
    }
    
    std::cout << "\n=== 创建正确的对象 ===" << std::endl;
    {
        CorrectClass* correct = new CorrectClass();
        delete correct;  // 无泄漏
    }
    
    std::cout << "\n=== 使用智能指针（最佳）===" << std::endl;
    {
        auto smart = std::make_unique<CorrectClass>();
        // 自动清理
    }
    
    return 0;
}

/*
使用Valgrind检测：
$ g++ -g memory_leak_test.cpp -o memory_leak_test
$ valgrind --leak-check=full ./memory_leak_test

Valgrind会报告：
- LeakyClass泄漏了4000字节（1000个int）
- CorrectClass无泄漏
*/

```

### 7.3 智能指针最佳实践

```cpp
#include <iostream>
#include <memory>
#include <vector>

class GameObject 
{
private:
    std::string name;
    
public:
    GameObject(const std::string& n) : name(n) 
    {
        std::cout << "创建: " << name << std::endl;
    }
    
    ~GameObject() 
    {
        std::cout << "销毁: " << name << std::endl;
    }
    
    void Update() 
    {
        std::cout << name << " 更新中..." << std::endl;
    }
};

int main() 
{
    std::cout << "=== unique_ptr：独占所有权 ===\n" << std::endl;
    {
        std::unique_ptr<GameObject> player = std::make_unique<GameObject>("Player");
        player->Update();
        // 自动delete
    }
    
    std::cout << "\n=== shared_ptr：共享所有权 ===\n" << std::endl;
    {
        std::shared_ptr<GameObject> enemy1 = std::make_shared<GameObject>("Enemy");
        {
            std::shared_ptr<GameObject> enemy2 = enemy1;  // 共享
            std::cout << "引用计数: " << enemy1.use_count() << std::endl;  // 2
        }
        std::cout << "引用计数: " << enemy1.use_count() << std::endl;  // 1
        // 最后一个shared_ptr销毁时，对象才被delete
    }
    
    std::cout << "\n=== weak_ptr：避免循环引用 ===\n" << std::endl;
    {
        std::shared_ptr<GameObject> obj1 = std::make_shared<GameObject>("Object1");
        std::weak_ptr<GameObject> weakRef = obj1;  // 弱引用，不增加引用计数
        
        std::cout << "引用计数: " << obj1.use_count() << std::endl;  // 1
        
        if (auto strongRef = weakRef.lock()) 
        {
            strongRef->Update();
        }
    }
    
    std::cout << "\n=== 容器中的智能指针 ===\n" << std::endl;
    {
        std::vector<std::unique_ptr<GameObject>> objects;
        
        objects.push_back(std::make_unique<GameObject>("Obj1"));
        objects.push_back(std::make_unique<GameObject>("Obj2"));
        objects.push_back(std::make_unique<GameObject>("Obj3"));
        
        for (auto& obj : objects) 
        {
            obj->Update();
        }
        
        // vector销毁时，所有对象自动清理
    }
    
    std::cout << "\n程序结束" << std::endl;
    
    return 0;
}

```

## 八、新手常见错误

### ❌ 错误1：返回栈变量的指针/引用

```cpp
#include <iostream>

// ❌ 危险：返回栈变量的指针
int* GetNumberBad() 
{
    int x = 42;
    return &x;  // ⚠️ x在函数结束后被销毁
}

// ❌ 危险：返回栈变量的引用
int& GetNumberBad2() 
{
    int x = 42;
    return x;  // ⚠️ x在函数结束后被销毁
}

// ✅ 正确：返回值
int GetNumberGood1() 
{
    int x = 42;
    return x;  // ✅ 返回副本
}

// ✅ 正确：返回堆对象的指针
int* GetNumberGood2() 
{
    int* x = new int(42);
    return x;  // ✅ 但需要手动delete
}

// ✅✅ 最佳：返回智能指针
std::unique_ptr<int> GetNumberBest() 
{
    return std::make_unique<int>(42);
}

int main() 
{
    // int* bad1 = GetNumberBad();
    // std::cout << *bad1 << std::endl;  // 💥 未定义行为
    
    int good1 = GetNumberGood1();
    std::cout << good1 << std::endl;  // ✅ 42
    
    int* good2 = GetNumberGood2();
    std::cout << *good2 << std::endl;  // ✅ 42
    delete good2;
    
    auto best = GetNumberBest();
    std::cout << *best << std::endl;  // ✅ 42
    
    return 0;
}

```

### ❌ 错误2：数组越界访问

```cpp
#include <iostream>

void ArrayBoundsError() 
{
    int arr[5] = {1, 2, 3, 4, 5};
    
    // ❌ 越界访问（未定义行为）
    std::cout << arr[5] << std::endl;   // 超出范围
    std::cout << arr[10] << std::endl;  // 超出范围
    
    // arr[5] = 100;  // 💥 可能覆盖其他变量的内存
}

void HeapArrayBoundsError() 
{
    int* arr = new int[5]{1, 2, 3, 4, 5};
    
    // ❌ 越界访问
    std::cout << arr[5] << std::endl;
    
    // arr[100] = 999;  // 💥 可能导致程序崩溃
    
    delete[] arr;
}

// ✅ 使用std::vector（带边界检查）
void SafeArrayAccess() 
{
    std::vector<int> vec = {1, 2, 3, 4, 5};
    
    // ✅ at()会检查边界
    try 
    {
        std::cout << vec.at(5) << std::endl;  // 抛出异常
    }
    catch (const std::out_of_range& e) 
    {
        std::cout << "捕获异常: " << e.what() << std::endl;
    }
}

int main() 
{
    SafeArrayAccess();
    return 0;
}

```

### ❌ 错误3：double free（重复释放）

```cpp
#include <iostream>

void DoubleFreeError() 
{
    int* p = new int(42);
    
    delete p;
    // delete p;  // 💥 第二次delete会崩溃！
    
    // ✅ 删除后置为nullptr
    p = nullptr;
    delete p;  // ✅ 删除nullptr是安全的（无操作）
}

void DoubleFreeError2() 
{
    int* p1 = new int(42);
    int* p2 = p1;  // 两个指针指向同一内存
    
    delete p1;
    // delete p2;  // 💥 重复释放同一内存
}

// ✅ 使用智能指针避免
void NoDoubleFree() 
{
    std::unique_ptr<int> p1 = std::make_unique<int>(42);
    // std::unique_ptr<int> p2 = p1;  // ❌ 编译错误：不能拷贝
    std::unique_ptr<int> p2 = std::move(p1);  // ✅ 转移所有权
    
    // p1现在是nullptr，p2拥有对象
}

int main() 
{
    DoubleFreeError();
    NoDoubleFree();
    return 0;
}

```

### ❌ 错误4：new和delete不匹配

```cpp
#include <iostream>

void MismatchedDeleteError() 
{
    // ❌ new搭配delete[]
    int* p1 = new int(42);
    // delete[] p1;  // 💥 错误！应该用delete

    // ❌ new[]搭配delete
    int* p2 = new int[10];
    // delete p2;  // 💥 错误！应该用delete[]
    
    // ✅ 正确的配对
    int* p3 = new int(42);
    delete p3;  // ✅
    
    int* p4 = new int[10];
    delete[] p4;  // ✅
}

class Test 
{
public:
    ~Test() 
    {
        std::cout << "析构" << std::endl;
    }
};

void MismatchedDeleteWithClass() 
{
    Test* arr = new Test[3];
    
    // ❌ 只调用一次析构函数
    // delete arr;  // 错误！应该用delete[]
    
    // ✅ 调用3次析构函数
    delete[] arr;
}

int main() 
{
    MismatchedDeleteError();
    MismatchedDeleteWithClass();
    return 0;
}

```

### ❌ 错误5：野指针（未初始化的指针）

```cpp
#include <iostream>

void WildPointerError() 
{
    int* p;  // ⚠️ 未初始化，指向随机地址
    
    // *p = 42;  // 💥 写入随机内存位置
    // std::cout << *p << std::endl;  // 💥 读取随机内存
}

// ✅ 总是初始化指针
void SafePointer() 
{
    int* p1 = nullptr;  // ✅ 初始化为空
    
    if (p1 != nullptr) 
    {
        *p1 = 42;  // 安全检查后使用
    }
    
    int* p2 = new int(42);  // ✅ 初始化为有效地址
    std::cout << *p2 << std::endl;
    delete p2;
    p2 = nullptr;  // ✅ 删除后置空
}

int main() 
{
    SafePointer();
    return 0;
}

```

## 九、虚幻引擎中的内存管理

### 9.1 UObject的垃圾回收

```cpp
// UE中，UObject派生类不应该手动new/delete

// ❌ 错误：手动new UObject
UCLASS()
class AMyActor : public AActor 
{
    GENERATED_BODY()
};

void WrongWay() 
{
    // AMyActor* actor = new AMyActor();  // ❌ 错误！
}

// ✅ 正确：使用UE的对象创建方法
void CorrectWay(UWorld* World) 
{
    // 方式1：SpawnActor
    AMyActor* actor = World->SpawnActor<AMyActor>();
    
    // 方式2：NewObject
    UMyObject* obj = NewObject<UMyObject>();
    
    // 不需要delete，UE的垃圾回收系统会处理
}

```

### 9.2 TArray vs std::vector

```cpp
// TArray内部使用堆内存，但由UE管理

UCLASS()
class AInventoryManager : public AActor 
{
    GENERATED_BODY()
    
    // ✅ TArray：UE推荐
    UPROPERTY()
    TArray<FString> Items;
    
    // ⚠️ std::vector：可以用，但不能用UPROPERTY
    std::vector<FString> ItemsStd;
    
public:
    void AddItem(const FString& Item) 
    {
        Items.Add(Item);  // TArray自动管理堆内存
    }
};

```

### 9.3 UE的内存分配器

```cpp
// UE提供自定义的内存分配函数

void UEMemoryExample() 
{
    // FMemory：UE的内存管理接口
    void* Memory = FMemory::Malloc(1024);  // 分配1KB
    FMemory::Memset(Memory, 0, 1024);      // 清零
    FMemory::Free(Memory);                 // 释放
    
    // 对齐分配
    void* AlignedMemory = FMemory::Malloc(1024, 16);  // 16字节对齐
    FMemory::Free(AlignedMemory);
}

// 自定义分配器的类
class CustomAllocatedClass 
{
public:
    void* operator new(size_t Size) 
    {
        return FMemory::Malloc(Size);
    }
    
    void operator delete(void* Ptr) 
    {
        FMemory::Free(Ptr);
    }
};

```

### 9.4 栈内存的使用场景（UE）

```cpp
// ✅ 小型临时数据：栈
void ProcessTransform(const FTransform& Transform) 
{
    FVector Location = Transform.GetLocation();    // 栈上
    FRotator Rotation = Transform.Rotator();       // 栈上
    FVector Forward = Rotation.Vector();           // 栈上
    
    // 临时计算，函数结束后自动清理
}

// ✅ 中型数据：栈（但要小心大小）
void ProcessSmallArray() 
{
    FVector Points[100];  // 1200字节，栈上OK
    
    for (int i = 0; i < 100; i++) 
    {
        Points[i] = FVector(i, i, i);
    }
}

// ❌ 大型数据：不要放栈上
void ProcessLargeData() 
{
    // FVector HugeArray[100000];  // 1.2MB - 太大，栈溢出！
    
    // ✅ 使用TArray（堆）
    TArray<FVector> HugeArray;
    HugeArray.SetNum(100000);
}

```

### 9.5 UE性能优化建议

```cpp
UCLASS()
class AOptimizedActor : public AActor 
{
    GENERATED_BODY()
    
    // ✅ 频繁使用的小数据：值类型（栈）
    FVector CachedLocation;
    FRotator CachedRotation;
    
    // ✅ 大型资源：指针（堆）
    UPROPERTY()
    UStaticMeshComponent* MeshComponent;
    
    // ✅ 可选/动态数据：指针
    UPROPERTY()
    UParticleSystemComponent* ParticleSystem;  // 可能为nullptr
    
    // ✅ 集合：TArray
    UPROPERTY()
    TArray<AActor*> NearbyActors;
    
public:
    void OptimizedTick(float DeltaTime) 
    {
        // ✅ 临时计算在栈上
        FVector Delta = GetActorForwardVector() * DeltaTime * 100.0f;
        FVector NewLocation = CachedLocation + Delta;
        
        // ✅ 避免不必要的堆分配
        // AActor* TempActor = NewObject<AActor>();  // ❌ 每帧new，太慢
        
        // ✅ 重用对象池
        AActor* PooledActor = GetFromPool();
    }
    
private:
    AActor* GetFromPool() 
    {
        // 对象池实现...
        return nullptr;
    }
};

```

## 十、最佳实践

### 决策流程图

```cpp
需要分配内存？
    │
    ├─ 是否在编译时知道大小？
    │   ├─ 是 → 是否较小（<几KB）？
    │   │   ├─ 是 → 使用栈（局部变量/数组）
    │   │   └─ 否 → 使用堆（std::vector/TArray）
    │   └─ 否 → 使用堆（动态分配）
    │
    ├─ 生命周期是否超过当前作用域？
    │   ├─ 是 → 使用堆（指针/容器）
    │   └─ 否 → 使用栈
    │
    └─ 是否需要多态？
        ├─ 是 → 使用堆（指针）
        └─ 否 → 优先栈

```

### 核心规则

✅ 栈的适用场景：
1. 小型局部变量（&lt;1KB）
2. 生命周期在当前作用域内
3. 大小在编译时已知
4. 临时计算结果
5. 频繁分配和释放的小对象

✅ 堆的适用场景：
1. 大型数据结构（&gt;几KB）
2. 生命周期超过当前作用域
3. 大小在运行时确定
4. 多态对象（基类指针）
5. 需要在函数间传递所有权

✅ 智能指针的使用：
1. unique_ptr：独占所有权
2. shared_ptr：共享所有权
3. weak_ptr：避免循环引用

❌ 避免的做法：
1. 在栈上分配大数组
2. 返回栈变量的指针/引用
3. 手动new/delete（优先智能指针）
4. 忘记delete导致内存泄漏
5. new和delete不匹配

今天的知识点你都有Get到吗~

有没有什么疑问，我们在评论区见哦~

你们也可以告诉我有什么是你们想知道的

![](./image-1.jpg)

![](./image-2.jpg)
