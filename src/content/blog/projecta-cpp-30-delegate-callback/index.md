---
title: "重启RestArt ProjectA｜30.Delegate & Callback委托与回调"
description: "一、什么是回调(Callback)想象你在餐厅点餐，你不需要一直站在厨房门口等着菜做好。你只需要： 告诉服务员：”菜好了叫我一声”继续做自己的事（玩手机、聊天）服务员叫你：”您的菜好了！”你再去取餐…"
category: tools
tags: ['C++', 'ProjectA', '编程基础']
date: 2025-11-10
readTime: 3
heroImage: "./cover.webp"
published: true
---
## 一、什么是回调(Callback)

想象你在餐厅点餐，你不需要一直站在厨房门口等着菜做好。你只需要：

1. 告诉服务员：”菜好了叫我一声”

1. 继续做自己的事（玩手机、聊天）

1. 服务员叫你：”您的菜好了！”

1. 你再去取餐

这就是回调机制！

在游戏开发中：

```cpp
玩家点击按钮 → 你不想每帧都检查"有没有点击？"
              → 你告诉系统："点击了就调用这个函数"
              → 系统检测到点击 → 自动调用你的函数
```

回调的本质： 把一个函数作为参数传给另一个函数，让它在合适的时候调用。

### 生活中的回调例子

```cpp
🔔 订外卖：下单后留电话，送到了给你打电话（回调函数）
📱 设闹钟：设定时间，时间到了响铃（回调函数）
🎮 按键绑定：绑定"按空格跳跃"，按下时执行跳跃（回调函数）
💬 事件监听：订阅"敌人死亡"事件，死亡时通知你（回调函数）
```

## 二、回调的原始形态——函数指针基础

### 1. 函数指针作为参数——实现回调

```cpp
#include <iostream>

// 回调函数类型1
void OnSuccess() 
{
    std::cout << "操作成功！" << std::endl;
}

// 回调函数类型2
void OnFailure() 
{
    std::cout << "操作失败！" << std::endl;
}

// 执行任务，并在完成时调用回调
void ExecuteTask(bool success, void (*callback)()) 
{
    std::cout << "正在执行任务..." << std::endl;
    
    if (success) 
    {
        std::cout << "任务完成！调用回调函数：" << std::endl;
        callback();  // 调用传入的函数
    }
    else 
    {
        std::cout << "任务失败！调用回调函数：" << std::endl;
        callback();
    }
}

int main() 
{
    ExecuteTask(true, OnSuccess);   // 传入成功回调
    ExecuteTask(false, OnFailure);  // 传入失败回调
    
    return 0;
}

```

### 2. 使用typedef简化函数指针

函数指针的语法很丑陋，用typedef简化：

```cpp
// 原始写法（难读）
void DoSomething(int (*callback)(int, int)) 
{
    int result = callback(5, 3);
}

// 使用typedef简化
typedef int (*MathOperation)(int, int);

void DoSomething(MathOperation callback) 
{
    int result = callback(5, 3);
}

// C++11 using语法（更清晰，推荐）
using MathOperation = int (*)(int, int);

void DoSomething(MathOperation callback) 
{
    int result = callback(5, 3);
}

```

### 3. 函数指针数组——实现命令表

```cpp
#include <iostream>

void Command_Move() { std::cout << "移动" << std::endl; }
void Command_Attack() { std::cout << "攻击" << std::endl; }
void Command_Defend() { std::cout << "防御" << std::endl; }
void Command_UseItem() { std::cout << "使用物品" << std::endl; }

int main() 
{
    // 函数指针数组
    void (*commands[4])() = {
        Command_Move,
        Command_Attack,
        Command_Defend,
        Command_UseItem
    };
    
    // 模拟玩家输入
    int input = 2;  // 选择防御
    
    if (input >= 0 && input < 4) 
    {
        commands[input]();  // 调用对应的命令
    }
    
    return 0;
}

```

## 三、函数指针的局限性

### 问题1：无法捕获状态

```cpp
class Player 
{
public:
    int health = 100;
    
    void TakeDamage(int damage) 
    {
        health -= damage;
        std::cout << "受到 " << damage << " 点伤害，剩余血量: " 
                  << health << std::endl;
    }
};

// ❌ 普通函数指针无法访问对象成员
void (*callback)();  // 只能指向全局函数或静态函数

Player player;
// callback = player.TakeDamage;  // 编译错误！

```

### 问题2：类型不统一

```cpp
// 不同签名的函数需要不同类型的指针
void Func1() {}
void Func2(int x) {}
int Func3(float x) { return 0; }

void (*ptr1)();
void (*ptr2)(int);
int (*ptr3)(float);

// 无法用统一的方式存储和调用

```

## 四、成员函数指针——访问对象方法

### 基础语法

```cpp
#include <iostream>

class Player 
{
public:
    void Jump() 
    {
        std::cout << "跳跃！" << std::endl;
    }
    
    void Attack(int damage) 
    {
        std::cout << "攻击！造成 " << damage << " 点伤害" << std::endl;
    }
};

int main() 
{
    // 成员函数指针语法
    void (Player::*jumpPtr)() = &Player::Jump;
    void (Player::*attackPtr)(int) = &Player::Attack;
    
    Player player;
    
    // 通过对象调用成员函数指针
    (player.*jumpPtr)();        // 跳跃！
    (player.*attackPtr)(50);    // 攻击！造成 50 点伤害
    
    // 通过指针调用
    Player* pPlayer = &player;
    (pPlayer->*jumpPtr)();      // 跳跃！
    (pPlayer->*attackPtr)(30);  // 攻击！造成 30 点伤害
    
    return 0;
}

```

成员函数指针语法分解：

```cpp
void (Player::*funcPtr)(int);
│    │       │  │       │
│    │       │  │       └─ 参数列表
│    │       │  └─────── 指针名称
│    │       └────────── * 表示指针
│    └────────────────── 所属类
└─────────────────────── 返回类型

// 调用语法
(object.*funcPtr)(args);   // 对象.成员函数指针
(pointer->*funcPtr)(args); // 指针->成员函数指针

```

成员函数指针很复杂，实际开发中我们有更好的方案！

## 五、函数对象(Functor)——可调用对象

函数对象是重载了operator()的类：

```cpp
#include <iostream>

// 函数对象：可以像函数一样调用的对象
class Greeter 
{
private:
    std::string name;
    
public:
    Greeter(const std::string& n) : name(n) {}
    
    // 重载()运算符
    void operator()() const 
    {
        std::cout << "Hello, " << name << "!" << std::endl;
    }
};

int main() 
{
    Greeter greet("World");
    greet();  // 像函数一样调用！输出: Hello, World!
    
    Greeter greet2("Alice");
    greet2();  // Hello, Alice!
    
    return 0;
}

```

函数对象的优势：可以保存状态！

```cpp
class Counter 
{
private:
    int count;
    
public:
    Counter() : count(0) {}
    
    void operator()() 
    {
        count++;
        std::cout << "调用次数: " << count << std::endl;
    }
};

int main() 
{
    Counter counter;
    counter();  // 调用次数: 1
    counter();  // 调用次数: 2
    counter();  // 调用次数: 3
    
    return 0;
}

```

## 六、Lambda表达式——最优雅的回调

Lambda是C++11引入的匿名函数，是最常用的回调方式！

### 基础语法

```cpp
#include <iostream>

int main() 
{
    // Lambda表达式
    auto sayHello = []() {
        std::cout << "Hello!" << std::endl;
    };
    
    sayHello();  // Hello!
    
    // 带参数的Lambda
    auto add = [](int a, int b) {
        return a + b;
    };
    
    std::cout << add(5, 3) << std::endl;  // 8
    
    // 直接使用（不赋值给变量）
    [](const char* msg) {
        std::cout << msg << std::endl;
    }("直接调用Lambda");
    
    return 0;
}

```

### Lambda捕获——访问外部变量

```cpp
#include <iostream>

int main() 
{
    int health = 100;
    int damage = 20;
    
    // [=] 值捕获：拷贝外部变量
    auto showHealth = [=]() {
        std::cout << "血量: " << health << std::endl;
    };
    showHealth();  // 血量: 100
    
    // [&] 引用捕获：可以修改外部变量
    auto takeDamage = [&]() {
        health -= damage;
        std::cout << "受到伤害！剩余血量: " << health << std::endl;
    };
    takeDamage();  // 受到伤害！剩余血量: 80
    takeDamage();  // 受到伤害！剩余血量: 60
    
    std::cout << "最终血量: " << health << std::endl;  // 60
    
    // [this] 捕获当前对象
    // [health] 只捕获health（值）
    // [&health] 只捕获health（引用）
    // [=, &health] 值捕获所有，health引用捕获
    
    return 0;
}

```

### Lambda作为回调

```cpp
#include <iostream>

void ExecuteTask(bool success, void (*callback)()) 
{
    if (success) 
    {
        callback();
    }
}

int main() 
{
    int score = 100;
    
    ExecuteTask(true, []() {
        std::cout << "任务成功！" << std::endl;
    });
    
    // ❌ 但是不能捕获变量！
    // ExecuteTask(true, [score]() {  // 编译错误
    //     std::cout << "得分: " << score << std::endl;
    // });
    
    return 0;
}

```

Lambda的问题：带捕获的Lambda无法转为函数指针——所以就要使用std::function

## 七、std::function——万能函数包装器

std::function可以存储任何可调用对象：函数指针、Lambda、函数对象、成员函数！

```cpp
#include <iostream>
#include <functional>

void GlobalFunc() 
{
    std::cout << "全局函数" << std::endl;
}

class MyClass 
{
public:
    void MemberFunc() 
    {
        std::cout << "成员函数" << std::endl;
    }
};

int main() 
{
    // std::function可以存储任何可调用对象
    std::function<void()> callback;
    
    // 1. 存储普通函数
    callback = GlobalFunc;
    callback();  // 全局函数
    
    // 2. 存储Lambda
    callback = []() {
        std::cout << "Lambda表达式" << std::endl;
    };
    callback();  // Lambda表达式
    
    // 3. 存储带捕获的Lambda
    int count = 0;
    callback = [&count]() {
        count++;
        std::cout << "调用次数: " << count << std::endl;
    };
    callback();  // 调用次数: 1
    callback();  // 调用次数: 2
    
    // 4. 存储函数对象
    struct Functor 
    {
        void operator()() 
        {
            std::cout << "函数对象" << std::endl;
        }
    };
    callback = Functor();
    callback();  // 函数对象
    
    // 5. 存储成员函数（需要绑定对象）
    MyClass obj;
    callback = std::bind(&MyClass::MemberFunc, &obj);
    callback();  // 成员函数
    
    return 0;
}

```

### 使用std::function实现回调系统

```cpp
#include <iostream>
#include <functional>

class Button 
{
private:
    std::function<void()> onClick;
    
public:
    void SetOnClick(std::function<void()> callback) 
    {
        onClick = callback;
    }
    
    void Click() 
    {
        std::cout << "按钮被点击！" << std::endl;
        if (onClick) 
        {
            onClick();  // 调用回调
        }
    }
};

int main() 
{
    Button button;
    
    int clickCount = 0;
    
    // 设置点击回调
    button.SetOnClick([&clickCount]() {
        clickCount++;
        std::cout << "点击次数: " << clickCount << std::endl;
    });
    
    button.Click();  // 点击次数: 1
    button.Click();  // 点击次数: 2
    button.Click();  // 点击次数: 3
    
    return 0;
}

```

## 八、实现简单的Delegate系统

现在我们来实现一个简化版的Delegate，类似UE的TDelegate！

### 单播Delegate（只能绑定一个函数）

```cpp
#include <iostream>
#include <functional>

// 单播Delegate：只能绑定一个回调
template<typename... Args>
class Delegate 
{
private:
    std::function<void(Args...)> callback;
    
public:
    // 绑定回调
    void Bind(std::function<void(Args...)> func) 
    {
        callback = func;
    }
    
    // 是否已绑定
    bool IsBound() const 
    {
        return callback != nullptr;
    }
    
    // 解绑
    void Unbind() 
    {
        callback = nullptr;
    }
    
    // 执行回调
    void Execute(Args... args) 
    {
        if (callback) 
        {
            callback(args...);
        }
    }
    
    // 也可以用()运算符执行
    void operator()(Args... args) 
    {
        Execute(args...);
    }
};

int main() 
{
    // 无参数Delegate
    Delegate<> onGameStart;
    onGameStart.Bind([]() {
        std::cout << "游戏开始！" << std::endl;
    });
    onGameStart.Execute();  // 游戏开始！
    
    // 带参数Delegate
    Delegate<int> onScoreChanged;
    onScoreChanged.Bind([](int newScore) {
        std::cout << "分数更新: " << newScore << std::endl;
    });
    onScoreChanged.Execute(100);  // 分数更新: 100
    onScoreChanged(200);          // 分数更新: 200
    
    // 带多个参数
    Delegate<const char*, int> onPlayerDamaged;
    onPlayerDamaged.Bind([](const char* name, int damage) {
        std::cout << name << " 受到 " << damage << " 点伤害" << std::endl;
    });
    onPlayerDamaged("玩家", 50);  // 玩家 受到 50 点伤害
    
    return 0;
}

```

### 多播Delegate（可以绑定多个函数）

```cpp
#include <iostream>
#include <functional>
#include <vector>

// 多播Delegate：可以绑定多个回调
template<typename... Args>
class MulticastDelegate 
{
private:
    std::vector<std::function<void(Args...)>> callbacks;
    
public:
    // 添加回调
    void Add(std::function<void(Args...)> func) 
    {
        callbacks.push_back(func);
    }
    
    // 移除所有回调
    void Clear() 
    {
        callbacks.clear();
    }
    
    // 广播：调用所有回调
    void Broadcast(Args... args) 
    {
        for (auto& callback : callbacks) 
        {
            callback(args...);
        }
    }
    
    // 也可以用()运算符
    void operator()(Args... args) 
    {
        Broadcast(args...);
    }
};

int main() 
{
    MulticastDelegate<int> onEnemyKilled;
    
    // 添加多个监听者
    onEnemyKilled.Add([](int enemyID) {
        std::cout << "[音效系统] 播放击杀音效" << std::endl;
    });
    
    onEnemyKilled.Add([](int enemyID) {
        std::cout << "[UI系统] 更新击杀数" << std::endl;
    });
    
    onEnemyKilled.Add([](int enemyID) {
        std::cout << "[统计系统] 记录击杀: 敌人" << enemyID << std::endl;
    });
    
    std::cout << "击杀敌人！" << std::endl;
    onEnemyKilled.Broadcast(42);
    
    /* 输出:
    击杀敌人！
    [音效系统] 播放击杀音效
    [UI系统] 更新击杀数
    [统计系统] 记录击杀: 敌人42
    */
    
    return 0;
}

```

### 带返回值的Delegate

```cpp
#include <iostream>
#include <functional>
#include <vector>

// 带返回值的Delegate（收集所有返回值）
template<typename ReturnType, typename... Args>
class DelegateWithReturn 
{
private:
    std::vector<std::function<ReturnType(Args...)>> callbacks;
    
public:
    void Add(std::function<ReturnType(Args...)> func) 
    {
        callbacks.push_back(func);
    }
    
    void Clear() 
    {
        callbacks.clear();
    }
    
    // 执行并返回所有结果
    std::vector<ReturnType> Execute(Args... args) 
    {
        std::vector<ReturnType> results;
        for (auto& callback : callbacks) 
        {
            results.push_back(callback(args...));
        }
        return results;
    }
};

int main() 
{
    DelegateWithReturn<int, int, int> onCalculate;
    
    // 添加不同的计算方法
    onCalculate.Add([](int a, int b) {
        return a + b;  // 加法
    });
    
    onCalculate.Add([](int a, int b) {
        return a * b;  // 乘法
    });
    
    onCalculate.Add([](int a, int b) {
        return a - b;  // 减法
    });
    
    auto results = onCalculate.Execute(10, 5);
    
    std::cout << "计算结果: ";
    for (int result : results) 
    {
        std::cout << result << " ";  // 15 50 5
    }
    std::cout << std::endl;
    
    return 0;
}

```

## 九、游戏开发实战案例

### 案例1：事件系统

```cpp
#include <iostream>
#include <functional>
#include <vector>
#include <map>
#include <string>

class EventSystem 
{
private:
    // 事件名 → 回调列表
    std::map<std::string, std::vector<std::function<void()>>> events;
    
public:
    // 订阅事件
    void Subscribe(const std::string& eventName, std::function<void()> callback) 
    {
        events[eventName].push_back(callback);
        std::cout << "订阅事件: " << eventName << std::endl;
    }
    
    // 触发事件
    void Trigger(const std::string& eventName) 
    {
        std::cout << "\n触发事件: " << eventName << std::endl;
        if (events.find(eventName) != events.end()) 
        {
            for (auto& callback : events[eventName]) 
            {
                callback();
            }
        }
    }
    
    // 取消订阅（简化版：清除所有）
    void Unsubscribe(const std::string& eventName) 
    {
        events.erase(eventName);
    }
};

int main() 
{
    EventSystem eventSystem;
    
    // 多个系统订阅"敌人死亡"事件
    eventSystem.Subscribe("EnemyKilled", []() {
        std::cout << "[音效] 播放击杀音效" << std::endl;
    });
    
    eventSystem.Subscribe("EnemyKilled", []() {
        std::cout << "[UI] 显示+100分" << std::endl;
    });
    
    eventSystem.Subscribe("EnemyKilled", []() {
        std::cout << "[任务] 更新击杀计数" << std::endl;
    });
    
    // 订阅"玩家升级"事件
    eventSystem.Subscribe("PlayerLevelUp", []() {
        std::cout << "[特效] 播放升级特效" << std::endl;
    });
    
    eventSystem.Subscribe("PlayerLevelUp", []() {
        std::cout << "[音效] 播放升级音效" << std::endl;
    });
    
    // 触发事件
    eventSystem.Trigger("EnemyKilled");
    eventSystem.Trigger("PlayerLevelUp");
    
    return 0;
}

```

### 案例2：UI按钮系统

```cpp
#include <iostream>
#include <functional>
#include <vector>
#include <string>

class Button 
{
private:
    std::string text;
    std::vector<std::function<void()>> onClickCallbacks;
    bool enabled;
    
public:
    Button(const std::string& t) : text(t), enabled(true) {}
    
    // 添加点击回调
    void AddOnClickListener(std::function<void()> callback) 
    {
        onClickCallbacks.push_back(callback);
    }
    
    // 模拟点击
    void Click() 
    {
        if (!enabled) 
        {
            std::cout << "[" << text << "] 按钮被禁用" << std::endl;
            return;
        }
        
        std::cout << "[" << text << "] 按钮被点击" << std::endl;
        for (auto& callback : onClickCallbacks) 
        {
            callback();
        }
    }
    
    void SetEnabled(bool value) 
    {
        enabled = value;
    }
};

class GameUI 
{
private:
    Button startButton;
    Button settingsButton;
    Button quitButton;
    
    int gameState;  // 0=主菜单, 1=游戏中
    
public:
    GameUI() 
        : startButton("开始游戏")
        , settingsButton("设置")
        , quitButton("退出")
        , gameState(0)
    {
        // 绑定开始按钮
        startButton.AddOnClickListener([this]() {
            std::cout << ">>> 启动游戏..." << std::endl;
            gameState = 1;
        });
        
        startButton.AddOnClickListener([]() {
            std::cout << ">>> 播放开始音效" << std::endl;
        });
        
        // 绑定设置按钮
        settingsButton.AddOnClickListener([]() {
            std::cout << ">>> 打开设置菜单" << std::endl;
        });
        
        // 绑定退出按钮
        quitButton.AddOnClickListener([this]() {
            std::cout << ">>> 确认退出游戏?" << std::endl;
        });
        
        quitButton.AddOnClickListener([]() {
            std::cout << ">>> 保存游戏数据" << std::endl;
        });
    }
    
    void SimulateClicks() 
    {
        std::cout << "=== 模拟UI交互 ===\n" << std::endl;
        
        startButton.Click();
        std::cout << std::endl;
        
        settingsButton.Click();
        std::cout << std::endl;
        
        quitButton.Click();
    }
};

int main() 
{
    GameUI ui;
    ui.SimulateClicks();
    
    return 0;
}

```

### 案例3：计时器系统

```cpp
#include <iostream>
#include <functional>
#include <vector>

struct Timer 
{
    float duration;       // 持续时间
    float elapsed;        // 已过时间
    bool repeating;       // 是否重复
    std::function<void()> callback;  // 回调函数
    bool active;
    
    Timer(float dur, bool rep, std::function<void()> cb)
        : duration(dur), elapsed(0), repeating(rep), callback(cb), active(true) {}
};

class TimerManager 
{
private:
    std::vector<Timer> timers;
    
public:
    // 设置一次性计时器
    void SetTimer(float duration, std::function<void()> callback) 
    {
        timers.emplace_back(duration, false, callback);
        std::cout << "设置计时器: " << duration << "秒" << std::endl;
    }
    
    // 设置重复计时器
    void SetRepeatingTimer(float interval, std::function<void()> callback) 
    {
        timers.emplace_back(interval, true, callback);
        std::cout << "设置重复计时器: 每" << interval << "秒" << std::endl;
    }
    
    // 更新（模拟游戏循环）
    void Update(float deltaTime) 
    {
        for (auto it = timers.begin(); it != timers.end(); ) 
        {
            if (!it->active) 
            {
                it = timers.erase(it);
                continue;
            }
            
            it->elapsed += deltaTime;
            
            if (it->elapsed >= it->duration) 
            {
                // 触发回调
                it->callback();
                
                if (it->repeating) 
                {
                    // 重复计时器：重置时间
                    it->elapsed = 0;
                    ++it;
                }
                else 
                {
                    // 一次性计时器：删除
                    it = timers.erase(it);
                }
            }
            else 
            {
                ++it;
            }
        }
    }
    
    void ClearAll() 
    {
        timers.clear();
    }
};

int main() 
{
    TimerManager timerManager;
    
    // 3秒后执行
    timerManager.SetTimer(3.0f, []() {
        std::cout << "[3秒] 敌人生成！" << std::endl;
    });
    
    // 5秒后执行
    timerManager.SetTimer(5.0f, []() {
        std::cout << "[5秒] Boss出现！" << std::endl;
    });
    
    int count = 0;
    // 每2秒重复
    timerManager.SetRepeatingTimer(2.0f, [&count]() {
        count++;
        std::cout << "[重复] 第" << count << "波敌人" << std::endl;
    });
    
    // 模拟游戏循环（每帧0.5秒）
    std::cout << "\n=== 开始模拟 ===\n" << std::endl;
    for (int i = 0; i < 20; i++) 
    {
        float deltaTime = 0.5f;
        std::cout << "时间: " << (i * deltaTime) << "秒" << std::endl;
        timerManager.Update(deltaTime);
        std::cout << std::endl;
        
        if (i * deltaTime >= 10) break;  // 运行10秒
    }
    
    return 0;
}

```

### 案例4：成就系统

```cpp
#include <iostream>
#include <functional>
#include <vector>
#include <string>

struct Achievement 
{
    std::string name;
    std::string description;
    bool unlocked;
    std::function<bool()> checkCondition;  // 检查条件
    std::function<void()> onUnlock;        // 解锁回调
    
    Achievement(const std::string& n, const std::string& desc,
                std::function<bool()> check, std::function<void()> callback)
        : name(n), description(desc), unlocked(false)
        , checkCondition(check), onUnlock(callback) {}
};

class AchievementSystem 
{
private:
    std::vector<Achievement> achievements;
    
public:
    void AddAchievement(const std::string& name, const std::string& desc,
                       std::function<bool()> condition, std::function<void()> onUnlock) 
    {
        achievements.emplace_back(name, desc, condition, onUnlock);
    }
    
    void CheckAll() 
    {
        for (auto& ach : achievements) 
        {
            if (!ach.unlocked && ach.checkCondition()) 
            {
                ach.unlocked = true;
                std::cout << "\n🏆 解锁成就: " << ach.name << std::endl;
                std::cout << "   " << ach.description << std::endl;
                ach.onUnlock();
            }
        }
    }
    
    void PrintAll() const 
    {
        std::cout << "\n=== 成就列表 ===" << std::endl;
        for (const auto& ach : achievements) 
        {
            std::cout << (ach.unlocked ? "✅" : "❌") << " " 
                      << ach.name << ": " << ach.description << std::endl;
        }
    }
};

int main() 
{
    AchievementSystem achSystem;
    
    // 游戏数据
    int enemiesKilled = 0;
    int level = 1;
    int gold = 0;
    
    // 添加成就
    achSystem.AddAchievement(
        "新手上路",
        "击杀10个敌人",
        [&enemiesKilled]() { return enemiesKilled >= 10; },
        [&gold]() {
            std::cout << "   奖励: +100金币" << std::endl;
            gold += 100;
        }
    );
    
    achSystem.AddAchievement(
        "经验丰富",
        "达到10级",
        [&level]() { return level >= 10; },
        []() {
            std::cout << "   奖励: 解锁新技能" << std::endl;
        }
    );
    
    achSystem.AddAchievement(
        "屠戮者",
        "击杀100个敌人",
        [&enemiesKilled]() { return enemiesKilled >= 100; },
        []() {
            std::cout << "   奖励: 稀有称号" << std::endl;
        }
    );
    
    // 模拟游戏进程
    std::cout << "=== 游戏开始 ===\n" << std::endl;
    
    enemiesKilled = 5;
    achSystem.CheckAll();
    
    enemiesKilled = 10;
    achSystem.CheckAll();
    
    level = 10;
    achSystem.CheckAll();
    
    enemiesKilled = 100;
    achSystem.CheckAll();
    
    achSystem.PrintAll();
    std::cout << "\n当前金币: " << gold << std::endl;
    
    return 0;
}

```

### 案例5：动画系统回调

```cpp
#include <iostream>
#include <functional>
#include <string>

class Animation 
{
private:
    std::string name;
    float duration;
    float currentTime;
    bool playing;
    
    std::function<void()> onStart;
    std::function<void(float)> onUpdate;
    std::function<void()> onComplete;
    
public:
    Animation(const std::string& n, float dur)
        : name(n), duration(dur), currentTime(0), playing(false) {}
    
    void SetOnStart(std::function<void()> callback) 
    {
        onStart = callback;
    }
    
    void SetOnUpdate(std::function<void(float)> callback) 
    {
        onUpdate = callback;
    }
    
    void SetOnComplete(std::function<void()> callback) 
    {
        onComplete = callback;
    }
    
    void Play() 
    {
        playing = true;
        currentTime = 0;
        std::cout << "播放动画: " << name << std::endl;
        
        if (onStart) 
        {
            onStart();
        }
    }
    
    void Update(float deltaTime) 
    {
        if (!playing) return;
        
        currentTime += deltaTime;
        float progress = currentTime / duration;
        
        if (onUpdate) 
        {
            onUpdate(progress);
        }
        
        if (currentTime >= duration) 
        {
            playing = false;
            std::cout << "动画完成: " << name << std::endl;
            
            if (onComplete) 
            {
                onComplete();
            }
        }
    }
    
    bool IsPlaying() const { return playing; }
};

int main() 
{
    Animation fadeIn("淡入", 2.0f);
    
    // 设置回调
    fadeIn.SetOnStart([]() {
        std::cout << "  → 开始淡入" << std::endl;
    });
    
    fadeIn.SetOnUpdate([](float progress) {
        int percent = static_cast<int>(progress * 100);
        if (percent % 25 == 0)  // 每25%打印一次
        {
            std::cout << "  → 进度: " << percent << "%" << std::endl;
        }
    });
    
    fadeIn.SetOnComplete([]() {
        std::cout << "  → 淡入完成，开始游戏" << std::endl;
    });
    
    // 播放并更新
    fadeIn.Play();
    
    std::cout << "\n模拟更新:\n" << std::endl;
    for (int i = 0; i < 10; i++) 
    {
        fadeIn.Update(0.25f);
    }
    
    return 0;
}

```

## 十、虚幻引擎的Delegate系统（TDelegate）

UE有完整的Delegate系统，非常强大！

### UE Delegate类型

```cpp
// 1. 单播Delegate（只能绑定一个函数）
DECLARE_DELEGATE(FSimpleDelegate)
DECLARE_DELEGATE_OneParam(FIntDelegate, int32)
DECLARE_DELEGATE_TwoParams(FFloatIntDelegate, float, int32)
DECLARE_DELEGATE_RetVal(bool, FBoolDelegate)  // 带返回值

// 2. 多播Delegate（可以绑定多个函数）
DECLARE_MULTICAST_DELEGATE(FSimpleMulticastDelegate)
DECLARE_MULTICAST_DELEGATE_OneParam(FDamageMulticastDelegate, float)

// 3. 动态Delegate（可以序列化，蓝图可用）
DECLARE_DYNAMIC_DELEGATE(FDynamicSimpleDelegate)
DECLARE_DYNAMIC_MULTICAST_DELEGATE(FDynamicMulticastDelegate)

// 4. 事件（多播的受限版本，只能在声明类中Broadcast）
DECLARE_EVENT(AMyClass, FMyEvent)

```

### UE Delegate基础使用

```cpp
// MyActor.h
UCLASS()
class MYGAME_API AMyActor : public AActor
{
    GENERATED_BODY()
    
public:
    // 声明单播Delegate
    DECLARE_DELEGATE_OneParam(FOnHealthChanged, float);
    FOnHealthChanged OnHealthChanged;
    
    // 声明多播Delegate
    DECLARE_MULTICAST_DELEGATE_OneParam(FOnDeath, AActor*);
    FOnDeath OnDeath;
    
private:
    float Health;
    
public:
    void TakeDamage(float Damage)
    {
        Health -= Damage;
        
        // 触发单播Delegate
        if (OnHealthChanged.IsBound())
        {
            OnHealthChanged.Execute(Health);
        }
        
        if (Health <= 0)
        {
            // 触发多播Delegate（广播）
            OnDeath.Broadcast(this);
        }
    }
};

// 使用
void AGameMode::BeginPlay()
{
    Super::BeginPlay();
    
    AMyActor* Actor = GetWorld()->SpawnActor<AMyActor>();
    
    // 绑定单播Delegate（Lambda）
    Actor->OnHealthChanged.BindLambda([](float NewHealth) {
        UE_LOG(LogTemp, Warning, TEXT("血量变化: %f"), NewHealth);
    });
    
    // 绑定多播Delegate（多个监听者）
    Actor->OnDeath.AddLambda([](AActor* DeadActor) {
        UE_LOG(LogTemp, Warning, TEXT("播放死亡音效"));
    });
    
    Actor->OnDeath.AddLambda([](AActor* DeadActor) {
        UE_LOG(LogTemp, Warning, TEXT("显示死亡特效"));
    });
    
    Actor->OnDeath.AddUObject(this, &AGameMode::OnActorDeath);
}

void AGameMode::OnActorDeath(AActor* DeadActor)
{
    UE_LOG(LogTemp, Warning, TEXT("敌人死亡，更新分数"));
}

```

### UE动态Delegate（蓝图可用）

```cpp
// MyComponent.h
UCLASS()
class MYGAME_API UMyComponent : public UActorComponent
{
    GENERATED_BODY()
    
public:
    // 动态多播Delegate（蓝图可见）
    DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnScoreChanged, int32, NewScore);
    
    UPROPERTY(BlueprintAssignable, Category = "Events")
    FOnScoreChanged OnScoreChanged;
    
private:
    int32 Score;
    
public:
    UFUNCTION(BlueprintCallable, Category = "Score")
    void AddScore(int32 Amount)
    {
        Score += Amount;
        
        // 广播事件（C++和蓝图都会收到）
        OnScoreChanged.Broadcast(Score);
    }
};

// C++中绑定
void APlayerController::BindEvents()
{
    UMyComponent* Comp = GetPawn()->FindComponentByClass<UMyComponent>();
    
    Comp->OnScoreChanged.AddDynamic(this, &APlayerController::OnScoreUpdated);
}

UFUNCTION()
void APlayerController::OnScoreUpdated(int32 NewScore)
{
    UE_LOG(LogTemp, Warning, TEXT("分数更新: %d"), NewScore);
}

```

### UE绑定成员函数的多种方式

```cpp
class UMyClass : public UObject
{
public:
    void MyFunction() {}
    void MyFunctionWithParam(int32 Value) {}
    
    UFUNCTION()
    void MyDynamicFunction(int32 Value) {}
};

void Example()
{
    UMyClass* Obj = NewObject<UMyClass>();
    
    // 1. 绑定普通成员函数
    FSimpleDelegate Delegate1;
    Delegate1.BindUObject(Obj, &UMyClass::MyFunction);
    
    // 2. 绑定带参数的成员函数
    FIntDelegate Delegate2;
    Delegate2.BindUObject(Obj, &UMyClass::MyFunctionWithParam);
    
    // 3. 绑定Lambda
    FSimpleDelegate Delegate3;
    Delegate3.BindLambda([]() {
        UE_LOG(LogTemp, Warning, TEXT("Lambda called"));
    });
    
    // 4. 绑定Lambda并捕获
    int32 Value = 42;
    Delegate3.BindLambda([Value]() {
        UE_LOG(LogTemp, Warning, TEXT("Value: %d"), Value);
    });
    
    // 5. 绑定静态函数
    Delegate1.BindStatic(&UMyClass::StaticFunction);
    
    // 6. 绑定动态Delegate（蓝图）
    FDynamicIntDelegate DynDelegate;
    DynDelegate.BindDynamic(Obj, &UMyClass::MyDynamicFunction);
}

```

### UE事件系统示例

```cpp
// 按钮组件
UCLASS()
class MYGAME_API UMyButton : public UUserWidget
{
    GENERATED_BODY()
    
public:
    // 声明事件（只能在此类中Broadcast）
    DECLARE_EVENT(UMyButton, FOnButtonClicked)
    FOnButtonClicked OnButtonClicked;
    
    UFUNCTION(BlueprintCallable)
    void Click()
    {
        UE_LOG(LogTemp, Warning, TEXT("按钮被点击"));
        
        // 触发事件
        OnButtonClicked.Broadcast();
    }
    
    // 提供订阅接口
    FDelegateHandle SubscribeToClick(const FSimpleDelegate& Callback)
    {
        return OnButtonClicked.Add(Callback);
    }
    
    void UnsubscribeFromClick(FDelegateHandle Handle)
    {
        OnButtonClicked.Remove(Handle);
    }
};

// 使用
void AMyHUD::SetupUI()
{
    UMyButton* Button = CreateWidget<UMyButton>(GetWorld());
    
    // 订阅按钮点击事件
    Button->SubscribeToClick(FSimpleDelegate::CreateLambda([]() {
        UE_LOG(LogTemp, Warning, TEXT("按钮点击回调"));
    }));
    
    // 或者直接访问（如果是友元类）
    Button->OnButtonClicked.AddLambda([]() {
        UE_LOG(LogTemp, Warning, TEXT("另一个监听者"));
    });
}

```

## 十一、最佳实践指南

### 原则一：优先使用Lambda

```cpp
// ✅ 清晰简洁
button.SetOnClick([]() {
    std::cout << "按钮被点击" << std::endl;
});

// ❌ 过于冗长
void OnButtonClick() 
{
    std::cout << "按钮被点击" << std::endl;
}
button.SetOnClick(OnButtonClick);

```

### 原则二：注意Lambda的捕获

```cpp
// ❌ 危险：捕获局部变量的引用
{
    int value = 42;
    button.SetOnClick([&value]() {
        std::cout << value << std::endl;  // value可能已销毁！
    });
}

// ✅ 安全：值捕获
{
    int value = 42;
    button.SetOnClick([value]() {
        std::cout << value << std::endl;  // 安全
    });
}

// ✅ 安全：捕获成员变量（对象生命周期足够长）
class MyClass 
{
    int memberValue = 42;
    
    void Setup() 
    {
        button.SetOnClick([this]() {
            std::cout << memberValue << std::endl;  // 安全
        });
    }
};

```

### 原则三：提供解绑机制

```cpp
class Button 
{
private:
    std::function<void()> onClick;
    
public:
    void SetOnClick(std::function<void()> callback) 
    {
        onClick = callback;
    }
    
    // ✅ 提供清除回调的方法
    void ClearOnClick() 
    {
        onClick = nullptr;
    }
};

```

### 原则四：多播Delegate用于事件通知

```cpp
// ✅ 多个系统需要响应同一事件
MulticastDelegate<int> onEnemyKilled;

onEnemyKilled.Add([](int enemyID) {
    // 音效系统
});

onEnemyKilled.Add([](int enemyID) {
    // UI系统
});

onEnemyKilled.Add([](int enemyID) {
    // 统计系统
});

```

### 原则五：UE中使用正确的Delegate类型

```cpp
// ✅ C++内部使用：普通Delegate
DECLARE_DELEGATE(FMyDelegate)

// ✅ 需要蓝图支持：动态Delegate
DECLARE_DYNAMIC_MULTICAST_DELEGATE(FMyDynamicDelegate)

// ✅ 限制访问权限：Event
DECLARE_EVENT(AMyClass, FMyEvent)

```

## 十二、性能对比

### 不同回调方式的性能

```cpp
// 性能排序（从快到慢）：
1. 直接函数调用         - 最快
2. 函数指针             - 很快
3. std::function        - 较快
4. 虚函数              - 较慢（虚表查找）
5. UE动态Delegate       - 慢（序列化开销）

// 具体选择：
性能关键路径    → 函数指针或直接调用
一般游戏逻辑    → std::function或Lambda
需要蓝图支持    → UE动态Delegate

```

今天的知识点你都有Get到吗~

有没有什么疑问，我们在评论区见哦~

你们也可以告诉我有什么是你们想知道的

![](./image-1.jpg)

![](./image-2.jpg)
