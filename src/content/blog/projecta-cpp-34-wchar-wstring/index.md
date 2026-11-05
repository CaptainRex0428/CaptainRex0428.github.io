---
title: "重启RestArt ProjectA｜34.wchar_t & wstring"
description: "一、字符编码基础1.1 字符编码的演变// ASCII时代（1字节=1字符，只支持英文） char asciiChar = 'A'; // 65 char asciiString[] = 'Hello…"
category: tools
tags: ['C++', 'ProjectA', '编程基础']
date: 2025-11-11
readTime: 5
heroImage: "./image-1.jpg"
published: true
---
## 一、字符编码基础

### 1.1 字符编码的演变

```cpp
// ASCII时代（1字节=1字符，只支持英文）
char asciiChar = 'A';        // 65
char asciiString[] = "Hello"; // 每个字符1字节

// 问题：无法表示中文、日文、韩文等
// char chineseChar = '中';  // ❌ 无法用1字节表示

// Unicode时代（统一字符集）
wchar_t wideChar = L'中';           // ✅ 可以表示
wchar_t wideString[] = L"你好世界";  // ✅ 支持多语言

```

### 1.2 常见编码对比

| 编码 | 字节数 | 范围 | 使用场景 |
| --- | --- | --- | --- |
| ASCII | 1字节 | 0-127 | 仅英文 |
| UTF-8 | 1-4字节 | 所有Unicode | Web、Linux、跨平台 |
| UTF-16 | 2或4字节 | 所有Unicode | Windows、Java、C# |
| UTF-32 | 4字节 | 所有Unicode | 简化处理，空间大 |
| GBK | 1-2字节 | 中文 | 中文Windows（旧） |

### 1.3 字符大小实测

```cpp
#include <iostream>

int main() 
{
    std::cout << "=== 字符类型大小 ===" << std::endl;
    std::cout << "sizeof(char)     = " << sizeof(char) << " 字节" << std::endl;
    std::cout << "sizeof(wchar_t)  = " << sizeof(wchar_t) << " 字节" << std::endl;
    std::cout << "sizeof(char16_t) = " << sizeof(char16_t) << " 字节" << std::endl;
    std::cout << "sizeof(char32_t) = " << sizeof(char32_t) << " 字节" << std::endl;
    
    // 字符串大小
    char str1[] = "Hello";
    wchar_t str2[] = L"Hello";
    
    std::cout << "\n=== 字符串大小 ===" << std::endl;
    std::cout << "char[] \"Hello\"    = " << sizeof(str1) << " 字节" << std::endl;
    std::cout << "wchar_t[] L\"Hello\" = " << sizeof(str2) << " 字节" << std::endl;
    
    return 0;
}

/* Windows输出:
=== 字符类型大小 ===
sizeof(char)     = 1 字节
sizeof(wchar_t)  = 2 字节   (Windows: UTF-16)
sizeof(char16_t) = 2 字节
sizeof(char32_t) = 4 字节

=== 字符串大小 ===
char[] "Hello"    = 6 字节  (5个字符 + \0)
wchar_t[] L"Hello" = 12 字节 (5个字符×2 + \0×2)
*/

/* Linux输出:
=== 字符类型大小 ===
sizeof(char)     = 1 字节
sizeof(wchar_t)  = 4 字节   (Linux: UTF-32)
sizeof(char16_t) = 2 字节
sizeof(char32_t) = 4 字节

=== 字符串大小 ===
char[] "Hello"    = 6 字节
wchar_t[] L"Hello" = 24 字节 (5个字符×4 + \0×4)
*/

```

关键点：

- wchar_t的大小不固定：Windows是2字节，Linux/Mac是4字节

- 这导致了跨平台问题

- C++11引入了char16_t和char32_t来解决这个问题

## 二、char vs wchar_t

### 2.1 基础对比

```cpp
#include <iostream>

int main() 
{
    // char：窄字符（1字节）
    char c1 = 'A';
    char c2 = 65;           // ASCII码
    char c3 = '\n';         // 转义字符
    
    std::cout << "char字符: " << c1 << " (ASCII: " << (int)c1 << ")" << std::endl;
    
    // wchar_t：宽字符（2或4字节）
    wchar_t wc1 = L'中';      // L前缀表示宽字符
    wchar_t wc2 = L'A';
    wchar_t wc3 = L'\n';
    
    // wcout用于输出宽字符
    std::wcout.imbue(std::locale(""));  // 设置本地化
    std::wcout << L"wchar_t字符: " << wc1 << std::endl;
    
    // 打印Unicode码点
    std::cout << "中的Unicode码点: " << (int)wc1 << std::endl;  // 20013
    
    return 0;
}

```

### 2.2 存储空间对比

```cpp
#include <iostream>

void CompareStorage() 
{
    // ASCII字符串
    const char* ascii = "Hello World";
    std::cout << "ASCII字符串: " << ascii << std::endl;
    std::cout << "长度: " << strlen(ascii) << " 字符" << std::endl;
    std::cout << "占用: " << strlen(ascii) + 1 << " 字节\n" << std::endl;
    
    // 宽字符串
    const wchar_t* wide = L"Hello World";
    std::wcout.imbue(std::locale(""));
    std::wcout << L"宽字符串: " << wide << std::endl;
    std::cout << "长度: " << wcslen(wide) << " 字符" << std::endl;
    std::cout << "占用: " << (wcslen(wide) + 1) * sizeof(wchar_t) << " 字节\n" << std::endl;
    
    // 中文字符串对比
    // const char* chinese = "你好";  // ⚠️ 编码依赖
    const wchar_t* chineseWide = L"你好";
    
    std::wcout << L"中文宽字符串: " << chineseWide << std::endl;
    std::cout << "长度: " << wcslen(chineseWide) << " 字符" << std::endl;
    std::cout << "占用: " << (wcslen(chineseWide) + 1) * sizeof(wchar_t) << " 字节" << std::endl;
}

int main() 
{
    CompareStorage();
    return 0;
}

/* Windows输出:
ASCII字符串: Hello World
长度: 11 字符
占用: 12 字节

宽字符串: Hello World
长度: 11 字符
占用: 24 字节

中文宽字符串: 你好
长度: 2 字符
占用: 6 字节
*/

```

### 2.3 字符串操作函数对比

```cpp
#include <iostream>
#include <cstring>
#include <cwchar>

void StringFunctionComparison() 
{
    // char字符串函数
    char str1[100] = "Hello";
    char str2[100] = " World";
    
    std::cout << "=== char字符串操作 ===" << std::endl;
    std::cout << "strlen(str1) = " << strlen(str1) << std::endl;
    
    strcat(str1, str2);  // 连接
    std::cout << "strcat结果: " << str1 << std::endl;
    
    if (strcmp(str1, "Hello World") == 0) 
    {
        std::cout << "strcmp: 字符串相等" << std::endl;
    }
    
    strcpy(str1, "New String");  // 复制
    std::cout << "strcpy结果: " << str1 << std::endl;
    
    // wchar_t字符串函数
    wchar_t wstr1[100] = L"你好";
    wchar_t wstr2[100] = L"世界";
    
    std::cout << "\n=== wchar_t字符串操作 ===" << std::endl;
    std::wcout.imbue(std::locale(""));
    std::cout << "wcslen(wstr1) = " << wcslen(wstr1) << std::endl;
    
    wcscat(wstr1, wstr2);  // 连接
    std::wcout << L"wcscat结果: " << wstr1 << std::endl;
    
    if (wcscmp(wstr1, L"你好世界") == 0) 
    {
        std::wcout << L"wcscmp: 字符串相等" << std::endl;
    }
    
    wcscpy(wstr1, L"新字符串");  // 复制
    std::wcout << L"wcscpy结果: " << wstr1 << std::endl;
}

int main() 
{
    StringFunctionComparison();
    return 0;
}

```

函数对比表：

| 功能 | char函数 | wchar_t函数 |
| --- | --- | --- |
| 长度 | strlen() | wcslen() |
| 复制 | strcpy() | wcscpy() |
| 连接 | strcat() | wcscat() |
| 比较 | strcmp() | wcscmp() |
| 查找字符 | strchr() | wcschr() |
| 查找字符串 | strstr() | wcsstr() |
| 格式化 | sprintf() | swprintf() |

## 三、string vs wstring

### 3.1 基础使用

```cpp
#include <iostream>
#include <string>

int main() 
{
    // std::string：基于char
    std::string str1 = "Hello World";
    std::string str2("C++ Programming");
    std::string str3 = str1 + " " + str2;
    
    std::cout << "std::string: " << str3 << std::endl;
    std::cout << "长度: " << str3.length() << std::endl;
    std::cout << "第一个字符: " << str3[0] << std::endl;
    
    // std::wstring：基于wchar_t
    std::wstring wstr1 = L"你好世界";
    std::wstring wstr2(L"C++编程");
    std::wstring wstr3 = wstr1 + L" " + wstr2;
    
    std::wcout.imbue(std::locale(""));
    std::wcout << L"std::wstring: " << wstr3 << std::endl;
    std::cout << "长度: " << wstr3.length() << std::endl;
    std::wcout << L"第一个字符: " << wstr3[0] << std::endl;
    
    return 0;
}

```

### 3.2 常用操作对比

```cpp
#include <iostream>
#include <string>
#include <algorithm>

void StringOperations() 
{
    // === std::string操作 ===
    std::string str = "Hello World";
    
    std::cout << "=== std::string操作 ===" << std::endl;
    
    // 查找
    size_t pos = str.find("World");
    std::cout << "find(\"World\") = " << pos << std::endl;
    
    // 子串
    std::string sub = str.substr(0, 5);
    std::cout << "substr(0, 5) = " << sub << std::endl;
    
    // 替换
    str.replace(6, 5, "C++");
    std::cout << "replace结果: " << str << std::endl;
    
    // 插入
    str.insert(0, ">>> ");
    std::cout << "insert结果: " << str << std::endl;
    
    // 删除
    str.erase(0, 4);
    std::cout << "erase结果: " << str << std::endl;
    
    // 转大写
    std::transform(str.begin(), str.end(), str.begin(), ::toupper);
    std::cout << "toupper结果: " << str << std::endl;
    
    // === std::wstring操作 ===
    std::wstring wstr = L"你好世界";
    
    std::wcout.imbue(std::locale(""));
    std::wcout << L"\n=== std::wstring操作 ===" << std::endl;
    
    // 查找
    size_t wpos = wstr.find(L"世界");
    std::cout << "find(L\"世界\") = " << wpos << std::endl;
    
    // 子串
    std::wstring wsub = wstr.substr(0, 2);
    std::wcout << L"substr(0, 2) = " << wsub << std::endl;
    
    // 替换
    wstr.replace(2, 2, L"C++");
    std::wcout << L"replace结果: " << wstr << std::endl;
    
    // 插入
    wstr.insert(0, L">>> ");
    std::wcout << L"insert结果: " << wstr << std::endl;
    
    // 删除
    wstr.erase(0, 4);
    std::wcout << L"erase结果: " << wstr << std::endl;
}

int main() 
{
    StringOperations();
    return 0;
}

```

### 3.3 容器中的使用

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <map>

void ContainerUsage() 
{
    // std::string容器
    std::vector<std::string> names = {
        "Alice", "Bob", "Charlie", "David"
    };
    
    std::cout << "=== std::string in vector ===" << std::endl;
    for (const auto& name : names) 
    {
        std::cout << name << " ";
    }
    std::cout << std::endl;
    
    std::map<std::string, int> ages = {
        {"Alice", 25},
        {"Bob", 30}
    };
    
    std::cout << "\n=== std::string in map ===" << std::endl;
    for (const auto& pair : ages) 
    {
        std::cout << pair.first << ": " << pair.second << std::endl;
    }
    
    // std::wstring容器
    std::vector<std::wstring> chineseNames = {
        L"张三", L"李四", L"王五"
    };
    
    std::wcout.imbue(std::locale(""));
    std::wcout << L"\n=== std::wstring in vector ===" << std::endl;
    for (const auto& name : chineseNames) 
    {
        std::wcout << name << L" ";
    }
    std::wcout << std::endl;
    
    std::map<std::wstring, int> chineseAges = {
        {L"张三", 25},
        {L"李四", 30}
    };
    
    std::wcout << L"\n=== std::wstring in map ===" << std::endl;
    for (const auto& pair : chineseAges) 
    {
        std::wcout << pair.first << L": " << pair.second << std::endl;
    }
}

int main() 
{
    ContainerUsage();
    return 0;
}

```

## 四、字符串字面量前缀

### 4.1 C++11/14字符串前缀

```cpp
#include <iostream>
#include <string>

int main() 
{
    // 无前缀：char字符串
    auto s1 = "Hello";           // const char*
    std::string str1 = "Hello";  // std::string
    
    // L前缀：wchar_t字符串
    auto s2 = L"Hello";          // const wchar_t*
    std::wstring wstr1 = L"你好"; // std::wstring
    
    // u8前缀：UTF-8字符串（C++11）
    auto s3 = u8"Hello 世界";    // const char* (UTF-8编码)
    std::string str2 = u8"你好";  // UTF-8编码的string
    
    // u前缀：char16_t字符串（UTF-16，C++11）
    auto s4 = u"Hello";          // const char16_t*
    std::u16string str3 = u"你好"; // std::u16string
    
    // U前缀：char32_t字符串（UTF-32，C++11）
    auto s5 = U"Hello";          // const char32_t*
    std::u32string str4 = U"你好"; // std::u32string
    
    // R前缀：原始字符串（C++11）
    std::string raw = R"(C:\Users\Path\file.txt)";  // 不需要转义
    std::cout << "原始字符串: " << raw << std::endl;
    
    // 组合使用
    std::wstring rawWide = LR"(C:\用户\路径\文件.txt)";  // 宽字符+原始
    
    // 打印类型大小
    std::cout << "\n=== 字符串类型大小 ===" << std::endl;
    std::cout << "sizeof(s1[0]) = " << sizeof(s1[0]) << std::endl;  // 1
    std::cout << "sizeof(s2[0]) = " << sizeof(s2[0]) << std::endl;  // 2或4
    std::cout << "sizeof(s4[0]) = " << sizeof(s4[0]) << std::endl;  // 2
    std::cout << "sizeof(s5[0]) = " << sizeof(s5[0]) << std::endl;  // 4
    
    return 0;
}

```

### 4.2 前缀对比表

| 前缀 | 类型 | 编码 | 使用场景 |
| --- | --- | --- | --- |
| 无 | char | 平台相关 | ASCII/ANSI |
| L | wchar_t | UTF-16⁄32 | Windows API |
| u8 | char | UTF-8 | 跨平台、Web |
| u | char16_t | UTF-16 | 固定UTF-16 |
| U | char32_t | UTF-32 | 固定UTF-32 |
| R | 原始字符串 | 无转义 | 路径、正则 |

### 4.3 原始字符串示例

```cpp
#include <iostream>
#include <string>

int main() 
{
    // 传统字符串：需要转义
    std::string path1 = "C:\\Users\\Documents\\file.txt";
    std::string json1 = "{\"name\": \"John\", \"age\": 30}";
    std::string regex1 = "\\d{3}-\\d{2}-\\d{4}";
    
    std::cout << "=== 传统字符串 ===" << std::endl;
    std::cout << "路径: " << path1 << std::endl;
    std::cout << "JSON: " << json1 << std::endl;
    std::cout << "正则: " << regex1 << std::endl;
    
    // 原始字符串：不需要转义
    std::string path2 = R"(C:\Users\Documents\file.txt)";
    std::string json2 = R"({"name": "John", "age": 30})";
    std::string regex2 = R"(\d{3}-\d{2}-\d{4})";
    
    std::cout << "\n=== 原始字符串 ===" << std::endl;
    std::cout << "路径: " << path2 << std::endl;
    std::cout << "JSON: " << json2 << std::endl;
    std::cout << "正则: " << regex2 << std::endl;
    
    // 多行原始字符串
    std::string multiline = R"(
        这是第一行
        这是第二行
        这是第三行
    )";
    
    std::cout << "\n=== 多行字符串 ===" << std::endl;
    std::cout << multiline << std::endl;
    
    // 自定义分隔符（当字符串包含 )" 时）
    std::string custom = R"delim(
        字符串中可以包含 )"
        使用自定义分隔符
    )delim";
    
    std::cout << custom << std::endl;
    
    return 0;
}

```

## 五、字符串转换

### 5.1 string与wstring互转

```cpp
#include <iostream>
#include <string>
#include <locale>
#include <codecvt>

// string转wstring（方法1：C++11）
std::wstring StringToWString(const std::string& str) 
{
    std::wstring_convert<std::codecvt_utf8<wchar_t>> converter;
    return converter.from_bytes(str);
}

// wstring转string（方法1：C++11）
std::string WStringToString(const std::wstring& wstr) 
{
    std::wstring_convert<std::codecvt_utf8<wchar_t>> converter;
    return converter.to_bytes(wstr);
}

// string转wstring（方法2：Windows API）
#ifdef _WIN32
#include <Windows.h>

std::wstring StringToWStringWin(const std::string& str) 
{
    if (str.empty()) return std::wstring();
    
    int size = MultiByteToWideChar(CP_UTF8, 0, str.c_str(), -1, nullptr, 0);
    std::wstring result(size, 0);
    MultiByteToWideChar(CP_UTF8, 0, str.c_str(), -1, &result[0], size);
    
    return result;
}

std::string WStringToStringWin(const std::wstring& wstr) 
{
    if (wstr.empty()) return std::string();
    
    int size = WideCharToMultiByte(CP_UTF8, 0, wstr.c_str(), -1, nullptr, 0, nullptr, nullptr);
    std::string result(size, 0);
    WideCharToMultiByte(CP_UTF8, 0, wstr.c_str(), -1, &result[0], size, nullptr, nullptr);
    
    return result;
}
#endif

void ConversionExample() 
{
    std::string str = u8"Hello 世界";
    std::wstring wstr = L"你好 World";
    
    std::cout << "=== 字符串转换示例 ===" << std::endl;
    
    // string → wstring
    std::wstring converted1 = StringToWString(str);
    std::wcout.imbue(std::locale(""));
    std::wcout << L"string → wstring: " << converted1 << std::endl;
    
    // wstring → string
    std::string converted2 = WStringToString(wstr);
    std::cout << "wstring → string: " << converted2 << std::endl;
    
#ifdef _WIN32
    // Windows API方式
    std::wstring converted3 = StringToWStringWin(str);
    std::wcout << L"Windows API转换: " << converted3 << std::endl;
#endif
}

int main() 
{
    ConversionExample();
    return 0;
}

```

### 5.2 数字与wstring互转

```cpp
#include <iostream>
#include <string>
#include <sstream>

void NumberWStringConversion() 
{
    std::wcout.imbue(std::locale(""));
    
    std::cout << "=== 数字转wstring ===" << std::endl;
    
    // 整数转wstring
    int num1 = 12345;
    std::wstring wstr1 = std::to_wstring(num1);
    std::wcout << L"int → wstring: " << wstr1 << std::endl;
    
    // 浮点数转wstring
    double num2 = 3.14159;
    std::wstring wstr2 = std::to_wstring(num2);
    std::wcout << L"double → wstring: " << wstr2 << std::endl;
    
    std::cout << "\n=== wstring转数字 ===" << std::endl;
    
    // wstring转整数
    std::wstring wstr3 = L"98765";
    int num3 = std::stoi(wstr3);
    std::cout << "wstring → int: " << num3 << std::endl;
    
    // wstring转浮点数
    std::wstring wstr4 = L"2.71828";
    double num4 = std::stod(wstr4);
    std::cout << "wstring → double: " << num4 << std::endl;
    
    // 使用wstringstream
    std::cout << "\n=== 使用wstringstream ===" << std::endl;
    
    std::wstringstream wss;
    wss << L"整数: " << 100 << L", 浮点数: " << 3.14;
    std::wcout << wss.str() << std::endl;
    
    // 从wstringstream读取
    std::wstringstream wss2(L"123 456.789");
    int a;
    double b;
    wss2 >> a >> b;
    std::cout << "读取的整数: " << a << ", 浮点数: " << b << std::endl;
}

int main() 
{
    NumberWStringConversion();
    return 0;
}

```

### 5.3 各种编码转换

```cpp
#include <iostream>
#include <string>
#include <codecvt>
#include <locale>

void EncodingConversion() 
{
    // UTF-8字符串
    std::string utf8Str = u8"Hello 世界 🌍";
    
    // UTF-8 → UTF-16
    std::wstring_convert<std::codecvt_utf8_utf16<char16_t>, char16_t> utf16Converter;
    std::u16string utf16Str = utf16Converter.from_bytes(utf8Str);
    
    std::cout << "UTF-8长度: " << utf8Str.length() << " 字节" << std::endl;
    std::cout << "UTF-16长度: " << utf16Str.length() << " 个char16_t" << std::endl;
    
    // UTF-8 → UTF-32
    std::wstring_convert<std::codecvt_utf8<char32_t>, char32_t> utf32Converter;
    std::u32string utf32Str = utf32Converter.from_bytes(utf8Str);
    
    std::cout << "UTF-32长度: " << utf32Str.length() << " 个char32_t" << std::endl;
    
    // UTF-16 → UTF-8
    std::string backToUtf8 = utf16Converter.to_bytes(utf16Str);
    std::cout << "转回UTF-8: " << backToUtf8 << std::endl;
    
    // 打印每个字符的码点
    std::cout << "\n=== UTF-32码点 ===" << std::endl;
    for (char32_t c : utf32Str) 
    {
        std::cout << "U+" << std::hex << (int)c << " ";
    }
    std::cout << std::dec << std::endl;
}

int main() 
{
    EncodingConversion();
    return 0;
}

/* 输出:
UTF-8长度: 16 字节
UTF-16长度: 10 个char16_t
UTF-32长度: 10 个char32_t
转回UTF-8: Hello 世界 🌍

=== UTF-32码点 ===
U+48 U+65 U+6c U+6c U+6f U+20 U+4e16 U+754c U+20 U+1f30d
*/

```

## 六、跨平台字符串处理

### 6.1 跨平台宏定义

```cpp
#include <iostream>
#include <string>

// 跨平台字符类型
#ifdef _WIN32
    typedef wchar_t tchar;
    typedef std::wstring tstring;
    #define T(x) L##x
    #define tcout std::wcout
#else
    typedef char tchar;
    typedef std::string tstring;
    #define T(x) x
    #define tcout std::cout
#endif

void CrossPlatformExample() 
{
    // 使用统一的类型
    tstring str = T("Hello World");
    tchar ch = T('A');
    
    tcout << T("跨平台字符串: ") << str << std::endl;
    std::cout << "字符大小: " << sizeof(tchar) << " 字节" << std::endl;
}

int main() 
{
    CrossPlatformExample();
    return 0;
}

```

### 6.2 文件路径处理

```cpp
#include <iostream>
#include <string>
#include <filesystem>  // C++17

namespace fs = std::filesystem;

void PathHandling() 
{
    std::cout << "=== 文件路径处理 ===" << std::endl;
    
    // C++17 filesystem支持UTF-8
    fs::path path1 = u8"C:/用户/文档/文件.txt";
    
    std::cout << "路径: " << path1.string() << std::endl;
    std::cout << "父路径: " << path1.parent_path().string() << std::endl;
    std::cout << "文件名: " << path1.filename().string() << std::endl;
    std::cout << "扩展名: " << path1.extension().string() << std::endl;
    
    // Windows宽字符路径
#ifdef _WIN32
    fs::path path2 = L"C:\\用户\\文档\\文件.txt";
    std::wcout.imbue(std::locale(""));
    std::wcout << L"Windows路径: " << path2.wstring() << std::endl;
#endif
    
    // 路径拼接
    fs::path basePath = u8"C:/项目";
    fs::path fullPath = basePath / u8"源代码" / u8"main.cpp";
    std::cout << "拼接路径: " << fullPath.string() << std::endl;
}

int main() 
{
    PathHandling();
    return 0;
}

```

### 6.3 文件读写

```cpp
#include <iostream>
#include <fstream>
#include <string>
#include <codecvt>

void FileIOExample() 
{
    std::cout << "=== 宽字符文件读写 ===" << std::endl;
    
    // 写入wstring到文件（UTF-8编码）
    {
        std::wofstream file("test_wide.txt");
        file.imbue(std::locale(std::locale(), new std::codecvt_utf8<wchar_t>));
        
        file << L"你好世界" << std::endl;
        file << L"Hello World" << std::endl;
        file << L"こんにちは" << std::endl;
        
        std::cout << "写入完成" << std::endl;
    }
    
    // 从文件读取wstring（UTF-8编码）
    {
        std::wifstream file("test_wide.txt");
        file.imbue(std::locale(std::locale(), new std::codecvt_utf8<wchar_t>));
        
        std::wstring line;
        std::wcout.imbue(std::locale(""));
        
        std::wcout << L"\n读取内容:" << std::endl;
        while (std::getline(file, line)) 
        {
            std::wcout << line << std::endl;
        }
    }
    
    // 写入string到文件（UTF-8编码）
    {
        std::ofstream file("test_utf8.txt");
        file << u8"UTF-8编码的文本" << std::endl;
        file << u8"支持中文" << std::endl;
    }
    
    // 读取string从文件
    {
        std::ifstream file("test_utf8.txt");
        std::string line;
        
        std::cout << "\n读取UTF-8文件:" << std::endl;
        while (std::getline(file, line)) 
        {
            std::cout << line << std::endl;
        }
    }
}

int main() 
{
    FileIOExample();
    return 0;
}

```

## 七、实战案例

### 案例1：多语言游戏文本系统

```cpp
#include <iostream>
#include <string>
#include <map>
#include <vector>

class LocalizationManager 
{
private:
    std::wstring currentLanguage;
    std::map<std::wstring, std::map<std::wstring, std::wstring>> texts;
    
public:
    LocalizationManager() : currentLanguage(L"en") 
    {
        LoadTexts();
    }
    
    void LoadTexts() 
    {
        // 英文
        texts[L"en"][L"welcome"] = L"Welcome to the game!";
        texts[L"en"][L"start"] = L"Start Game";
        texts[L"en"][L"quit"] = L"Quit";
        texts[L"en"][L"score"] = L"Score: {0}";
        
        // 中文
        texts[L"zh"][L"welcome"] = L"欢迎来到游戏！";
        texts[L"zh"][L"start"] = L"开始游戏";
        texts[L"zh"][L"quit"] = L"退出";
        texts[L"zh"][L"score"] = L"分数：{0}";
        
        // 日文
        texts[L"jp"][L"welcome"] = L"ゲームへようこそ！";
        texts[L"jp"][L"start"] = L"スタート";
        texts[L"jp"][L"quit"] = L"終了";
        texts[L"jp"][L"score"] = L"スコア：{0}";
    }
    
    void SetLanguage(const std::wstring& lang) 
    {
        if (texts.find(lang) != texts.end()) 
        {
            currentLanguage = lang;
            std::wcout << L"语言切换到: " << lang << std::endl;
        }
    }
    
    std::wstring GetText(const std::wstring& key) const 
    {
        auto langIt = texts.find(currentLanguage);
        if (langIt != texts.end()) 
        {
            auto textIt = langIt->second.find(key);
            if (textIt != langIt->second.end()) 
            {
                return textIt->second;
            }
        }
        return L"[Missing: " + key + L"]";
    }
    
    std::wstring GetFormattedText(const std::wstring& key, const std::wstring& arg) const 
    {
        std::wstring text = GetText(key);
        size_t pos = text.find(L"{0}");
        if (pos != std::wstring::npos) 
        {
            text.replace(pos, 3, arg);
        }
        return text;
    }
    
    void PrintMenu() const 
    {
        std::wcout << L"\n=== " << GetText(L"welcome") << L" ===" << std::endl;
        std::wcout << L"1. " << GetText(L"start") << std::endl;
        std::wcout << L"2. " << GetText(L"quit") << std::endl;
        std::wcout << GetFormattedText(L"score", L"1234") << std::endl;
    }
};

int main() 
{
    std::wcout.imbue(std::locale(""));
    
    LocalizationManager locManager;
    
    // 测试英文
    locManager.SetLanguage(L"en");
    locManager.PrintMenu();
    
    // 测试中文
    locManager.SetLanguage(L"zh");
    locManager.PrintMenu();
    
    // 测试日文
    locManager.SetLanguage(L"jp");
    locManager.PrintMenu();
    
    return 0;
}

/* 输出:
语言切换到: en

=== Welcome to the game! ===
1. Start Game
2. Quit
Score: 1234

语言切换到: zh

=== 欢迎来到游戏！ ===
1. 开始游戏
2. 退出
分数：1234

语言切换到: jp

=== ゲームへようこそ！ ===
1. スタート
2. 終了
スコア：1234
*/

```

### 案例2：跨平台配置文件读取

```cpp
#include <iostream>
#include <fstream>
#include <string>
#include <map>
#include <sstream>
#include <codecvt>

class ConfigManager 
{
private:
    std::map<std::wstring, std::wstring> config;
    
public:
    bool LoadFromFile(const std::string& filename) 
    {
        std::wifstream file(filename);
        if (!file.is_open()) 
        {
            std::cerr << "无法打开配置文件: " << filename << std::endl;
            return false;
        }
        
        // 设置UTF-8编码
        file.imbue(std::locale(std::locale(), new std::codecvt_utf8<wchar_t>));
        
        std::wstring line;
        int lineNum = 0;
        
        while (std::getline(file, line)) 
        {
            lineNum++;
            
            // 跳过空行和注释
            if (line.empty() || line[0] == L'#') 
            {
                continue;
            }
            
            // 解析 key=value
            size_t pos = line.find(L'=');
            if (pos != std::wstring::npos) 
            {
                std::wstring key = line.substr(0, pos);
                std::wstring value = line.substr(pos + 1);
                
                // 去除首尾空格
                key = Trim(key);
                value = Trim(value);
                
                config[key] = value;
            }
        }
        
        std::cout << "成功加载 " << config.size() << " 个配置项" << std::endl;
        return true;
    }
    
    std::wstring Get(const std::wstring& key, const std::wstring& defaultValue = L"") const 
    {
        auto it = config.find(key);
        return (it != config.end()) ? it->second : defaultValue;
    }
    
    int GetInt(const std::wstring& key, int defaultValue = 0) const 
    {
        std::wstring value = Get(key);
        if (value.empty()) return defaultValue;
        
        try 
        {
            return std::stoi(value);
        }
        catch (...) 
        {
            return defaultValue;
        }
    }
    
    double GetDouble(const std::wstring& key, double defaultValue = 0.0) const 
    {
        std::wstring value = Get(key);
        if (value.empty()) return defaultValue;
        
        try 
        {
            return std::stod(value);
        }
        catch (...) 
        {
            return defaultValue;
        }
    }
    
    void Print() const 
    {
        std::wcout.imbue(std::locale(""));
        std::wcout << L"\n=== 配置信息 ===" << std::endl;
        
        for (const auto& pair : config) 
        {
            std::wcout << pair.first << L" = " << pair.second << std::endl;
        }
    }
    
private:
    static std::wstring Trim(const std::wstring& str) 
    {
        size_t start = str.find_first_not_of(L" \t\r\n");
        if (start == std::wstring::npos) return L"";
        
        size_t end = str.find_last_not_of(L" \t\r\n");
        return str.substr(start, end - start + 1);
    }
};

void CreateSampleConfig() 
{
    std::wofstream file("game_config.txt");
    file.imbue(std::locale(std::locale(), new std::codecvt_utf8<wchar_t>));
    
    file << L"# 游戏配置文件" << std::endl;
    file << L"游戏名称=我的游戏" << std::endl;
    file << L"窗口宽度=1920" << std::endl;
    file << L"窗口高度=1080" << std::endl;
    file << L"音量=0.8" << std::endl;
    file << L"语言=中文" << std::endl;
    file << L"全屏=true" << std::endl;
    file << std::endl;
    file << L"# 玩家设置" << std::endl;
    file << L"玩家名称=张三" << std::endl;
}

int main() 
{
    // 创建示例配置文件
    CreateSampleConfig();
    
    // 加载并读取配置
    ConfigManager config;
    
    if (config.LoadFromFile("game_config.txt")) 
    {
        config.Print();
        
        // 读取特定配置
        std::wcout.imbue(std::locale(""));
        std::wcout << L"\n=== 读取配置 ===" << std::endl;
        std::wcout << L"游戏名称: " << config.Get(L"游戏名称") << std::endl;
        std::wcout << L"玩家名称: " << config.Get(L"玩家名称") << std::endl;
        
        std::cout << "窗口宽度: " << config.GetInt(L"窗口宽度") << std::endl;
        std::cout << "窗口高度: " << config.GetInt(L"窗口高度") << std::endl;
        std::cout << "音量: " << config.GetDouble(L"音量") << std::endl;
    }
    
    return 0;
}

```

### 案例3：聊天系统消息处理

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <chrono>
#include <iomanip>
#include <sstream>

class ChatMessage 
{
private:
    std::wstring sender;
    std::wstring content;
    std::chrono::system_clock::time_point timestamp;
    
public:
    ChatMessage(const std::wstring& s, const std::wstring& c) 
        : sender(s), content(c), timestamp(std::chrono::system_clock::now()) {}
    
    std::wstring GetFormattedMessage() const 
    {
        // 格式化时间
        auto time = std::chrono::system_clock::to_time_t(timestamp);
        std::tm tm;
#ifdef _WIN32
        localtime_s(&tm, &time);
#else
        localtime_r(&time, &tm);
#endif
        
        std::wostringstream oss;
        oss << L"[" << std::put_time(&tm, L"%H:%M:%S") << L"] "
            << sender << L": " << content;
        
        return oss.str();
    }
    
    const std::wstring& GetSender() const { return sender; }
    const std::wstring& GetContent() const { return content; }
};

class ChatSystem 
{
private:
    std::vector<ChatMessage> messages;
    std::wstring currentUser;
    
public:
    void SetCurrentUser(const std::wstring& user) 
    {
        currentUser = user;
    }
    
    void SendMessage(const std::wstring& content) 
    {
        if (currentUser.empty()) 
        {
            std::wcout << L"错误：未设置用户名" << std::endl;
            return;
        }
        
        messages.emplace_back(currentUser, content);
        std::wcout << L"✓ 消息已发送" << std::endl;
    }
    
    void PrintMessages(size_t count = 10) const 
    {
        std::wcout << L"\n=== 聊天记录 ===" << std::endl;
        
        size_t start = (messages.size() > count) ? messages.size() - count : 0;
        
        for (size_t i = start; i < messages.size(); i++) 
        {
            std::wcout << messages[i].GetFormattedMessage() << std::endl;
        }
    }
    
    void SearchMessages(const std::wstring& keyword) const 
    {
        std::wcout << L"\n=== 搜索: \"" << keyword << L"\" ===" << std::endl;
        
        bool found = false;
        for (const auto& msg : messages) 
        {
            if (msg.GetContent().find(keyword) != std::wstring::npos) 
            {
                std::wcout << msg.GetFormattedMessage() << std::endl;
                found = true;
            }
        }
        
        if (!found) 
        {
            std::wcout << L"未找到匹配的消息" << std::endl;
        }
    }
    
    void FilterByUser(const std::wstring& user) const 
    {
        std::wcout << L"\n=== 用户 \"" << user << L"\" 的消息 ===" << std::endl;
        
        bool found = false;
        for (const auto& msg : messages) 
        {
            if (msg.GetSender() == user) 
            {
                std::wcout << msg.GetFormattedMessage() << std::endl;
                found = true;
            }
        }
        
        if (!found) 
        {
            std::wcout << L"该用户没有消息" << std::endl;
        }
    }
};

int main() 
{
    std::wcout.imbue(std::locale(""));
    
    ChatSystem chat;
    
    // 模拟多用户聊天
    chat.SetCurrentUser(L"张三");
    chat.SendMessage(L"大家好！");
    chat.SendMessage(L"今天天气不错");
    
    chat.SetCurrentUser(L"李四");
    chat.SendMessage(L"你好张三");
    chat.SendMessage(L"确实，天气很好");
    
    chat.SetCurrentUser(L"王五");
    chat.SendMessage(L"Hello everyone!");
    chat.SendMessage(L"有人要组队吗？");
    
    chat.SetCurrentUser(L"张三");
    chat.SendMessage(L"我可以组队");
    
    // 显示所有消息
    chat.PrintMessages();
    
    // 搜索消息
    chat.SearchMessages(L"天气");
    
    // 按用户过滤
    chat.FilterByUser(L"张三");
    
    return 0;
}

```

### 案例4：文件名处理工具

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <filesystem>
#include <algorithm>

namespace fs = std::filesystem;

class FileNameProcessor 
{
public:
    // 批量重命名文件
    static void BatchRename(const std::wstring& directory, 
                           const std::wstring& prefix) 
    {
        std::wcout << L"=== 批量重命名 ===" << std::endl;
        std::wcout << L"目录: " << directory << std::endl;
        std::wcout << L"前缀: " << prefix << std::endl;
        
        try 
        {
            int count = 0;
            for (const auto& entry : fs::directory_iterator(directory)) 
            {
                if (entry.is_regular_file()) 
                {
                    fs::path oldPath = entry.path();
                    std::wstring extension = oldPath.extension().wstring();
                    
                    std::wstring newName = prefix + std::to_wstring(++count) + extension;
                    fs::path newPath = oldPath.parent_path() / newName;
                    
                    std::wcout << L"重命名: " << oldPath.filename().wstring() 
                              << L" → " << newName << std::endl;
                    
                    // fs::rename(oldPath, newPath);  // 实际重命名
                }
            }
            
            std::wcout << L"完成，共处理 " << count << L" 个文件" << std::endl;
        }
        catch (const std::exception& e) 
        {
            std::cerr << "错误: " << e.what() << std::endl;
        }
    }
    
    // 查找包含特定文本的文件
    static void FindFiles(const std::wstring& directory, 
                         const std::wstring& keyword) 
    {
        std::wcout << L"\n=== 查找文件 ===" << std::endl;
        std::wcout << L"目录: " << directory << std::endl;
        std::wcout << L"关键词: " << keyword << std::endl;
        
        try 
        {
            std::vector<std::wstring> matches;
            
            for (const auto& entry : fs::recursive_directory_iterator(directory)) 
            {
                if (entry.is_regular_file()) 
                {
                    std::wstring filename = entry.path().filename().wstring();
                    
                    if (filename.find(keyword) != std::wstring::npos) 
                    {
                        matches.push_back(entry.path().wstring());
                    }
                }
            }
            
            std::wcout << L"\n找到 " << matches.size() << L" 个匹配文件:" << std::endl;
            for (const auto& path : matches) 
            {
                std::wcout << L"  " << path << std::endl;
            }
        }
        catch (const std::exception& e) 
        {
            std::cerr << "错误: " << e.what() << std::endl;
        }
    }
    
    // 按扩展名分类文件
    static void CategorizeByExtension(const std::wstring& directory) 
    {
        std::wcout << L"\n=== 按扩展名分类 ===" << std::endl;
        
        std::map<std::wstring, std::vector<std::wstring>> categories;
        
        try 
        {
            for (const auto& entry : fs::directory_iterator(directory)) 
            {
                if (entry.is_regular_file()) 
                {
                    std::wstring ext = entry.path().extension().wstring();
                    if (ext.empty()) ext = L"(无扩展名)";
                    
                    categories[ext].push_back(entry.path().filename().wstring());
                }
            }
            
            for (const auto& pair : categories) 
            {
                std::wcout << L"\n" << pair.first << L" (" << pair.second.size() << L" 个文件):" << std::endl;
                
                for (const auto& filename : pair.second) 
                {
                    std::wcout << L"  " << filename << std::endl;
                }
            }
        }
        catch (const std::exception& e) 
        {
            std::cerr << "错误: " << e.what() << std::endl;
        }
    }
};

int main() 
{
    std::wcout.imbue(std::locale(""));
    
    // 示例用法（请根据实际路径修改）
    std::wstring testDir = L"./test_files";
    
    // 创建测试目录和文件（示例）
    try 
    {
        fs::create_directory(testDir);
        
        // 创建一些测试文件
        std::vector<std::wstring> testFiles = {
            L"文档1.txt",
            L"图片1.jpg",
            L"代码文件.cpp",
            L"数据.xlsx"
        };
        
        for (const auto& filename : testFiles) 
        {
            fs::path filepath = fs::path(testDir) / filename;
            std::wofstream(filepath).close();
        }
        
        std::wcout << L"创建测试文件完成" << std::endl;
    }
    catch (...) {}
    
    // 演示功能
    // FileNameProcessor::BatchRename(testDir, L"新文件_");
    FileNameProcessor::FindFiles(testDir, L"文");
    FileNameProcessor::CategorizeByExtension(testDir);
    
    return 0;
}

```

## 八、新手常见错误

### ❌ 错误1：混用char和wchar_t

```cpp
#include <iostream>
#include <string>

void MixingCharTypes() 
{
    // ❌ 错误：char*和wchar_t*混用
    const char* str1 = "Hello";
    // const wchar_t* str2 = str1;  // 编译错误！
    
    // ❌ 错误：string和wstring混用
    std::string s1 = "Hello";
    // std::wstring s2 = s1;  // 编译错误！
    
    // ❌ 错误：忘记L前缀
    // std::wstring ws = "Hello";  // 编译错误！
    std::wstring ws = L"Hello";  // ✅ 正确
    
    // ❌ 错误：cout输出wstring
    std::wstring wstr = L"你好";
    // std::cout << wstr << std::endl;  // 编译错误或乱码
    
    // ✅ 正确：使用wcout
    std::wcout.imbue(std::locale(""));
    std::wcout << wstr << std::endl;
}

int main() 
{
    MixingCharTypes();
    return 0;
}

```

### ❌ 错误2：编码不匹配导致乱码

```cpp
#include <iostream>
#include <fstream>
#include <string>

void EncodingMismatch() 
{
    // ❌ 写入时用UTF-8，读取时不指定编码
    {
        std::ofstream file("test.txt");
        file << u8"中文内容" << std::endl;
    }
    
    {
        std::ifstream file("test.txt");
        std::string content;
        std::getline(file, content);
        std::cout << "读取内容: " << content << std::endl;  // 可能乱码
    }
    
    // ✅ 正确：使用一致的编码
    {
        std::wofstream file("test_wide.txt");
        file.imbue(std::locale(std::locale(), new std::codecvt_utf8<wchar_t>));
        file << L"中文内容" << std::endl;
    }
    
    {
        std::wifstream file("test_wide.txt");
        file.imbue(std::locale(std::locale(), new std::codecvt_utf8<wchar_t>));
        
        std::wstring content;
        std::getline(file, content);
        
        std::wcout.imbue(std::locale(""));
        std::wcout << L"读取内容: " << content << std::endl;  // ✅ 正确显示
    }
}

int main() 
{
    EncodingMismatch();
    return 0;
}

```

### ❌ 错误3：wchar_t大小假设错误

```cpp
#include <iostream>
#include <cstring>

void WcharSizeAssumption() 
{
    wchar_t wstr[] = L"Hello";
    
    // ❌ 错误：假设wchar_t总是2字节
    // size_t bytes = wcslen(wstr) * 2;  // 在Linux上错误（wchar_t是4字节）
    
    // ✅ 正确：使用sizeof
    size_t bytes = wcslen(wstr) * sizeof(wchar_t);
    
    std::cout << "字符串长度: " << wcslen(wstr) << " 字符" << std::endl;
    std::cout << "占用空间: " << bytes << " 字节" << std::endl;
    std::cout << "wchar_t大小: " << sizeof(wchar_t) << " 字节" << std::endl;
}

int main() 
{
    WcharSizeAssumption();
    return 0;
}

```

### ❌ 错误4：字符串转换时的内存问题

```cpp
#include <iostream>
#include <string>
#include <codecvt>

void ConversionMemoryIssues() 
{
    // ❌ 错误：返回临时对象的指针
    /*
    const char* BadConvert(const std::wstring& wstr) 
    {
        std::wstring_convert<std::codecvt_utf8<wchar_t>> converter;
        std::string str = converter.to_bytes(wstr);
        return str.c_str();  // ⚠️ str是局部变量，函数结束后被销毁
    }
    */
    
    // ✅ 正确：返回string
    std::string GoodConvert(const std::wstring& wstr) 
    {
        std::wstring_convert<std::codecvt_utf8<wchar_t>> converter;
        return converter.to_bytes(wstr);
    }
    
    std::wstring wstr = L"测试";
    std::string result = GoodConvert(wstr);
    std::cout << "转换结果: " << result << std::endl;
}

int main() 
{
    ConversionMemoryIssues();
    return 0;
}

```

### ❌ 错误5：未设置locale导致输出失败

```cpp
#include <iostream>
#include <string>

void LocaleIssue() 
{
    std::wstring wstr = L"你好世界";
    
    // ❌ 未设置locale，可能无法正确输出
    // std::wcout << wstr << std::endl;  // 可能输出乱码或失败
    
    // ✅ 正确：设置locale
    std::wcout.imbue(std::locale(""));  // 使用系统默认locale
    std::wcout << wstr << std::endl;
    
    // ✅ 或者设置特定locale
    try 
    {
        std::wcout.imbue(std::locale("zh_CN.UTF-8"));
        std::wcout << L"使用中文locale" << std::endl;
    }
    catch (const std::exception& e) 
    {
        std::cerr << "Locale设置失败: " << e.what() << std::endl;
    }
}

int main() 
{
    LocaleIssue();
    return 0;
}

```

## 九、虚幻引擎中的字符串系统

### 9.1 FString与TCHAR

```cpp
// UE的字符串系统

// TCHAR：平台相关的字符类型
// Windows: wchar_t (UTF-16)
// 其他平台: char (UTF-8)

// FString：UE的字符串类，基于TCHAR
FString MyString = TEXT("Hello World");
FString ChineseString = TEXT("你好世界");

// TEXT宏：自动添加适当的前缀
// Windows: TEXT("Hello") → L"Hello"
// 其他: TEXT("Hello") → "Hello"

void UEStringExample() 
{
    // 创建FString
    FString Str1 = TEXT("Hello");
    FString Str2(TEXT("World"));
    
    // 连接
    FString Str3 = Str1 + TEXT(" ") + Str2;
    
    // 格式化
    int32 Score = 100;
    FString Formatted = FString::Printf(TEXT("Score: %d"), Score);
    
    // 比较
    if (Str1.Equals(TEXT("Hello"))) 
    {
        UE_LOG(LogTemp, Warning, TEXT("字符串相等"));
    }
    
    // 查找
    int32 Index = Str3.Find(TEXT("World"));
    
    // 替换
    FString Replaced = Str3.Replace(TEXT("World"), TEXT("UE5"));
    
    // 转换
    FString Upper = Str1.ToUpper();
    FString Lower = Str1.ToLower();
}

```

### 9.2 FString与std::string/wstring互转

```cpp
#include "CoreMinimal.h"

void UEStringConversion() 
{
    // FString → std::string
    FString UEStr = TEXT("Hello UE5");
    std::string StdStr = TCHAR_TO_UTF8(*UEStr);
    
    // std::string → FString
    std::string StdStr2 = "Hello STL";
    FString UEStr2 = UTF8_TO_TCHAR(StdStr2.c_str());
    
    // FString → std::wstring (Windows)
#ifdef _WIN32
    std::wstring WStr = *UEStr;
    
    // std::wstring → FString (Windows)
    std::wstring WStr2 = L"Hello Wide";
    FString UEStr3 = WStr2.c_str();
#endif
    
    // FString → const char*
    const char* CStr = TCHAR_TO_ANSI(*UEStr);
    
    // const char* → FString
    const char* CStr2 = "Hello C";
    FString UEStr4 = ANSI_TO_TCHAR(CStr2);
}

```

### 9.3 FText：本地化文本

```cpp
// FText：用于本地化的文本

void UETextExample() 
{
    // 创建可本地化的文本
    FText LocalizedText = NSLOCTEXT("GameNamespace", "WelcomeKey", "Welcome to the game!");
    
    // 使用宏简化
    FText SimpleText = LOCTEXT("HelloKey", "Hello World");
    
    // 格式化FText
    FText PlayerName = FText::FromString(TEXT("Player1"));
    FText Score = FText::AsNumber(1234);
    
    FText FormattedText = FText::Format(
        LOCTEXT("ScoreFormat", "{0} scored {1} points!"),
        PlayerName,
        Score
    );
    
    // 显示
    UE_LOG(LogTemp, Warning, TEXT("%s"), *FormattedText.ToString());
}

```

### 9.4 FName：高效的字符串标识符

```cpp
// FName：用于快速比较的字符串

void UENameExample() 
{
    // 创建FName
    FName Name1(TEXT("MyActor"));
    FName Name2(TEXT("MyActor"));
    
    // 快速比较（只比较索引）
    if (Name1 == Name2)  // 非常快！
    {
        UE_LOG(LogTemp, Warning, TEXT("Names are equal"));
    }
    
    // 用于标签、资产名称等
    FName TagName(TEXT("Player"));
    FName AssetName(TEXT("BP_Character"));
    
    // FName → FString
    FString NameStr = Name1.ToString();
    
    // FString → FName
    FString Str = TEXT("NewName");
    FName NewName(*Str);
}

```

### 9.5 UE字符串最佳实践

```cpp
UCLASS()
class MYGAME_API AMyActor : public AActor 
{
    GENERATED_BODY()
    
public:
    // ✅ 使用FString存储可变文本
    UPROPERTY(EditAnywhere, Category = "Info")
    FString Description;
    
    // ✅ 使用FText存储UI文本（支持本地化）
    UPROPERTY(EditAnywhere, Category = "Info")
    FText DisplayName;
    
    // ✅ 使用FName存储标识符
    UPROPERTY(EditAnywhere, Category = "Info")
    FName ActorTag;
    
    void ProcessStrings() 
    {
        // ❌ 避免频繁的字符串操作
        for (int32 i = 0; i < 10000; i++) 
        {
            // FString Temp = FString::Printf(TEXT("Item_%d"), i);  // 慢
        }
        
        // ✅ 使用StringBuilder
        FString Result;
        Result.Reserve(10000 * 10);  // 预分配
        for (int32 i = 0; i < 10000; i++) 
        {
            Result += FString::Printf(TEXT("Item_%d,"), i);
        }
        
        // ✅ 使用TArray存储多个字符串
        TArray<FString> Items;
        Items.Reserve(10000);
        for (int32 i = 0; i < 10000; i++) 
        {
            Items.Add(FString::Printf(TEXT("Item_%d"), i));
        }
    }
};

```

## 十、最佳实践

### 决策流程

```cpp
需要处理多语言文本？
    │
    ├─ 是 → 使用wchar_t/wstring
    │       或 char16_t/u16string
    │       或 UE的FString（推荐）
    │
    ├─ 仅ASCII/英文？
    │   └─ 使用char/string（更高效）
    │
    ├─ 跨平台？
    │   ├─ 使用char16_t/char32_t（C++11）
    │   └─ 或使用UTF-8 (char with u8 prefix)
    │
    └─ Windows特定？
        └─ 可以使用wchar_t/wstring
```

### 核心建议

✅ 推荐做法：

1. UTF-8为主：使用std::string + u8前缀 std::string text = u8”支持多语言”;

1. 跨平台：使用char16_t/char32_t std::u16string text = u”固定UTF-16”;

1. UE开发：使用FString + TEXT宏 FString text = TEXT(“UE标准写法”);

1. 文件操作：明确指定编码 file.imbue(std::locale(std::locale(), new std::codecvt_utf8));

1. 字符串转换：使用std::wstring_convert 或平台API（Windows: MultiByteToWideChar）

❌ 避免做法：

1. 避免假设wchar_t大小 ❌ size_t bytes = len * 2; ✅ size_t bytes = len * sizeof(wchar_t);

1. 避免混用char和wchar_t ❌ std::wstring ws = “Hello”; ✅ std::wstring ws = L”Hello”;

1. 避免忘记设置locale ✅ std::wcout.imbue(std::locale(“”));

1. 避免编码不一致 ✅ 读写文件时保持编码一致

1. 避免在UE中使用std::wstring ✅ 使用FString代替

### 性能考虑

```cpp
// 性能对比

// char/string：最快（1字节）
std::string str = "Hello";  // 5字节

// wchar_t/wstring：较慢（2或4字节）
std::wstring wstr = L"Hello";  // 10或20字节

// char16_t：中等（2字节，固定）
std::u16string u16str = u"Hello";  // 10字节

// char32_t：慢（4字节，固定）
std::u32string u32str = U"Hello";  // 20字节

// 建议：
// 1. 纯英文用char/string
// 2. 多语言用UTF-8 (char with u8)
// 3. UE开发用FString

```

今天的知识点你都有Get到吗~

有没有什么疑问，我们在评论区见哦~

你们也可以告诉我有什么是你们想知道的

![](./image-1.jpg)

![](./image-2.jpg)
