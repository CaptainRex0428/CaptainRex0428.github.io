---
title: "重启RestArt EasyTA｜Swizzle实现（下）"
description: "Swizzle上篇传送门——实现原理 上一篇我们详细分析了Swizzle的实现原理，这一篇作为补充将Swizzle相关的算数运算方法补齐以适配更多场景的需要 本身在上篇觉得可以不说这些算数运算符，但自…"
category: tools
tags: ['EasyTA', 'UE', '材质', '技术美术']
date: 2025-10-20
readTime: 4
heroImage: "./cover.webp"
published: true
---
Swizzle上篇传送门——实现原理

上一篇我们详细分析了Swizzle的实现原理，这一篇作为补充将Swizzle相关的算数运算方法补齐以适配更多场景的需要

> 本身在上篇觉得可以不说这些算数运算符，但自己完整实现了一遍发现还是有一些小细节需要注意

在设计之前我们需要明确Swizzle中比较特殊的一个维度就是1D Swizzle，因为其他Swizzle会返回Vector，但只有1D Swizzle会返回要么是一个标量，要么是另一个Swizzle维度的Vector，所以对于所有1D Swizzle都需要进行单独处理来保证所有情况下可以不经过隐式转换

所以在下面的生命中会大量用到模板判断，比如template&lt;size_t D = swizzle_dim, size_t otherDimension, int OtherIndex&gt; typename std::enable_if_t&lt;D ==1, T&gt; 这就限制了函数在1D Swizzle中生效， template&lt;int OtherIndex, size_t D = swizzle_dim&gt; typename std::enable_if_t&lt;(D &gt;1), Vector&lt;T, swizzle_dim&gt;&gt; 限制了函数在其他维度的Swizzle中生效

## Swizzle内部声明

### 1D Swizzle 与 1D Swizzle 运算（返回标量）

这里特殊处理两个1D Swizzle之间的加减乘除运算，为的是满足Vector.x这类一维Swizzle的返回值不会是Vector&lt;T,1&gt;，而是一个类型为T的值

```cpp
template<size_t D = swizzle_dim, size_t otherDimension, int OtherIndex>
typename std::enable_if_t<D == 1, T> 
operator+(const Swizzle<T, otherDimension, OtherIndex>& other) const
{
    static_assert(check_indices(), "left swizzle index out of bounds");
    static_assert(other.check_indices(), "right swizzle index out of bounds");
    return T(*this) + T(other);
}

template<size_t D = swizzle_dim, size_t otherDimension, int OtherIndex>
typename std::enable_if_t<D == 1, T> 
operator-(const Swizzle<T, otherDimension, OtherIndex>& other) const
{
    static_assert(check_indices(), "left swizzle index out of bounds");
    static_assert(other.check_indices(), "right swizzle index out of bounds");
    return T(*this) - T(other);
}

template<size_t D = swizzle_dim, size_t otherDimension, int OtherIndex>
typename std::enable_if_t<D == 1, T> 
operator*(const Swizzle<T, otherDimension, OtherIndex>& other) const
{
    static_assert(check_indices(), "left swizzle index out of bounds");
    static_assert(other.check_indices(), "right swizzle index out of bounds");
    return T(*this) * T(other);
}

template<size_t D = swizzle_dim, size_t otherDimension, int OtherIndex>
typename std::enable_if_t<D == 1, T> 
operator/(const Swizzle<T, otherDimension, OtherIndex>& other) const
{
    static_assert(check_indices(), "left swizzle index out of bounds");
    static_assert(other.check_indices(), "right swizzle index out of bounds");
    return T(*this) / T(other);
}

```

### 1D Swizzle 与不同维度 Swizzle 运算（广播）

这里要注意1D Swizzle 除去或者减去另一个非1D的Swizzle，在语义上都说不通，所以会忽略掉减法和除法

```cpp
template<size_t D = swizzle_dim, int... OtherIndices>
typename std::enable_if_t<D == 1 && (sizeof...(OtherIndices) > 1), Vector<T, sizeof...(OtherIndices)>> 
operator+(const Swizzle<T, dimension, OtherIndices...>& other) const
{
    static_assert(check_indices(), "left swizzle index out of bounds");
    static_assert(other.check_indices(), "right swizzle index out of bounds");
    constexpr size_t other_dim = sizeof...(OtherIndices);
    return Vector<T, other_dim>(other) + T(*this);
}

template<size_t D = swizzle_dim, int... OtherIndices>
typename std::enable_if_t<D == 1 && (sizeof...(OtherIndices) > 1), Vector<T, sizeof...(OtherIndices)>> 
operator*(const Swizzle<T, dimension, OtherIndices...>& other) const
{
    static_assert(check_indices(), "left swizzle index out of bounds");
    static_assert(other.check_indices(), "right swizzle index out of bounds");
    constexpr size_t other_dim = sizeof...(OtherIndices);
    return Vector<T, other_dim>(other) * T(*this);
}

```

### Swizzle 与 Swizzle 运算

swizzle + 1D swizzle

这里依然是特殊考虑1D swizzle的特殊性，但Swizzle在前， 不需要再特意排除减法和除法

```cpp
template<int OtherIndex, size_t D = swizzle_dim>
typename std::enable_if_t<(D > 1), Vector<T, swizzle_dim>> 
operator+(const Swizzle<T, dimension, OtherIndex>& other) const
{
    static_assert(check_indices(), "Left swizzle index out of bounds");
    
    Vector<T, swizzle_dim> lhs = *this;
    T scalar_value = T(other);
    return lhs + scalar_value;
}

template<int OtherIndex, size_t D = swizzle_dim>
typename std::enable_if_t<(D > 1), Vector<T, swizzle_dim>> 
operator-(const Swizzle<T, dimension, OtherIndex>& other) const
{
    static_assert(check_indices(), "Left swizzle index out of bounds");
    
    Vector<T, swizzle_dim> lhs = *this;
    T scalar_value = T(other);
    return lhs - scalar_value;
}

template<int OtherIndex, size_t D = swizzle_dim>
typename std::enable_if_t<(D > 1), Vector<T, swizzle_dim>> 
operator*(const Swizzle<T, dimension, OtherIndex>& other) const
{
    static_assert(check_indices(), "Left swizzle index out of bounds");
    
    Vector<T, swizzle_dim> lhs = *this;
    T scalar_value = T(other);
    return lhs * scalar_value;
}

template<int OtherIndex, size_t D = swizzle_dim>
typename std::enable_if_t<(D > 1), Vector<T, swizzle_dim>> 
operator/(const Swizzle<T, dimension, OtherIndex>& other) const
{
    static_assert(check_indices(), "Left swizzle index out of bounds");
    
    Vector<T, swizzle_dim> lhs = *this;
    T scalar_value = T(other);
    return lhs / scalar_value;
}

```

Swizzle + Swizzle

大于1D的Swizzle之间的运算必须要保证Swizzle的维度相同，否则是无法运算的

```cpp
template<int ... OtherIndices, size_t OtherDimension, size_t D = swizzle_dim, size_t OtherD = sizeof ... (OtherIndices)>
typename std::enable_if_t<(D > 1 && D == OtherD), Vector<T, swizzle_dim>> 
operator+(const Swizzle<T, OtherDimension, OtherIndices ...>& other) const
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    Vector<T, swizzle_dim> lhs = *this;
    Vector<T, swizzle_dim> rhs = other;
    return lhs + rhs;
}

template<int ... OtherIndices, size_t OtherDimension, size_t D = swizzle_dim, size_t OtherD = sizeof ... (OtherIndices)>
typename std::enable_if_t<(D > 1 && D == OtherD), Vector<T, swizzle_dim>> 
operator-(const Swizzle<T, OtherDimension, OtherIndices ... >& other) const
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    Vector<T, swizzle_dim> lhs = *this;
    Vector<T, swizzle_dim> rhs = other;
    return lhs - rhs;
}

template<int ... OtherIndices, size_t OtherDimension, size_t D = swizzle_dim, size_t OtherD = sizeof ... (OtherIndices)>
typename std::enable_if_t<(D > 1 && D == OtherD), Vector<T, swizzle_dim>> 
operator*(const Swizzle<T, OtherDimension, OtherIndices ...>& other) const
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    Vector<T, swizzle_dim> lhs = *this;
    Vector<T, swizzle_dim> rhs = other;
    return lhs * rhs;
}

template<int ... OtherIndices, size_t OtherDimension, size_t D = swizzle_dim, size_t OtherD = sizeof ... (OtherIndices)>
typename std::enable_if_t<(D > 1 && D == OtherD), Vector<T, swizzle_dim>> 
operator/(const Swizzle<T, OtherDimension, OtherIndices ... >& other) const
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    Vector<T, swizzle_dim> lhs = *this;
    Vector<T, swizzle_dim> rhs = other;
    return lhs / rhs;
}

```

### 1D Swizzle 与 Vector

这里特殊考虑1D Swizzle与向量之间的计算

```cpp
template<size_t D = swizzle_dim, size_t VDimension>
typename std::enable_if_t<D == 1, Vector<T,VDimension>> operator+(const Vector<T,VDimension>& vec) const
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    return vec + T(*this);
}

template<size_t D = swizzle_dim, size_t VDimension>
typename std::enable_if_t<D == 1, Vector<T,VDimension>> operator*(const Vector<T,VDimension>& vec) const
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    return vec * T(*this);
}

```

### Swizzle 与 Vector 运算

大于1D的Swizzle与Vector的运算要注意条件和返回值，不要将Swizzle的维度和其对应Vector的维度弄混

```cpp
template<size_t D = swizzle_dim>
typename std::enable_if_t<(D > 1), Vector<T,swizzle_dim>> operator+(const Vector<T,swizzle_dim>& vec) const
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    return vec + Vector<T,swizzle_dim>(*this);
}

template<size_t D = swizzle_dim>
typename std::enable_if_t<(D > 1), Vector<T,swizzle_dim>> operator-(const Vector<T,swizzle_dim>& vec) const
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    return Vector<T,swizzle_dim>(*this) - vec;
}

template<size_t D = swizzle_dim>
typename std::enable_if_t<(D > 1), Vector<T,swizzle_dim>> operator*(const Vector<T,swizzle_dim>& vec) const
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    return vec * Vector<T,swizzle_dim>(*this);
}

template<size_t D = swizzle_dim>
typename std::enable_if_t<(D > 1), Vector<T,swizzle_dim>> operator/(const Vector<T,swizzle_dim>& vec) const
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    return Vector<T,swizzle_dim>(*this) / vec;
}

```

### 1D Swizzle 与 Scalar

这两者之间的运算相对来说简单一些，不要太多的模板来限制其使用

```cpp
template<size_t D = swizzle_dim>
typename std::enable_if_t<D == 1, T> operator+(const T& scalar) const
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    return T(*this) + scalar;
}

template<size_t D = swizzle_dim>
typename std::enable_if_t<D == 1, T> operator-(const T& scalar) const
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    return T(*this) - scalar;
}

template<size_t D = swizzle_dim>
typename std::enable_if_t<D == 1, T> operator*(const T& scalar) const
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    return T(*this) * scalar;
}

template<size_t D = swizzle_dim>
typename std::enable_if_t<D == 1, T> operator/(const T& scalar) const
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    return T(*this) / scalar;
}

```

### Swizzle 与 Scalar

将1D Swizzle和Scalar的运算普遍化，注意条件和返回值即可

```cpp
template<size_t D = swizzle_dim>
typename std::enable_if_t<(D > 1), Vector<T, swizzle_dim>> operator+(const T& scalar) const
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    Vector<T, swizzle_dim> lhs = *this;
    return lhs + scalar;
}

template<size_t D = swizzle_dim>
typename std::enable_if_t<(D > 1), Vector<T, swizzle_dim>> operator-(const T& scalar) const
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    Vector<T, swizzle_dim> lhs = *this;
    return lhs - scalar;
}

template<size_t D = swizzle_dim>
typename std::enable_if_t<(D > 1), Vector<T, swizzle_dim>> operator*(const T& scalar) const
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    Vector<T, swizzle_dim> lhs = *this;
    return lhs * scalar;
}

template<size_t D = swizzle_dim>
typename std::enable_if_t<(D > 1), Vector<T, swizzle_dim>> operator/(const T& scalar) const
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    Vector<T, swizzle_dim> lhs = *this;
    return lhs / scalar;
}

```

## Swizzle友元声明

友元函数的出现主要是为了将上面函数内声明的计算方法反向，比如原来支持Swizzle * Vector，但是我们还要支持Vector * Swizzle

### Vector & Swizzle

```cpp
template<size_t D = swizzle_dim>
friend typename std::enable_if_t<(D > 1), Vector<T,swizzle_dim>> operator+(const Vector<T,swizzle_dim>& vec, const Swizzle& sw)
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    return vec + Vector<T,swizzle_dim>(sw);
}

template<size_t D = swizzle_dim>
friend typename std::enable_if_t<(D > 1), Vector<T,swizzle_dim>> operator-(const Vector<T,swizzle_dim>& vec, const Swizzle& sw)
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    return vec - Vector<T,swizzle_dim>(sw);
}

template<size_t D = swizzle_dim>
friend typename std::enable_if_t<(D > 1), Vector<T,swizzle_dim>> operator*(const Vector<T,swizzle_dim>& vec, const Swizzle& sw)
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    return vec * Vector<T,swizzle_dim>(sw);
}

template<size_t D = swizzle_dim>
friend typename std::enable_if_t<(D > 1), Vector<T,swizzle_dim>> operator/(const Vector<T,swizzle_dim>& vec, const Swizzle& sw)
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    return vec / Vector<T,swizzle_dim>(sw) ;
}

```

### Vector & 1D Swizzle

```cpp
template<size_t D = swizzle_dim, size_t VDimension>
friend typename std::enable_if_t<(D > 1), Vector<T,VDimension>> operator+(const Vector<T,VDimension>& vec, const Swizzle& sw)
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    return sw + vec;
}

template<size_t D = swizzle_dim, size_t VDimension>
friend typename std::enable_if_t<(D > 1), Vector<T,VDimension>> operator-(const Vector<T,VDimension>& vec, const Swizzle& sw)
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    return vec - T(sw);
}

template<size_t D = swizzle_dim, size_t VDimension>
friend typename std::enable_if_t<(D > 1), Vector<T,VDimension>> operator*(const Vector<T,VDimension>& vec, const Swizzle& sw)
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    return sw * vec;
}

template<size_t D = swizzle_dim, size_t VDimension>
friend typename std::enable_if_t<(D > 1), Vector<T,VDimension>> operator/(const Vector<T,VDimension>& vec, const Swizzle& sw)
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    return vec / T(sw);
}

```

### Scalar & Swizzle

```cpp
template<size_t D = swizzle_dim>
friend  typename std::enable_if_t<(D > 1), Vector<T, swizzle_dim>> operator+(const T& scalar, const Swizzle& sw)
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    return sw + scalar;
}

template<size_t D = swizzle_dim>
friend  typename std::enable_if_t<(D > 1), Vector<T, swizzle_dim>>  operator*(const T& scalar, const Swizzle& sw)
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    return sw * scalar;
}

```

### Scalar & 1D Swizzle

```cpp
template<size_t D = swizzle_dim>
friend typename std::enable_if_t<D == 1, T> operator+(const T& scalar, const Swizzle& sw)
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    return sw + scalar;
}

template<size_t D = swizzle_dim>
friend typename std::enable_if_t<D == 1, T> operator-(const T& scalar, const Swizzle& sw)
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    return scalar - T(sw) ;
}

template<size_t D = swizzle_dim>
friend typename std::enable_if_t<D == 1, T>  operator*(const T& scalar, const Swizzle& sw)
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    return sw * scalar;
}

template<size_t D = swizzle_dim>
friend typename std::enable_if_t<D == 1, T> operator/(const T& scalar, const Swizzle& sw)
{
    static_assert(check_indices(), "Swizzle index out of bounds");
    return scalar/T(sw);
}

```

## Swizzle外部全局声明

外部声明主要是针对一些普遍的向量算法，如果Swizzle支持那么计算将更加简单

所以我们依然使用template对条件进行了 限制，对于满足条件的对象和调用的函数我们会直接直接返回计算使用向量的计算结果，但是遇到不满足对象格式的调用我们会直接回到底层的函数中去解决

### dot

```cpp
template<typename T, size_t Dim1, size_t Dim2, int... Indices1, int... Indices2, size_t dim_a = sizeof...(Indices1), size_t dim_b = sizeof...(Indices2)>
std::enable_if_t<dim_a == dim_b,T> dot(const Swizzle<T, Dim1, Indices1...>& a, const Swizzle<T, Dim2, Indices2...>& b)
{
    if constexpr (dim_a > 1)
    {
        Vector<T, dim_a> va = a;
        Vector<T, dim_b> vb = b;
        return dot(va, vb);
    }
    else
    {
        T va = a;
        T vb = b;
        return va * vb;
    }
}

```

### cross

3D

```cpp
template<typename T, size_t Dim1, size_t Dim2, int... Indices1, int... Indices2, size_t dim_a = sizeof...(Indices1), size_t dim_b = sizeof...(Indices2)>
std::enable_if_t<dim_a == 3 && dim_b == 3, Vector<T, 3>> cross(const Swizzle<T, Dim1, Indices1...>& a, const Swizzle<T, Dim2, Indices2...>& b)
{

    Vector<T, 3> va = a;
    Vector<T, 3> vb = b;
    return cross(va, vb);
    
}

```

2D

```cpp
template<typename T, size_t Dim1, size_t Dim2, int... Indices1, int... Indices2, size_t dim_a = sizeof...(Indices1), size_t dim_b = sizeof...(Indices2)>
std::enable_if_t<dim_a == 2 && dim_b == 2, T> cross(const Swizzle<T, Dim1, Indices1...>& a, const Swizzle<T, Dim2, Indices2...>& b)
{

    Vector<T, 2> va = a;
    Vector<T, 2> vb = b;
    return cross(va, vb);
    
}

```

这里要注意的是Cross分成了对2D和3D的支持，但是在使用方式上都是一样的，在语义上也能说得通

### distance

```cpp
template<typename T, size_t D>
T distance(const Vector<T, D>& a, const Vector<T, D>& b, bool dimensionalityReduction  = true)
{
    return (b - a).length(dimensionalityReduction);
}

template<typename T, size_t Dim1, size_t Dim2, int... Indices1, int... Indices2, size_t dim_a = sizeof...(Indices1), size_t dim_b = sizeof...(Indices2)>
std::enable_if_t<dim_a == dim_b, T> distance(const Swizzle<T, Dim1, Indices1...>& a, const Swizzle<T, Dim2, Indices2...>& b, bool dimensionalityReduction  = true)
{
    Vector<T, dim_a> va = a;
    Vector<T, dim_b> vb = b;
    return distance(va, vb, dimensionalityReduction);
}

template<typename T, size_t D>
T distanceSquared(const Vector<T, D>& a, const Vector<T, D>& b, bool dimensionalityReduction = true)
{
    return (b - a).lengthSquared(dimensionalityReduction);
}

template<typename T, size_t Dim1, size_t Dim2, int... Indices1, int... Indices2, size_t dim_a = sizeof...(Indices1), size_t dim_b = sizeof...(Indices2)>
std::enable_if_t<dim_a == dim_b, T> distanceSquared(const Swizzle<T, Dim1, Indices1...>& a, const Swizzle<T, Dim2, Indices2...>& b, bool dimensionalityReduction  = true)
{
    Vector<T, dim_a> va = a;
    Vector<T, dim_b> vb = b;
    return distanceSquared(va, vb, dimensionalityReduction);
}

```

### angle

```cpp
template<typename T, size_t D>
T angle(const Vector<T, D>& a, const Vector<T, D>& b, bool dimensionalityReduction = true)
{
    T dot_product = dot(a, b);
    T magnitude_product = a.length(dimensionalityReduction) * b.length(dimensionalityReduction);
    if (magnitude_product == T{ 0 }) {
        return T{ 0 };
    }
    return std::acos(std::clamp(dot_product / magnitude_product, T{ -1 }, T{ 1 }));
}

template<typename T, size_t Dim1, size_t Dim2, int... Indices1, int... Indices2, size_t dim_a = sizeof...(Indices1), size_t dim_b = sizeof...(Indices2)>
std::enable_if_t<dim_a == dim_b, T> angle(const Swizzle<T, Dim1, Indices1...>& a, const Swizzle<T, Dim2, Indices2...>& b, bool dimensionalityReduction  = true)
{
    Vector<T, dim_a> va = a;
    Vector<T, dim_b> vb = b;
    return angle(va,vb,dimensionalityReduction);
}

```

### lerp

```cpp
template<typename T, size_t D>
Vector<T, D> lerp(const Vector<T, D>& a, const Vector<T, D>& b, T t)
{
    return a.lerp(b, t);
}

template<typename T, size_t Dim1, size_t Dim2, int... Indices1, int... Indices2, size_t dim_a = sizeof...(Indices1), size_t dim_b = sizeof...(Indices2)>
std::enable_if_t<dim_a == dim_b, T> lerp(const Swizzle<T, Dim1, Indices1...>& a, const Swizzle<T, Dim2, Indices2...>& b, T t)
{
    Vector<T, dim_a> va = a;
    Vector<T, dim_b> vb = b;
    return lerp(va,vb,t);
}

```

### slerp

```cpp
template<typename T, size_t D>
Vector<T, D> slerp(const Vector<T, D>& a, const Vector<T, D>& b, T t)
{
    T dot_product = std::clamp(dot(a, b), T{ -1 }, T{ 1 });
    T theta = std::acos(std::abs(dot_product));

    if (theta < T{ 1e-6 }) {
        return lerp(a, b, t);  // 向量几乎平行，使用线性插值
    }

    T sin_theta = std::sin(theta);
    T factor_a = std::sin((T{ 1 } - t) * theta) / sin_theta;
    T factor_b = std::sin(t * theta) / sin_theta;

    if (dot_product < T{ 0 }) {
        factor_b = -factor_b;  // 选择较短路径
    }

    return factor_a * a + factor_b * b;
}

template<typename T, size_t Dim1, size_t Dim2, int... Indices1, int... Indices2, size_t dim_a = sizeof...(Indices1), size_t dim_b = sizeof...(Indices2)>
std::enable_if_t<dim_a == dim_b, T> slerp(const Swizzle<T, Dim1, Indices1...>& a, const Swizzle<T, Dim2, Indices2...>& b, T t)
{
    Vector<T, dim_a> va = a;
    Vector<T, dim_b> vb = b;
    return slerp(va,vb,t);
}

```

![](./image-1.jpg)

![](./image-2.jpg)
