---
title: "重启RestArt ProjecUT｜索引"
description: "一、为什么有这样的一个内容？ ProjectUT是一个专门针对于虚幻引擎资产工具的开发分享，以C++为主，内容会随着我自己的开发不断跟大家分享和更新。 目前市面上和UE工具开发相关的内容相对来说较少，…"
category: tools
tags: ['ProjectUT', 'UE', '工具开发', '编辑器扩展']
date: 2025-04-16
readTime: 3
heroImage: "./cover.webp"
published: true
---
## 一、为什么有这样的一个内容？

ProjectUT是一个专门针对于虚幻引擎资产工具的开发分享，以C++为主，内容会随着我自己的开发不断跟大家分享和更新。

目前市面上和UE工具开发相关的内容相对来说较少，但是在实际生产开发中又发现不少同行的初学者非常需要这一板块的内容补充，所以这一个系列也就应运而生~

希望这个板块能帮助大家解决更多实际项目开发中的需求，尤其是为技术美术的日常资产管理和验证提供一定的参考思路

## 二、你需要的基础

首先学习这个板块你需要有一定的C++基础，在ProjectA中专门为小白入门C++提供了基础的知识

其次学习这个板块需要对虚幻引擎有一定的了解（能熟练打开和关闭虚幻引擎也可以～）

学习引擎和开发引擎需要咱们有一定的钻研能力，能不断提出问题并尝试解决问题，在不同的方法中找到最优解～

## 三、索引目录

新工程CrazyUAsset（优化项目结构和冗余代码）

旧工程AssetsManager（完整的结构和体系）

### 1.工具配置

引擎自定义资产配置

引擎读取自定义ini配置

引擎注册自定义UI图标

引擎工具预制Log组件

### 2.导入管线

引擎资产导入后处理OnEditorDelegatePostImport

### 4.自定义资产行为

引擎注册自定义资产行为RegisterAssetTypeActions

### 5.Slate设计

获取当前检查路径

获取自定义路径下资产列表

SCommonSlate预定义一些小工具

SCustomEditableText可编辑的文本框

SCustomListView为列表新添加一些自定义方法

SCustomTable&SCustomTableRow自定义表格

SAssetView原生通用资产列表查看类

### 6.标准化资产检查——通用资产

UCustomStandardObject和FCustomStandardAssetData

引擎资产前缀获取和判断

引擎资产内存和磁盘大小获取

### 7.标准化资产检查——贴图

UCustomStandardTexture2D和FCustomStandardTexture2DData

引擎获取和修改贴图尺寸

引擎内C++实现贴图尺寸降级和标准化

引擎内C++实现贴图深度降低

引擎获取和修改贴图压缩设置

引擎获取和修改贴图sRGB设置

引擎读取贴图内存大小

引擎获取和修改贴图纹理组设置

自定义判断贴图资产是否合规和自动修复的思路

引擎内信息贴图ID检查的思路和工具设计

### 8.标准化资产检查——骨骼网格体

UCustomStandardSkeletalMeshObject和FCustomStandardSkeletalMeshData

引擎读取骨骼网格体LOD的顶点及面数

引擎获取和修改CPUAccess设置

引擎读取材质插槽和设置LOD材质的方式

### 其他拓展

![](./image-1.jpg)

![](./image-2.jpg)
