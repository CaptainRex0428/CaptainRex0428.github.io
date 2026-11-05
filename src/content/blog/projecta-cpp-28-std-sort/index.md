---
title: "重启RestArt ProjectA｜28.std::sort排序算法"
description: "一、什么是std::sort想象你在玩《守望先锋》，赛后结算界面会按照 伤害值从高到低排列所有玩家，或者你在管理背包时想按物品等级排序，这就是排序的魔力！ std::sort就是C++标准库提供的”万…"
category: tools
tags: ['C++', 'ProjectA', '编程基础']
date: 2025-11-10
readTime: 3
heroImage: "./cover.webp"
published: true
---
## 一、什么是std::sort

想象你在玩《守望先锋》，赛后结算界面会按照伤害值从高到低排列所有玩家，或者你在管理背包时想按物品等级排序，这就是排序的魔力！

std::sort就是C++标准库提供的”万能排序器”——快速、高效、灵活！

### 为什么需要排序？

```cpp
// 杂乱无章的数据
std::vector<int> scores = {45, 12, 89, 34, 67, 23, 90};

// 排序后
std::vector<int> sortedScores = {12, 23, 34, 45, 67, 89, 90};
// 一目了然！

```

排序的威力：

```cpp
排行榜系统    → 按分数排序
商店物品      → 按价格/等级排序
敌人AI        → 按威胁度排序
寻路算法      → 按距离排序
任务系统      → 按优先级排序

```

## 二、基础使用

```cpp
#include <iostream>
#include <vector>
#include <algorithm>  // 必须包含这个头文件

int main() 
{
    std::vector<int> numbers = {64, 34, 25, 12, 22, 11, 90};
    
    std::cout << "排序前: ";
    for (int num : numbers) 
    {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    // 默认升序排序
    std::sort(numbers.begin(), numbers.end());
    
    std::cout << "排序后: ";
    for (int num : numbers) 
    {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    return 0;
}

```

输出：

```cpp
排序前: 64 34 25 12 22 11 90
排序后: 11 12 22 25 34 64 90

```

## 三、std::sort的核心用法

### 1. 基本排序

```cpp
std::vector<int> numbers = {5, 2, 8, 1, 9, 3};

// 升序排序（默认）
std::sort(numbers.begin(), numbers.end());
// 结果: {1, 2, 3, 5, 8, 9}

// 降序排序（使用greater）
std::sort(numbers.begin(), numbers.end(), std::greater<int>());
// 结果: {9, 8, 5, 3, 2, 1}

```

### 2. 部分排序

```cpp
std::vector<int> numbers = {5, 2, 8, 1, 9, 3, 7, 4, 6};

// 只排序前5个元素
std::sort(numbers.begin(), numbers.begin() + 5);
// 结果: {1, 2, 5, 8, 9, 3, 7, 4, 6}
//       ↑排序部分↑  ↑未排序↑

```

### 3. 使用自定义比较函数

```cpp
// 方式1：函数指针
bool CompareDescending(int a, int b) 
{
    return a > b;  // 降序
}

std::vector<int> numbers = {5, 2, 8, 1, 9};
std::sort(numbers.begin(), numbers.end(), CompareDescending);
// 结果: {9, 8, 5, 2, 1}

// 方式2：Lambda表达式（推荐）
std::sort(numbers.begin(), numbers.end(), [](int a, int b) {
    return a > b;  // 降序
});

```

比较函数的规则：

```cpp
// ✅ 正确：返回 a < b 表示升序
std::sort(vec.begin(), vec.end(), [](int a, int b) {
    return a < b;
});

// ✅ 正确：返回 a > b 表示降序
std::sort(vec.begin(), vec.end(), [](int a, int b) {
    return a > b;
});

// ❌ 错误：返回 a <= b 会导致未定义行为！
std::sort(vec.begin(), vec.end(), [](int a, int b) {
    return a <= b;  // 违反严格弱序
});
```

### 4. 排序自定义类型

```cpp
struct Player 
{
    std::string name;
    int score;
    int level;
};

std::vector<Player> players = {
    {"Alice", 1500, 50},
    {"Bob", 2000, 60},
    {"Charlie", 1500, 45}
};

// 按分数降序排序
std::sort(players.begin(), players.end(), 
    [](const Player& a, const Player& b) {
        return a.score > b.score;
    });

// 多重排序：先按分数，分数相同按等级
std::sort(players.begin(), players.end(), 
    [](const Player& a, const Player& b) {
        if (a.score != b.score) 
            return a.score > b.score;  // 分数降序
        return a.level > b.level;      // 等级降序
    });

```

### 5. 排序指针/智能指针容器

```cpp
std::vector<Player*> playerPtrs;
// ... 填充指针 ...

// 排序指针指向的对象
std::sort(playerPtrs.begin(), playerPtrs.end(), 
    [](const Player* a, const Player* b) {
        return a->score > b->score;  // 按分数降序
    });

```

## 四、std::sort“家族”函数

### 函数1：std::stable_sort - 稳定排序

保持相等元素的相对顺序！

```cpp
struct Student 
{
    std::string name;
    int score;
};

std::vector<Student> students = {
    {"Alice", 90},
    {"Bob", 85},
    {"Charlie", 90},  // 和Alice分数相同
    {"David", 85}
};

// 不稳定排序：相等元素顺序可能改变
std::sort(students.begin(), students.end(), 
    [](const Student& a, const Student& b) {
        return a.score > b.score;
    });
// 结果可能: Alice(90), Charlie(90) 或 Charlie(90), Alice(90)

// 稳定排序：相等元素保持原始顺序
std::stable_sort(students.begin(), students.end(), 
    [](const Student& a, const Student& b) {
        return a.score > b.score;
    });
// 结果一定: Alice(90), Charlie(90) - 保持原顺序！

```

### 函数2：std::partial_sort - 部分排序

只需要前N个最大/最小元素？用partial_sort更快！

```cpp
std::vector<int> scores = {45, 89, 12, 67, 34, 90, 23, 56, 78};

// 只要前3名，其余不关心顺序
std::partial_sort(scores.begin(), scores.begin() + 3, scores.end(), 
    std::greater<int>());

// 结果: {90, 89, 78, ...其余乱序...}
//       ↑前3名有序↑  ↑后面不保证顺序↑

```

性能优势：

```cpp
// 如果只需要前10名
std::vector<int> data(1000000);  // 100万个数

// ❌ 慢：排序所有元素
std::sort(data.begin(), data.end(), std::greater<int>());

// ✅ 快：只排序前10个
std::partial_sort(data.begin(), data.begin() + 10, data.end(), 
    std::greater<int>());

```

### 函数3：std::nth_element - 找第N大/小元素

不需要完全排序，只想找第N名？用nth_element！

```cpp
std::vector<int> scores = {45, 89, 12, 67, 34, 90, 23, 56, 78};

// 找第5大的元素（索引4）
std::nth_element(scores.begin(), scores.begin() + 4, scores.end(), 
    std::greater<int>());

std::cout << "第5名的分数: " << scores[4] << std::endl;

// 结果: scores[4] 就是第5大的元素
// 前面的都 >= scores[4]
// 后面的都 <= scores[4]
// 但前后都不保证有序！

```

应用场景：

```cpp
// 找中位数
std::nth_element(data.begin(), data.begin() + data.size()/2, data.end());
int median = data[data.size()/2];

// 找前25%分位数
std::nth_element(data.begin(), data.begin() + data.size()/4, data.end());

```

### 函数4：std::is_sorted - 检查是否已排序

```cpp
std::vector<int> numbers = {1, 2, 3, 4, 5};

if (std::is_sorted(numbers.begin(), numbers.end())) 
{
    std::cout << "已排序" << std::endl;
}

// 检查降序
if (std::is_sorted(numbers.begin(), numbers.end(), std::greater<int>())) 
{
    std::cout << "降序排列" << std::endl;
}

```

### 函数5：std::sort + std::unique - 去重

```cpp
std::vector<int> numbers = {5, 2, 8, 2, 9, 5, 3, 8, 1};

// 先排序
std::sort(numbers.begin(), numbers.end());
// {1, 2, 2, 3, 5, 5, 8, 8, 9}

// 再去重
auto last = std::unique(numbers.begin(), numbers.end());
numbers.erase(last, numbers.end());
// {1, 2, 3, 5, 8, 9}

// 一步到位
numbers.erase(
    std::unique(
        std::sort(numbers.begin(), numbers.end()),
        numbers.end()
    ),
    numbers.end()
);

```

## 五、开发实战案例

### 案例1：游戏排行榜系统

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <string>

struct PlayerScore 
{
    std::string name;
    int score;
    int kills;
    int deaths;
    float kda;
    
    PlayerScore(const std::string& n, int s, int k, int d) 
        : name(n), score(s), kills(k), deaths(d) 
    {
        kda = deaths > 0 ? static_cast<float>(kills) / deaths : kills;
    }
    
    void Print() const 
    {
        std::cout << name << " | 分数:" << score 
                  << " | K:" << kills << " D:" << deaths 
                  << " | KDA:" << kda << std::endl;
    }
};

class Leaderboard 
{
private:
    std::vector<PlayerScore> players;
    
public:
    void AddPlayer(const std::string& name, int score, int kills, int deaths) 
    {
        players.emplace_back(name, score, kills, deaths);
    }
    
    void SortByScore() 
    {
        std::sort(players.begin(), players.end(),
            [](const PlayerScore& a, const PlayerScore& b) {
                return a.score > b.score;  // 分数降序
            });
    }
    
    void SortByKDA() 
    {
        std::sort(players.begin(), players.end(),
            [](const PlayerScore& a, const PlayerScore& b) {
                return a.kda > b.kda;  // KDA降序
            });
    }
    
    void SortByScoreAndKills() 
    {
        std::sort(players.begin(), players.end(),
            [](const PlayerScore& a, const PlayerScore& b) {
                if (a.score != b.score) 
                    return a.score > b.score;  // 优先分数
                return a.kills > b.kills;      // 分数相同比击杀
            });
    }
    
    void PrintTop(int count) 
    {
        std::cout << "=== 前 " << count << " 名 ===" << std::endl;
        for (int i = 0; i < std::min(count, static_cast<int>(players.size())); i++) 
        {
            std::cout << (i + 1) << ". ";
            players[i].Print();
        }
    }
    
    void PrintAll() 
    {
        std::cout << "=== 完整排行榜 ===" << std::endl;
        for (size_t i = 0; i < players.size(); i++) 
        {
            std::cout << (i + 1) << ". ";
            players[i].Print();
        }
    }
};

int main() 
{
    Leaderboard board;
    
    board.AddPlayer("Alice", 2500, 15, 3);
    board.AddPlayer("Bob", 2000, 12, 5);
    board.AddPlayer("Charlie", 2500, 18, 4);
    board.AddPlayer("David", 1800, 10, 8);
    board.AddPlayer("Eve", 2200, 14, 2);
    
    std::cout << "按分数排序：" << std::endl;
    board.SortByScore();
    board.PrintAll();
    
    std::cout << "\n按KDA排序：" << std::endl;
    board.SortByKDA();
    board.PrintTop(3);
    
    std::cout << "\n按分数+击杀排序：" << std::endl;
    board.SortByScoreAndKills();
    board.PrintAll();
    
    return 0;
}

```

### 案例2：敌人威胁度排序

```cpp
#include <vector>
#include <algorithm>
#include <cmath>

struct Vector2 
{
    float x, y;
    
    float Distance(const Vector2& other) const 
    {
        float dx = x - other.x;
        float dy = y - other.y;
        return std::sqrt(dx * dx + dy * dy);
    }
};

struct Enemy 
{
    std::string name;
    Vector2 position;
    int hp;
    int damage;
    float aggroLevel;  // 仇恨值
    
    // 计算威胁度
    float CalculateThreat(const Vector2& playerPos) const 
    {
        float distance = position.Distance(playerPos);
        float distanceFactor = 1.0f / (distance + 1.0f);  // 距离越近威胁越高
        float damageFactor = damage / 100.0f;
        float aggroFactor = aggroLevel / 10.0f;
        
        return distanceFactor * damageFactor * aggroFactor;
    }
};

class EnemyAI 
{
private:
    std::vector<Enemy> enemies;
    Vector2 playerPosition;
    
public:
    void SetPlayerPosition(const Vector2& pos) 
    {
        playerPosition = pos;
    }
    
    void AddEnemy(const Enemy& enemy) 
    {
        enemies.push_back(enemy);
    }
    
    void SortByThreat() 
    {
        std::sort(enemies.begin(), enemies.end(),
            [this](const Enemy& a, const Enemy& b) {
                return a.CalculateThreat(playerPosition) > 
                       b.CalculateThreat(playerPosition);
            });
    }
    
    void SortByDistance() 
    {
        std::sort(enemies.begin(), enemies.end(),
            [this](const Enemy& a, const Enemy& b) {
                return a.position.Distance(playerPosition) < 
                       b.position.Distance(playerPosition);
            });
    }
    
    Enemy* GetMostThreateningEnemy() 
    {
        if (enemies.empty()) return nullptr;
        
        SortByThreat();
        return &enemies[0];
    }
    
    std::vector<Enemy*> GetTopThreats(int count) 
    {
        SortByThreat();
        
        std::vector<Enemy*> topThreats;
        for (int i = 0; i < std::min(count, static_cast<int>(enemies.size())); i++) 
        {
            topThreats.push_back(&enemies[i]);
        }
        return topThreats;
    }
    
    void PrintEnemies() 
    {
        for (size_t i = 0; i < enemies.size(); i++) 
        {
            const Enemy& e = enemies[i];
            float threat = e.CalculateThreat(playerPosition);
            std::cout << (i + 1) << ". " << e.name 
                      << " | 威胁度:" << threat 
                      << " | 距离:" << e.position.Distance(playerPosition)
                      << std::endl;
        }
    }
};

int main() 
{
    EnemyAI ai;
    ai.SetPlayerPosition({0, 0});
    
    ai.AddEnemy({"哥布林", {5, 5}, 50, 20, 3.0f});
    ai.AddEnemy({"兽人", {10, 10}, 100, 50, 5.0f});
    ai.AddEnemy({"巨魔", {3, 3}, 200, 80, 7.0f});
    ai.AddEnemy({"骷髅", {15, 2}, 30, 15, 2.0f});
    
    std::cout << "按威胁度排序：" << std::endl;
    ai.SortByThreat();
    ai.PrintEnemies();
    
    std::cout << "\n最大威胁：" << std::endl;
    Enemy* threat = ai.GetMostThreateningEnemy();
    if (threat) 
    {
        std::cout << threat->name << std::endl;
    }
    
    return 0;
}

```

### 案例3：背包物品排序

```cpp
#include <vector>
#include <algorithm>
#include <string>

enum class ItemRarity 
{
    Common = 0,
    Uncommon = 1,
    Rare = 2,
    Epic = 3,
    Legendary = 4
};

struct Item 
{
    std::string name;
    ItemRarity rarity;
    int level;
    int price;
    float weight;
    
    std::string GetRarityName() const 
    {
        switch (rarity) 
        {
            case ItemRarity::Common: return "普通";
            case ItemRarity::Uncommon: return "优秀";
            case ItemRarity::Rare: return "稀有";
            case ItemRarity::Epic: return "史诗";
            case ItemRarity::Legendary: return "传说";
            default: return "未知";
        }
    }
    
    void Print() const 
    {
        std::cout << "[" << GetRarityName() << "] " << name 
                  << " | Lv." << level 
                  << " | " << price << "金币"
                  << " | " << weight << "kg" << std::endl;
    }
};

class Inventory 
{
private:
    std::vector<Item> items;
    
public:
    void AddItem(const Item& item) 
    {
        items.push_back(item);
    }
    
    // 按稀有度排序
    void SortByRarity() 
    {
        std::sort(items.begin(), items.end(),
            [](const Item& a, const Item& b) {
                return static_cast<int>(a.rarity) > static_cast<int>(b.rarity);
            });
    }
    
    // 按价格排序
    void SortByPrice() 
    {
        std::sort(items.begin(), items.end(),
            [](const Item& a, const Item& b) {
                return a.price > b.price;
            });
    }
    
    // 按等级排序
    void SortByLevel() 
    {
        std::sort(items.begin(), items.end(),
            [](const Item& a, const Item& b) {
                return a.level > b.level;
            });
    }
    
    // 按重量排序
    void SortByWeight() 
    {
        std::sort(items.begin(), items.end(),
            [](const Item& a, const Item& b) {
                return a.weight < b.weight;
            });
    }
    
    // 综合排序：稀有度 > 等级 > 价格
    void SortComprehensive() 
    {
        std::sort(items.begin(), items.end(),
            [](const Item& a, const Item& b) {
                if (a.rarity != b.rarity)
                    return static_cast<int>(a.rarity) > static_cast<int>(b.rarity);
                if (a.level != b.level)
                    return a.level > b.level;
                return a.price > b.price;
            });
    }
    
    // 过滤+排序：只显示稀有及以上
    std::vector<Item> GetRareItems() 
    {
        std::vector<Item> rareItems;
        std::copy_if(items.begin(), items.end(), std::back_inserter(rareItems),
            [](const Item& item) {
                return item.rarity >= ItemRarity::Rare;
            });
        
        std::sort(rareItems.begin(), rareItems.end(),
            [](const Item& a, const Item& b) {
                return static_cast<int>(a.rarity) > static_cast<int>(b.rarity);
            });
        
        return rareItems;
    }
    
    void PrintItems() 
    {
        for (size_t i = 0; i < items.size(); i++) 
        {
            std::cout << (i + 1) << ". ";
            items[i].Print();
        }
    }
};

int main() 
{
    Inventory inventory;
    
    inventory.AddItem({"铁剑", ItemRarity::Common, 5, 50, 3.0f});
    inventory.AddItem({"精钢剑", ItemRarity::Uncommon, 10, 200, 3.5f});
    inventory.AddItem({"火焰之剑", ItemRarity::Rare, 15, 1000, 4.0f});
    inventory.AddItem({"屠龙剑", ItemRarity::Epic, 25, 5000, 5.0f});
    inventory.AddItem({"生命药水", ItemRarity::Common, 1, 10, 0.1f});
    inventory.AddItem({"传说护符", ItemRarity::Legendary, 30, 10000, 0.5f});
    
    std::cout << "=== 按稀有度排序 ===" << std::endl;
    inventory.SortByRarity();
    inventory.PrintItems();
    
    std::cout << "\n=== 按价格排序 ===" << std::endl;
    inventory.SortByPrice();
    inventory.PrintItems();
    
    std::cout << "\n=== 综合排序 ===" << std::endl;
    inventory.SortComprehensive();
    inventory.PrintItems();
    
    std::cout << "\n=== 稀有及以上物品 ===" << std::endl;
    auto rareItems = inventory.GetRareItems();
    for (size_t i = 0; i < rareItems.size(); i++) 
    {
        std::cout << (i + 1) << ". ";
        rareItems[i].Print();
    }
    
    return 0;
}

```

### 案例4：任务优先级系统

```cpp
#include <vector>
#include <algorithm>
#include <string>

enum class QuestType 
{
    Main,      // 主线
    Side,      // 支线
    Daily,     // 日常
    Event      // 活动
};

struct Quest 
{
    std::string name;
    QuestType type;
    int priority;     // 优先级（1-10）
    int level;        // 等级要求
    int reward;       // 奖励
    int timeLimit;    // 剩余时间（分钟）
    bool isUrgent;    // 是否紧急
    
    std::string GetTypeName() const 
    {
        switch (type) 
        {
            case QuestType::Main: return "主线";
            case QuestType::Side: return "支线";
            case QuestType::Daily: return "日常";
            case QuestType::Event: return "活动";
            default: return "未知";
        }
    }
    
    void Print() const 
    {
        std::cout << "[" << GetTypeName() << "] " << name 
                  << " | 优先级:" << priority
                  << " | Lv." << level
                  << " | 奖励:" << reward
                  << " | 剩余:" << timeLimit << "分钟";
        if (isUrgent) std::cout << " ⚠️紧急";
        std::cout << std::endl;
    }
};

class QuestManager 
{
private:
    std::vector<Quest> quests;
    
public:
    void AddQuest(const Quest& quest) 
    {
        quests.push_back(quest);
    }
    
    // 智能排序：综合考虑多个因素
    void SortByPriority() 
    {
        std::sort(quests.begin(), quests.end(),
            [](const Quest& a, const Quest& b) {
                // 1. 紧急任务最优先
                if (a.isUrgent != b.isUrgent)
                    return a.isUrgent;
                
                // 2. 主线 > 活动 > 日常 > 支线
                if (a.type != b.type) 
                {
                    int aTypeScore = 0, bTypeScore = 0;
                    if (a.type == QuestType::Main) aTypeScore = 4;
                    else if (a.type == QuestType::Event) aTypeScore = 3;
                    else if (a.type == QuestType::Daily) aTypeScore = 2;
                    else aTypeScore = 1;
                    
                    if (b.type == QuestType::Main) bTypeScore = 4;
                    else if (b.type == QuestType::Event) bTypeScore = 3;
                    else if (b.type == QuestType::Daily) bTypeScore = 2;
                    else bTypeScore = 1;
                    
                    return aTypeScore > bTypeScore;
                }
                
                // 3. 剩余时间少的优先
                if (a.timeLimit != b.timeLimit)
                    return a.timeLimit < b.timeLimit;
                
                // 4. 优先级高的优先
                if (a.priority != b.priority)
                    return a.priority > b.priority;
                
                // 5. 奖励多的优先
                return a.reward > b.reward;
            });
    }
    
    // 按类型分组排序
    void SortByType() 
    {
        std::stable_sort(quests.begin(), quests.end(),
            [](const Quest& a, const Quest& b) {
                return static_cast<int>(a.type) < static_cast<int>(b.type);
            });
    }
    
    // 获取推荐任务（前3个）
    std::vector<Quest> GetRecommendedQuests() 
    {
        SortByPriority();
        
        std::vector<Quest> recommended;
        int count = std::min(3, static_cast<int>(quests.size()));
        for (int i = 0; i < count; i++) 
        {
            recommended.push_back(quests[i]);
        }
        return recommended;
    }
    
    void PrintQuests() 
    {
        for (size_t i = 0; i < quests.size(); i++) 
        {
            std::cout << (i + 1) << ". ";
            quests[i].Print();
        }
    }
};

int main() 
{
    QuestManager manager;
    
    manager.AddQuest({"拯救公主", QuestType::Main, 10, 20, 5000, 180, true});
    manager.AddQuest({"收集草药", QuestType::Side, 3, 5, 100, 999, false});
    manager.AddQuest({"击败10只史莱姆", QuestType::Daily, 5, 10, 500, 60, false});
    manager.AddQuest({"限时活动：龙王入侵", QuestType::Event, 9, 30, 10000, 30, true});
    manager.AddQuest({"寻找失踪的猫", QuestType::Side, 2, 8, 80, 999, false});
    manager.AddQuest({"每日签到", QuestType::Daily, 1, 1, 50, 120, false});
    
    std::cout << "=== 按优先级排序 ===" << std::endl;
    manager.SortByPriority();
    manager.PrintQuests();
    
    std::cout << "\n=== 推荐任务 ===" << std::endl;
    auto recommended = manager.GetRecommendedQuests();
    for (size_t i = 0; i < recommended.size(); i++) 
    {
        std::cout << (i + 1) << ". ";
        recommended[i].Print();
    }
    
    return 0;
}

```

### 案例5：寻路算法中的节点排序

```cpp
#include <vector>
#include <algorithm>
#include <cmath>
#include <queue>

struct Vector2 
{
    int x, y;
    
    float Distance(const Vector2& other) const 
    {
        int dx = x - other.x;
        int dy = y - other.y;
        return std::sqrt(dx * dx + dy * dy);
    }
    
    int ManhattanDistance(const Vector2& other) const 
    {
        return std::abs(x - other.x) + std::abs(y - other.y);
    }
};

struct PathNode 
{
    Vector2 position;
    float gCost;  // 从起点到当前点的实际代价
    float hCost;  // 从当前点到终点的启发式代价
    float fCost;  // gCost + hCost
    PathNode* parent;
    
    PathNode(const Vector2& pos, float g, float h, PathNode* p = nullptr)
        : position(pos), gCost(g), hCost(h), fCost(g + h), parent(p) {}
};

class AStar 
{
private:
    std::vector<PathNode*> openList;
    std::vector<PathNode*> closedList;
    Vector2 start;
    Vector2 goal;
    
public:
    AStar(const Vector2& s, const Vector2& g) : start(s), goal(g) {}
    
    ~AStar() 
    {
        for (auto node : openList) delete node;
        for (auto node : closedList) delete node;
    }
    
    void AddToOpenList(PathNode* node) 
    {
        openList.push_back(node);
    }
    
    PathNode* GetLowestFCostNode() 
    {
        // 排序找到fCost最小的节点
        std::sort(openList.begin(), openList.end(),
            [](const PathNode* a, const PathNode* b) {
                if (a->fCost != b->fCost)
                    return a->fCost < b->fCost;
                return a->hCost < b->hCost;  // fCost相同比hCost
            });
        
        if (openList.empty()) return nullptr;
        
        PathNode* best = openList.front();
        openList.erase(openList.begin());
        closedList.push_back(best);
        
        return best;
    }
    
    void PrintOpenList() 
    {
        std::cout << "=== Open List ===" << std::endl;
        for (auto node : openList) 
        {
            std::cout << "(" << node->position.x << "," << node->position.y << ")"
                      << " F:" << node->fCost 
                      << " G:" << node->gCost 
                      << " H:" << node->hCost << std::endl;
        }
    }
};

int main() 
{
    Vector2 start{0, 0};
    Vector2 goal{10, 10};
    
    AStar astar(start, goal);
    
    // 添加一些示例节点
    astar.AddToOpenList(new PathNode({1, 0}, 1.0f, 
        Vector2{1, 0}.Distance(goal)));
    astar.AddToOpenList(new PathNode({0, 1}, 1.0f, 
        Vector2{0, 1}.Distance(goal)));
    astar.AddToOpenList(new PathNode({1, 1}, 1.4f, 
        Vector2{1, 1}.Distance(goal)));
    
    std::cout << "排序前：" << std::endl;
    astar.PrintOpenList();
    
    std::cout << "\n获取最佳节点：" << std::endl;
    PathNode* best = astar.GetLowestFCostNode();
    if (best) 
    {
        std::cout << "最佳节点: (" << best->position.x << "," 
                  << best->position.y << ") F:" << best->fCost << std::endl;
    }
    
    std::cout << "\n排序后的Open List：" << std::endl;
    astar.PrintOpenList();
    
    return 0;
}

```

## 六、新手常见五大错误

### 错误1：比较函数返回&lt;=而不是&lt;

```cpp
std::vector<int> numbers = {5, 2, 8, 1, 9};

// ❌ 严重错误：违反严格弱序
std::sort(numbers.begin(), numbers.end(), [](int a, int b) {
    return a <= b;  // 未定义行为！可能崩溃！
});

// ✅ 正确：使用严格小于
std::sort(numbers.begin(), numbers.end(), [](int a, int b) {
    return a < b;
});

// ✅ 降序也是严格小于（对调a和b）
std::sort(numbers.begin(), numbers.end(), [](int a, int b) {
    return a > b;  // 等价于 b < a
});

```

为什么不能用&lt;=？

```cpp
严格弱序要求：
1. a < a 必须为false（非自反性）
2. 如果a < b且b < c，则a < c（传递性）

但如果用 <=：
a <= a 为true，违反了非自反性！

```

### 错误2：忘记引用传递导致性能问题

```cpp
struct BigObject 
{
    std::string data[1000];  // 很大的对象
    int value;
};

std::vector<BigObject> objects;

// ❌ 每次比较都拷贝对象，超级慢！
std::sort(objects.begin(), objects.end(), 
    [](BigObject a, BigObject b) {  // 值传递！
        return a.value < b.value;
    });

// ✅ 使用const引用，快速！
std::sort(objects.begin(), objects.end(), 
    [](const BigObject& a, const BigObject& b) {  // 引用传递
        return a.value < b.value;
    });

```

### 错误3：排序指针但比较的是地址

```cpp
std::vector<Player*> players;
// ... 填充指针 ...

// ❌ 错误：比较的是指针地址，不是对象内容
std::sort(players.begin(), players.end());

// ✅ 正确：解引用指针比较对象
std::sort(players.begin(), players.end(), 
    [](const Player* a, const Player* b) {
        return a->score > b->score;  // 比较score
    });

```

### 错误4：在遍历中修改容器

```cpp
std::vector<int> numbers = {5, 2, 8, 1, 9};

// ❌ 危险：排序后迭代器可能失效
for (auto it = numbers.begin(); it != numbers.end(); ++it) 
{
    std::sort(numbers.begin(), numbers.end());  // 错误！
}

// ✅ 正确：先排序再遍历
std::sort(numbers.begin(), numbers.end());
for (auto it = numbers.begin(); it != numbers.end(); ++it) 
{
    // 安全使用
}

```

### 错误5：期望部分排序保持其余元素顺序

```cpp
std::vector<int> numbers = {5, 2, 8, 1, 9, 3, 7};

// partial_sort后，后面的元素顺序是不确定的！
std::partial_sort(numbers.begin(), numbers.begin() + 3, numbers.end());
// 前3个: {1, 2, 3}
// 后面的: 顺序不保证，可能是 {5, 9, 8, 7} 或其他

// 如果需要保持顺序，用完整排序
std::sort(numbers.begin(), numbers.end());

```

## 七、最佳实践指南

### 原则一：优先使用lambda表达式

```cpp
// ❌ 不够清晰
bool Compare(int a, int b) { return a > b; }
std::sort(vec.begin(), vec.end(), Compare);

// ✅ 更清晰，代码集中
std::sort(vec.begin(), vec.end(), [](int a, int b) {
    return a > b;
});

```

### 原则二：const引用传递大对象

```cpp
struct BigData 
{
    // ... 很多数据 ...
};

// ✅ 使用const引用
std::sort(data.begin(), data.end(), 
    [](const BigData& a, const BigData& b) {
        return a.value < b.value;
    });

```

### 原则三：根据需求选择合适的排序函数

```cpp
// 需要完整排序
std::sort(vec.begin(), vec.end());

// 只需要前N个
std::partial_sort(vec.begin(), vec.begin() + N, vec.end());

// 只需要第N个元素
std::nth_element(vec.begin(), vec.begin() + N, vec.end());

// 需要保持稳定性
std::stable_sort(vec.begin(), vec.end());

```

### 原则四：先排序再去重

```cpp
std::vector<int> numbers = {5, 2, 8, 2, 9, 5, 3};

// ✅ 标准做法
std::sort(numbers.begin(), numbers.end());
auto last = std::unique(numbers.begin(), numbers.end());
numbers.erase(last, numbers.end());

```

### 原则五：多重排序清晰表达

```cpp
// ✅ 清晰的多重排序逻辑
std::sort(players.begin(), players.end(), 
    [](const Player& a, const Player& b) {
        // 1. 先按分数降序
        if (a.score != b.score)
            return a.score > b.score;
        
        // 2. 分数相同按等级降序
        if (a.level != b.level)
            return a.level > b.level;
        
        // 3. 等级相同按名字升序
        return a.name < b.name;
    });

```

## 八、性能分析

### 时间复杂度对比

| 算法 | 平均 | 最坏 | 稳定性 | 适用场景 |
| --- | --- | --- | --- | --- |
| std::sort | O(n log n) | O(n log n) | ❌ | 通用排序 |
| std::stable_sort | O(n log n) | O(n log n) | ✅ | 需要稳定性 |
| std::partial_sort | O(n log k) | O(n log k) | ❌ | 只需前k个 |
| std::nth_element | O(n) | O(n) | ❌ | 只需第k个 |

k是部分排序的元素数量

### 实际性能测试

```cpp
#include <chrono>
#include <random>

void BenchmarkSort() 
{
    const int SIZE = 1000000;
    std::vector<int> data(SIZE);
    
    // 随机填充
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(1, 1000000);
    for (int& n : data) n = dis(gen);
    
    // 完整排序
    auto start = std::chrono::high_resolution_clock::now();
    std::sort(data.begin(), data.end());
    auto end = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start);
    std::cout << "std::sort: " << duration.count() << "ms" << std::endl;
    
    // 重新打乱
    std::shuffle(data.begin(), data.end(), gen);
    
    // 只排前100个
    start = std::chrono::high_resolution_clock::now();
    std::partial_sort(data.begin(), data.begin() + 100, data.end());
    end = std::chrono::high_resolution_clock::now();
    duration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start);
    std::cout << "std::partial_sort (100): " << duration.count() << "ms" << std::endl;
    
    // 重新打乱
    std::shuffle(data.begin(), data.end(), gen);
    
    // 只找第100个
    start = std::chrono::high_resolution_clock::now();
    std::nth_element(data.begin(), data.begin() + 100, data.end());
    end = std::chrono::high_resolution_clock::now();
    duration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start);
    std::cout << "std::nth_element (100): " << duration.count() << "ms" << std::endl;
}

// 典型输出（100万元素）：
// std::sort: 120ms
// std::partial_sort (100): 15ms  ← 快8倍！
// std::nth_element (100): 8ms    ← 快15倍！

```

### 何时使用哪种排序？

```cpp
// 需要所有元素有序 → std::sort
std::sort(all.begin(), all.end());

// 只需要前10名 → std::partial_sort
std::partial_sort(scores.begin(), scores.begin() + 10, scores.end());

// 只需要中位数 → std::nth_element
std::nth_element(data.begin(), data.begin() + data.size()/2, data.end());

// 需要保持相等元素顺序 → std::stable_sort
std::stable_sort(students.begin(), students.end());

```

## 九、调试技巧

### 打印排序前后的数据

```cpp
template<typename T>
void PrintVector(const std::vector<T>& vec, const std::string& name) 
{
    std::cout << name << ": ";
    for (const auto& item : vec) 
    {
        std::cout << item << " ";
    }
    std::cout << std::endl;
}

// 使用
std::vector<int> numbers = {5, 2, 8, 1, 9};
PrintVector(numbers, "排序前");
std::sort(numbers.begin(), numbers.end());
PrintVector(numbers, "排序后");

```

### 验证排序是否正确

```cpp
bool IsSorted(const std::vector<int>& vec) 
{
    return std::is_sorted(vec.begin(), vec.end());
}

// 使用
if (!IsSorted(numbers)) 
{
    std::cout << "排序失败！" << std::endl;
}

```

### 检查比较函数是否合法

```cpp
// 简单测试比较函数
bool TestCompare(auto compare) 
{
    // 测试自反性：a < a 应该为false
    int a = 5;
    if (compare(a, a)) 
    {
        std::cout << "比较函数错误：违反自反性" << std::endl;
        return false;
    }
    
    // 测试反对称性
    int b = 3;
    if (compare(a, b) && compare(b, a)) 
    {
        std::cout << "比较函数错误：违反反对称性" << std::endl;
        return false;
    }
    
    return true;
}

```

今天的知识点你都有Get到吗~

有没有什么疑问，我们在评论区见哦~

你们也可以告诉我有什么是你们想知道的

![](./image-1.jpg)

![](./image-2.jpg)
