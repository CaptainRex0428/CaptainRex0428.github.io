---
title: "重启RestArt ProjectA｜20.Operators & Operator Overloading"
description: "加减乘除在编程中是我们最普遍的应用，我们声明的整数、浮点数等等都可以做加减乘除，但是我们也会发现一个问题，尤其是在游戏开发中，我们经常会需要使用二维向量、三维向量以及矩阵等等来进行计算，但是C++中并…"
category: tools
tags: ['C++', 'ProjectA', '编程基础']
date: 2025-05-30
readTime: 3
heroImage: "./cover.webp"
published: true
---
加减乘除在编程中是我们最普遍的应用，我们声明的整数、浮点数等等都可以做加减乘除，但是我们也会发现一个问题，尤其是在游戏开发中，我们经常会需要使用二维向量、三维向量以及矩阵等等来进行计算，但是C++中并没有内置向量或者矩阵的任何类，更不可能给我们预制好向量和矩阵的任何算法，难道我们就束手无策了吗？

这就要说到C++的灵活性了，其运算符是可以被覆写和重新定义的~这个过程就被叫做运算符重载

运算符重载就是让自定义类型支持 + - * / == 等运算符

## 一、运算符重载的声明

运算符重载和函数定义的基本要求相同，唯一不同的是需要标识其是operator然后再加上原始符号即可

```cpp
#include <iostream>
#define LOG(X) std::cout << X << std::endl

// 2D向量结构体（游戏开发核心组件）
struct Vector2D {
    float x, y;  // 坐标分量

    // 运算符重载：向量加法 ➕
    Vector2D operator+(const Vector2D& other) const {
        return { x + other.x, y + other.y };  // 分量相加
    }

    // 运算符重载：向量乘法 ✖️（分量相乘）
    Vector2D operator*(const Vector2D& other) const {
        return { x * other.x, y * other.y };
    }

    // 运算符重载：标量乘法 ✖️（向量缩放）
    Vector2D operator*(float scalar) const {
        return { x * scalar, y * scalar };
    }

    // 运算符重载：相等比较 ==
    bool operator==(const Vector2D& other) const {
        return (x == other.x) && (y == other.y);
    }

    // 运算符重载：不等比较 !=
    bool operator!=(const Vector2D& other) const {
        return !(*this == other);  // 复用==运算符
    }
};

// 全局重载：输出流运算符 <<
std::ostream& operator<<(std::ostream& stream, const Vector2D& vec) {
    stream << "(" << vec.x << ", " << vec.y << ")";
    return stream;
}

int main() {
    Vector2D position  = {1.0f, 2.0f};
    Vector2D velocity  = {0.5f, 1.5f};
    Vector2D direction = {2.0f, 0.5f};
    float deltaTime = 1.6f;

    // 物理运动：位置 = 位置 + 速度 * 方向 * 时间
    Vector2D newPosition = position + velocity * direction * deltaTime;

    LOG("StartPosition: " << position);
    LOG("EndPosition: " << newPosition);  // 输出: (1.0 + 0.5*2.0*1.6, 2.0 + 1.5*0.5*1.6)
}

```

这个案例中我们声明了一个二维向量Vector2D，同时对常用的加减和比较算法进行了重载，使得我们在使用的时候可以支持两个二维向量之间的比较和加减

这也就使得我们在使用的时候，可以像案例中Vector2D newPosition = position + velocity * direction * deltaTime; 一样更好地去组织容易让人理解的代码了

同时值得注意的是，我们还声明了一个全局的运算符重载&lt;&lt; ，这个运算符可以允许我们将Vector2D传入输出流中进行处理，决定了要怎么在控制台输出这个向量，方便我们显示或者Debug

常用运算符重载对照表

| 运算符 | 成员函数签名 | 典型应用场景 |
| --- | --- | --- |
| + | T operator+(const T&) const; | 向量/矩阵加法 |
| - | T operator-(const T&) const; | 向量减法/取负 |
| * | T operator*(float) const; | 标量乘法 |
| / | T operator/(float) const; | 标量除法 |
| == | bool operator==(const T&) const; | 向量/颜色比较 |
| != | bool operator!=(const T&) const; | 不等判断 |
| << | friend ostream& operator<<(ostream&, const T&); | 调试输出 |
| [] | float& operator[](int index); | 向量分量访问 |
| () | float operator()(int i, int j) const; | 矩阵元素访问 |

## 二、最佳实践与性能优化

### 1. 返回优化（避免临时对象）

```cpp
// 优化前：创建临时对象
Vector2D operator+(const Vector2D& other) 
{
    Vector2D temp; // 额外构造
    temp.x = x + other.x;
    temp.y = y + other.y;
    return temp;
}

// 优化后：直接返回初始化
Vector2D operator+(const Vector2D& other) const 
{
    return {x + other.x, y + other.y}; // C++11统一初始化
}

```

### 2. 复合赋值运算符

```cpp
// 实现复合赋值 +=
Vector2D& operator+=(const Vector2D& other) 
{
    x += other.x;
    y += other.y;
    return *this; // 支持链式调用
}

// 复用实现普通加法
Vector2D operator+(const Vector2D& other) const 
{
    Vector2D result = *this;
    result += other; // 复用+=
    return result;
}

```

### 3. const正确性

```cpp
// 正确：const成员函数
float Length() const 
{ 
    return sqrt(x*x + y*y); // 不修改成员
}

// 错误：非const修改
Vector2D operator*(float scalar) 
{ 
    x *= scalar; // 意外修改原对象！
    return *this;
}

```

### 4. 友元函数应用

```cpp
// 全局运算符访问私有成员
friend Vector2D operator*(float scalar, const Vector2D& vec);

```

相对来说友元函数比较特殊，其实对于单一的类来说用不上友元，但是如果是针对两个不同的类，比如Vector2D和Vector3D之间要做加减乘除，那就需要使用友元函数了

### 5.将在向量中用不到的位运算符利用起来

```cpp
struct Vector3D {
    float x, y, z;

    // 点积运算
    float operator|(const Vector3D& other) const {
        return x*other.x + y*other.y + z*other.z;
    }

    // 叉积运算
    Vector3D operator^(const Vector3D& other) const {
        return {
            y*other.z - z*other.y,
            z*other.x - x*other.z,
            x*other.y - y*other.x
        };
    }
};

// 使用示例
Vector3D up = {0,1,0};
Vector3D right = {1,0,0};
Vector3D forward = up ^ right; // 叉积求前方向量

```

## 三、常见陷阱与调试

陷阱1：忽略返回值优化

```cpp
// 错误：返回局部变量引用
const Vector2D& operator+(...) {
    Vector2D temp(...);
    return temp; // temp将被销毁！
}

```

陷阱2：错误处理自赋值

```cpp
Vector2D& operator=(const Vector2D& other) 
{
    // 缺少自赋值检查
    x = other.x;
    y = other.y;
    return *this;
}

// 正确版本
Vector2D& operator=(const Vector2D& other) 
{
    if(this == &other) return *this; // 自赋值检查
    x = other.x;
    y = other.y;
    return *this;
}

```

陷阱3：混淆前置/后置运算符

```cpp
// 前置++
Vector2D& operator++() 
{
    x++; y++;
    return *this;
}

// 后置++
Vector2D operator++(int) 
{
    Vector2D temp = *this;
    ++(*this); // 复用前置++
    return temp;
}

```

今天的知识点你都有Get到吗~

有没有什么疑问，我们在评论区见哦~

你们也可以告诉我有什么是你们想知道的

![](./image-1.jpg)

![](./image-2.jpg)
