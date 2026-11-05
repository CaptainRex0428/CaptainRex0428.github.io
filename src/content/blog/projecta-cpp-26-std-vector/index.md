---
title: "重启RestArt ProjectA｜26.std::vector动态数组"
description: "一、什么是std::vector想象你在玩《魔兽世界》，背包一开始只有16格，但随着你的冒险，你可以升级背包到20格、24格、28格…背包会 自动扩容，你不需要担心物品放不下！ std::vector…"
category: tools
tags: ['C++', 'ProjectA', '编程基础']
date: 2025-11-07
readTime: 4
heroImage: "./image-1.jpg"
published: true
---
## 一、什么是std::vector

想象你在玩《魔兽世界》，背包一开始只有16格，但随着你的冒险，你可以升级背包到20格、24格、28格…背包会自动扩容，你不需要担心物品放不下！

std::vector就是C++中的”自动扩容背包”——一个可以动态改变大小的数组！

### 传统数组 vs std::vector

```cpp
// 传统数组：大小固定，不能改变
int numbers[5];  // 只能存5个元素
numbers[5] = 10;  // ❌ 越界！崩溃！

// std::vector：大小可变，自动扩容
std::vector<int> numbers;
numbers.push_back(1);
numbers.push_back(2);
numbers.push_back(3);
// ... 可以一直添加，自动扩容！

```

vector的魔法：

```cpp
初始容量: [][][]           (capacity = 3)
添加元素: [1][2][3]        (size = 3, 满了!)

自动扩容: [1][2][3][][][]  (capacity = 6, 容量翻倍!)
继续添加: [1][2][3][4][5]  (size = 5)

```

## 二、基础操作

```cpp
#include <iostream>
#include <vector>  // 必须包含这个头文件

int main() 
{
    // 创建一个空的int类型vector
    std::vector<int> numbers;
    
    // 添加元素
    numbers.push_back(10);
    numbers.push_back(20);
    numbers.push_back(30);
    
    // 访问元素
    std::cout << "第一个元素: " << numbers[0] << std::endl;     // 10
    std::cout << "第二个元素: " << numbers.at(1) << std::endl;  // 20
    
    // 获取大小
    std::cout << "元素数量: " << numbers.size() << std::endl;  // 3
    
    // 遍历vector
    for (int i = 0; i < numbers.size(); i++) 
    {
        std::cout << numbers[i] << " ";
    }
    std::cout << std::endl;
    
    return 0;
}

```

输出：

```cpp
第一个元素: 10
第二个元素: 20
元素数量: 3
10 20 30

```

## 三、核心操作

### 1. 创建和初始化

```cpp
// 方式1：创建空vector
std::vector<int> v1;

// 方式2：指定初始大小
std::vector<int> v2(5);  // 5个元素，默认值为0

// 方式3：指定大小和初始值
std::vector<int> v3(5, 100);  // 5个元素，都是100

// 方式4：用初始化列表（C++11）
std::vector<int> v4 = {1, 2, 3, 4, 5};
std::vector<int> v5{10, 20, 30};

// 方式5：从另一个vector复制
std::vector<int> v6 = v4;

// 方式6：从数组初始化
int arr[] = {1, 2, 3, 4};
std::vector<int> v7(arr, arr + 4);

// 方式7：使用迭代器范围
std::vector<int> v8(v4.begin(), v4.end());

```

### 2. 添加元素

```cpp
std::vector<int> numbers;

// push_back - 在末尾添加
numbers.push_back(10);
numbers.push_back(20);
numbers.push_back(30);
// [10, 20, 30]

// emplace_back - 在末尾构造（C++11，更高效）
numbers.emplace_back(40);
// [10, 20, 30, 40]

// insert - 在指定位置插入
numbers.insert(numbers.begin() + 1, 15);  // 在索引1插入15
// [10, 15, 20, 30, 40]

// insert - 插入多个相同值
numbers.insert(numbers.begin(), 3, 5);  // 在开头插入3个5
// [5, 5, 5, 10, 15, 20, 30, 40]

// insert - 插入另一个vector
std::vector<int> extra = {100, 200};
numbers.insert(numbers.end(), extra.begin(), extra.end());
// [5, 5, 5, 10, 15, 20, 30, 40, 100, 200]

```

### 3. 删除元素

```cpp
std::vector<int> numbers = {10, 20, 30, 40, 50};

// pop_back - 删除最后一个元素
numbers.pop_back();
// [10, 20, 30, 40]

// erase - 删除指定位置的元素
numbers.erase(numbers.begin() + 1);  // 删除索引1的元素
// [10, 30, 40]

// erase - 删除范围内的元素
numbers.erase(numbers.begin(), numbers.begin() + 2);  // 删除前2个
// [40]

// clear - 删除所有元素
numbers.clear();
// []

// remove-erase idiom - 删除所有值为30的元素
std::vector<int> nums = {10, 30, 20, 30, 40, 30};
nums.erase(std::remove(nums.begin(), nums.end(), 30), nums.end());
// [10, 20, 40]

```

### 4. 访问元素

```cpp
std::vector<int> numbers = {10, 20, 30, 40, 50};

// 方式1：[] 操作符（不检查越界，快速）
int first = numbers[0];  // 10
int last = numbers[4];   // 50

// 方式2：at() 方法（检查越界，安全）
int second = numbers.at(1);  // 20
// numbers.at(10);  // ❌ 抛出异常：std::out_of_range

// 方式3：front() 获取第一个元素
int firstElem = numbers.front();  // 10

// 方式4：back() 获取最后一个元素
int lastElem = numbers.back();  // 50

// 方式5：data() 获取底层数组指针
int* ptr = numbers.data();
std::cout << ptr[0] << std::endl;  // 10

```

[] vs at() 的区别：

```cpp
std::vector<int> numbers = {1, 2, 3};

// [] 不检查边界（快速但不安全）
int x = numbers[10];  // ❌ 未定义行为，可能崩溃

// at() 检查边界（安全但略慢）
try 
{
    int y = numbers.at(10);  // 抛出异常
} 
catch (const std::out_of_range& e) 
{
    std::cout << "索引越界！" << std::endl;
}

```

### 5. 查询信息

```cpp
std::vector<int> numbers = {10, 20, 30};

// size() - 元素数量
std::cout << numbers.size() << std::endl;  // 3

// empty() - 是否为空
if (numbers.empty()) 
{
    std::cout << "Vector is empty" << std::endl;
}
else 
{
    std::cout << "Vector has elements" << std::endl;  // 输出这个
}

// capacity() - 当前容量（不需要扩容能存多少元素）
std::cout << numbers.capacity() << std::endl;  // 可能是3或更大

// max_size() - 理论最大容量
std::cout << numbers.max_size() << std::endl;  // 非常大的数字

```

### 6. 修改操作

```cpp
std::vector<int> numbers = {10, 20, 30};

// assign - 替换所有内容
numbers.assign(5, 100);  // 替换为5个100
// [100, 100, 100, 100, 100]

numbers.assign({1, 2, 3});  // 用初始化列表替换
// [1, 2, 3]

// swap - 交换两个vector的内容
std::vector<int> v1 = {1, 2, 3};
std::vector<int> v2 = {7, 8, 9};
v1.swap(v2);
// v1 = [7, 8, 9]
// v2 = [1, 2, 3]

// resize - 改变大小
numbers.resize(5);       // 增加到5个，新元素默认为0
numbers.resize(2);       // 缩减到2个
numbers.resize(10, 99);  // 增加到10个，新元素为99

```

### 7. 容量管理

```cpp
std::vector<int> numbers;

// reserve - 预留容量（避免多次扩容）
numbers.reserve(100);  // 预留100个元素的空间
std::cout << "Capacity: " << numbers.capacity() << std::endl;  // 100
std::cout << "Size: " << numbers.size() << std::endl;          // 0

// 添加元素不会触发扩容（直到超过100个）
for (int i = 0; i < 100; i++) 
{
    numbers.push_back(i);
}

// shrink_to_fit - 缩减容量到实际大小（C++11）
numbers.resize(10);
std::cout << "Before shrink: " << numbers.capacity() << std::endl;  // 100
numbers.shrink_to_fit();
std::cout << "After shrink: " << numbers.capacity() << std::endl;   // 约10

```

## 四、遍历vector的五种方式

### 1.索引遍历（传统）

```cpp
std::vector<int> numbers = {10, 20, 30, 40, 50};

for (int i = 0; i < numbers.size(); i++) 
{
    std::cout << numbers[i] << " ";
}
std::cout << std::endl;

```

⚠️ 注意： size()返回的是size_t（无符号类型），倒序遍历要小心

```cpp
// ❌ 危险！i是无符号类型，永远 >= 0
for (size_t i = numbers.size() - 1; i >= 0; i--) 
{
    // 无限循环！
}

// ✅ 正确
for (int i = numbers.size() - 1; i >= 0; i--) 
{
    std::cout << numbers[i] << " ";
}

```

### 2.迭代器遍历

这是比较常用的方式

```cpp
std::vector<int> numbers = {10, 20, 30, 40, 50};

for (std::vector<int>::iterator it = numbers.begin(); 
     it != numbers.end(); ++it) 
{
    std::cout << *it << " ";
}
std::cout << std::endl;

// 使用auto简化（C++11）
for (auto it = numbers.begin(); it != numbers.end(); ++it) 
{
    std::cout << *it << " ";
}

```

### 3.范围for循环（&gt; C++11）

```cpp
std::vector<int> numbers = {10, 20, 30, 40, 50};

// 只读遍历
for (int num : numbers) 
{
    std::cout << num << " ";
}
std::cout << std::endl;

// 修改元素（使用引用）
for (int& num : numbers) 
{
    num *= 2;  // 所有元素翻倍
}

// 只读遍历（推荐用const引用，避免拷贝）
for (const auto& num : numbers) 
{
    std::cout << num << " ";
}

```

### 4.反向迭代器

```cpp
std::vector<int> numbers = {10, 20, 30, 40, 50};

for (auto it = numbers.rbegin(); it != numbers.rend(); ++it) 
{
    std::cout << *it << " ";  // 输出: 50 40 30 20 10
}
std::cout << std::endl;

```

### 5.算法遍历

```cpp
#include <algorithm>

std::vector<int> numbers = {10, 20, 30, 40, 50};

// for_each
std::for_each(numbers.begin(), numbers.end(), [](int num) {
    std::cout << num << " ";
});
std::cout << std::endl;

```

## 五、开发实战案例

### 1.敌人管理系统

```cpp
#include <iostream>
#include <vector>
#include <string>

struct Enemy 
{
    std::string name;
    int hp;
    int damage;
    bool isAlive;
    
    Enemy(const std::string& n, int h, int d) 
        : name(n), hp(h), damage(d), isAlive(true) {}
    
    void TakeDamage(int dmg) 
    {
        hp -= dmg;
        if (hp <= 0) 
        {
            hp = 0;
            isAlive = false;
            std::cout << name << " 被击败了！" << std::endl;
        }
    }
};

class EnemyManager 
{
private:
    std::vector<Enemy> enemies;
    
public:
    void SpawnEnemy(const std::string& name, int hp, int damage) 
    {
        enemies.emplace_back(name, hp, damage);
        std::cout << name << " 出现了！" << std::endl;
    }
    
    void AttackEnemy(int index, int damage) 
    {
        if (index >= 0 && index < enemies.size()) 
        {
            enemies[index].TakeDamage(damage);
        }
    }
    
    void RemoveDeadEnemies() 
    {
        // remove-erase idiom
        enemies.erase(
            std::remove_if(enemies.begin(), enemies.end(),
                [](const Enemy& e) { return !e.isAlive; }),
            enemies.end()
        );
    }
    
    void PrintEnemies() 
    {
        std::cout << "\n=== 当前敌人列表 ===" << std::endl;
        for (size_t i = 0; i < enemies.size(); i++) 
        {
            const Enemy& e = enemies[i];
            std::cout << i << ". " << e.name 
                      << " (HP: " << e.hp << ")" << std::endl;
        }
    }
    
    int GetEnemyCount() const 
    {
        return enemies.size();
    }
};

int main() 
{
    EnemyManager manager;
    
    manager.SpawnEnemy("哥布林", 50, 10);
    manager.SpawnEnemy("兽人", 100, 20);
    manager.SpawnEnemy("巨魔", 150, 30);
    
    manager.PrintEnemies();
    
    manager.AttackEnemy(0, 60);  // 击败哥布林
    manager.RemoveDeadEnemies();
    
    manager.PrintEnemies();
    
    return 0;
}

```

### 2.物品背包系统

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

struct Item 
{
    std::string name;
    int quantity;
    float weight;
    
    Item(const std::string& n, int q, float w) 
        : name(n), quantity(q), weight(w) {}
};

class Inventory 
{
private:
    std::vector<Item> items;
    float maxWeight;
    
public:
    Inventory(float max) : maxWeight(max) {}
    
    bool AddItem(const std::string& name, int quantity, float weight) 
    {
        float totalWeight = GetTotalWeight() + weight * quantity;
        if (totalWeight > maxWeight) 
        {
            std::cout << "背包太重了！无法添加 " << name << std::endl;
            return false;
        }
        
        // 检查是否已存在该物品
        for (auto& item : items) 
        {
            if (item.name == name) 
            {
                item.quantity += quantity;
                std::cout << "添加了 " << quantity << " 个 " 
                          << name << std::endl;
                return true;
            }
        }
        
        // 新物品
        items.emplace_back(name, quantity, weight);
        std::cout << "获得了 " << quantity << " 个 " << name << std::endl;
        return true;
    }
    
    bool RemoveItem(const std::string& name, int quantity) 
    {
        for (auto it = items.begin(); it != items.end(); ++it) 
        {
            if (it->name == name) 
            {
                if (it->quantity >= quantity) 
                {
                    it->quantity -= quantity;
                    std::cout << "使用了 " << quantity << " 个 " 
                              << name << std::endl;
                    
                    if (it->quantity == 0) 
                    {
                        items.erase(it);
                    }
                    return true;
                }
                else 
                {
                    std::cout << name << " 数量不足！" << std::endl;
                    return false;
                }
            }
        }
        
        std::cout << "背包中没有 " << name << std::endl;
        return false;
    }
    
    float GetTotalWeight() const 
    {
        float total = 0.0f;
        for (const auto& item : items) 
        {
            total += item.weight * item.quantity;
        }
        return total;
    }
    
    void SortByName() 
    {
        std::sort(items.begin(), items.end(),
            [](const Item& a, const Item& b) {
                return a.name < b.name;
            });
    }
    
    void PrintInventory() 
    {
        std::cout << "\n=== 背包 ===" << std::endl;
        std::cout << "负重: " << GetTotalWeight() << "/" << maxWeight << std::endl;
        
        for (const auto& item : items) 
        {
            std::cout << item.name << " x" << item.quantity 
                      << " (重量: " << item.weight << ")" << std::endl;
        }
    }
};

int main() 
{
    Inventory bag(50.0f);
    
    bag.AddItem("生命药水", 5, 0.5f);
    bag.AddItem("面包", 10, 0.2f);
    bag.AddItem("铁剑", 1, 5.0f);
    
    bag.PrintInventory();
    
    bag.RemoveItem("生命药水", 2);
    bag.AddItem("生命药水", 3, 0.5f);
    
    bag.SortByName();
    bag.PrintInventory();
    
    return 0;
}

```

### 3.弹幕系统

```cpp
#include <iostream>
#include <vector>

struct Bullet 
{
    float x, y;
    float velocityX, velocityY;
    bool isActive;
    
    Bullet(float px, float py, float vx, float vy) 
        : x(px), y(py), velocityX(vx), velocityY(vy), isActive(true) {}
    
    void Update(float deltaTime) 
    {
        x += velocityX * deltaTime;
        y += velocityY * deltaTime;
        
        // 超出边界则失效
        if (x < 0 || x > 800 || y < 0 || y > 600) 
        {
            isActive = false;
        }
    }
};

class BulletManager 
{
private:
    std::vector<Bullet> bullets;
    
public:
    void Fire(float x, float y, float vx, float vy) 
    {
        bullets.emplace_back(x, y, vx, vy);
    }
    
    void Update(float deltaTime) 
    {
        // 更新所有子弹
        for (auto& bullet : bullets) 
        {
            if (bullet.isActive) 
            {
                bullet.Update(deltaTime);
            }
        }
        
        // 清理失效的子弹
        bullets.erase(
            std::remove_if(bullets.begin(), bullets.end(),
                [](const Bullet& b) { return !b.isActive; }),
            bullets.end()
        );
    }
    
    void ClearAll() 
    {
        bullets.clear();
    }
    
    int GetActiveCount() const 
    {
        return bullets.size();
    }
    
    void PrintBullets() 
    {
        std::cout << "活跃子弹数: " << bullets.size() << std::endl;
        for (size_t i = 0; i < bullets.size(); i++) 
        {
            const Bullet& b = bullets[i];
            std::cout << "子弹" << i << ": (" << b.x << ", " << b.y << ")" 
                      << std::endl;
        }
    }
};

int main() 
{
    BulletManager manager;
    
    // 发射3发子弹
    manager.Fire(100, 100, 10, 0);
    manager.Fire(150, 150, -5, 10);
    manager.Fire(200, 200, 0, -15);
    
    manager.PrintBullets();
    
    // 模拟更新
    for (int frame = 0; frame < 100; frame++) 
    {
        manager.Update(0.016f);  // 约60FPS
    }
    
    manager.PrintBullets();
    
    return 0;
}

```

### 4.技能冷却系统

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

struct Skill 
{
    std::string name;
    float cooldownTime;      // 冷却时间
    float remainingCooldown; // 剩余冷却
    int damage;
    
    Skill(const std::string& n, float cd, int dmg) 
        : name(n), cooldownTime(cd), remainingCooldown(0.0f), damage(dmg) {}
    
    bool IsReady() const 
    {
        return remainingCooldown <= 0.0f;
    }
    
    void Use() 
    {
        if (IsReady()) 
        {
            remainingCooldown = cooldownTime;
            std::cout << "使用技能: " << name << " (伤害: " 
                      << damage << ")" << std::endl;
        }
        else 
        {
            std::cout << name << " 冷却中，还需 " 
                      << remainingCooldown << " 秒" << std::endl;
        }
    }
    
    void Update(float deltaTime) 
    {
        if (remainingCooldown > 0.0f) 
        {
            remainingCooldown -= deltaTime;
            if (remainingCooldown < 0.0f) 
            {
                remainingCooldown = 0.0f;
            }
        }
    }
};

class SkillManager 
{
private:
    std::vector<Skill> skills;
    
public:
    void AddSkill(const std::string& name, float cooldown, int damage) 
    {
        skills.emplace_back(name, cooldown, damage);
    }
    
    void UseSkill(int index) 
    {
        if (index >= 0 && index < skills.size()) 
        {
            skills[index].Use();
        }
    }
    
    void UseSkillByName(const std::string& name) 
    {
        auto it = std::find_if(skills.begin(), skills.end(),
            [&name](const Skill& s) { return s.name == name; });
        
        if (it != skills.end()) 
        {
            it->Use();
        }
    }
    
    void Update(float deltaTime) 
    {
        for (auto& skill : skills) 
        {
            skill.Update(deltaTime);
        }
    }
    
    void PrintSkills() 
    {
        std::cout << "\n=== 技能列表 ===" << std::endl;
        for (size_t i = 0; i < skills.size(); i++) 
        {
            const Skill& s = skills[i];
            std::cout << i << ". " << s.name;
            if (s.IsReady()) 
            {
                std::cout << " [就绪]";
            }
            else 
            {
                std::cout << " [冷却: " << s.remainingCooldown << "s]";
            }
            std::cout << std::endl;
        }
    }
};

int main() 
{
    SkillManager manager;
    
    manager.AddSkill("火球术", 3.0f, 50);
    manager.AddSkill("冰冻箭", 5.0f, 80);
    manager.AddSkill("闪电链", 8.0f, 120);
    
    manager.PrintSkills();
    
    manager.UseSkill(0);  // 使用火球术
    manager.UseSkill(1);  // 使用冰冻箭
    
    manager.PrintSkills();
    
    // 模拟时间流逝
    manager.Update(4.0f);
    
    manager.PrintSkills();
    manager.UseSkill(0);  // 火球术已就绪
    
    return 0;
}

```

### 5.排行榜系统

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

struct Player 
{
    std::string name;
    int score;
    int level;
    
    Player(const std::string& n, int s, int l) 
        : name(n), score(s), level(l) {}
};

class Leaderboard 
{
private:
    std::vector<Player> players;
    int maxEntries;
    
public:
    Leaderboard(int max = 10) : maxEntries(max) {}
    
    void AddPlayer(const std::string& name, int score, int level) 
    {
        players.emplace_back(name, score, level);
        
        // 按分数降序排序
        std::sort(players.begin(), players.end(),
            [](const Player& a, const Player& b) {
                if (a.score != b.score) 
                    return a.score > b.score;  // 分数高的在前
                return a.level > b.level;      // 分数相同比等级
            });
        
        // 只保留前N名
        if (players.size() > maxEntries) 
        {
            players.resize(maxEntries);
        }
    }
    
    void PrintLeaderboard() 
    {
        std::cout << "\n=== 排行榜 ===" << std::endl;
        std::cout << "排名\t玩家\t\t分数\t等级" << std::endl;
        std::cout << "------------------------------------" << std::endl;
        
        for (size_t i = 0; i < players.size(); i++) 
        {
            const Player& p = players[i];
            std::cout << (i + 1) << "\t" << p.name << "\t\t" 
                      << p.score << "\t" << p.level << std::endl;
        }
    }
    
    int GetRank(const std::string& name) 
    {
        for (size_t i = 0; i < players.size(); i++) 
        {
            if (players[i].name == name) 
            {
                return i + 1;
            }
        }
        return -1;  // 未上榜
    }
};

int main() 
{
    Leaderboard board(5);
    
    board.AddPlayer("Alice", 1500, 50);
    board.AddPlayer("Bob", 2000, 60);
    board.AddPlayer("Charlie", 1200, 45);
    board.AddPlayer("David", 2500, 70);
    board.AddPlayer("Eve", 1800, 55);
    board.AddPlayer("Frank", 1000, 40);  // 不会进入前5
    
    board.PrintLeaderboard();
    
    int rank = board.GetRank("Eve");
    std::cout << "\nEve的排名: " << rank << std::endl;
    
    return 0;
}

```

## 六、虚幻引擎中的TArray

UE使用TArray而不是std::vector，但概念非常相似！

### TArray vs std::vector

```cpp
// std::vector
std::vector<int> numbers;
numbers.push_back(10);
int x = numbers[0];
int count = numbers.size();

// TArray（UE）
TArray<int32> Numbers;
Numbers.Add(10);
int32 X = Numbers[0];
int32 Count = Numbers.Num();  // 注意是Num()不是size()

```

### TArray常用操作

```cpp
UCLASS()
class MYGAME_API AMyActor : public AActor
{
    GENERATED_BODY()
    
public:
    // 暴露到编辑器的数组
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Data")
    TArray<int32> Numbers;
    
    UPROPERTY(EditAnywhere, Category = "Enemies")
    TArray<AActor*> Enemies;
    
    void ExampleOperations()
    {
        // 添加元素
        Numbers.Add(10);
        Numbers.Add(20);
        Numbers.Emplace(30);
        
        // 插入元素
        Numbers.Insert(15, 1);  // 在索引1插入15
        
        // 删除元素
        Numbers.RemoveAt(0);       // 删除索引0
        Numbers.Remove(20);        // 删除值为20的元素
        Numbers.Pop();             // 删除最后一个
        Numbers.Empty();           // 清空
        
        // 访问元素
        int32 First = Numbers[0];
        int32 Last = Numbers.Last();
        
        // 查询
        int32 Count = Numbers.Num();
        bool IsEmpty = Numbers.Num() == 0;
        
        // 查找
        int32 Index = Numbers.Find(20);
        bool Contains = Numbers.Contains(30);
        
        // 排序
        Numbers.Sort();
        
        // 预留空间
        Numbers.Reserve(100);
        
        // 遍历
        for (int32 Num : Numbers)
        {
            UE_LOG(LogTemp, Warning, TEXT("Number: %d"), Num);
        }
    }
};

```

### TArray的特殊功能

```cpp
// 使用谓词删除
TArray<AActor*> Actors;
Actors.RemoveAll([](AActor* Actor) {
    return Actor == nullptr || !Actor->IsValidLowLevel();
});

// 过滤数组
TArray<int32> AllNumbers = {1, 2, 3, 4, 5, 6};
TArray<int32> EvenNumbers = AllNumbers.FilterByPredicate([](int32 Num) {
    return Num % 2 == 0;
});

// 数组切片
TArray<int32> Numbers = {1, 2, 3, 4, 5};
TArrayView<int32> View = MakeArrayView(Numbers.GetData() + 1, 3);
// View = {2, 3, 4}

// Append合并
TArray<int32> A = {1, 2, 3};
TArray<int32> B = {4, 5, 6};
A.Append(B);  // A = {1, 2, 3, 4, 5, 6}

```

## 七、新手常见五大错误

### 错误1：忘记检查empty()就使用front()或back()

```cpp
std::vector<int> numbers;

// ❌ 危险！vector为空时未定义行为
int first = numbers.front();
int last = numbers.back();

// ✅ 正确
if (!numbers.empty()) 
{
    int first = numbers.front();
    int last = numbers.back();
}

```

### 错误2：在遍历时修改vector大小

```cpp
std::vector<int> numbers = {1, 2, 3, 4, 5};

// ❌ 危险！迭代器失效
for (auto it = numbers.begin(); it != numbers.end(); ++it) 
{
    if (*it == 3) 
    {
        numbers.erase(it);  // 迭代器失效！
    }
}

// ✅ 正确方式1：使用erase返回的迭代器
for (auto it = numbers.begin(); it != numbers.end(); ) 
{
    if (*it == 3) 
    {
        it = numbers.erase(it);  // erase返回下一个有效迭代器
    }
    else 
    {
        ++it;
    }
}

// ✅ 正确方式2：使用remove-erase idiom
numbers.erase(
    std::remove(numbers.begin(), numbers.end(), 3),
    numbers.end()
);

```

### 错误3：频繁push_back导致多次扩容

```cpp
std::vector<int> numbers;

// ❌ 性能差：可能触发多次内存分配
for (int i = 0; i < 10000; i++) 
{
    numbers.push_back(i);  // 每次扩容都要复制所有元素！
}

// ✅ 好：预留空间，一次分配
std::vector<int> numbers;
numbers.reserve(10000);  // 提前分配足够空间
for (int i = 0; i < 10000; i++) 
{
    numbers.push_back(i);  // 不会触发扩容
}

```

### 错误4：使用erase后继续使用被删除的迭代器

```cpp
std::vector<int> numbers = {1, 2, 3, 4, 5};
auto it = numbers.begin() + 2;  // 指向3

numbers.erase(it);

// ❌ 危险！it已经失效
std::cout << *it << std::endl;  // 未定义行为

// ✅ 正确：使用erase的返回值
auto it = numbers.begin() + 2;
it = numbers.erase(it);  // it现在指向4
std::cout << *it << std::endl;  // 安全

```

### 错误5：比较size()时类型不匹配

```cpp
std::vector<int> numbers = {1, 2, 3};

// ⚠️ 警告：size()返回size_t（无符号），-1是有符号
if (numbers.size() > -1)  // 永远为true！
{
    // -1会被转换为很大的无符号数
}

// ✅ 正确：保持类型一致
if (numbers.size() > 0)
{
    // ...
}

// 或者显式转换
if (static_cast<int>(numbers.size()) > -1)
{
    // ...
}

```

## 八、最佳实践指南

### 原则一：能用emplace就不用push

```cpp
struct Player 
{
    std::string name;
    int level;
    
    Player(const std::string& n, int l) : name(n), level(l) {}
};

std::vector<Player> players;

// ❌ 慢：创建临时对象再拷贝
players.push_back(Player("Alice", 10));

// ✅ 快：直接在vector内构造对象
players.emplace_back("Alice", 10);

```

### 原则二：大量添加前先reserve

```cpp
std::vector<int> numbers;

// 如果知道大概要存多少元素，先预留
numbers.reserve(1000);

for (int i = 0; i < 1000; i++) 
{
    numbers.push_back(i);
}

```

### 原则三：使用范围for读取，引用修改

```cpp
std::vector<BigObject> objects;

// ✅ 只读：用const引用避免拷贝
for (const auto& obj : objects) 
{
    obj.Print();
}

// ✅ 修改：用非const引用
for (auto& obj : objects) 
{
    obj.Update();
}

// ❌ 不好：每次循环都拷贝对象
for (auto obj : objects) 
{
    // obj是拷贝，修改无效
}

```

### 原则四：删除元素用remove-erase idiom

```cpp
std::vector<int> numbers = {1, 2, 3, 2, 4, 2, 5};

// ✅ 删除所有值为2的元素（标准做法）
numbers.erase(
    std::remove(numbers.begin(), numbers.end(), 2),
    numbers.end()
);

// 条件删除
numbers.erase(
    std::remove_if(numbers.begin(), numbers.end(),
        [](int n) { return n % 2 == 0; }),  // 删除所有偶数
    numbers.end()
);

```

### 原则五：用shrink_to_fit释放多余内存

```cpp
std::vector<int> numbers;
numbers.reserve(10000);

// ... 只用了100个

numbers.resize(100);
// 此时capacity仍是10000，浪费内存

numbers.shrink_to_fit();  // 释放多余空间

```

## 九、性能分析

### 时间复杂度

| 操作 | 复杂度 | 说明 |
| --- | --- | --- |
| [] / at() | O(1) | 随机访问 |
| push_back() | O(1)* | 均摊常数，偶尔O(n) |
| pop_back() | O(1) | 删除末尾 |
| insert() | O(n) | 需要移动元素 |
| erase() | O(n) | 需要移动元素 |
| find() | O(n) | 线性查找 |
| clear() | O(n) | 销毁所有元素 |

### 扩容机制

```cpp
std::vector<int> numbers;

std::cout << "Capacity\tSize" << std::endl;
for (int i = 0; i < 20; i++) 
{
    numbers.push_back(i);
    std::cout << numbers.capacity() << "\t\t" << numbers.size() << std::endl;
}

// 输出（MSVC）：
// Capacity    Size
// 1          1
// 2          2
// 3          3
// 4          4
// 6          5  ← 扩容！
// 6          6
// 9          7  ← 扩容！
// 9          8
// ...

```

扩容策略（不同编译器可能不同）：

- GCC/Clang：通常翻倍（2x）

- MSVC：通常1.5倍

### 内存布局

```cpp
// vector的内存是连续的，对缓存友好
std::vector<int> numbers = {1, 2, 3, 4, 5};

// 内存布局：
// [1][2][3][4][5]  ← 连续内存块
//  ^
//  data()指向的地址

// vs std::list（链表）：
// [1]→[2]→[3]→[4]→[5]  ← 分散在内存各处

```

## 十、vector vs 其他容器

### vector vs array

```cpp
// std::array - 固定大小，栈上分配
std::array<int, 5> arr = {1, 2, 3, 4, 5};
// arr.size() 永远是5

// std::vector - 动态大小，堆上分配
std::vector<int> vec = {1, 2, 3, 4, 5};
vec.push_back(6);  // 可以增长

```

何时用array：

- ✅ 大小在编译期确定

- ✅ 不需要动态改变大小

- ✅ 需要栈上分配（性能关键）

### vector vs list

```cpp
// std::list - 双向链表
std::list<int> lst = {1, 2, 3, 4, 5};
lst.push_front(0);  // vector不支持

```

| 特性 | vector | list |
| --- | --- | --- |
| 随机访问 | O(1) | ❌ O(n) |
| 插入/删除头部 | O(n) | ✅ O(1) |
| 插入/删除中间 | O(n) | ✅ O(1)* |
| 内存连续 | ✅ 是 | ❌ 否 |
| 缓存友好 | ✅ 是 | ❌ 否 |

何时用vector： 90%的情况！除非你需要频繁的中间插入删除

### vector vs deque

```cpp
// std::deque - 双端队列
std::deque<int> dq = {1, 2, 3, 4, 5};
dq.push_front(0);   // 两端都高效
dq.push_back(6);

```

何时用deque：

- ✅ 需要频繁在两端添加/删除

- ✅ 不需要保证内存连续性

## 十一、调试技巧

### 打印vector内容

```cpp
template<typename T>
void PrintVector(const std::vector<T>& vec, const std::string& name = "") 
{
    if (!name.empty()) 
    {
        std::cout << name << ": ";
    }
    
    std::cout << "[";
    for (size_t i = 0; i < vec.size(); i++) 
    {
        std::cout << vec[i];
        if (i < vec.size() - 1) 
            std::cout << ", ";
    }
    std::cout << "]" << std::endl;
}

// 使用
std::vector<int> numbers = {1, 2, 3, 4, 5};
PrintVector(numbers, "numbers");
// 输出: numbers: [1, 2, 3, 4, 5]

```

### 检查迭代器是否有效

```cpp
std::vector<int> numbers = {1, 2, 3, 4, 5};
auto it = numbers.begin() + 2;

// 检查迭代器是否在范围内
if (it >= numbers.begin() && it < numbers.end()) 
{
    std::cout << "迭代器有效" << std::endl;
}

```

今天的知识点你都有Get到吗~

有没有什么疑问，我们在评论区见哦~

你们也可以告诉我有什么是你们想知道的

![](./image-1.jpg)

![](./image-2.jpg)
