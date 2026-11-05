---
title: "重启RestArt ProjectA｜25.Template"
description: "一、什么是模板(template)想象你在经营一家蛋糕店，客户想要不同口味的蛋糕：草莓蛋糕、巧克力蛋糕、抹茶蛋糕… 如果没有模具，你需要为每种口味单独设计制作流程： // 没有模板的世界 😰 void…"
category: tools
tags: ['C++', 'ProjectA', '编程基础']
date: 2025-11-07
readTime: 4
heroImage: "./cover.webp"
published: true
---
## 一、什么是模板(template)

想象你在经营一家蛋糕店，客户想要不同口味的蛋糕：草莓蛋糕、巧克力蛋糕、抹茶蛋糕…

如果没有模具，你需要为每种口味单独设计制作流程：

```cpp
// 没有模板的世界 😰
void MakeStrawberryCake() 
{
    准备材料();
    混合草莓();
    烘烤();
    装饰();
}

void MakeChocolateCake() 
{
    准备材料();
    混合巧克力();
    烘烤();
    装饰();
}

void MakeMatchaCake() 
{
    准备材料();
    混合抹茶();
    烘烤();
    装饰();
}
// 每个口味都要写一遍... 😫

```

但如果你有一个万能模具，只需要替换不同的原料：

```cpp
// 有模板的世界 ✨
template<typename Flavor>
void MakeCake(Flavor flavor) 
{
    准备材料();
    混合(flavor);  // 根据口味自动调整
    烘烤();
    装饰();
}

// 使用
MakeCake(草莓);
MakeCake(巧克力);
MakeCake(抹茶);

```

这就是模板的优势——一份代码，多种类型！

模板让你写通用代码，编译器会根据你使用的具体类型自动生成对应的代码版本。

```cpp
模板代码 + 类型参数 → 编译器生成 → 具体类型的代码
```

## 二、Code Instance

### 问题：重复的代码

假设我们需要写一个”返回较大值”的函数：

```cpp
// 没有模板：需要为每种类型写一个版本
int Max(int a, int b) 
{
    return (a > b) ? a : b;
}

float Max(float a, float b) 
{
    return (a > b) ? a : b;
}

double Max(double a, double b) 
{
    return (a > b) ? a : b;
}
// 如果还有其他类型呢？😱
```

### 解决：函数模板

```cpp
// 使用模板：一个函数搞定所有类型！
template<typename T>
T Max(T a, T b) 
{
    return (a > b) ? a : b;
}

int main() 
{
    // 编译器自动推导类型
    std::cout << Max(10, 20) << std::endl;        // T = int
    std::cout << Max(3.14f, 2.71f) << std::endl;  // T = float
    std::cout << Max(100.5, 99.9) << std::endl;   // T = double
    
    // 也可以显式指定类型
    std::cout << Max<int>(10, 20) << std::endl;
    
    return 0;
}
```

编译器在幕后做了什么？

```cpp
// 编译器看到 Max(10, 20)，自动生成：
int Max(int a, int b) { return (a > b) ? a : b; }

// 编译器看到 Max(3.14f, 2.71f)，自动生成：
float Max(float a, float b) { return (a > b) ? a : b; }
```

这个过程叫做模板实例化

## 三、函数模板声明和使用

### Part1. 模板语法解析

```cpp
template<typename T>  // ← 模板声明
//       ^^^^^^^^ 类型参数名（可以是任何名字）
T Max(T a, T b)      // ← 使用类型参数
{
    return (a > b) ? a : b;
}

```

关键字选择：

```cpp
// 两种写法完全等价
template<typename T>  // ✅ 推荐（更准确）
template<class T>     // ✅ 也可以（历史原因）

// typename更准确，因为T可以是int、float等基本类型，不一定是class

```

### Part2. 多个类型参数

```cpp
// 可以有多个类型参数
template<typename T1, typename T2>
void Print(T1 first, T2 second) 
{
    std::cout << first << " and " << second << std::endl;
}

// 使用
Print(10, 3.14);           // T1=int, T2=double
Print("Hello", 42);        // T1=const char*, T2=int
Print(true, "World");      // T1=bool, T2=const char*

```

### Part3. 返回值可以是不同类型

```cpp
template<typename T1, typename T2, typename ReturnType>
ReturnType Add(T1 a, T2 b) 
{
    return static_cast<ReturnType>(a + b);
}

// 使用（必须显式指定返回类型）
auto result = Add<int, float, double>(10, 3.14f);

```

C++11后可以用auto自动推导返回类型：

```cpp
template<typename T1, typename T2>
auto Add(T1 a, T2 b) -> decltype(a + b)  // 尾置返回类型
{
    return a + b;
}

// C++14 更简单
template<typename T1, typename T2>
auto Add(T1 a, T2 b) 
{
    return a + b;  // 编译器自动推导
}

```

### Part4. 非类型模板参数

模板参数不仅可以是类型，还可以是常量值：

```cpp
// N是编译期常量
template<typename T, int N>
void PrintArray(T (&arr)[N])  // N是数组大小
{
    for (int i = 0; i < N; i++) 
    {
        std::cout << arr[i] << " ";
    }
    std::cout << std::endl;
}

// 使用
int numbers[] = {1, 2, 3, 4, 5};
PrintArray(numbers);  // 自动推导 T=int, N=5

```

## 四、类模板声明和使用

函数模板解决了函数的通用性，类模板解决了类的通用性

### Part1. 第一个类模板

```cpp
// 通用数组类
template<typename T>
class Array 
{
private:
    T* data;
    int size;
    
public:
    Array(int s) : size(s) 
    {
        data = new T[size];
    }
    
    ~Array() 
    {
        delete[] data;
    }
    
    T& operator[](int index) 
    {
        return data[index];
    }
    
    int GetSize() const 
    {
        return size;
    }
};

// 使用
int main() 
{
    Array<int> intArray(5);      // T = int
    intArray[0] = 10;
    intArray[1] = 20;
    
    Array<float> floatArray(3);  // T = float
    floatArray[0] = 3.14f;
    
    Array<std::string> strArray(2);  // T = std::string
    strArray[0] = "Hello";
    
    return 0;
}

```

注意： 类模板必须显式指定类型，不能自动推导（&lt; C++17）：

```cpp
Array arr(5);        // ❌ 错误！不知道T是什么类型
Array<int> arr(5);   // ✅ 正确

```

### Part2. 类模板的成员函数定义

方式1：类内定义

```cpp
template<typename T>
class MyClass 
{
public:
    void Print(T value) 
    {
        std::cout << value << std::endl;
    }
};

```

方式2：类外定义

```cpp
template<typename T>
class MyClass 
{
public:
    void Print(T value);  // 声明
};

// 类外定义（注意语法）
template<typename T>
void MyClass<T>::Print(T value)  // 需要 MyClass<T>::
{
    std::cout << value << std::endl;
}

```

### Part3. 多个模板参数的类

```cpp
template<typename KeyType, typename ValueType>
class KeyValuePair 
{
private:
    KeyType key;
    ValueType value;
    
public:
    KeyValuePair(KeyType k, ValueType v) : key(k), value(v) {}
    
    void Print() 
    {
        std::cout << "Key: " << key << ", Value: " << value << std::endl;
    }
};

// 使用
KeyValuePair<std::string, int> age("Alice", 25);
age.Print();  // Key: Alice, Value: 25

KeyValuePair<int, float> score(1, 95.5f);
score.Print();  // Key: 1, Value: 95.5

```

### Part4. 默认模板参数

```cpp
template<typename T, int Size = 10>  // 默认大小为10
class FixedArray 
{
private:
    T data[Size];
    
public:
    T& operator[](int index) 
    {
        return data[index];
    }
};

// 使用
FixedArray<int> arr1;        // 使用默认Size=10
FixedArray<int, 20> arr2;    // 自定义Size=20

```

## 五、模板特化——为特殊类型定制

有时候某些类型需要特殊处理，这时候用模板特化：

### 完全特化（Full Specialization）

```cpp
// 通用模板
template<typename T>
class Storage 
{
public:
    void Info() 
    {
        std::cout << "Generic storage" << std::endl;
    }
};

// 为bool类型特化（节省空间用位存储）
template<>
class Storage<bool> 
{
public:
    void Info() 
    {
        std::cout << "Optimized bool storage (uses bits)" << std::endl;
    }
};

// 使用
Storage<int> intStorage;
intStorage.Info();  // 输出: Generic storage

Storage<bool> boolStorage;
boolStorage.Info();  // 输出: Optimized bool storage (uses bits)

```

### 偏特化（Partial Specialization）——仅类模板支持

```cpp
// 通用模板
template<typename T1, typename T2>
class Pair 
{
public:
    void Info() 
    {
        std::cout << "Generic pair" << std::endl;
    }
};

// 偏特化：两个类型相同时
template<typename T>
class Pair<T, T> 
{
public:
    void Info() 
    {
        std::cout << "Same type pair" << std::endl;
    }
};

// 偏特化：第二个类型是int时
template<typename T>
class Pair<T, int> 
{
public:
    void Info() 
    {
        std::cout << "Second type is int" << std::endl;
    }
};

// 使用
Pair<float, double> p1;
p1.Info();  // Generic pair

Pair<int, int> p2;
p2.Info();  // Same type pair

Pair<std::string, int> p3;
p3.Info();  // Second type is int

```

注意： 函数模板不支持偏特化，只支持完全特化

## 六、开发案例解析

### 案例1：Vector容器实现

```cpp
template<typename T>
class Vector 
{
private:
    T* data;
    int capacity;
    int count;
    
public:
    Vector() : capacity(10), count(0) 
    {
        data = new T[capacity];
    }
    
    ~Vector() 
    {
        delete[] data;
    }
    
    void Add(const T& item) 
    {
        if (count >= capacity) 
        {
            Resize();
        }
        data[count++] = item;
    }
    
    T& Get(int index) 
    {
        return data[index];
    }
    
    int Size() const 
    {
        return count;
    }
    
private:
    void Resize() 
    {
        capacity *= 2;
        T* newData = new T[capacity];
        for (int i = 0; i < count; i++) 
        {
            newData[i] = data[i];
        }
        delete[] data;
        data = newData;
    }
};

// 使用
int main() 
{
    Vector<int> numbers;
    numbers.Add(10);
    numbers.Add(20);
    numbers.Add(30);
    
    Vector<std::string> names;
    names.Add("Alice");
    names.Add("Bob");
    
    // 甚至可以存储自定义类型
    struct Enemy 
    {
        int hp;
        std::string name;
    };
    
    Vector<Enemy> enemies;
    enemies.Add({100, "Goblin"});
    enemies.Add({200, "Orc"});
    
    return 0;
}

```

### 案例2：智能指针简化版

```cpp
template<typename T>
class SmartPtr 
{
private:
    T* ptr;
    
public:
    // 构造函数
    SmartPtr(T* p = nullptr) : ptr(p) {}
    
    // 析构函数：自动释放内存
    ~SmartPtr() 
    {
        if (ptr) 
        {
            delete ptr;
            std::cout << "Memory freed" << std::endl;
        }
    }
    
    // 重载->运算符
    T* operator->() 
    {
        return ptr;
    }
    
    // 重载*运算符
    T& operator*() 
    {
        return *ptr;
    }
    
    // 禁止拷贝（简化版）
    SmartPtr(const SmartPtr&) = delete;
    SmartPtr& operator=(const SmartPtr&) = delete;
};

// 使用
struct Player 
{
    int hp = 100;
    void TakeDamage(int dmg) 
    {
        hp -= dmg;
        std::cout << "HP: " << hp << std::endl;
    }
};

int main() 
{
    {
        SmartPtr<Player> player(new Player());
        player->TakeDamage(30);
        (*player).hp = 50;
        
    }  // 离开作用域，自动调用析构函数释放内存
    
    std::cout << "No memory leak!" << std::endl;
    return 0;
}

```

### 案例3：对象池（Object Pool）

```cpp
template<typename T, int PoolSize = 100>
class ObjectPool 
{
private:
    T objects[PoolSize];
    bool used[PoolSize];
    
public:
    ObjectPool() 
    {
        for (int i = 0; i < PoolSize; i++) 
        {
            used[i] = false;
        }
    }
    
    T* Allocate() 
    {
        for (int i = 0; i < PoolSize; i++) 
        {
            if (!used[i]) 
            {
                used[i] = true;
                return &objects[i];
            }
        }
        return nullptr;  // 池子满了
    }
    
    void Free(T* obj) 
    {
        int index = obj - objects;  // 计算索引
        if (index >= 0 && index < PoolSize) 
        {
            used[index] = false;
        }
    }
    
    int GetUsedCount() const 
    {
        int count = 0;
        for (int i = 0; i < PoolSize; i++) 
        {
            if (used[i]) count++;
        }
        return count;
    }
};

// 使用
struct Bullet 
{
    float x, y;
    float velocityX, velocityY;
    
    void Init(float px, float py, float vx, float vy) 
    {
        x = px; y = py;
        velocityX = vx; velocityY = vy;
    }
};

int main() 
{
    ObjectPool<Bullet, 50> bulletPool;
    
    // 发射子弹
    Bullet* bullet1 = bulletPool.Allocate();
    if (bullet1) 
    {
        bullet1->Init(0, 0, 10, 0);
    }
    
    Bullet* bullet2 = bulletPool.Allocate();
    if (bullet2) 
    {
        bullet2->Init(5, 5, -5, 10);
    }
    
    std::cout << "Active bullets: " << bulletPool.GetUsedCount() << std::endl;
    
    // 子弹销毁，归还对象池
    bulletPool.Free(bullet1);
    
    std::cout << "Active bullets: " << bulletPool.GetUsedCount() << std::endl;
    
    return 0;
}

```

### 案例4：通用比较器

```cpp
template<typename T>
class Comparator 
{
public:
    static T Max(T a, T b) 
    {
        return (a > b) ? a : b;
    }
    
    static T Min(T a, T b) 
    {
        return (a < b) ? a : b;
    }
    
    static T Clamp(T value, T min, T max) 
    {
        if (value < min) return min;
        if (value > max) return max;
        return value;
    }
};

// 为自定义类型特化
struct Character 
{
    int level;
    int hp;
    
    bool operator>(const Character& other) const 
    {
        return level > other.level;  // 按等级比较
    }
    
    bool operator<(const Character& other) const 
    {
        return level < other.level;
    }
};

int main() 
{
    // 基本类型
    std::cout << Comparator<int>::Max(10, 20) << std::endl;  // 20
    std::cout << Comparator<float>::Min(3.14f, 2.71f) << std::endl;  // 2.71
    
    int hp = 150;
    hp = Comparator<int>::Clamp(hp, 0, 100);  // 限制在0-100
    std::cout << hp << std::endl;  // 100
    
    // 自定义类型
    Character hero{10, 100};
    Character enemy{5, 80};
    
    Character stronger = Comparator<Character>::Max(hero, enemy);
    std::cout << "Stronger level: " << stronger.level << std::endl;  // 10
    
    return 0;
}

```

### 案例5：事件系统

```cpp
template<typename EventType>
class EventHandler 
{
private:
    std::vector<void(*)(EventType)> callbacks;
    
public:
    void Subscribe(void(*callback)(EventType)) 
    {
        callbacks.push_back(callback);
    }
    
    void Trigger(EventType event) 
    {
        for (auto callback : callbacks) 
        {
            callback(event);
        }
    }
};

// 定义事件类型
struct DamageEvent 
{
    int damage;
    std::string source;
};

struct LevelUpEvent 
{
    int newLevel;
};

// 回调函数
void OnDamage(DamageEvent event) 
{
    std::cout << "Took " << event.damage << " damage from " 
              << event.source << std::endl;
}

void OnLevelUp(LevelUpEvent event) 
{
    std::cout << "Level up to " << event.newLevel << "!" << std::endl;
}

int main() 
{
    EventHandler<DamageEvent> damageHandler;
    damageHandler.Subscribe(OnDamage);
    
    EventHandler<LevelUpEvent> levelUpHandler;
    levelUpHandler.Subscribe(OnLevelUp);
    
    // 触发事件
    damageHandler.Trigger({50, "Goblin"});
    levelUpHandler.Trigger({10});
    
    return 0;
}

```

还有我们在图形学中做运算的时候也需要大量使用template来简化我们代码

下面我的这个库里面Matrix、Vector的实现都使用了template

## 七、新手常见五大错误

### 错误1：忘记在类外定义时写template

```cpp
template<typename T>
class MyClass 
{
public:
    void Print(T value);
};

// ❌ 错误：忘记写template
void MyClass<T>::Print(T value) 
{
    std::cout << value << std::endl;
}

// ✅ 正确
template<typename T>
void MyClass<T>::Print(T value) 
{
    std::cout << value << std::endl;
}

```

### 错误2：模板定义和实现分离

```cpp
// MyTemplate.h
template<typename T>
class MyClass 
{
public:
    void Print(T value);
};

// MyTemplate.cpp
template<typename T>
void MyClass<T>::Print(T value)  // ❌ 链接错误！
{
    std::cout << value << std::endl;
}

```

为什么错误？ 模板需要在编译期知道完整定义才能实例化，.cpp文件在其他编译单元不可见！

正确做法： 模板实现放在头文件中

```cpp
// MyTemplate.h
template<typename T>
class MyClass 
{
public:
    void Print(T value) 
    {
        std::cout << value << std::endl;
    }
};

// 或者在头文件末尾include实现文件
#include "MyTemplate.inl"

```

### 错误3：类模板忘记指定类型

```cpp
template<typename T>
class Array 
{
    T data[10];
};

// ❌ 错误
Array arr;  // 编译错误！T是什么？

// ✅ 正确
Array<int> arr;

```

### 错误4：模板参数类型不支持所需操作

```cpp
template<typename T>
T Max(T a, T b) 
{
    return (a > b) ? a : b;  // 要求T支持>运算符
}

struct MyClass 
{
    int value;
    // 没有重载>运算符
};

MyClass obj1{10}, obj2{20};
Max(obj1, obj2);  // ❌ 编译错误！MyClass没有>运算符

// 正确做法：为MyClass重载>运算符
struct MyClass 
{
    int value;
    
    bool operator>(const MyClass& other) const 
    {
        return value > other.value;
    }
};

```

### 错误5：模板特化时忘记完整语法

```cpp
template<typename T>
class MyClass 
{
public:
    void Info() { std::cout << "Generic" << std::endl; }
};

// ❌ 错误：忘记template<>
class MyClass<int> 
{
public:
    void Info() { std::cout << "Int version" << std::endl; }
};

// ✅ 正确
template<>
class MyClass<int> 
{
public:
    void Info() { std::cout << "Int version" << std::endl; }
};

```

## 八、最佳实践指南

### 原则一：模板声明和实现放在同一个头文件

```cpp
// MyTemplate.h

// ✅ 推荐方式1：类内实现
template<typename T>
class MyClass 
{
public:
    void Print(T value) 
    {
        std::cout << value << std::endl;
    }
};

// ✅ 推荐方式2：类外实现但在同一头文件
template<typename T>
class AnotherClass 
{
public:
    void Print(T value);
};

template<typename T>
void AnotherClass<T>::Print(T value) 
{
    std::cout << value << std::endl;
}

```

### 原则二：使用概念(Concepts)约束模板（&gt;C++20）

```cpp
// C++20: 使用Concepts明确类型要求
#include <concepts>

// 要求T必须可比较
template<typename T>
requires std::totally_ordered<T>
T Max(T a, T b) 
{
    return (a > b) ? a : b;
}

// 或者使用更简洁的语法
template<std::totally_ordered T>
T Max(T a, T b) 
{
    return (a > b) ? a : b;
}

```

### 原则三：为模板参数取有意义的名字

```cpp
// ❌ 不好
template<typename T, typename U, typename V>
class BadName { /* ... */ };

// ✅ 好
template<typename KeyType, typename ValueType, typename AllocatorType>
class GoodName { /* ... */ };

```

### 原则四：提供默认模板参数

```cpp
template<typename T, typename AllocatorType = std::allocator<T>>
class Container 
{
    // 大部分情况使用默认分配器
    // 高级用户可以自定义
};

// 使用
Container<int> c1;  // 使用默认分配器
Container<int, MyCustomAllocator<int>> c2;  // 自定义分配器

```

### 原则五：使用static_assert验证模板参数

```cpp
template<typename T>
class NumericArray 
{
    static_assert(std::is_arithmetic<T>::value, 
                  "T must be a numeric type");
    // 编译期检查T必须是数字类型
};

NumericArray<int> arr1;        // ✅ 通过
NumericArray<std::string> arr2;  // ❌ 编译错误并显示友好提示

```

## 九、模板 vs 其他方案

### 模板 vs 函数重载

```cpp
// 函数重载：需要为每种类型写一遍
int Max(int a, int b) { return (a > b) ? a : b; }
float Max(float a, float b) { return (a > b) ? a : b; }
double Max(double a, double b) { return (a > b) ? a : b; }

// 模板：一次搞定
template<typename T>
T Max(T a, T b) { return (a > b) ? a : b; }

```

### 模板 vs 继承/多态

```cpp
// 继承方式：运行时多态，有虚函数开销
class Container 
{
public:
    virtual void Add(void* item) = 0;
    virtual void* Get(int index) = 0;
};

// 模板方式：编译期多态，零开销，类型安全
template<typename T>
class Container 
{
public:
    void Add(T item) { /* ... */ }
    T Get(int index) { /* ... */ }
};

```

何时用模板：

- ✅ 需要类型安全

- ✅ 需要性能（零运行时开销）

- ✅ 处理多种类型的相同逻辑

何时用继承：

- ✅ 需要运行时决定类型

- ✅ 需要存储不同类型在同一容器

- ✅ 代码量增长会导致二进制膨胀时

## 十、调试技巧

### 查看模板实例化

```cpp
// 故意触发编译错误来查看类型
template<typename T>
void DebugType(T value) 
{
    // 留空或使用static_assert
    static_assert(sizeof(T) == 0, "Debug type");
}

// 调用时编译器会显示T的具体类型
DebugType(10);  // 错误信息会显示 T = int

```

### 使用IDE的类型推导

```cpp
template<typename T>
void MyFunction(T value) 
{
    // 鼠标悬停在value上，IDE会显示T的实际类型
    auto result = value * 2;
}

```

今天的知识点你都有Get到吗~

有没有什么疑问，我们在评论区见哦~

你们也可以告诉我有什么是你们想知道的

![](./image-1.jpg)

![](./image-2.jpg)
