---
title: "重启RestArt ProjectA｜29.Union联合体"
description: "一、什么是Union想象你住在一个小公寓里，只有一个房间。这个房间可以是 卧室、办公室或健身房，但同一时间只能是其中一种！你想睡觉时就当卧室，想工作时就当办公室，想锻炼时就当健身房。 Union（联合…"
category: tools
tags: ['C++', 'ProjectA', '编程基础']
date: 2025-11-10
readTime: 2
heroImage: "./cover.webp"
published: true
---
## 一、什么是Union

想象你住在一个小公寓里，只有一个房间。这个房间可以是卧室、办公室或健身房，但同一时间只能是其中一种！你想睡觉时就当卧室，想工作时就当办公室，想锻炼时就当健身房。

Union（联合体）就是C++中的”多功能房间”——多个成员共享同一块内存，同一时间只能使用一个！

### Union vs Struct

```cpp
// Struct：每个成员都有独立的房间
struct House 
{
    int bedroom;    // 占4字节
    int office;     // 占4字节
    int gym;        // 占4字节
};  // 总共12字节

// Union：所有成员共用一个房间
union Room 
{
    int bedroom;    // 占4字节
    int office;     // 占4字节
    int gym;        // 占4字节
};  // 只占4字节！

```

Union的魔法：

```cpp
内存布局：

Struct House:
[bedroom][office][gym]    12字节
    ↓        ↓       ↓
   独立    独立    独立

Union Room:
[bedroom/office/gym]      4字节
         ↓
    共享同一块内存

```

## 二、基础使用

```cpp
#include <iostream>

union Data 
{
    int intValue;
    float floatValue;
    char charValue;
};

int main() 
{
    Data data;
    
    // 存储整数
    data.intValue = 42;
    std::cout << "Int: " << data.intValue << std::endl;  // 42
    
    // 存储浮点数（覆盖了之前的整数）
    data.floatValue = 3.14f;
    std::cout << "Float: " << data.floatValue << std::endl;  // 3.14
    
    // 此时读取intValue是未定义行为！
    std::cout << "Int (corrupted): " << data.intValue << std::endl;  // 垃圾值
    
    // 存储字符（又覆盖了浮点数）
    data.charValue = 'A';
    std::cout << "Char: " << data.charValue << std::endl;  // A
    
    // Union的大小等于最大成员的大小
    std::cout << "Size: " << sizeof(Data) << " bytes" << std::endl;  // 4
    
    return 0;
}

```

输出：

```cpp
Int: 42
Float: 3.14
Int (corrupted): 1078523331  (垃圾值！)
Char: A
Size: 4 bytes

```

关键！！！同一时间只能使用一个成员！

## 三、Union的核心特性

### 1. 内存共享

```cpp
union Number 
{
    int i;      // 4字节
    float f;    // 4字节
    char c[4];  // 4字节
};

Number num;
std::cout << sizeof(num) << std::endl;  // 4字节（不是12字节！）

// 所有成员地址相同
std::cout << &num.i << std::endl;
std::cout << &num.f << std::endl;
std::cout << &num.c << std::endl;
// 输出相同的地址！

```

### 2. Union的大小

```cpp
union Data 
{
    char c;          // 1字节
    int i;           // 4字节
    double d;        // 8字节
    char str[100];   // 100字节
};

std::cout << sizeof(Data) << std::endl;  // 100字节（最大成员）

// 实际可能更大（对齐）
union Aligned 
{
    char c;    // 1字节
    int i;     // 4字节
    double d;  // 8字节
};
std::cout << sizeof(Aligned) << std::endl;  // 8字节（对齐到double）

```

### 3. 匿名Union

```cpp
struct Packet 
{
    int type;
    
    // 匿名union：不需要名字，成员直接访问
    union 
    {
        int intData;
        float floatData;
        char stringData[64];
    };
};

Packet packet;
packet.type = 1;
packet.intData = 42;  // 直接访问，不需要 packet.xxx.intData

// 等价于命名union
struct PacketNamed 
{
    int type;
    
    union Data 
    {
        int intData;
        float floatData;
        char stringData[64];
    } data;
};

PacketNamed p2;
p2.data.intData = 42;  // 需要通过data访问

```

匿名union的特性特别适合用来写图形学坐标计算中的swizzle

### 4. Union中的构造函数和析构函数（&gt; C++11）

```cpp
#include <string>
#include <iostream>

union Value 
{
    int i;
    float f;
    std::string s;  // 有构造/析构函数的类型
    
    // 必须提供构造函数
    Value() : i(0) {}  // 默认构造int
    
    // 必须提供析构函数
    ~Value() 
    {
        // 需要手动判断当前是什么类型！
        // 这里无法自动销毁string
    }
};

// ⚠️ 现代C++不推荐在union中使用复杂类型
// 应该使用std::variant（C++17）

```

### 5. Tagged Union（标记联合体）

安全使用union的最佳实践：添加类型标记！

```cpp
enum class DataType 
{
    None,
    Int,
    Float,
    String
};

struct SafeData 
{
    DataType type;  // 类型标记
    
    union 
    {
        int intValue;
        float floatValue;
        char stringValue[64];
    };
    
    // 构造函数
    SafeData() : type(DataType::None), intValue(0) {}
    
    // 设置整数
    void SetInt(int value) 
    {
        type = DataType::Int;
        intValue = value;
    }
    
    // 设置浮点数
    void SetFloat(float value) 
    {
        type = DataType::Float;
        floatValue = value;
    }
    
    // 设置字符串
    void SetString(const char* value) 
    {
        type = DataType::String;
        strncpy(stringValue, value, 63);
        stringValue[63] = '\0';
    }
    
    // 安全获取整数
    bool GetInt(int& out) const 
    {
        if (type == DataType::Int) 
        {
            out = intValue;
            return true;
        }
        return false;
    }
    
    // 安全获取浮点数
    bool GetFloat(float& out) const 
    {
        if (type == DataType::Float) 
        {
            out = floatValue;
            return true;
        }
        return false;
    }
    
    void Print() const 
    {
        switch (type) 
        {
            case DataType::Int:
                std::cout << "Int: " << intValue << std::endl;
                break;
            case DataType::Float:
                std::cout << "Float: " << floatValue << std::endl;
                break;
            case DataType::String:
                std::cout << "String: " << stringValue << std::endl;
                break;
            default:
                std::cout << "None" << std::endl;
        }
    }
};

int main() 
{
    SafeData data;
    
    data.SetInt(42);
    data.Print();  // Int: 42
    
    data.SetFloat(3.14f);
    data.Print();  // Float: 3.14
    
    // 尝试错误类型的访问
    int value;
    if (!data.GetInt(value))  // false，因为现在是float
    {
        std::cout << "不是整数类型！" << std::endl;
    }
    
    return 0;
}

```

## 四、Union实战应用

### 应用1：位操作和类型双关

```cpp
// 查看float的二进制表示
union FloatInspector 
{
    float f;
    unsigned int bits;
};

void InspectFloat(float value) 
{
    FloatInspector inspector;
    inspector.f = value;
    
    std::cout << "Float: " << inspector.f << std::endl;
    std::cout << "Bits: 0x" << std::hex << inspector.bits << std::dec << std::endl;
    
    // 提取符号位、指数、尾数
    unsigned int sign = (inspector.bits >> 31) & 1;
    unsigned int exponent = (inspector.bits >> 23) & 0xFF;
    unsigned int mantissa = inspector.bits & 0x7FFFFF;
    
    std::cout << "Sign: " << sign << std::endl;
    std::cout << "Exponent: " << exponent << std::endl;
    std::cout << "Mantissa: " << mantissa << std::endl;
}

int main() 
{
    InspectFloat(3.14f);
    return 0;
}

```

### 应用2：颜色表示

```cpp
// 用union表示颜色
union Color 
{
    unsigned int value;  // RGBA打包为32位整数
    
    struct 
    {
        unsigned char r;
        unsigned char g;
        unsigned char b;
        unsigned char a;
    };
    
    unsigned char components[4];  // 数组访问
};

int main() 
{
    Color color;
    
    // 方式1：设置整个颜色
    color.value = 0xFF00FFAA;
    
    // 方式2：分别设置通道
    color.r = 255;
    color.g = 128;
    color.b = 64;
    color.a = 255;
    
    // 方式3：数组访问
    color.components[0] = 255;  // R
    color.components[1] = 128;  // G
    color.components[2] = 64;   // B
    color.components[3] = 255;  // A
    
    std::cout << "Color value: 0x" << std::hex << color.value << std::dec << std::endl;
    std::cout << "R: " << (int)color.r << std::endl;
    std::cout << "G: " << (int)color.g << std::endl;
    std::cout << "B: " << (int)color.b << std::endl;
    std::cout << "A: " << (int)color.a << std::endl;
    
    return 0;
}

```

### 应用3：网络包头

```cpp
#include <cstring>

union IPv4Address 
{
    unsigned int value;      // 32位整数
    unsigned char bytes[4];  // 4个字节
};

struct PacketHeader 
{
    unsigned short packetType;
    unsigned short length;
    IPv4Address sourceIP;
    IPv4Address destIP;
};

void PrintIPAddress(const IPv4Address& ip) 
{
    std::cout << (int)ip.bytes[0] << "."
              << (int)ip.bytes[1] << "."
              << (int)ip.bytes[2] << "."
              << (int)ip.bytes[3] << std::endl;
}

int main() 
{
    PacketHeader packet;
    packet.packetType = 1;
    packet.length = 128;
    
    // 设置源IP: 192.168.1.100
    packet.sourceIP.bytes[0] = 192;
    packet.sourceIP.bytes[1] = 168;
    packet.sourceIP.bytes[2] = 1;
    packet.sourceIP.bytes[3] = 100;
    
    // 设置目标IP: 10.0.0.1
    packet.destIP.bytes[0] = 10;
    packet.destIP.bytes[1] = 0;
    packet.destIP.bytes[2] = 0;
    packet.destIP.bytes[3] = 1;
    
    std::cout << "Source IP: ";
    PrintIPAddress(packet.sourceIP);
    
    std::cout << "Dest IP: ";
    PrintIPAddress(packet.destIP);
    
    return 0;
}

```

## 五、游戏开发实战案例

### 案例1：变体数据类型（游戏配置）

```cpp
#include <iostream>
#include <vector>
#include <string>

enum class ConfigValueType 
{
    None,
    Bool,
    Int,
    Float,
    String
};

struct ConfigValue 
{
    ConfigValueType type;
    
    union 
    {
        bool boolValue;
        int intValue;
        float floatValue;
        char stringValue[128];
    };
    
    ConfigValue() : type(ConfigValueType::None), intValue(0) {}
    
    static ConfigValue Bool(bool value) 
    {
        ConfigValue v;
        v.type = ConfigValueType::Bool;
        v.boolValue = value;
        return v;
    }
    
    static ConfigValue Int(int value) 
    {
        ConfigValue v;
        v.type = ConfigValueType::Int;
        v.intValue = value;
        return v;
    }
    
    static ConfigValue Float(float value) 
    {
        ConfigValue v;
        v.type = ConfigValueType::Float;
        v.floatValue = value;
        return v;
    }
    
    static ConfigValue String(const char* value) 
    {
        ConfigValue v;
        v.type = ConfigValueType::String;
        strncpy(v.stringValue, value, 127);
        v.stringValue[127] = '\0';
        return v;
    }
    
    void Print() const 
    {
        switch (type) 
        {
            case ConfigValueType::Bool:
                std::cout << (boolValue ? "true" : "false");
                break;
            case ConfigValueType::Int:
                std::cout << intValue;
                break;
            case ConfigValueType::Float:
                std::cout << floatValue;
                break;
            case ConfigValueType::String:
                std::cout << "\"" << stringValue << "\"";
                break;
            default:
                std::cout << "None";
        }
    }
};

class GameConfig 
{
private:
    struct Setting 
    {
        std::string name;
        ConfigValue value;
    };
    
    std::vector<Setting> settings;
    
public:
    void Set(const std::string& name, const ConfigValue& value) 
    {
        // 查找是否已存在
        for (auto& setting : settings) 
        {
            if (setting.name == name) 
            {
                setting.value = value;
                return;
            }
        }
        
        // 不存在则添加
        settings.push_back({name, value});
    }
    
    ConfigValue* Get(const std::string& name) 
    {
        for (auto& setting : settings) 
        {
            if (setting.name == name) 
            {
                return &setting.value;
            }
        }
        return nullptr;
    }
    
    void PrintAll() 
    {
        std::cout << "=== 游戏配置 ===" << std::endl;
        for (const auto& setting : settings) 
        {
            std::cout << setting.name << " = ";
            setting.value.Print();
            std::cout << std::endl;
        }
    }
};

int main() 
{
    GameConfig config;
    
    config.Set("fullscreen", ConfigValue::Bool(true));
    config.Set("resolution_width", ConfigValue::Int(1920));
    config.Set("resolution_height", ConfigValue::Int(1080));
    config.Set("volume", ConfigValue::Float(0.8f));
    config.Set("player_name", ConfigValue::String("Hero"));
    
    config.PrintAll();
    
    // 读取配置
    if (ConfigValue* value = config.Get("volume")) 
    {
        if (value->type == ConfigValueType::Float) 
        {
            std::cout << "\n当前音量: " << value->floatValue << std::endl;
        }
    }
    
    return 0;
}

```

### 案例2：事件系统

```cpp
#include <iostream>
#include <vector>

enum class EventType 
{
    None,
    KeyPress,
    MouseClick,
    GameOver,
    LevelUp
};

struct KeyPressData 
{
    int keyCode;
    bool isShift;
    bool isCtrl;
};

struct MouseClickData 
{
    int x;
    int y;
    int button;  // 0=左键, 1=右键, 2=中键
};

struct GameOverData 
{
    int finalScore;
    bool isVictory;
};

struct LevelUpData 
{
    int oldLevel;
    int newLevel;
    int skillPoints;
};

struct GameEvent 
{
    EventType type;
    
    union EventData 
    {
        KeyPressData keyPress;
        MouseClickData mouseClick;
        GameOverData gameOver;
        LevelUpData levelUp;
        
        EventData() {}  // 空构造
    } data;
    
    GameEvent() : type(EventType::None) {}
    
    static GameEvent KeyPress(int keyCode, bool shift, bool ctrl) 
    {
        GameEvent event;
        event.type = EventType::KeyPress;
        event.data.keyPress = {keyCode, shift, ctrl};
        return event;
    }
    
    static GameEvent MouseClick(int x, int y, int button) 
    {
        GameEvent event;
        event.type = EventType::MouseClick;
        event.data.mouseClick = {x, y, button};
        return event;
    }
    
    static GameEvent GameOver(int score, bool victory) 
    {
        GameEvent event;
        event.type = EventType::GameOver;
        event.data.gameOver = {score, victory};
        return event;
    }
    
    static GameEvent LevelUp(int oldLv, int newLv, int points) 
    {
        GameEvent event;
        event.type = EventType::LevelUp;
        event.data.levelUp = {oldLv, newLv, points};
        return event;
    }
    
    void Print() const 
    {
        switch (type) 
        {
            case EventType::KeyPress:
                std::cout << "KeyPress: Code=" << data.keyPress.keyCode
                          << " Shift=" << data.keyPress.isShift
                          << " Ctrl=" << data.keyPress.isCtrl << std::endl;
                break;
                
            case EventType::MouseClick:
                std::cout << "MouseClick: (" << data.mouseClick.x << "," 
                          << data.mouseClick.y << ") Button=" 
                          << data.mouseClick.button << std::endl;
                break;
                
            case EventType::GameOver:
                std::cout << "GameOver: Score=" << data.gameOver.finalScore
                          << " Victory=" << data.gameOver.isVictory << std::endl;
                break;
                
            case EventType::LevelUp:
                std::cout << "LevelUp: " << data.levelUp.oldLevel 
                          << " -> " << data.levelUp.newLevel
                          << " (+" << data.levelUp.skillPoints << " points)" 
                          << std::endl;
                break;
                
            default:
                std::cout << "None" << std::endl;
        }
    }
};

class EventQueue 
{
private:
    std::vector<GameEvent> events;
    
public:
    void Push(const GameEvent& event) 
    {
        events.push_back(event);
    }
    
    void ProcessAll() 
    {
        std::cout << "=== 处理事件队列 ===" << std::endl;
        for (const auto& event : events) 
        {
            event.Print();
        }
        events.clear();
    }
};

int main() 
{
    EventQueue queue;
    
    queue.Push(GameEvent::KeyPress(65, false, false));  // 'A'键
    queue.Push(GameEvent::MouseClick(100, 200, 0));     // 左键点击
    queue.Push(GameEvent::LevelUp(5, 6, 3));            // 升级
    queue.Push(GameEvent::GameOver(12345, true));       // 胜利
    
    queue.ProcessAll();
    
    return 0;
}

```

### 案例3：紧凑的游戏存档

```cpp
#include <iostream>
#include <fstream>
#include <cstring>

// 紧凑的位标志
union PlayerFlags 
{
    unsigned int all;
    
    struct 
    {
        unsigned int hasWeapon : 1;
        unsigned int hasArmor : 1;
        unsigned int hasPotion : 1;
        unsigned int levelCompleted : 5;  // 0-31关卡
        unsigned int difficulty : 2;      // 0-3难度
        unsigned int unused : 22;
    };
};

struct SaveData 
{
    char playerName[32];
    int level;
    int experience;
    int health;
    int gold;
    PlayerFlags flags;
    
    void Print() const 
    {
        std::cout << "=== 存档数据 ===" << std::endl;
        std::cout << "玩家: " << playerName << std::endl;
        std::cout << "等级: " << level << std::endl;
        std::cout << "经验: " << experience << std::endl;
        std::cout << "生命: " << health << std::endl;
        std::cout << "金币: " << gold << std::endl;
        std::cout << "拥有武器: " << (flags.hasWeapon ? "是" : "否") << std::endl;
        std::cout << "拥有护甲: " << (flags.hasArmor ? "是" : "否") << std::endl;
        std::cout << "拥有药水: " << (flags.hasPotion ? "是" : "否") << std::endl;
        std::cout << "完成关卡: " << flags.levelCompleted << std::endl;
        std::cout << "难度: " << flags.difficulty << std::endl;
    }
    
    void Save(const char* filename) const 
    {
        std::ofstream file(filename, std::ios::binary);
        if (file.is_open()) 
        {
            file.write(reinterpret_cast<const char*>(this), sizeof(SaveData));
            file.close();
            std::cout << "存档保存成功: " << filename << std::endl;
        }
    }
    
    bool Load(const char* filename) 
    {
        std::ifstream file(filename, std::ios::binary);
        if (file.is_open()) 
        {
            file.read(reinterpret_cast<char*>(this), sizeof(SaveData));
            file.close();
            std::cout << "存档读取成功: " << filename << std::endl;
            return true;
        }
        return false;
    }
};

int main() 
{
    SaveData save;
    strcpy(save.playerName, "Hero");
    save.level = 10;
    save.experience = 5000;
    save.health = 80;
    save.gold = 1500;
    
    // 设置标志
    save.flags.all = 0;  // 清零
    save.flags.hasWeapon = 1;
    save.flags.hasArmor = 1;
    save.flags.hasPotion = 1;
    save.flags.levelCompleted = 12;
    save.flags.difficulty = 2;  // 困难
    
    save.Print();
    save.Save("savegame.dat");
    
    std::cout << "\n模拟读取存档..." << std::endl;
    SaveData loaded;
    if (loaded.Load("savegame.dat")) 
    {
        loaded.Print();
    }
    
    std::cout << "\n存档大小: " << sizeof(SaveData) << " 字节" << std::endl;
    
    return 0;
}

```

### 案例4：快速数学库（SIMD准备）

```cpp
#include <iostream>
#include <cmath>

// 向量的不同表示方式
union Vector3 
{
    struct 
    {
        float x, y, z;
    };
    
    float v[3];
    
    Vector3() : x(0), y(0), z(0) {}
    Vector3(float _x, float _y, float _z) : x(_x), y(_y), z(_z) {}
    
    float Length() const 
    {
        return std::sqrt(x*x + y*y + z*z);
    }
    
    Vector3 Normalize() const 
    {
        float len = Length();
        if (len > 0) 
        {
            return Vector3(x/len, y/len, z/len);
        }
        return Vector3();
    }
    
    void Print() const 
    {
        std::cout << "(" << x << ", " << y << ", " << z << ")" << std::endl;
    }
};

union Vector4 
{
    struct 
    {
        float x, y, z, w;
    };
    
    struct 
    {
        float r, g, b, a;  // 也可以表示颜色
    };
    
    float v[4];
    
    Vector4() : x(0), y(0), z(0), w(0) {}
    Vector4(float _x, float _y, float _z, float _w) 
        : x(_x), y(_y), z(_z), w(_w) {}
};

union Matrix4x4 
{
    float m[4][4];
    float data[16];
    
    Matrix4x4() 
    {
        // 初始化为单位矩阵
        for (int i = 0; i < 16; i++) 
            data[i] = 0;
        m[0][0] = m[1][1] = m[2][2] = m[3][3] = 1.0f;
    }
    
    void Print() const 
    {
        for (int i = 0; i < 4; i++) 
        {
            for (int j = 0; j < 4; j++) 
            {
                std::cout << m[i][j] << " ";
            }
            std::cout << std::endl;
        }
    }
};

int main() 
{
    Vector3 v(3, 4, 0);
    std::cout << "向量: ";
    v.Print();
    std::cout << "长度: " << v.Length() << std::endl;
    
    Vector3 normalized = v.Normalize();
    std::cout << "归一化: ";
    normalized.Print();
    
    // 数组访问
    std::cout << "v[0] = " << v.v[0] << std::endl;
    std::cout << "v[1] = " << v.v[1] << std::endl;
    
    std::cout << "\n单位矩阵:" << std::endl;
    Matrix4x4 identity;
    identity.Print();
    
    return 0;
}

```

### 案例5：指令/操作码系统

```cpp
#include <iostream>
#include <vector>

enum class OpCode 
{
    Move,      // 移动
    Attack,    // 攻击
    UseItem,   // 使用物品
    Dialogue   // 对话
};

struct MoveCommand 
{
    float x, y;
    float speed;
};

struct AttackCommand 
{
    int targetID;
    int skillID;
};

struct UseItemCommand 
{
    int itemID;
    int targetID;
};

struct DialogueCommand 
{
    int npcID;
    int dialogueID;
};

struct Command 
{
    OpCode opcode;
    
    union CommandData 
    {
        MoveCommand move;
        AttackCommand attack;
        UseItemCommand useItem;
        DialogueCommand dialogue;
        
        CommandData() {}
    } data;
    
    Command() : opcode(OpCode::Move) {}
    
    static Command Move(float x, float y, float speed) 
    {
        Command cmd;
        cmd.opcode = OpCode::Move;
        cmd.data.move = {x, y, speed};
        return cmd;
    }
    
    static Command Attack(int targetID, int skillID) 
    {
        Command cmd;
        cmd.opcode = OpCode::Attack;
        cmd.data.attack = {targetID, skillID};
        return cmd;
    }
    
    static Command UseItem(int itemID, int targetID) 
    {
        Command cmd;
        cmd.opcode = OpCode::UseItem;
        cmd.data.useItem = {itemID, targetID};
        return cmd;
    }
    
    static Command Dialogue(int npcID, int dialogueID) 
    {
        Command cmd;
        cmd.opcode = OpCode::Dialogue;
        cmd.data.dialogue = {npcID, dialogueID};
        return cmd;
    }
    
    void Execute() const 
    {
        switch (opcode) 
        {
            case OpCode::Move:
                std::cout << "移动到 (" << data.move.x << "," 
                          << data.move.y << ") 速度:" << data.move.speed 
                          << std::endl;
                break;
                
            case OpCode::Attack:
                std::cout << "攻击目标 " << data.attack.targetID 
                          << " 使用技能 " << data.attack.skillID << std::endl;
                break;
                
            case OpCode::UseItem:
                std::cout << "使用物品 " << data.useItem.itemID 
                          << " 对目标 " << data.useItem.targetID << std::endl;
                break;
                
            case OpCode::Dialogue:
                std::cout << "与NPC " << data.dialogue.npcID 
                          << " 对话 " << data.dialogue.dialogueID << std::endl;
                break;
        }
    }
};

class CommandQueue 
{
private:
    std::vector<Command> commands;
    
public:
    void Add(const Command& cmd) 
    {
        commands.push_back(cmd);
    }
    
    void ExecuteAll() 
    {
        std::cout << "=== 执行命令队列 ===" << std::endl;
        for (const auto& cmd : commands) 
        {
            cmd.Execute();
        }
        commands.clear();
    }
};

int main() 
{
    CommandQueue queue;
    
    queue.Add(Command::Move(100, 200, 5.0f));
    queue.Add(Command::Attack(42, 1));
    queue.Add(Command::UseItem(10, 0));  // 对自己使用
    queue.Add(Command::Dialogue(5, 101));
    
    queue.ExecuteAll();
    
    std::cout << "\nCommand大小: " << sizeof(Command) << " 字节" << std::endl;
    
    return 0;
}

```

## 六、新手常见五大错误

### 错误1：读取未激活的union成员

```cpp
union Data 
{
    int i;
    float f;
};

Data d;
d.i = 42;

// ❌ 错误：读取未激活的成员
float value = d.f;  // 未定义行为！垃圾值

// ✅ 正确：只读取激活的成员
int value = d.i;

```

### 错误2：忘记union大小规则

```cpp
union Data 
{
    char c;     // 1字节
    int i;      // 4字节
    double d;   // 8字节
};

// ❌ 错误假设
// sizeof(Data) == 1+4+8 = 13字节

// ✅ 正确
sizeof(Data) == 8字节  // 最大成员的大小

```

### 错误3：在union中使用有析构函数的类型

```cpp
union Bad 
{
    int i;
    std::string s;  // ❌ 错误！string有析构函数
    std::vector<int> v;  // ❌ 错误！vector有析构函数
};

// 编译错误！
// C++11后，union不能包含有非平凡析构函数的类型
// （除非手动管理）

// ✅ 正确：使用POD类型
union Good 
{
    int i;
    float f;
    char str[100];  // 数组可以
};

```

### 错误4：不使用标记联合体导致类型混淆

```cpp
union Data 
{
    int i;
    float f;
};

void Process(Data d) 
{
    // ❌ 无法知道d是int还是float！
    std::cout << d.i << std::endl;  // 可能是错的
}

// ✅ 正确：使用标记联合体
enum class Type { Int, Float };

struct TaggedData 
{
    Type type;
    union 
    {
        int i;
        float f;
    };
};

void Process(const TaggedData& d) 
{
    if (d.type == Type::Int) 
    {
        std::cout << d.i << std::endl;
    }
    else 
    {
        std::cout << d.f << std::endl;
    }
}

```

### 错误5：期望union成员独立存储

```cpp
union Data 
{
    int a;
    int b;
};

Data d;
d.a = 10;
d.b = 20;

// ❌ 错误期望
// d.a == 10, d.b == 20

// ✅ 实际情况
// d.a == 20, d.b == 20 (共享内存！)
std::cout << d.a << " " << d.b << std::endl;  // 20 20

```

## 七、最佳实践指南

### 原则一：优先使用std::variant（&gt; C++17）

```cpp
#include <variant>

// ❌ 旧方式：union + 标记
struct OldData 
{
    enum Type { Int, Float, String };
    Type type;
    union 
    {
        int i;
        float f;
        char s[64];
    };
};

// ✅ 新方式：std::variant
using NewData = std::variant<int, float, std::string>;

NewData data = 42;
data = 3.14f;
data = std::string("Hello");

// 安全访问
if (std::holds_alternative<int>(data)) 
{
    int value = std::get<int>(data);
}

```

### 原则二：始终使用标记联合体

```cpp
// ✅ 好的做法
struct SafeUnion 
{
    enum class Type { Int, Float } type;
    
    union 
    {
        int i;
        float f;
    };
    
    SafeUnion() : type(Type::Int), i(0) {}
};

```

### 原则三：只在必要时使用union

```cpp
// ✅ 合理的union使用场景：

// 1. 内存优化（嵌入式、网络包）
union CompactData 
{
    unsigned int value;
    unsigned char bytes[4];
};

// 2. 类型双关（位操作）
union FloatBits 
{
    float f;
    unsigned int bits;
};

// 3. 快速颜色转换
union Color32 
{
    unsigned int rgba;
    struct { unsigned char r, g, b, a; };
};

```

### 原则四：union中只使用POD类型

```cpp
// ✅ 安全的union成员
union Safe 
{
    int i;
    float f;
    double d;
    char str[64];
    struct { int x, y; } point;  // POD struct
};

// ❌ 危险的union成员
union Dangerous 
{
    std::string s;       // 有析构函数
    std::vector<int> v;  // 有析构函数
};

```

### 原则五：文档化当前激活的成员

```cpp
// ✅ 清晰的API设计
struct Data 
{
    enum class ActiveMember { None, Int, Float } active;
    
    union 
    {
        int intValue;
        float floatValue;
    };
    
    // 明确的setter
    void SetInt(int value) 
    {
        active = ActiveMember::Int;
        intValue = value;
    }
    
    void SetFloat(float value) 
    {
        active = ActiveMember::Float;
        floatValue = value;
    }
    
    // 明确的getter
    bool TryGetInt(int& out) const 
    {
        if (active == ActiveMember::Int) 
        {
            out = intValue;
            return true;
        }
        return false;
    }
};

```

## 八、Union vs 替代方案

### Union vs Struct

```cpp
// Struct：每个成员独立
struct Point 
{
    int x;  // 独立的4字节
    int y;  // 独立的4字节
};  // 总共8字节

// Union：成员共享
union Value 
{
    int i;    // 共享的4字节
    float f;  // 共享的4字节
};  // 总共4字节

// 何时用union：
// - 同一时间只需要一个值
// - 需要节省内存
// - 需要类型双关

// 何时用struct：
// - 需要所有成员同时存在
// - 大部分情况！

```

### Union vs std::variant

```cpp
#include <variant>

// Union：手动管理类型
union OldWay 
{
    int i;
    float f;
};

// std::variant：自动管理类型（C++17）
std::variant<int, float> NewWay;

NewWay = 42;
NewWay = 3.14f;

// ✅ 类型安全的访问
if (auto* ptr = std::get_if<int>(&NewWay)) 
{
    std::cout << "Int: " << *ptr << std::endl;
}

// ✅ visitor模式
std::visit([](auto&& arg) {
    std::cout << arg << std::endl;
}, NewWay);

```

### Union vs void*

```cpp
// Union：类型有限但安全
union Data 
{
    int i;
    float f;
    char c;
};

// void*：任意类型但不安全
void* ptr = malloc(sizeof(int));
*(int*)ptr = 42;  // 需要手动管理类型

// ✅ 优先用union（如果类型已知）
// ✅ 用void*只在必要时（插件系统等）

```

## 九、性能分析

### 内存大小对比

```cpp
#include <iostream>

struct StructData 
{
    int a;      // 4字节
    float b;    // 4字节
    double c;   // 8字节
};

union UnionData 
{
    int a;      // 4字节
    float b;    // 4字节
    double c;   // 8字节
};

int main() 
{
    std::cout << "Struct大小: " << sizeof(StructData) << " 字节" << std::endl;  // 16字节（对齐）
    std::cout << "Union大小: " << sizeof(UnionData) << " 字节" << std::endl;    // 8字节
    
    // 节省了50%的内存！
    
    return 0;
}

```

### 实际应用：网络包压缩

```cpp
// 不使用union：每个包56字节
struct PacketOld 
{
    int type;              // 4字节
    int intData;           // 4字节（可能不用）
    float floatData;       // 4字节（可能不用）
    char stringData[32];   // 32字节（可能不用）
    double doubleData;     // 8字节（可能不用）
};  // 总共56字节（浪费！）

// 使用union：每个包只需40字节
struct PacketNew 
{
    int type;              // 4字节
    union 
    {
        int intData;       // 4字节
        float floatData;   // 4字节
        char stringData[32];   // 32字节
        double doubleData;     // 8字节
    };  // 只占32字节（最大成员）
};  // 总共40字节

// 节省了28.6%的带宽！

```

今天的知识点你都有Get到吗~

有没有什么疑问，我们在评论区见哦~

你们也可以告诉我有什么是你们想知道的

![](./image-1.jpg)

![](./image-2.jpg)
