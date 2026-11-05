---
title: "重启RestArt EasyTA｜Swizzle实现（上）"
description: "基于上一篇已经写到的一个通用库，其中有一个比较有意思的C++实现就是Swizzle 这里借鉴了一下GLM的思路 其实对于Swizzle的实现我们出于两个目的 1.能用不同的变量名称访问到同一个地址 2…"
category: tools
tags: ['EasyTA', 'UE', '材质', '技术美术']
date: 2025-10-17
readTime: 4
heroImage: "./cover.webp"
published: true
---
基于上一篇已经写到的一个通用库，其中有一个比较有意思的C++实现就是Swizzle

这里借鉴了一下GLM的思路

其实对于Swizzle的实现我们出于两个目的

1.能用不同的变量名称访问到同一个地址

2.使用任意变量都可以更改内存地址的值且不会冲突

其实问题就变简单了，回想C++中什么东西可以以多种方式来解释同一个内存地址——union，同时利用匿名union将变量名注入到外部空间。

接下来就要想如何让我的代码可以以下面的方式来运行

```cpp
template<typename T, size_t dimension, typename = std::enable_if_t<std::is_arithmetic_v<T>>>
class Vector
{
//......

public:
    union
    {
        std::array<T, dimension> data;
        Swizzle x;
        Swizzle xy;
    }
}
```

很明显这里会出现一个问题，就是对齐，因为x，xy，xyz或者更多访问这些参数量以及参数长度是对不齐的，但是！我们需要对齐吗？回想我们上面的两个目的，我们只需要保证在访问的时候可以隐式转换，在赋值的时候重新定义赋值方式即可，至于其原始的内存在union中只占1个字节，这也并不影响我们访问更多数据，因为可以转化为[x,y,z,w]的组合布局。

所以我们可以开始一步步构建我们的Swizzle了

## Swizzle1D

```cpp
template <typename T, size_t dimension, int idx>
struct Swizzle1D
{
	Swizzle1D& operator=(const T& e)
	{
		static_assert(idx < dimension, 
		"Swizzle index out of bounds! "
		"You're trying to access a component that doesn't exist in this vector.");
		elem(idx) = e;
		return *this;
	}

	operator T() const
	{
		static_assert(idx < dimension, 
		"Swizzle index out of bounds! "
		"You're trying to access a component that doesn't exist in this vector.");
		return T(elem(idx));
	}
		
	friend std::ostream& operator<<(std::ostream& out, const Swizzle1D& sw)
	{
		return out << T(sw); 
	}
		
protected:
	T elem(int i) const
	{
		// 注意，它存在于Union之中，尽管自身仅占1个字节，
		// 但是可以转化为[x,y,z,w]的内存布局的float[4]
		return reinterpret_cast<const T*>(this)[i];
	}

	T& elem(int i)
	{
		return reinterpret_cast<T*>(this)[i];
	}
};

```

首先Swizzle1D& operator=(const T& e)这个函数覆盖了访问时的赋值问题

其次operator T() const 这个函数覆盖了从Swizzle1D向T的转换，这样我们在使用的时候可以隐式将Swizzle1D转换为类型T的值

friend std::ostream&operator&lt;&lt;(std::ostream& out,const Swizzle1D& sw) 是对输出函数的覆写

最后，T elem(int i)const 和T&elem(int i) 这两个函数作为内部辅助函数，会直接返回其存在的内存地址，当其放在union中的时候，就能直接返回通过data访问的结果

```cpp
template<typename T, size_t dimension, typename = std::enable_if_t<std::is_arithmetic_v<T>>>
class Vector
{
// ......

public:
    union
    {
        std::array<T, dimension> data;
	Swizzle1D<T, dimension, 0> x;
	Swizzle1D<T, dimension, 1> y;
	Swizzle1D<T, dimension, 2> z;
	Swizzle1D<T, dimension, 3> w;
    }
}

```

### Swizzle2D/Swizzle3D/Swizzle4D

接下来我们继续升维，这些类的方法和结构都不变，只是一些返回类型需要发生变化

```cpp
template <typename T, size_t dimension, int E0, int E1>
struct Swizzle2D
{
	Swizzle2D& operator=(const Vector<T,2>& vec)
	{
		static_assert(E0 < dimension && E1 < dimension, 
		"Swizzle index out of bounds! "
		"You're trying to access a component that doesn't exist in this vector.");
		elem(E0) = vec.x;
		elem(E1) = vec.y;
		return *this;
	}

	operator Vector<T,2>() const
	{
		static_assert(E0 < dimension && E1 < dimension,  
		"Swizzle index out of bounds! "
		"You're trying to access a component that doesn't exist in this vector.");
		return Vector<T,2>{elem(E0),elem(E1)};
	}

	friend std::ostream& operator<<(std::ostream& out, const Swizzle2D& sw)
	{
		return out << Vector<T,2>(sw);
	}
protected:
	T elem(int i) const
	{
		// 注意，它存在于Union之中，尽管自身仅占1个字节，
		// 但是可以转化为[x,y,z,w]的内存布局的float[4]
		return reinterpret_cast<const T*>(this)[i];
	}

	T& elem(int i)
	{
		return reinterpret_cast<T*>(this)[i];
	}
};

```

这里主要影响的就是Swizzle2D& operator=(const Vector&lt;T,2&gt;& vec) 赋值函数和 operator Vector&lt;T,2&gt;()const 隐式转换函数

> 这里要注意，因为Vector&lt;T,dimension&gt;是我们自定义的类型，和单纯转换为T（可能是float，double或者其他的）不一样，尤其是做加减乘除的时候需要重新定义operator运算符，但是转换为内置的float，double等浮点变量就不用

同理我们来设计Swizzle3D和Swizzle4D

```cpp
template <typename T, size_t dimension, int E0, int E1, int E2>
struct Swizzle3D
{
	template<bool Enable = (E0 < dimension && E1 < dimension && E2 < dimension)>
	[[deprecated("Swizzle component access out of bounds! Check this line.")]]
	typename std::enable_if_t<!Enable, Swizzle3D&>
	operator=(const Vector<T,3>& vec)
	{
		static_assert(E0 < dimension && E1 < dimension && E2 < dimension, 
		"Swizzle index out of bounds! "
		"You're trying to access a component that doesn't exist in this vector.");
		elem(E0) = vec.x;
		elem(E1) = vec.y;
		elem(E2) = vec.z;
		return *this;
	}
		
	operator Vector<T,3>() const
	{
		static_assert(E0 < dimension && E1 < dimension && E2 < dimension, 
		"Swizzle index out of bounds! "
		"You're trying to access a component that doesn't exist in this vector.");
		return Vector<T,3>{elem(E0),elem(E1), elem(E2)};
	}
		
	friend std::ostream& operator<<(std::ostream& out, const Swizzle3D& sw)
	{
		static_assert(E0 < dimension && E1 < dimension && E2 < dimension, 
		"Swizzle index out of bounds! "
		"You're trying to access a component that doesn't exist in this vector.");
		return out << Vector<T,3>(sw);
	}

protected:
	T elem(int i) const
	{
		// 注意，它存在于Union之中，尽管自身仅占1个字节，
		// 但是可以转化为[x,y,z,w]的内存布局的float[4]
        	return reinterpret_cast<const T*>(this)[i];
	}

	T& elem(int i)
	{
		return reinterpret_cast<T*>(this)[i];
	}
};

template <typename T, size_t dimension, int E0, int E1, int E2, int E3>
struct Swizzle4D
{
	Swizzle4D& operator=(const Vector<T,4>& vec)
	{
		static_assert(E0 < dimension && E1 < dimension && E2 < dimension && E3 < dimension,
		"Swizzle index out of bounds! "
		"You're trying to access a component that doesn't exist in this vector.");
		elem(E0) = vec.x;
		elem(E1) = vec.y;
		elem(E2) = vec.z;
		elem(E3) = vec.w;
		return *this;
	}

	operator Vector<T,4>() const
	{
		static_assert(E0 < dimension && E1 < dimension && E2 < dimension && E3 < dimension, 
		"Swizzle index out of bounds! "
		"You're trying to access a component that doesn't exist in this vector.");
		return Vector<T,4>{elem(E0),elem(E1), elem(E2), elem(E3)};
	}

	friend std::ostream& operator<<(std::ostream& out, const Swizzle4D& sw)
	{
		return out << Vector<T,4>(sw);
	}

protected:
	T elem(int i) const
	{
		// 注意，它存在于Union之中，尽管自身仅占1个字节，
		// 但是可以转化为[x,y,z,w]的内存布局的float[4]
		return reinterpret_cast<const T*>(this)[i];
	}

	T& elem(int i)
	{
		return reinterpret_cast<T*>(this)[i];
	}
};

```

那我们在union中的声明就变成了如下样子（当然也可以用宏简化）

```cpp
union
{
	std::array<T, dimension> data;
	Swizzle1D<T, dimension, 0> x;
	Swizzle1D<T, dimension, 1> y;
	Swizzle1D<T, dimension, 2> z;
	Swizzle1D<T, dimension, 3> w;
	Swizzle2D<T, dimension, 0, 1> xy;
	Swizzle2D<T, dimension, 1, 0> yx;
	Swizzle2D<T, dimension, 0, 2> xz;
	Swizzle2D<T, dimension, 2, 0> zx;
	Swizzle2D<T, dimension, 0, 3> xw;
	Swizzle2D<T, dimension, 3, 0> wx;
	Swizzle2D<T, dimension, 1, 2> yz;
	Swizzle2D<T, dimension, 2, 1> zy;
	Swizzle2D<T, dimension, 1, 3> yw;
	Swizzle2D<T, dimension, 3, 1> wy;
	Swizzle2D<T, dimension, 2, 3> zw;
	Swizzle2D<T, dimension, 3, 2> wz;
	Swizzle3D<T, dimension, 0, 1, 2> xyz;
	Swizzle3D<T, dimension, 0, 2, 1> xzy;
	Swizzle3D<T, dimension, 1, 0, 2> yxz;
	Swizzle3D<T, dimension, 1, 2, 0> yzx;
	Swizzle3D<T, dimension, 2, 0, 1> zxy;
	Swizzle3D<T, dimension, 2, 1, 0> zyx;
	Swizzle3D<T, dimension, 0, 1, 3> xyw;
	Swizzle3D<T, dimension, 0, 3, 1> xwy;
	Swizzle3D<T, dimension, 1, 0, 3> yxw;
	Swizzle3D<T, dimension, 1, 3, 0> ywx;
	Swizzle3D<T, dimension, 3, 0, 1> wxy;
	Swizzle3D<T, dimension, 3, 1, 0> wyx;
	Swizzle3D<T, dimension, 1, 2, 3> yzw;
	Swizzle3D<T, dimension, 1, 3, 2> ywz;
	Swizzle3D<T, dimension, 2, 1, 3> zyw;
	Swizzle3D<T, dimension, 2, 3, 1> zwy;
	Swizzle3D<T, dimension, 3, 1, 2> wyz;
	Swizzle3D<T, dimension, 3, 2, 1> wzy;
	Swizzle3D<T, dimension, 0, 2, 3> xzw;
	Swizzle3D<T, dimension, 0, 3, 2> xwz;
	Swizzle3D<T, dimension, 2, 0, 3> zxw;
	Swizzle3D<T, dimension, 2, 3, 0> zwx;
	Swizzle3D<T, dimension, 3, 0, 2> wxz;
	Swizzle3D<T, dimension, 3, 2, 0> wzx;
	Swizzle4D<T, dimension, 0, 1, 2, 3> xyzw;
	Swizzle4D<T, dimension, 0, 1, 3, 2> xywz;
	Swizzle4D<T, dimension, 0, 2, 1, 3> xzyw;
	Swizzle4D<T, dimension, 0, 2, 3, 1> xzwy;
	Swizzle4D<T, dimension, 0, 3, 1, 2> xwyz;
	Swizzle4D<T, dimension, 0, 3, 2, 1> xwzy;
	Swizzle4D<T, dimension, 1, 0, 2, 3> yxzw;
	Swizzle4D<T, dimension, 1, 0, 3, 2> yxwz;
	Swizzle4D<T, dimension, 1, 2, 0, 3> yzxw;
	Swizzle4D<T, dimension, 1, 2, 3, 0> yzwx;
	Swizzle4D<T, dimension, 1, 3, 0, 2> ywxz;
	Swizzle4D<T, dimension, 1, 3, 2, 0> ywzx;
	Swizzle4D<T, dimension, 2, 0, 1, 3> zxyw;
	Swizzle4D<T, dimension, 2, 0, 3, 1> zxwy;
	Swizzle4D<T, dimension, 2, 1, 0, 3> zyxw;
	Swizzle4D<T, dimension, 2, 1, 3, 0> zywx;
	Swizzle4D<T, dimension, 2, 3, 0, 1> zwxy;
	Swizzle4D<T, dimension, 2, 3, 1, 0> zwyx;
	Swizzle4D<T, dimension, 3, 0, 1, 2> wxyz;
        Swizzle4D<T, dimension, 3, 0, 2, 1> wxzy;
	Swizzle4D<T, dimension, 3, 1, 0, 2> wyxz;
	Swizzle4D<T, dimension, 3, 1, 2, 0> wyzx;
	Swizzle4D<T, dimension, 3, 2, 0, 1> wzxy;
	Swizzle4D<T, dimension, 3, 2, 1, 0> wzyx;
}

```

当然后面你也可以加上rgba之类的Swizzle

其实到这里就可以满足基本需求了，从使用上说没什么不一样的，但是声明了4个维度的Swizzle看起来总是觉得有点太繁杂了，那有没有办法能将这几类合并呢？

## Swizzle

```cpp
template <typename T, size_t dimension, int... Indices>
struct Swizzle
{
    // 编译期计算 swizzle 的维度
    static constexpr size_t swizzle_dim = sizeof...(Indices);
	    
    // 编译期检查所有索引是否在范围内
    static constexpr bool check_indices()
    {
        return ((Indices < static_cast<int>(dimension)) && ...);
    }
	    
protected:

    T elem(int i) const
    {
        // 通过 reinterpret_cast 将 this 指针转换为 T* 来访问 union 中的 data 数组
        return reinterpret_cast<const T*>(this)[i];
    }
	    
    T& elem(int i)
    {
        return reinterpret_cast<T*>(this)[i];
    }
	    
    // 辅助：使用索引序列创建 Vector
    template<size_t... Is>
    Vector<T, swizzle_dim> make_vector_impl(std::index_sequence<Is...>) const
    {
        // 将 Indices... 展开为数组，然后用索引序列访问
        constexpr int idx_array[] = {Indices...};
        return Vector<T, swizzle_dim>{elem(idx_array[Is])...};
    }
	    
    // 辅助：使用索引序列赋值
    template<size_t... Is>
    void assign_vector_impl(const Vector<T, swizzle_dim>& vec, std::index_sequence<Is...>)
    {
        constexpr int idx_array[] = {Indices...};
        ((elem(idx_array[Is]) = vec[Is]), ...);
    }
	    
public:

// ==================== 1D Swizzle 特化处理 ====================
    
    // 1D: 支持赋值单个标量
    template<size_t D = swizzle_dim>
    std::enable_if_t<D == 1, Swizzle&> operator=(const T& value)
    {
        static_assert(check_indices(), 
            "Swizzle index out of bounds! "
            "You're trying to access a component that doesn't exist in this vector.");
        
        constexpr int idx_array[] = {Indices...};
        elem(idx_array[0]) = value;
        return *this;
    }
	    
    // 1D: 隐式转换为 T
    template<size_t D = swizzle_dim>
    operator std::enable_if_t<D == 1, T>() const
    {
        static_assert(check_indices(), 
        "Swizzle index out of bounds! "
        "You're trying to access a component that doesn't exist in this vector.");
        
        constexpr int idx_array[] = {Indices...};
        return elem(idx_array[0]);
    }
	    
// ==================== 通用功能（所有维度）====================
	    
    // 赋值操作符：从 Vector 赋值
    Swizzle& operator=(const Vector<T, swizzle_dim>& vec)
    {
        static_assert(check_indices(),
        "Swizzle index out of bounds! "
        "You're trying to access a component that doesn't exist in this vector.");
	        
        assign_vector_impl(vec, std::make_index_sequence<swizzle_dim>{});
        return *this;
    }
	    
    // 转换为 Vector
    operator Vector<T, swizzle_dim>() const
    {
        static_assert(check_indices(), 
        "Swizzle index out of bounds! "
        "You're trying to access a component that doesn't exist in this vector.");
	        
        return make_vector_impl(std::make_index_sequence<swizzle_dim>{});
    }
	    
    // 输出操作符
    friend std::ostream& operator<<(std::ostream& out, const Swizzle& sw)
    {
        static_assert(check_indices(), 
        "Swizzle index out of bounds! "
        "You're trying to access a component that doesn't exist in this vector.");
        
        if constexpr (swizzle_dim == 1)
        {
            return out << T(sw);
        }
        else
        {
            return out << Vector<T, swizzle_dim>(sw);
        }
    }
};

```

这里使用了变参模板参数 int... indices （C++11）可以适配多维度索引值的传入，如果后续开发需要一些类似于xxyy这样的访问可以单独去声明，又或者需要限制这种xxyy的重复访问，也可以通过宏去剔除

同时这里也新声明了两个内部函数make_vector_impl 和 assign_vector_impl ，前者负责将2维及以上的Swizzle转换为Vector，后者负责接收Vector作为赋值参数

> 另外这里为了实现vectorA.xyz + vectorB.xyz 这样的算数运算，还需要重新为Swizzle声明Operator，这里就不过多赘述

（上卖说不过多赘述，但是在写的时候发现还是有很多细节需要处理，所以就有了下篇~）

声明union的时候也舒服多了

```cpp
union
{
	std::array<T, dimension> data;
	Swizzle<T, dimension, 0> x;
	Swizzle<T, dimension, 1> y;
	Swizzle<T, dimension, 2> z;
	Swizzle<T, dimension, 3> w;
	Swizzle<T, dimension, 0, 1> xy;
	Swizzle<T, dimension, 1, 0> yx;
	Swizzle<T, dimension, 0, 2> xz;
	Swizzle<T, dimension, 2, 0> zx;
        ........
}

```

## 使用Swizzle

这里仅做一个小的演示

```cpp
int main(int argc, char * argv[])
{
	EM::Vector<float, 3> vectorA{1,2,3};
	EM::Vector<float, 4> vectorB{4,5,6,7};
	
	vectorB.wxz = vectorA;
	std::cout << vectorB  << std::endl;
	return 0;
}

```

这里声明了两个不同的向量，通过Swizzle的方式我们可以以自己想要的顺序去赋值我们的向量

输出结果

```cpp
(2, 5, 3, 1) (V mode: xyzw)
```

![](./image-1.jpg)

![](./image-2.jpg)
