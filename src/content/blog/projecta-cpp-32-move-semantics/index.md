---
title: "重启RestArt ProjectA｜32.Move Semantics移动语义"
description: "一、什么是移动语义(Move Semantics)生活中的”拷贝”与”移动”想象以下场景： 🏠 场景1：搬家❌ 拷贝方式（传统做法）： 1. 把旧房子里的所有东西复制一份 2. 把复制品搬到新房子 3…"
category: tools
tags: ['C++', 'ProjectA', '编程基础']
date: 2025-11-11
readTime: 6
heroImage: "./cover.webp"
published: true
---
## 一、什么是移动语义(Move Semantics)

### 生活中的”拷贝”与”移动”

想象以下场景：

🏠 场景1：搬家

```cpp
❌ 拷贝方式（传统做法）：
   1. 把旧房子里的所有东西复制一份
   2. 把复制品搬到新房子
   3. 旧房子的东西还在原地
   结果：两份东西，浪费空间和时间

✅ 移动方式（高效做法）：
   1. 直接把旧房子的东西搬到新房子
   2. 旧房子空了
   结果：只有一份东西，节省空间和时间

```

💰 场景2：转账

```cpp
❌ 拷贝方式：
   你账户：1000元 → 复制1000元 → 朋友账户：1000元
   结果：系统凭空多了1000元（这不合理！）

✅ 移动方式：
   你账户：1000元 → 转移1000元 → 你账户：0元
   朋友账户：0元 → 接收1000元 → 朋友账户：1000元
   结果：总金额不变，所有权转移

```

📦 场景3：快递配送

```cpp
❌ 拷贝方式：
   仓库的货物 → 复制一份 → 送到你家
   仓库还有一份（占用仓储空间）

✅ 移动方式：
   仓库的货物 → 直接发货 → 送到你家
   仓库没有了（释放仓储空间）

```

这就是移动语义的核心逻辑——当一个对象即将”死亡”时，不要浪费时间拷贝它，直接”偷走”它的资源！

### C++中的问题场景

在C++11之前，以下代码会发生什么？

```cpp
#include <iostream>
#include <vector>

std::vector<int> CreateVector() 
{
    std::vector<int> temp;
    for (int i = 0; i < 1000000; i++) 
    {
        temp.push_back(i);
    }
    return temp;  // ❌ C++03：拷贝100万个整数！
}

int main() 
{
    std::vector<int> myVec = CreateVector();  // 又一次拷贝！
    
    return 0;
}

```

C++03的问题：

- temp是个临时对象，函数返回后就会销毁

- 但我们先把它的100万个整数全部拷贝一份

- 然后再销毁temp

- 这就像搬家时把所有家具复制一份再扔掉旧的——完全是浪费！

C++11的解决方案：移动语义

```cpp
// ✅ C++11：直接"偷走"temp的资源
std::vector<int> myVec = CreateVector();  
// 编译器自动使用移动构造函数，不拷贝数据！

```

### 移动语义的优势

| 对比项 | 拷贝语义 | 移动语义 |
| --- | --- | --- |
| 操作 | 复制所有资源 | 转移资源所有权 |
| 性能 | 慢（深拷贝） | 快（指针转移） |
| 内存 | 需要额外空间 | 不需要额外空间 |
| 适用场景 | 需要保留原对象 | 原对象即将销毁 |
| 类比 | 复印文件 | 剪切粘贴文件 |

## 二、左值与右值——理解移动的前提

### 2.1 基本概念

```cpp
int a = 10;     // a是左值（有名字，有地址）
int b = 20;     // b是左值
int c = a + b;  // a+b是右值（临时结果，没有名字）

int& ref = a;   // ✅ 左值引用：绑定到左值
// int& ref2 = 5;  // ❌ 错误：不能绑定到右值

int&& rref = 5;     // ✅ 右值引用：绑定到右值
int&& rref2 = a + b; // ✅ 绑定到临时对象

```

### 2.2 判断左值和右值的简单规则

```cpp
// 🔑 判断方法：能不能对它取地址(&)？

int x = 42;
int* ptr = &x;           // ✅ 能取地址 → x是左值
// int* ptr2 = &(x + 1);   // ❌ 不能取地址 → x+1是右值

std::string s1 = "hello";
std::string* p1 = &s1;   // ✅ 能取地址 → s1是左值
// std::string* p2 = &(s1 + " world");  // ❌ 不能取地址 → 临时对象是右值

```

### 2.3 左值引用 vs 右值引用

```cpp
#include <iostream>

void ProcessLvalue(int& x)      // 接受左值
{
    std::cout << "处理左值: " << x << std::endl;
}

void ProcessRvalue(int&& x)     // 接受右值
{
    std::cout << "处理右值: " << x << std::endl;
}

int main() 
{
    int a = 10;
    
    ProcessLvalue(a);        // ✅ 传左值
    // ProcessLvalue(5);     // ❌ 错误：不能把右值传给左值引用
    
    // ProcessRvalue(a);     // ❌ 错误：不能把左值传给右值引用
    ProcessRvalue(20);       // ✅ 传右值
    ProcessRvalue(a + 5);    // ✅ 传临时对象（右值）
    
    return 0;
}

```

### 2.4 std::move：左值变右值

```cpp
#include <iostream>

void ProcessRvalue(int&& x) 
{
    std::cout << "处理右值: " << x << std::endl;
}

int main() 
{
    int a = 10;
    
    // ProcessRvalue(a);           // ❌ 错误：a是左值
    ProcessRvalue(std::move(a));   // ✅ 成功：强制转换为右值
    
    // ⚠️ 注意：a仍然存在，但不应再使用它
    std::cout << "a = " << a << std::endl;  // 可能输出10，但语义上已"失效"
    
    return 0;
}

```

std::move的本质：

- 不移动任何东西！

- 只是一个类型转换：左值 → 右值引用

- 告诉编译器——”这个对象我不要了，你可以偷走它的资源”

## 三、移动构造函数与移动赋值运算符

### 3.1 传统的拷贝构造函数

```cpp
#include <iostream>
#include <cstring>

class String 
{
private:
    char* data;
    size_t size;
    
public:
    // 构造函数
    String(const char* str) 
    {
        size = strlen(str);
        data = new char[size + 1];
        memcpy(data, str, size + 1);
        std::cout << "构造: " << data << std::endl;
    }
    
    // ❌ 拷贝构造函数：深拷贝，很慢！
    String(const String& other) 
    {
        size = other.size;
        data = new char[size + 1];       // 分配新内存
        memcpy(data, other.data, size + 1);  // 拷贝所有数据
        std::cout << "拷贝构造: " << data << std::endl;
    }
    
    ~String() 
    {
        std::cout << "析构: " << data << std::endl;
        delete[] data;
    }
    
    void Print() const 
    {
        std::cout << "String: " << data << std::endl;
    }
};

String CreateString() 
{
    String temp("Hello World");
    return temp;  // ❌ 拷贝构造（C++03）
}

int main() 
{
    String str = CreateString();  // 又一次拷贝！
    str.Print();
    
    return 0;
}

/* C++03输出（未优化）:
构造: Hello World
拷贝构造: Hello World
析构: Hello World
拷贝构造: Hello World
析构: Hello World
String: Hello World
析构: Hello World
*/

```

### 3.2 添加移动构造函数

```cpp
#include <iostream>
#include <cstring>

class String 
{
private:
    char* data;
    size_t size;
    
public:
    // 构造函数
    String(const char* str) 
    {
        size = strlen(str);
        data = new char[size + 1];
        memcpy(data, str, size + 1);
        std::cout << "构造: " << data << std::endl;
    }
    
    // 拷贝构造函数
    String(const String& other) 
    {
        size = other.size;
        data = new char[size + 1];
        memcpy(data, other.data, size + 1);
        std::cout << "拷贝构造: " << data << std::endl;
    }
    
    // ✅ 移动构造函数：偷走资源超快
    String(String&& other) noexcept  // 注意：右值引用 &&
    {
        std::cout << "移动构造: " << other.data << std::endl;
        
        // 1. 偷走资源
        data = other.data;
        size = other.size;
        
        // 2. 清空源对象（防止它的析构函数删除我们的资源）
        other.data = nullptr;
        other.size = 0;
    }
    
    ~String() 
    {
        if (data) 
        {
            std::cout << "析构: " << data << std::endl;
            delete[] data;
        }
        else 
        {
            std::cout << "析构: (已移动)" << std::endl;
        }
    }
    
    void Print() const 
    {
        if (data) 
        {
            std::cout << "String: " << data << std::endl;
        }
        else 
        {
            std::cout << "String: (已移动)" << std::endl;
        }
    }
};

String CreateString() 
{
    String temp("Hello World");
    return temp;  // ✅ 移动构造（C++11）
}

int main() 
{
    String str = CreateString();  // ✅ 移动构造
    str.Print();
    
    return 0;
}

/* C++11输出:
构造: Hello World
移动构造: Hello World
析构: (已移动)
String: Hello World
析构: Hello World
*/

```

移动构造函数的关键点：

1. 参数是右值引用T&&

1. 标记为 noexcept（告诉编译器不会抛异常）

1. “偷走”源对象的资源（指针、句柄等）

1. 清空源对象（通常设为nullptr）！！！这里非常重要

1. 不分配新内存，只转移所有权

### 3.3 移动赋值运算符

```cpp
class String 
{
private:
    char* data;
    size_t size;
    
public:
    // ... 其他函数 ...
    
    // ✅ 移动赋值运算符
    String& operator=(String&& other) noexcept 
    {
        std::cout << "移动赋值: " << other.data << std::endl;
        
        // 1. 检查自赋值
        if (this != &other) 
        {
            // 2. 释放当前对象的资源
            delete[] data;
            
            // 3. 偷走源对象的资源
            data = other.data;
            size = other.size;
            
            // 4. 清空源对象
            other.data = nullptr;
            other.size = 0;
        }
        
        return *this;
    }
    
    // 拷贝赋值运算符（对比）
    String& operator=(const String& other) 
    {
        std::cout << "拷贝赋值: " << other.data << std::endl;
        
        if (this != &other) 
        {
            delete[] data;  // 释放旧资源
            
            size = other.size;
            data = new char[size + 1];  // 分配新内存
            memcpy(data, other.data, size + 1);  // 深拷贝
        }
        
        return *this;
    }
};

int main() 
{
    String s1("Hello");
    String s2("World");
    
    s1 = s2;               // 拷贝赋值（s2是左值）
    s1 = String("Test");   // 移动赋值（临时对象是右值）
    
    String s3("Move Me");
    s1 = std::move(s3);    // 移动赋值（强制转为右值）
    
    return 0;
}

```

## 四、std::move的使用

### 4.1 std::move的实现原理

```cpp
// std::move的简化实现
template<typename T>
typename remove_reference<T>::type&& move(T&& arg) noexcept 
{
    return static_cast<typename remove_reference<T>::type&&>(arg);
}

// 本质：强制类型转换
int a = 10;
int&& rref = std::move(a);  // 等价于 static_cast<int&&>(a)

```

重要理解：

- std::move不移动任何东西

- 它只是把左值转换成右值引用

- 真正的”移动”发生在移动构造函数/移动赋值运算符中

### 4.2 何时使用std::move

```cpp
#include <iostream>
#include <vector>

class Texture 
{
private:
    unsigned char* data;
    size_t size;
    
public:
    Texture(size_t s) : size(s) 
    {
        data = new unsigned char[size];
        std::cout << "分配 " << size << " 字节纹理数据" << std::endl;
    }
    
    ~Texture() 
    {
        if (data) 
        {
            std::cout << "释放 " << size << " 字节纹理数据" << std::endl;
            delete[] data;
        }
    }
    
    // 移动构造
    Texture(Texture&& other) noexcept 
        : data(other.data), size(other.size) 
    {
        std::cout << "移动 " << size << " 字节纹理" << std::endl;
        other.data = nullptr;
        other.size = 0;
    }
    
    // 禁用拷贝
    Texture(const Texture&) = delete;
    Texture& operator=(const Texture&) = delete;
};

int main() 
{
    std::vector<Texture> textures;
    
    // ✅ 场景1：插入临时对象（自动移动）
    textures.push_back(Texture(1024));  // 右值，自动移动
    
    // ✅ 场景2：插入已有对象（需要std::move）
    Texture tex(2048);
    textures.push_back(std::move(tex));  // 显式移动
    // ⚠️ tex现在已失效，不应再使用
    
    // ❌ 场景3：不需要std::move（会阻碍优化）
    Texture CreateTexture() 
    {
        Texture temp(4096);
        return temp;  // ❌ 不要写 return std::move(temp);
    }
    
    return 0;
}

```

std::move的使用规则：

| 场景 | 是否使用std::move | 原因 |
| --- | --- | --- |
| 插入临时对象 | ❌ 不需要 | 已经是右值 |
| 插入已有对象 | ✅ 需要 | 左值需转右值 |
| 函数返回局部变量 | ❌ 不需要 | RVO优化 |
| 转发参数 | ✅ 需要 | 保持值类别 |
| 最后一次使用对象 | ✅ 需要 | 避免不必要拷贝 |

### 4.3 std::move的常见用法

```cpp
#include <iostream>
#include <vector>
#include <string>

class GameObject 
{
private:
    std::string name;
    std::vector<int> data;
    
public:
    GameObject(const std::string& n, const std::vector<int>& d) 
        : name(n), data(d) 
    {
        std::cout << "构造对象: " << name << std::endl;
    }
    
    // ✅ 用法1：参数是右值引用，直接移动
    GameObject(std::string&& n, std::vector<int>&& d) 
        : name(std::move(n)), data(std::move(d))  // 必须用std::move
    {
        std::cout << "构造对象（移动版本）" << std::endl;
    }
    
    void AddData(std::vector<int>&& newData) 
    {
        // ✅ 用法2：在函数内移动右值引用参数
        data = std::move(newData);  // 必须用std::move
    }
};

int main() 
{
    // ✅ 用法3：最后一次使用对象时移动
    std::vector<GameObject> objects;
    
    std::string name = "Player";
    std::vector<int> stats = {100, 50, 25};
    
    objects.emplace_back(std::move(name), std::move(stats));
    // name和stats现在已失效
    
    // ✅ 用法4：在容器之间转移元素
    std::vector<int> vec1 = {1, 2, 3, 4, 5};
    std::vector<int> vec2 = std::move(vec1);  // vec1变为空
    
    std::cout << "vec1 size: " << vec1.size() << std::endl;  // 0
    std::cout << "vec2 size: " << vec2.size() << std::endl;  // 5
    
    return 0;
}

```

## 五、Rule of Five——五法则

在C++11之前，我们有Rule of Three（三法则）：

- 如果你定义了析构函数、拷贝构造函数或拷贝赋值运算符之一

- 你很可能需要定义全部三个

C++11引入移动语义后，变成了Rule of Five（五法则）：

```cpp
class Resource 
{
private:
    int* data;
    size_t size;
    
public:
    // 1️⃣ 构造函数
    Resource(size_t s) : size(s), data(new int[s]) 
    {
        std::cout << "构造" << std::endl;
    }
    
    // 2️⃣ 析构函数
    ~Resource() 
    {
        std::cout << "析构" << std::endl;
        delete[] data;
    }
    
    // 3️⃣ 拷贝构造函数
    Resource(const Resource& other) 
        : size(other.size), data(new int[other.size]) 
    {
        std::cout << "拷贝构造" << std::endl;
        std::copy(other.data, other.data + size, data);
    }
    
    // 4️⃣ 拷贝赋值运算符
    Resource& operator=(const Resource& other) 
    {
        std::cout << "拷贝赋值" << std::endl;
        
        if (this != &other) 
        {
            delete[] data;
            
            size = other.size;
            data = new int[size];
            std::copy(other.data, other.data + size, data);
        }
        
        return *this;
    }
    
    // 5️⃣ 移动构造函数
    Resource(Resource&& other) noexcept 
        : size(other.size), data(other.data) 
    {
        std::cout << "移动构造" << std::endl;
        
        other.data = nullptr;
        other.size = 0;
    }
    
    // 6️⃣ 移动赋值运算符
    Resource& operator=(Resource&& other) noexcept 
    {
        std::cout << "移动赋值" << std::endl;
        
        if (this != &other) 
        {
            delete[] data;
            
            data = other.data;
            size = other.size;
            
            other.data = nullptr;
            other.size = 0;
        }
        
        return *this;
    }
};

```

### Rule of Zero（零法则）

最佳实践：如果可能，遵循Rule of Zero！

```cpp
#include <vector>
#include <string>

// ✅ Rule of Zero：使用标准库容器，不需要自己管理资源
class Player 
{
private:
    std::string name;           // 自动管理内存
    std::vector<int> inventory; // 自动管理内存
    
public:
    Player(const std::string& n) : name(n) {}
    
    // 不需要定义任何特殊成员函数！
    // 编译器自动生成正确的拷贝/移动版本
};

// ❌ 不要自己管理原始指针（除非必要）
class BadPlayer 
{
private:
    char* name;  // 需要手动管理
    
public:
    // 需要定义所有5个特殊函数...
};

```

## 六、实战案例

### 案例1：资源管理类

```cpp
#include <iostream>

// 模拟一个大型资源（如纹理、模型）
class Texture 
{
private:
    unsigned char* pixels;
    int width, height;
    int id;
    
    static int nextId;
    
public:
    // 构造函数
    Texture(int w, int h) 
        : width(w), height(h), id(nextId++) 
    {
        size_t size = width * height * 4;  // RGBA
        pixels = new unsigned char[size];
        std::cout << "🎨 [" << id << "] 创建纹理 " << width << "x" << height 
                  << " (" << size / 1024 << "KB)" << std::endl;
    }
    
    // 析构函数
    ~Texture() 
    {
        if (pixels) 
        {
            std::cout << "💥 [" << id << "] 销毁纹理" << std::endl;
            delete[] pixels;
        }
        else 
        {
            std::cout << "💥 [" << id << "] 销毁纹理（已移动）" << std::endl;
        }
    }
    
    // 拷贝构造（深拷贝，开销大）
    Texture(const Texture& other) 
        : width(other.width), height(other.height), id(nextId++) 
    {
        size_t size = width * height * 4;
        pixels = new unsigned char[size];
        std::memcpy(pixels, other.pixels, size);
        std::cout << "📋 [" << id << "] 拷贝纹理 [" << other.id << "]" 
                  << " (" << size / 1024 << "KB)" << std::endl;
    }
    
    // 移动构造（转移所有权，开销小）
    Texture(Texture&& other) noexcept 
        : width(other.width), height(other.height), 
          pixels(other.pixels), id(other.id) 
    {
        std::cout << "🚀 [" << id << "] 移动纹理" << std::endl;
        
        other.pixels = nullptr;
        other.width = 0;
        other.height = 0;
    }
    
    // 拷贝赋值
    Texture& operator=(const Texture& other) 
    {
        std::cout << "📋 [" << id << "] 拷贝赋值 [" << other.id << "]" << std::endl;
        
        if (this != &other) 
        {
            delete[] pixels;
            
            width = other.width;
            height = other.height;
            
            size_t size = width * height * 4;
            pixels = new unsigned char[size];
            std::memcpy(pixels, other.pixels, size);
        }
        
        return *this;
    }
    
    // 移动赋值
    Texture& operator=(Texture&& other) noexcept 
    {
        std::cout << "🚀 [" << id << "] 移动赋值 [" << other.id << "]" << std::endl;
        
        if (this != &other) 
        {
            delete[] pixels;
            
            pixels = other.pixels;
            width = other.width;
            height = other.height;
            
            other.pixels = nullptr;
            other.width = 0;
            other.height = 0;
        }
        
        return *this;
    }
    
    void Display() const 
    {
        if (pixels) 
        {
            std::cout << "🖼️  [" << id << "] 纹理: " << width << "x" << height << std::endl;
        }
        else 
        {
            std::cout << "🖼️  [" << id << "] 纹理: (已移动)" << std::endl;
        }
    }
};

int Texture::nextId = 1;

// 工厂函数：返回纹理
Texture LoadTexture(int w, int h) 
{
    Texture tex(w, h);
    // 处理纹理数据...
    return tex;  // ✅ 自动使用移动构造（RVO可能会优化掉）
}

int main() 
{
    std::cout << "=== 测试1：函数返回值（移动） ===\n" << std::endl;
    Texture tex1 = LoadTexture(1024, 1024);
    tex1.Display();
    
    std::cout << "\n=== 测试2：拷贝 vs 移动 ===\n" << std::endl;
    Texture tex2(512, 512);
    
    Texture tex3 = tex2;              // 拷贝构造
    Texture tex4 = std::move(tex2);   // 移动构造
    
    tex2.Display();  // 已移动
    tex3.Display();  // 拷贝的副本
    tex4.Display();  // 移动后的对象
    
    std::cout << "\n=== 测试3：容器操作 ===\n" << std::endl;
    std::vector<Texture> textures;
    
    textures.push_back(Texture(256, 256));  // 移动临时对象
    
    Texture tex5(128, 128);
    textures.push_back(tex5);               // 拷贝
    textures.push_back(std::move(tex5));    // 移动
    
    std::cout << "\n=== 程序结束，清理资源 ===\n" << std::endl;
    
    return 0;
}

```

### 案例2：游戏实体系统

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <memory>

class Component 
{
public:
    virtual ~Component() = default;
    virtual void Update() = 0;
};

class MeshComponent : public Component 
{
private:
    std::vector<float> vertices;
    
public:
    MeshComponent(size_t vertexCount) 
    {
        vertices.resize(vertexCount);
        std::cout << "  📦 创建Mesh组件 (" << vertexCount << " 顶点)" << std::endl;
    }
    
    void Update() override 
    {
        // 更新逻辑
    }
    
    ~MeshComponent() 
    {
        std::cout << "  📦 销毁Mesh组件" << std::endl;
    }
};

class Entity 
{
private:
    std::string name;
    std::vector<std::unique_ptr<Component>> components;
    
public:
    Entity(const std::string& n) : name(n) 
    {
        std::cout << "🎮 创建实体: " << name << std::endl;
    }
    
    // 移动构造
    Entity(Entity&& other) noexcept 
        : name(std::move(other.name))
        , components(std::move(other.components))  // 移动vector
    {
        std::cout << "🚀 移动实体: " << name << std::endl;
    }
    
    // 移动赋值
    Entity& operator=(Entity&& other) noexcept 
    {
        if (this != &other) 
        {
            name = std::move(other.name);
            components = std::move(other.components);
            std::cout << "🚀 移动赋值实体: " << name << std::endl;
        }
        return *this;
    }
    
    // 删除拷贝操作（实体通常是唯一的）
    Entity(const Entity&) = delete;
    Entity& operator=(const Entity&) = delete;
    
    void AddComponent(std::unique_ptr<Component> comp) 
    {
        components.push_back(std::move(comp));
    }
    
    void Update() 
    {
        for (auto& comp : components) 
        {
            comp->Update();
        }
    }
    
    ~Entity() 
    {
        std::cout << "💥 销毁实体: " << name << std::endl;
    }
};

class EntityManager 
{
private:
    std::vector<Entity> entities;
    
public:
    void AddEntity(Entity&& entity)  // 接受右值引用
    {
        entities.push_back(std::move(entity));  // 移动到vector
    }
    
    Entity CreateEntity(const std::string& name) 
    {
        Entity entity(name);
        entity.AddComponent(std::make_unique<MeshComponent>(1000));
        return entity;  // ✅ 返回值优化（RVO）
    }
    
    void UpdateAll() 
    {
        for (auto& entity : entities) 
        {
            entity.Update();
        }
    }
};

int main() 
{
    EntityManager manager;
    
    std::cout << "=== 添加实体 ===\n" << std::endl;
    
    // 方式1：通过工厂函数
    manager.AddEntity(manager.CreateEntity("Player"));
    
    // 方式2：直接创建并移动
    Entity enemy("Enemy");
    enemy.AddComponent(std::make_unique<MeshComponent>(500));
    manager.AddEntity(std::move(enemy));  // 显式移动
    
    // ⚠️ enemy现在已失效，不应再使用
    
    std::cout << "\n=== 更新实体 ===\n" << std::endl;
    manager.UpdateAll();
    
    std::cout << "\n=== 程序结束 ===\n" << std::endl;
    
    return 0;
}

```

### 案例3：智能指针的移动

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
        std::cout << "✨ 创建对象: " << name << std::endl;
    }
    
    ~GameObject() 
    {
        std::cout << "💀 销毁对象: " << name << std::endl;
    }
    
    void Activate() 
    {
        std::cout << "🎯 激活对象: " << name << std::endl;
    }
};

int main() 
{
    std::cout << "=== unique_ptr移动 ===\n" << std::endl;
    
    // unique_ptr只能移动，不能拷贝
    std::unique_ptr<GameObject> obj1 = std::make_unique<GameObject>("Player");
    
    // std::unique_ptr<GameObject> obj2 = obj1;  // ❌ 错误：不能拷贝
    std::unique_ptr<GameObject> obj2 = std::move(obj1);  // ✅ 移动所有权
    
    // obj1现在是nullptr
    if (obj1 == nullptr) 
    {
        std::cout << "obj1现在是空指针" << std::endl;
    }
    
    obj2->Activate();
    
    std::cout << "\n=== 容器中的unique_ptr ===\n" << std::endl;
    
    std::vector<std::unique_ptr<GameObject>> objects;
    
    // 移动到容器
    objects.push_back(std::make_unique<GameObject>("Enemy1"));
    objects.push_back(std::make_unique<GameObject>("Enemy2"));
    
    std::unique_ptr<GameObject> obj3 = std::make_unique<GameObject>("Enemy3");
    objects.push_back(std::move(obj3));  // 必须显式移动
    
    // 从容器中移动出来
    std::unique_ptr<GameObject> extracted = std::move(objects[0]);
    objects.erase(objects.begin());
    
    extracted->Activate();
    
    std::cout << "\n=== shared_ptr移动（可选） ===\n" << std::endl;
    
    // shared_ptr可以拷贝（共享所有权）
    std::shared_ptr<GameObject> shared1 = std::make_shared<GameObject>("Shared1");
    std::shared_ptr<GameObject> shared2 = shared1;  // ✅ 拷贝（引用计数+1）
    
    std::cout << "引用计数: " << shared1.use_count() << std::endl;  // 2
    
    // 也可以移动（转移所有权，不增加引用计数）
    std::shared_ptr<GameObject> shared3 = std::move(shared1);  // ✅ 移动
    
    std::cout << "引用计数: " << shared3.use_count() << std::endl;  // 2
    std::cout << "shared1是否为空: " << (shared1 == nullptr) << std::endl;  // true
    
    std::cout << "\n=== 程序结束 ===\n" << std::endl;
    
    return 0;
}

```

## 七、性能对比

### 拷贝 vs 移动性能测试

```cpp
#include <iostream>
#include <vector>
#include <chrono>
#include <string>

class BigObject 
{
private:
    std::vector<int> data;
    
public:
    BigObject() 
    {
        data.resize(1000000);  // 100万个整数
    }
    
    // 拷贝构造
    BigObject(const BigObject& other) : data(other.data) 
    {
        // 深拷贝：分配新内存并复制所有数据
    }
    
    // 移动构造
    BigObject(BigObject&& other) noexcept : data(std::move(other.data)) 
    {
        // 移动：只转移指针，不复制数据
    }
};

template<typename Func>
void MeasureTime(const std::string& name, Func func) 
{
    auto start = std::chrono::high_resolution_clock::now();
    func();
    auto end = std::chrono::high_resolution_clock::now();
    
    auto duration = std::chrono::duration_cast<std::chrono::microseconds>(end - start);
    std::cout << name << ": " << duration.count() << " μs" << std::endl;
}

int main() 
{
    std::vector<BigObject> vec;
    vec.reserve(100);  // 预分配空间，避免重新分配
    
    std::cout << "=== 性能测试：拷贝 vs 移动 ===\n" << std::endl;
    
    // 测试1：拷贝插入
    MeasureTime("拷贝插入100个对象", [&]() {
        BigObject obj;
        for (int i = 0; i < 100; i++) 
        {
            vec.push_back(obj);  // 拷贝
        }
        vec.clear();
    });
    
    // 测试2：移动插入
    MeasureTime("移动插入100个对象", [&]() {
        for (int i = 0; i < 100; i++) 
        {
            vec.push_back(BigObject());  // 移动临时对象
        }
        vec.clear();
    });
    
    // 测试3：显式移动
    MeasureTime("显式移动插入100个对象", [&]() {
        for (int i = 0; i < 100; i++) 
        {
            BigObject obj;
            vec.push_back(std::move(obj));  // 显式移动
        }
        vec.clear();
    });
    
    return 0;
}

/* 典型输出（性能差异巨大）:
拷贝插入100个对象: 125000 μs  (125毫秒)
移动插入100个对象: 150 μs     (0.15毫秒)
显式移动插入100个对象: 200 μs  (0.2毫秒)

性能提升：约 600倍！
*/

```

### 性能对比总结

| 操作类型 | 数据量 | 拷贝耗时 | 移动耗时 | 性能提升 |
| --- | --- | --- | --- | --- |
| 小对象（int） | 1个 | ~1ns | ~1ns | 无差别 |
| 中等对象（1KB） | 1个 | ~100ns | ~1ns | 100倍 |
| 大对象（1MB） | 1个 | ~1ms | ~1ns | 1000倍 |
| vector | 100万元素 | ~10ms | ~1ns | 10000倍 |
| string | 长文本 | ~微秒级 | ~纳秒级 | 数百倍 |

关键发现：

- 移动操作的时间几乎是常数（只转移指针）

- 拷贝操作的时间与数据大小成正比

- 数据越大，移动的优势越明显

## 八、新手常见错误

### ❌ 错误1：使用已移动的对象

```cpp
#include <iostream>
#include <vector>

int main() 
{
    std::vector<int> vec1 = {1, 2, 3, 4, 5};
    std::vector<int> vec2 = std::move(vec1);
    
    // ❌ 错误：使用已移动的对象
    std::cout << "vec1 size: " << vec1.size() << std::endl;  // 0（未定义行为）
    // vec1[0] = 10;  // 💥 崩溃！
    
    // ✅ 正确：检查后再使用
    if (!vec1.empty()) 
    {
        std::cout << vec1[0] << std::endl;
    }
    
    // ✅ 或者重新赋值
    vec1 = {6, 7, 8};
    std::cout << "vec1 size: " << vec1.size() << std::endl;  // 3
    
    return 0;
}

```

规则：

- 移动后的对象处于有效但未指定状态

- 可以对它赋值、销毁，但不要读取或使用它的值

- 标准库容器移动后通常为空（但这不是保证）

### ❌ 错误2：不必要的std::move

```cpp
// ❌ 错误1：函数返回值不要用std::move
std::vector<int> CreateVector() 
{
    std::vector<int> temp = {1, 2, 3};
    return std::move(temp);  // ❌ 错误！阻碍RVO优化
}

// ✅ 正确：让编译器自动优化
std::vector<int> CreateVector() 
{
    std::vector<int> temp = {1, 2, 3};
    return temp;  // ✅ 编译器自动使用移动或RVO
}

// ❌ 错误2：右值不需要std::move
void ProcessVector(std::vector<int> vec) 
{
    std::vector<int> copy1 = vec;              // 拷贝
    std::vector<int> copy2 = std::move(vec);   // 移动
}

int main() 
{
    ProcessVector(std::vector<int>{1, 2, 3});  // 已经是右值
    // 不需要：ProcessVector(std::move(std::vector<int>{1, 2, 3}));
    
    return 0;
}

// ❌ 错误3：const对象不能移动
const std::string str = "hello";
// std::string str2 = std::move(str);  // ❌ const无法移动，会退化为拷贝

```

### ❌ 错误3：忘记noexcept

```cpp
#include <iostream>
#include <vector>

class MyClass 
{
public:
    // ❌ 没有noexcept
    MyClass(MyClass&& other) 
    {
        std::cout << "移动构造（无noexcept）" << std::endl;
    }
    
    // ✅ 有noexcept
    // MyClass(MyClass&& other) noexcept 
    // {
    //     std::cout << "移动构造（有noexcept）" << std::endl;
    // }
    
    MyClass(const MyClass&) 
    {
        std::cout << "拷贝构造" << std::endl;
    }
};

int main() 
{
    std::vector<MyClass> vec;
    
    vec.push_back(MyClass());  // 第一个元素
    
    // 当vector需要扩容时...
    vec.push_back(MyClass());  // 如果没有noexcept，会使用拷贝！
    
    return 0;
}

/* 输出（无noexcept）:
拷贝构造  // vector扩容时拷贝而非移动！
*/

```

为什么需要noexcept？

- vector扩容时，如果移动构造函数可能抛异常

- 为了保证强异常安全性，vector会使用拷贝而非移动

- 标记noexcept告诉编译器”这个函数不会抛异常，可以安全使用”

### ❌ 错误4：移动后忘记清空源对象

```cpp
class Resource 
{
private:
    int* data;
    
public:
    Resource(int value) : data(new int(value)) {}
    
    // ❌ 错误的移动构造
    Resource(Resource&& other) noexcept 
        : data(other.data) 
    {
        // 忘记清空other.data！
    }
    
    ~Resource() 
    {
        delete data;  // 💥 双重删除！
    }
};

int main() 
{
    Resource r1(42);
    Resource r2(std::move(r1));  // 移动
    
    // 当r1和r2析构时，会删除同一个指针两次！
    
    return 0;
}
// ✅ 正确的移动构造
Resource(Resource&& other) noexcept 
    : data(other.data) 
{
    other.data = nullptr;  // ✅ 清空源对象
}

```

### ❌ 错误5：在循环中误用std::move

```cpp
#include <iostream>
#include <vector>
#include <string>

int main() 
{
    std::vector<std::string> source = {"apple", "banana", "cherry"};
    std::vector<std::string> dest;
    
    // ❌ 错误：第一次迭代后，source[0]已失效
    for (size_t i = 0; i < source.size(); i++) 
    {
        dest.push_back(std::move(source[i]));
        // 第二次访问source[i]时，它已经是空字符串了
    }
    
    // ❌ 打印源容器（已失效）
    for (const auto& str : source) 
    {
        std::cout << str << std::endl;  // 输出空字符串
    }
    
    // ✅ 正确：如果要移动整个容器
    std::vector<std::string> source2 = {"dog", "cat", "bird"};
    std::vector<std::string> dest2 = std::move(source2);  // 移动整个vector
    
    // source2现在是空的
    std::cout << "source2 size: " << source2.size() << std::endl;  // 0
    
    return 0;
}

```

## 九、虚幻引擎中的Move语义

UE大量使用移动语义来优化性能，特别是在资源管理和容器操作中。

### 9.1 UE容器的移动

```cpp
// TArray的移动
TArray<FString> Array1;
Array1.Add(TEXT("Element1"));
Array1.Add(TEXT("Element2"));

// ✅ 移动整个数组（不拷贝元素）
TArray<FString> Array2 = MoveTemp(Array1);  // UE的std::move

// Array1现在为空
UE_LOG(LogTemp, Warning, TEXT("Array1 size: %d"), Array1.Num());  // 0
UE_LOG(LogTemp, Warning, TEXT("Array2 size: %d"), Array2.Num());  // 2

```

### 9.2 MoveTemp vs std::move

UE使用MoveTemp而非std::move：

```cpp
// UE中的MoveTemp等价于std::move
FString Str1 = TEXT("Hello");
FString Str2 = MoveTemp(Str1);  // 移动

// 也可以用std::move（但UE推荐MoveTemp）
FString Str3 = std::move(Str2);

```

### 9.3 智能指针的移动

```cpp
// TUniquePtr的移动（类似std::unique_ptr）
TUniquePtr<AMyActor> Actor1 = MakeUnique<AMyActor>();

// ✅ 转移所有权
TUniquePtr<AMyActor> Actor2 = MoveTemp(Actor1);

// Actor1现在为空
if (!Actor1.IsValid()) 
{
    UE_LOG(LogTemp, Warning, TEXT("Actor1 已移动"));
}

// TSharedPtr的移动（通常不需要移动，直接拷贝共享）
TSharedPtr<AMyActor> SharedActor1 = MakeShared<AMyActor>();
TSharedPtr<AMyActor> SharedActor2 = SharedActor1;  // 共享所有权（拷贝）

// 也可以移动（但通常没必要）
TSharedPtr<AMyActor> SharedActor3 = MoveTemp(SharedActor1);

```

### 9.4 UObject的移动

```cpp
// ⚠️ 注意：UObject不应该使用移动语义！
// UObject由UE的垃圾回收系统管理

// ❌ 不要这样做
UCLASS()
class AMyActor : public AActor 
{
    GENERATED_BODY()
    
public:
    // ❌ 不要为UObject定义移动构造函数
    // AMyActor(AMyActor&& Other) { ... }
};

// ✅ 正确：使用指针或引用
TArray<AMyActor*> Actors;  // 存储指针，而非对象本身

```

### 9.5 结构体的移动

```cpp
// 自定义结构体使用移动语义
USTRUCT()
struct FGameData 
{
    GENERATED_BODY()
    
    UPROPERTY()
    TArray<FString> Items;
    
    UPROPERTY()
    TMap<FString, int32> Stats;
    
    // UE会自动生成移动构造函数（如果成员支持移动）
};

void ProcessData() 
{
    FGameData Data1;
    Data1.Items.Add(TEXT("Item1"));
    Data1.Stats.Add(TEXT("Health"), 100);
    
    // ✅ 移动整个结构体
    FGameData Data2 = MoveTemp(Data1);
    
    // Data1的容器现在为空
}

```

### 9.6 函数参数的移动

```cpp
// 按值传递 + 移动
void ProcessItems(TArray<FString> Items)  // 按值传递
{
    // Items已经是我们的了
    for (const FString& Item : Items) 
    {
        // 处理...
    }
}

void Example() 
{
    TArray<FString> MyItems;
    MyItems.Add(TEXT("Item1"));
    
    // ✅ 移动到函数（避免拷贝）
    ProcessItems(MoveTemp(MyItems));
    
    // MyItems现在为空
}

```

### 9.7 性能优化示例

```cpp
// ❌ 性能差：多次拷贝
UCLASS()
class AInventoryManager : public AActor 
{
    TArray<FString> Items;
    
public:
    void AddItems(TArray<FString> NewItems)  // 拷贝1
    {
        for (const FString& Item : NewItems)  // 遍历
        {
            Items.Add(Item);  // 拷贝2
        }
    }
};

// ✅ 性能好：使用移动
UCLASS()
class AInventoryManager : public AActor 
{
    TArray<FString> Items;
    
public:
    void AddItems(TArray<FString>&& NewItems)  // 右值引用
    {
        Items.Append(MoveTemp(NewItems));  // 移动整个数组
    }
    
    // 或者使用Append的移动版本
    void AddItemsV2(TArray<FString> NewItems)  // 按值传递
    {
        Items.Append(MoveTemp(NewItems));
    }
};

void Usage() 
{
    AInventoryManager* Manager = GetWorld()->SpawnActor<AInventoryManager>();
    
    TArray<FString> NewItems;
    NewItems.Add(TEXT("Sword"));
    NewItems.Add(TEXT("Shield"));
    
    // 移动数组
    Manager->AddItems(MoveTemp(NewItems));
}

```

## 十、最佳实践

| 场景 | 使用方式 | 性能收益 |
| --- | --- | --- |
| 函数返回大对象 | 自动移动 | 高 |
| 容器插入临时对象 | 自动移动 | 高 |
| 转移唯一所有权 | std::move | 高 |
| 最后一次使用对象 | std::move | 中 |
| 交换两个对象 | std::swap | 中 |

```cpp
✅ DO（推荐做法）
1. 函数返回局部变量时，让编译器自动优化
   return localVar;  // 不要用std::move

2. 移动操作标记为noexcept
   MyClass(MyClass&&) noexcept;

3. 使用智能指针管理资源
   std::unique_ptr, std::shared_ptr

4. 遵循Rule of Zero或Rule of Five
   优先使用标准容器

5. 最后一次使用对象时显式移动
   vec.push_back(std::move(obj));

❌ DON'T（避免做法）
1. 不要使用已移动的对象
   auto b = std::move(a);
   cout << a;  // 危险！

2. 不要在return语句中使用std::move
   return std::move(localVar);  // 阻碍RVO

3. 不要移动const对象
   const string s = "hi";
   auto s2 = std::move(s);  // 无效，会拷贝

4. 不要过度使用std::move
   func(std::move(临时对象));  // 多余

5. 移动后不要忘记清空源对象
   other.ptr = nullptr;  // 防止双重删除

```

今天的知识点你都有Get到吗~

有没有什么疑问，我们在评论区见哦~

你们也可以告诉我有什么是你们想知道的

![](./image-1.jpg)

![](./image-2.jpg)
