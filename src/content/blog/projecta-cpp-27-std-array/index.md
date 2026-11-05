---
title: "重启RestArt ProjectA｜27.std::array固定数组"
description: "一、什么是std::array想象你在玩《炉石传说》，每个玩家的 手牌上限固定是10张，不多不少。你不需要一个可以无限扩容的背包，你需要的是一个大小固定、快速访问的卡牌槽位！ std::array就是…"
category: tools
tags: ['C++', 'ProjectA', '编程基础']
date: 2025-11-07
readTime: 3
heroImage: "./image-1.jpg"
published: true
---
## 一、什么是std::array

想象你在玩《炉石传说》，每个玩家的手牌上限固定是10张，不多不少。你不需要一个可以无限扩容的背包，你需要的是一个大小固定、快速访问的卡牌槽位！

std::array就是C++中的”固定容量容器”——大小在编译期确定，存储在栈上，零开销！

### 三种数组的进化史

```cpp
// 1. 传统C数组（原始但危险）
int numbers[5];  // 大小固定
// 问题：不知道大小、容易越界、不能返回

// 2. std::vector（强大但有开销）
std::vector<int> numbers(5);  // 动态数组
// 优点：安全、灵活
// 缺点：堆分配、动态内存管理有开销

// 3. std::array（现代C++最佳选择）
std::array<int, 5> numbers;  // 固定大小数组
// 优点：安全、零开销、编译期大小
// 缺点：大小不能改变

```

std::array的特点：

```cpp
内存位置: 栈 (Stack)
大小:     编译期确定
效率:     与C数组完全相同
安全性:   提供边界检查（at()）
功能:     提供迭代器、算法支持

```

## 二、基础使用

```cpp
#include <iostream>
#include <array>  // 必须包含这个头文件

int main() 
{
    // 创建一个大小为5的int数组
    std::array<int, 5> numbers = {10, 20, 30, 40, 50};
    
    // 访问元素
    std::cout << "第一个元素: " << numbers[0] << std::endl;     // 10
    std::cout << "第二个元素: " << numbers.at(1) << std::endl;  // 20
    
    // 修改元素
    numbers[2] = 35;
    
    // 获取大小（编译期常量）
    std::cout << "数组大小: " << numbers.size() << std::endl;  // 5
    
    // 遍历
    for (int i = 0; i < numbers.size(); i++) 
    {
        std::cout << numbers[i] << " ";
    }
    std::cout << std::endl;
    
    // 范围for循环
    for (const auto& num : numbers) 
    {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    return 0;
}

```

输出：

```cpp
第一个元素: 10
第二个元素: 20
数组大小: 5
10 20 35 40 50
10 20 35 40 50

```

## 三、核心操作

### 1. 创建和初始化

```cpp
// 方式1：列表初始化
std::array<int, 5> arr1 = {1, 2, 3, 4, 5};

// 方式2：部分初始化（其余为0）
std::array<int, 5> arr2 = {1, 2, 3};  // {1, 2, 3, 0, 0}

// 方式3：全部初始化为0
std::array<int, 5> arr3 = {};  // {0, 0, 0, 0, 0}
std::array<int, 5> arr4{};     // 同上

// 方式4：C++11 统一初始化
std::array<int, 5> arr5{10, 20, 30, 40, 50};

// 方式5：使用fill填充相同值
std::array<int, 5> arr6;
arr6.fill(100);  // {100, 100, 100, 100, 100}

// 错误示例：
// std::array<int, 5> bad = {1, 2, 3, 4, 5, 6};  // ❌ 初始化器太多
// std::array<int> bad2;  // ❌ 必须指定大小

```

### 2. 访问元素

```cpp
std::array<int, 5> numbers = {10, 20, 30, 40, 50};

// 方式1：[] 操作符（不检查边界，快速）
int first = numbers[0];  // 10
int last = numbers[4];   // 50
// int bad = numbers[10];  // ❌ 未定义行为！不会报错但可能崩溃

// 方式2：at() 方法（检查边界，安全）
int second = numbers.at(1);  // 20
try 
{
    int bad = numbers.at(10);  // 抛出 std::out_of_range 异常
} 
catch (const std::out_of_range& e) 
{
    std::cout << "越界访问！" << std::endl;
}

// 方式3：front() 获取第一个元素
int firstElem = numbers.front();  // 10

// 方式4：back() 获取最后一个元素
int lastElem = numbers.back();  // 50

// 方式5：data() 获取底层C数组指针
int* ptr = numbers.data();
std::cout << ptr[0] << std::endl;  // 10

```

### 3. 修改元素

```cpp
std::array<int, 5> numbers = {10, 20, 30, 40, 50};

// 直接赋值
numbers[0] = 100;
numbers.at(1) = 200;

// 使用front()和back()
numbers.front() = 15;
numbers.back() = 55;

// fill - 填充相同值
numbers.fill(0);  // {0, 0, 0, 0, 0}

// swap - 交换两个array的内容
std::array<int, 5> other = {1, 2, 3, 4, 5};
numbers.swap(other);
// numbers = {1, 2, 3, 4, 5}
// other = {0, 0, 0, 0, 0}

```

### 4. 查询信息

```cpp
std::array<int, 5> numbers = {10, 20, 30, 40, 50};

// size() - 元素数量（编译期常量）
std::cout << numbers.size() << std::endl;  // 5
constexpr size_t sz = numbers.size();  // 可以用于编译期

// empty() - 是否为空
if (numbers.empty())  // 永远false（大小固定为5）
{
    std::cout << "Empty" << std::endl;
}

// max_size() - 最大容量（等于size()）
std::cout << numbers.max_size() << std::endl;  // 5

```

### 5. 迭代器

```cpp
std::array<int, 5> numbers = {10, 20, 30, 40, 50};

// begin() / end() - 正向迭代器
for (auto it = numbers.begin(); it != numbers.end(); ++it) 
{
    std::cout << *it << " ";
}
std::cout << std::endl;

// rbegin() / rend() - 反向迭代器
for (auto it = numbers.rbegin(); it != numbers.rend(); ++it) 
{
    std::cout << *it << " ";  // 50 40 30 20 10
}
std::cout << std::endl;

// cbegin() / cend() - 常量迭代器
for (auto it = numbers.cbegin(); it != numbers.cend(); ++it) 
{
    // *it = 100;  // ❌ 错误！不能修改
    std::cout << *it << " ";
}

```

## 四、std::array遍历

### 方式1：索引遍历

```cpp
std::array<int, 5> numbers = {10, 20, 30, 40, 50};

for (size_t i = 0; i < numbers.size(); i++) 
{
    std::cout << numbers[i] << " ";
}
std::cout << std::endl;

```

### 方式2：范围for循环

```cpp
std::array<int, 5> numbers = {10, 20, 30, 40, 50};

// 只读
for (const auto& num : numbers) 
{
    std::cout << num << " ";
}
std::cout << std::endl;

// 修改
for (auto& num : numbers) 
{
    num *= 2;
}

```

### 方式3：迭代器

```cpp
std::array<int, 5> numbers = {10, 20, 30, 40, 50};

for (auto it = numbers.begin(); it != numbers.end(); ++it) 
{
    std::cout << *it << " ";
}
std::cout << std::endl;

```

### 方式4：algorithm

```cpp
#include <algorithm>

std::array<int, 5> numbers = {10, 20, 30, 40, 50};

// for_each
std::for_each(numbers.begin(), numbers.end(), [](int num) {
    std::cout << num << " ";
});
std::cout << std::endl;

// transform
std::array<int, 5> doubled;
std::transform(numbers.begin(), numbers.end(), doubled.begin(),
    [](int num) { return num * 2; });

```

## 五、std::array vs C数组 vs std::vector

### 对比表格

| 特性 | C数组 | std::array | std::vector |
| --- | --- | --- | --- |
| 内存位置 | 栈 | 栈 | 堆 |
| 大小 | 编译期 | 编译期 | 运行时 |
| 可改变大小 | ❌ | ❌ | ✅ |
| 边界检查 | ❌ | ✅ at() | ✅ at() |
| 知道大小 | ❌ | ✅ size() | ✅ size() |
| 可返回 | ❌* | ✅ | ✅ |
| 可拷贝 | ❌ | ✅ | ✅ |
| 迭代器 | ❌ | ✅ | ✅ |
| 性能 | ⚡ 最快 | ⚡ 最快 | 📊 有开销 |

*C数组返回会退化为指针

### 代码对比

```cpp
// C数组的问题
void ProcessData(int arr[])  // 实际传的是指针
{
    // sizeof(arr) 返回指针大小，不是数组大小！
    int size = sizeof(arr) / sizeof(int);  // ❌ 错误！
}

int GetNumbers()[5]  // ❌ 不能返回数组
{
    int arr[5] = {1, 2, 3, 4, 5};
    return arr;  // 编译错误
}

// std::array的优势
void ProcessData(const std::array<int, 5>& arr)  // 真正的数组引用
{
    int size = arr.size();  // ✅ 正确！
}

std::array<int, 5> GetNumbers()  // ✅ 可以返回
{
    return {1, 2, 3, 4, 5};
}

```

### 性能对比

```cpp
#include <chrono>

// C数组
int cArray[1000];
for (int i = 0; i < 1000; i++) 
{
    cArray[i] = i;
}

// std::array
std::array<int, 1000> stdArray;
for (int i = 0; i < 1000; i++) 
{
    stdArray[i] = i;
}

// 性能完全相同！编译器优化后生成的机器码一样
// std::array是零开销抽象！

```

## 六、开发实战案例

### 案例1：方向向量定义

```cpp
#include <array>
#include <cmath>

// 固定的8个方向（上下左右+4斜向）
enum class Direction 
{
    Up, Down, Left, Right,
    UpLeft, UpRight, DownLeft, DownRight,
    Count  // 自动计数
};

struct Vector2 
{
    float x, y;
};

class DirectionHelper 
{
private:
    // 固定大小的方向向量数组
    static constexpr std::array<Vector2, 8> directions = {{
        {0, -1},   // Up
        {0, 1},    // Down
        {-1, 0},   // Left
        {1, 0},    // Right
        {-0.707f, -0.707f},  // UpLeft
        {0.707f, -0.707f},   // UpRight
        {-0.707f, 0.707f},   // DownLeft
        {0.707f, 0.707f}     // DownRight
    }};
    
public:
    static Vector2 GetDirection(Direction dir) 
    {
        return directions[static_cast<int>(dir)];
    }
    
    static void MoveInDirection(float& x, float& y, Direction dir, float speed) 
    {
        Vector2 vec = GetDirection(dir);
        x += vec.x * speed;
        y += vec.y * speed;
    }
};

// C++17后需要定义（头文件声明+源文件定义）
constexpr std::array<Vector2, 8> DirectionHelper::directions;

int main() 
{
    float playerX = 0, playerY = 0;
    
    DirectionHelper::MoveInDirection(playerX, playerY, Direction::Up, 5.0f);
    std::cout << "Position: (" << playerX << ", " << playerY << ")" << std::endl;
    
    return 0;
}

```

### 案例2：扑克牌系统

```cpp
#include <array>
#include <string>
#include <algorithm>
#include <random>

enum class Suit { Hearts, Diamonds, Clubs, Spades, Count };
enum class Rank { Ace = 1, Two, Three, Four, Five, Six, Seven, 
                  Eight, Nine, Ten, Jack, Queen, King };

struct Card 
{
    Suit suit;
    Rank rank;
    
    std::string ToString() const 
    {
        static const std::array<std::string, 4> suitNames = 
            {"♥", "♦", "♣", "♠"};
        static const std::array<std::string, 13> rankNames = 
            {"A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"};
        
        return rankNames[static_cast<int>(rank) - 1] + 
               suitNames[static_cast<int>(suit)];
    }
};

class Deck 
{
private:
    std::array<Card, 52> cards;  // 固定52张牌
    int currentIndex;
    
public:
    Deck() : currentIndex(0) 
    {
        // 初始化牌组
        int index = 0;
        for (int s = 0; s < 4; s++) 
        {
            for (int r = 1; r <= 13; r++) 
            {
                cards[index++] = {static_cast<Suit>(s), static_cast<Rank>(r)};
            }
        }
    }
    
    void Shuffle() 
    {
        std::random_device rd;
        std::mt19937 gen(rd());
        std::shuffle(cards.begin(), cards.end(), gen);
        currentIndex = 0;
    }
    
    Card Draw() 
    {
        if (currentIndex >= 52) 
        {
            throw std::runtime_error("牌堆空了！");
        }
        return cards[currentIndex++];
    }
    
    int RemainingCards() const 
    {
        return 52 - currentIndex;
    }
    
    void PrintDeck() 
    {
        std::cout << "=== 牌堆 ===" << std::endl;
        for (int i = currentIndex; i < 52; i++) 
        {
            std::cout << cards[i].ToString() << " ";
            if ((i - currentIndex + 1) % 13 == 0) 
                std::cout << std::endl;
        }
    }
};

int main() 
{
    Deck deck;
    deck.Shuffle();
    
    std::cout << "抽5张牌：" << std::endl;
    for (int i = 0; i < 5; i++) 
    {
        Card card = deck.Draw();
        std::cout << card.ToString() << " ";
    }
    std::cout << std::endl;
    
    std::cout << "剩余牌数: " << deck.RemainingCards() << std::endl;
    
    return 0;
}

```

### 案例3：棋盘系统

```cpp
#include <array>
#include <iostream>

enum class ChessPiece 
{
    Empty, 
    WhitePawn, WhiteRook, WhiteKnight, WhiteBishop, WhiteQueen, WhiteKing,
    BlackPawn, BlackRook, BlackKnight, BlackBishop, BlackQueen, BlackKing
};

class ChessBoard 
{
private:
    std::array<std::array<ChessPiece, 8>, 8> board;  // 8x8棋盘
    
public:
    ChessBoard() 
    {
        InitializeBoard();
    }
    
    void InitializeBoard() 
    {
        // 清空棋盘
        for (auto& row : board) 
        {
            row.fill(ChessPiece::Empty);
        }
        
        // 初始化棋子位置（简化版）
        board[0] = {
            ChessPiece::BlackRook, ChessPiece::BlackKnight, 
            ChessPiece::BlackBishop, ChessPiece::BlackQueen,
            ChessPiece::BlackKing, ChessPiece::BlackBishop, 
            ChessPiece::BlackKnight, ChessPiece::BlackRook
        };
        
        board[1].fill(ChessPiece::BlackPawn);
        board[6].fill(ChessPiece::WhitePawn);
        
        board[7] = {
            ChessPiece::WhiteRook, ChessPiece::WhiteKnight, 
            ChessPiece::WhiteBishop, ChessPiece::WhiteQueen,
            ChessPiece::WhiteKing, ChessPiece::WhiteBishop, 
            ChessPiece::WhiteKnight, ChessPiece::WhiteRook
        };
    }
    
    ChessPiece GetPiece(int row, int col) const 
    {
        return board[row][col];
    }
    
    void SetPiece(int row, int col, ChessPiece piece) 
    {
        board[row][col] = piece;
    }
    
    bool MovePiece(int fromRow, int fromCol, int toRow, int toCol) 
    {
        // 简化的移动逻辑（不检查规则）
        if (board[fromRow][fromCol] == ChessPiece::Empty) 
        {
            return false;
        }
        
        board[toRow][toCol] = board[fromRow][fromCol];
        board[fromRow][fromCol] = ChessPiece::Empty;
        return true;
    }
    
    void PrintBoard() 
    {
        std::cout << "  a b c d e f g h" << std::endl;
        for (int i = 0; i < 8; i++) 
        {
            std::cout << (8 - i) << " ";
            for (int j = 0; j < 8; j++) 
            {
                char symbol = GetPieceSymbol(board[i][j]);
                std::cout << symbol << " ";
            }
            std::cout << (8 - i) << std::endl;
        }
        std::cout << "  a b c d e f g h" << std::endl;
    }
    
private:
    char GetPieceSymbol(ChessPiece piece) 
    {
        switch (piece) 
        {
            case ChessPiece::Empty: return '.';
            case ChessPiece::WhitePawn: return 'P';
            case ChessPiece::WhiteRook: return 'R';
            case ChessPiece::WhiteKnight: return 'N';
            case ChessPiece::WhiteBishop: return 'B';
            case ChessPiece::WhiteQueen: return 'Q';
            case ChessPiece::WhiteKing: return 'K';
            case ChessPiece::BlackPawn: return 'p';
            case ChessPiece::BlackRook: return 'r';
            case ChessPiece::BlackKnight: return 'n';
            case ChessPiece::BlackBishop: return 'b';
            case ChessPiece::BlackQueen: return 'q';
            case ChessPiece::BlackKing: return 'k';
            default: return '?';
        }
    }
};

int main() 
{
    ChessBoard board;
    board.PrintBoard();
    
    std::cout << "\n移动白色兵: e2 -> e4" << std::endl;
    board.MovePiece(6, 4, 4, 4);
    board.PrintBoard();
    
    return 0;
}

```

### 案例4：技能快捷键栏

```cpp
#include <array>
#include <string>
#include <optional>

struct Skill 
{
    std::string name;
    int damage;
    float cooldown;
    
    Skill() : name(""), damage(0), cooldown(0) {}
    Skill(const std::string& n, int d, float cd) 
        : name(n), damage(d), cooldown(cd) {}
};

class Hotbar 
{
private:
    static constexpr int SLOT_COUNT = 10;  // 10个快捷键槽位
    std::array<std::optional<Skill>, SLOT_COUNT> slots;
    
public:
    Hotbar() 
    {
        // 初始化为空
        for (auto& slot : slots) 
        {
            slot = std::nullopt;
        }
    }
    
    bool SetSkill(int slot, const Skill& skill) 
    {
        if (slot < 0 || slot >= SLOT_COUNT) 
        {
            std::cout << "无效的槽位: " << slot << std::endl;
            return false;
        }
        
        slots[slot] = skill;
        std::cout << "技能 " << skill.name << " 放入槽位 " << slot << std::endl;
        return true;
    }
    
    bool RemoveSkill(int slot) 
    {
        if (slot < 0 || slot >= SLOT_COUNT) 
        {
            return false;
        }
        
        if (slots[slot].has_value()) 
        {
            std::cout << "移除技能: " << slots[slot]->name << std::endl;
            slots[slot] = std::nullopt;
            return true;
        }
        return false;
    }
    
    void UseSkill(int slot) 
    {
        if (slot < 0 || slot >= SLOT_COUNT) 
        {
            std::cout << "无效的槽位" << std::endl;
            return;
        }
        
        if (slots[slot].has_value()) 
        {
            const Skill& skill = slots[slot].value();
            std::cout << "使用技能: " << skill.name 
                      << " (伤害: " << skill.damage << ")" << std::endl;
        }
        else 
        {
            std::cout << "槽位 " << slot << " 为空" << std::endl;
        }
    }
    
    void PrintHotbar() 
    {
        std::cout << "\n=== 快捷栏 ===" << std::endl;
        for (int i = 0; i < SLOT_COUNT; i++) 
        {
            std::cout << "[" << i << "] ";
            if (slots[i].has_value()) 
            {
                std::cout << slots[i]->name;
            }
            else 
            {
                std::cout << "(空)";
            }
            std::cout << std::endl;
        }
    }
};

int main() 
{
    Hotbar hotbar;
    
    hotbar.SetSkill(0, {"火球术", 50, 3.0f});
    hotbar.SetSkill(1, {"冰冻箭", 80, 5.0f});
    hotbar.SetSkill(5, {"闪现", 0, 10.0f});
    
    hotbar.PrintHotbar();
    
    hotbar.UseSkill(0);
    hotbar.UseSkill(3);  // 空槽位
    
    hotbar.RemoveSkill(1);
    hotbar.PrintHotbar();
    
    return 0;
}

```

### 案例5：固定大小缓冲区

```cpp
#include <array>
#include <iostream>

template<typename T, size_t Size>
class CircularBuffer 
{
private:
    std::array<T, Size> buffer;
    size_t head;  // 写入位置
    size_t tail;  // 读取位置
    size_t count; // 当前元素数量
    
public:
    CircularBuffer() : head(0), tail(0), count(0) {}
    
    bool Push(const T& item) 
    {
        if (count >= Size) 
        {
            std::cout << "缓冲区满了！覆盖旧数据" << std::endl;
            tail = (tail + 1) % Size;  // 移动tail
        }
        else 
        {
            count++;
        }
        
        buffer[head] = item;
        head = (head + 1) % Size;
        return true;
    }
    
    bool Pop(T& item) 
    {
        if (count == 0) 
        {
            return false;
        }
        
        item = buffer[tail];
        tail = (tail + 1) % Size;
        count--;
        return true;
    }
    
    size_t Size() const 
    {
        return count;
    }
    
    bool IsEmpty() const 
    {
        return count == 0;
    }
    
    bool IsFull() const 
    {
        return count >= Size;
    }
    
    void Print() 
    {
        std::cout << "Buffer [" << count << "/" << Size << "]: ";
        size_t pos = tail;
        for (size_t i = 0; i < count; i++) 
        {
            std::cout << buffer[pos] << " ";
            pos = (pos + 1) % Size;
        }
        std::cout << std::endl;
    }
};

int main() 
{
    CircularBuffer<int, 5> buffer;
    
    // 添加元素
    for (int i = 1; i <= 7; i++) 
    {
        buffer.Push(i);
        buffer.Print();
    }
    
    // 弹出元素
    int value;
    while (buffer.Pop(value)) 
    {
        std::cout << "Popped: " << value << std::endl;
        buffer.Print();
    }
    
    return 0;
}

```

## 七、新手常见五大错误

### 错误1：尝试改变数组大小

```cpp
std::array<int, 5> numbers = {1, 2, 3, 4, 5};

// ❌ std::array没有这些方法！
// numbers.push_back(6);  // 编译错误
// numbers.resize(10);    // 编译错误
// numbers.clear();       // 编译错误

// ✅ 大小固定，只能修改元素
numbers[0] = 10;
numbers.fill(0);

```

### 错误2：忘记指定数组大小

```cpp
// ❌ 必须指定大小
std::array<int> bad;  // 编译错误

// ✅ 必须在模板参数中指定
std::array<int, 5> good;

```

不过大家可能会想我希望在A类声明一个3长度的数组，在B类声明一个4长度的数组，但是A和B又有一定相似的接口，其实还可以通过template来声明

### 错误3：初始化器过多

```cpp
// ❌ 初始化器太多
std::array<int, 3> bad = {1, 2, 3, 4, 5};  // 编译错误

// ✅ 正确
std::array<int, 5> good = {1, 2, 3, 4, 5};

```

### 错误4：混淆std::array和C数组的衰退

```cpp
void ProcessArray(int arr[5])  // C数组会退化为指针
{
    // sizeof(arr) 是指针大小，不是数组大小
}

void ProcessArray(std::array<int, 5> arr)  // std::array不会退化
{
    // arr.size() 永远是5
}

// ✅ 最佳实践：传递引用避免拷贝
void ProcessArray(const std::array<int, 5>& arr)
{
    // 高效且安全
}

```

### 错误5：越界访问使用[]而不是at()

```cpp
std::array<int, 5> numbers = {1, 2, 3, 4, 5};

// ❌ []不检查边界，可能崩溃
int value = numbers[10];  // 未定义行为

// ✅ at()检查边界，抛出异常
try 
{
    int value = numbers.at(10);
} 
catch (const std::out_of_range& e) 
{
    std::cout << "越界！" << std::endl;
}

```

## 八、最佳实践指南

### 原则一：固定大小就用std::array

```cpp
// ✅ 固定的魔法数值
std::array<float, 4> elementalResistances;  // 火冰雷毒

// ✅ 固定的方向数
std::array<Vector2, 8> directions;

// ❌ 不确定大小用vector
std::vector<Enemy> enemies;  // 敌人数量不固定

```

### 原则二：传递时使用const引用

```cpp
// ❌ 值传递会拷贝整个数组
void Process(std::array<int, 1000> arr);

// ✅ 引用传递，零开销
void Process(const std::array<int, 1000>& arr);

// 需要修改时
void Modify(std::array<int, 1000>& arr);

```

### 原则三：用constexpr标记编译期常量数组

```cpp
// ✅ 编译期常量，可能优化为常量数据
constexpr std::array<int, 5> primeNumbers = {2, 3, 5, 7, 11};

// 使用
for (int prime : primeNumbers) 
{
    // 编译器可能完全内联
}

```

### 原则四：使用结构化绑定（C++17）

```cpp
std::array<int, 3> rgb = {255, 128, 64};

// C++17 结构化绑定
auto [r, g, b] = rgb;
std::cout << "R:" << r << " G:" << g << " B:" << b << std::endl;

```

### 原则五：大数组考虑使用指针或引用存储

```cpp
// ❌ 巨大的数组值传递
struct BigData 
{
    std::array<float, 10000> data;
};

// ✅ 使用指针或引用
class DataProcessor 
{
private:
    std::array<float, 10000>* data;  // 指针
    // 或
    std::array<float, 10000>& data;  // 引用
};

```

## 九、性能分析

### 零开销抽象

```cpp
// 生成的汇编代码完全相同！

// C数组
int cArray[5] = {1, 2, 3, 4, 5};
int sum1 = 0;
for (int i = 0; i < 5; i++) 
{
    sum1 += cArray[i];
}

// std::array
std::array<int, 5> stdArray = {1, 2, 3, 4, 5};
int sum2 = 0;
for (int i = 0; i < 5; i++) 
{
    sum2 += stdArray[i];
}

// 编译器优化后生成的机器码相同
// std::array没有任何运行时开销！

```

### 内存布局

```cpp
struct Data 
{
    std::array<int, 4> values;
};

// 内存布局（连续）
// [int][int][int][int]
// 完全等同于 int values[4]

sizeof(std::array<int, 4>);  // 16字节
sizeof(int[4]);               // 16字节
// 完全相同！

```

### 栈 vs 堆

```cpp
// std::array - 栈分配
std::array<int, 100> stackArray;  // 快速，无需new/delete

// std::vector - 堆分配
std::vector<int> heapArray(100);  // 需要动态内存分配

// 对于固定大小的小数组，std::array更快！

```

## 十、std::array的局限性

### 局限1：大小必须编译期确定

```cpp
int size = 10;  // 运行时变量

// ❌ 不能用运行时变量
std::array<int, size> bad;  // 编译错误

// ✅ 必须是编译期常量
constexpr int SIZE = 10;
std::array<int, SIZE> good;

// 或者用字面量
std::array<int, 10> good2;

```

### 局限2：不能改变大小

```cpp
std::array<int, 5> numbers = {1, 2, 3, 4, 5};

// 想扩容？不可能！
// 只能创建新的更大的array并拷贝
std::array<int, 10> bigger;
std::copy(numbers.begin(), numbers.end(), bigger.begin());

```

### 局限3：大数组可能爆栈

```cpp
// ⚠️ 危险：非常大的数组在栈上
void DangerousFunction() 
{
    std::array<int, 1000000> huge;  // 4MB！可能栈溢出
}

// ✅ 大数组用vector（堆分配）
void SafeFunction() 
{
    std::vector<int> huge(1000000);  // 在堆上，安全
}

// 或static分配
static std::array<int, 1000000> huge;  // 全局区，不在栈上

```

今天的知识点你都有Get到吗~

有没有什么疑问，我们在评论区见哦~

你们也可以告诉我有什么是你们想知道的

![](./image-1.jpg)

![](./image-2.jpg)
