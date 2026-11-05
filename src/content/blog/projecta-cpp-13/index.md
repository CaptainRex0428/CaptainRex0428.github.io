---
title: "重启RestArt ProjectA｜13.多返回值处理"
description: "我们以游戏开发为例，在游戏开发中，我们的常见需求往往都不是那么单一，而且有时候我们正在极致性能的要求下，不希望同样的事情在一帧之内重复做多次，在完成一个任务的过程中，可能刚好另一个任务的值也可以被计算…"
category: tools
tags: ['C++', 'ProjectA', '编程基础']
date: 2025-04-22
readTime: 4
heroImage: "./image-1.jpg"
published: true
---
我们以游戏开发为例，在游戏开发中，我们的常见需求往往都不是那么单一，而且有时候我们正在极致性能的要求下，不希望同样的事情在一帧之内重复做多次，在完成一个任务的过程中，可能刚好另一个任务的值也可以被计算出来，那我们是不是就存在了这样的一种情况，我们的一个任务函数需要返回多个不同的值？这样才能满足我们多维度变量的需要。

比如游戏开发中一些常见需求：

1.同时获取角色位置和旋转

2.技能释放返回伤害值和状态效果

3.物理检测返回碰撞点和碰撞物体

4.资源加载返回资源指针和加载状态

5.AI计算返回移动方向和移动速度

所以我们这一篇的主题就是如何应对多返回值的情况。这里给大家变量参数、数组指针、模板数组、元组、结构体以及C++17的结构化绑定五种方式作为参考，分别分析其可行性和优劣，大家在实践中有选择性使用。

## 一、引用参数传值

引用传值我们在之前的函数一篇和指针一篇已经有所涉及，我们初步知道了什么是引用传值，什么是复制传值。

这种传值方式相对来说更加稳定，适应性更广，兼容性更强，不会导致一些C++不同版本标准之间的冲突。

```cpp
void GetPlayerStatus(int& Health, float& Stamina) 
{
    Health = 100;
    Stamina = 50.0f;
}

// 调用方需要预先声明变量
int hp;
float sp;
GetPlayerStatus(hp, sp);

```

️这种方式适合修改已有变量，不推荐作为返回机制

✅ 优点：兼容性最好，C++98可用

❌ 缺点：代码可读性差，无法链式调用

## 二、数组/指针

关于数组我们都已经理解了数组的变量名其实是指向数组第一个元素的指针，那同类型的多返回参数，我们是否可以使用数字来返回呢？当然是可以的

### 第一种方式——返回指向数组的指针

```cpp
#include <iostream>
#include <string>

std::string * preShader()
{
    std::string first = "first";
    std::string second = "second";

    std::string * shi = new std::string[] {first,second};

    return shi;
}

int main() 
{
    std::string * result = preShader();

    std::cout << result[0] << std::endl;
    std::cout << result[1] << std::endl;
}

```

这种方式要注意使用后，数组是存在于堆上的，要主动释放。

### 第二种方式——返回std::array数组

```cpp
#include <iostream>
#include <string>
#include <array>

std::array<std::string, 2> preShader()
{
    std::string first = "first";
    std::string second = "second";

    return {first,second};
}

int main() {

    std::array<std::string, 2>  result = preShader();

    std::cout << std::get<0>(result) << std::endl;
    std::cout << std::get<1>(result) << std::endl;
}

```

这里使用到了标准库中的array，具体可以参考std::array一篇

这种返回值std::array是声明在堆上的，函数返回值是复制返回，当超过作用域后会自动析构。

️这种方式适合同类型变量返回值

✅ 优点：兼容性最好，结构紧凑

❌ 缺点：索引访问不直观，类型不安全

## 三、tuple/pair

我们在std::map一篇中有提到insert和emplace的返回值并不是一个单一的值，而是std::pair&lt;iterator, bool&gt; 这就是我们处理多返回值的另一种方式，使用pair或者tuple

### 使用tuple

```cpp
#include <iostream>
#include <string>
#include <tuple>

std::tuple<std::string, std::string, int> preShader(){
    std::string first = "first";
    std::string second = "second";

    return {first,second,3};
}

int main() {

    std::tuple<std::string, std::string, int> result = preShader();

    std::cout << std::get<0>(result) << std::endl;
    std::cout << std::get<1>(result) << std::endl;
    std::cout << std::get<2>(result) << std::endl;
}

```

### 使用pair

```cpp
#include <iostream>
#include <string>
#include <utility>

std::pair<std::string, std::string> preShader(){
    std::string first = "first";
    std::string second = "second";

    return {first,second};
}

int main() {

    std::pair result = preShader();

    std::cout << result.first << std::endl;
    std::cout << result.second << std::endl;
}

```

✅ 优点：快速组合不同类型数据

❌ 缺点：字段含义不明确（需要查定义）

### pair和tuple的区别

| 特性 | std::pair | std::tuple |
| --- | --- | --- |
| 元素数量 | 固定2个 | 任意数量（1~N个） |
| 语义明确性 | 通过first/second命名 | 只能通过索引访问 |
| 内存布局 | 更紧凑（通常无padding优化） | 可能有内存对齐padding |
| 版本支持 | C++98起 | C++11起 |
| 典型使用场景 | 键值对、坐标、范围等明确成对数据 | 临时组合多个异构数据 |

### ️ 技术细节对比

1. 元素访问方式

```cpp
// pair的明确命名访问
std::pair<int, int> screenRes(1920, 1080);
int width = screenRes.first;   // 直观
int height = screenRes.second;

// tuple的索引访问（C++17前）
std::tuple<int, int, bool> displayMode(2560, 1440, true);
int width = std::get<0>(displayMode);  // 需要记住顺序
bool hdr = std::get<2>(displayMode);   // 容易出错！

```

2. 结构化绑定（C++17）

```cpp
// pair的优雅解包
auto [minDmg, maxDmg] = std::make_pair(50, 150);
UE_LOG(LogTemp, Log, TEXT("伤害范围：%d-%d"), minDmg, maxDmg);

// tuple的多参数解包
auto [x, y, z] = std::make_tuple(100.f, 200.f, 50.f);
Character.JumpTo(FVector(x, y, z));

```

3. 类型推导差异

```cpp
// pair自动推导（C++17）
auto weapon = std::make_pair("LaserGun", 200); // pair<const char*, int>

// tuple需要明确类型或使用make_tuple
auto potion = std::make_tuple("Healing", 50, 30.0f); // tuple<const char*, int, double>

```

## 四、结构体/类

结构体或者类使用我们通过自己的定义重新确定我们想返回的类型，这种方式虽然体量庞大，但是在语义上更容易被理解

尤其在游戏引擎中我们自定义处理shader时，更容易理解每个部分的定义

```cpp
#include <iostream>
#include <string>

struct shaderInfo
{
    std::string vertex;
    std::string fragment;
};


shaderInfo preShader()
{
    std::string v = "vertexInfo";
    std::string f = "fragmentInfo";

    return {v,f};
}

int main()
{

    shaderInfo result = preShader();

    std::cout << result.vertex << std::endl;
    std::cout << result.fragment << std::endl;
}

```

✅ 优点：代码自解释性强，支持扩展

❌ 缺点：需要预先定义结构体

## 五、结构化绑定（C++17）

auto[]结构化绑定是一个C++17之后的新特性，使用时务必注意版本

使用auto[]可以自动绑定返回的std::tuple&lt;_T&gt;值和std::pair&lt;_T1,_T2&gt;值

```cpp
#include <iostream>
#include <tuple>
#include <string>

std::tuple<std::string, int> CreatePlayer()
{
    return {"default name",12};
};

int main()
{
    auto[name,age] = CreatePlayer();

    std::cout << name << std::endl;
    std::cout << age << std::endl;
}

```

这种方式结合我们的std::tuple或者std::pair在语义上会更容易被理解，且能直接对元素进行变量赋值

✅ 优点：代码简洁，类型自动推导

❌ 缺点：需要C++17支持，字段顺序敏感

## 六、性能与可读性平衡技巧

小数据（&lt;=4个）：优先使用结构化绑定

高频访问数据：使用引用参数

跨模块通信：推荐明确的结构体

临时调试数据：可用tuple快速实现

今天的知识点你都有Get到吗~

有没有什么疑问，我们在评论区见哦~

你们也可以告诉我有什么是你们想知道的

![](./image-1.jpg)

![](./image-2.jpg)
