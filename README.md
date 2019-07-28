## 问题
1. Header component 重新设计, 把与用户有关的操作都放在这个面板上
2. book 的类型字段是 type 不是 book_type, 要更改
3. 导入数据不需要使用 csv, 直接使用json
4. book page 二维码按钮在游客登录状态不显示灰色
5. 刷新按钮重新放回 borrowingBoard component 上


## 思路整理
### 登录和权限
1. 权限: 
管理员, 用户, 游客(1:纯, 2:用户或管理员登录时间太长导致降权,需要重新登录)
2. 登录逻辑:
纯游客 -> navigate to login page -> 用户或管理员 -> navigateback 2 delta (这样就无需另外刷新 borrowingInfo, 似乎不行,还是无法刷新)
降权游客(需重新登录的用户或管理员) -> navigate to login page(带上id) -> 重新登录 或 登录为其他 -> navigateback 2 delta (这样就无需另外刷新 borrowingInfo)
两种游客 -> 无法修改密码, 无法登出
用户, 管理员 -> 登出, redirect to login page(带上redirect指示) -> 重新登录 或 登录为其他 -> redirect to index
用户, 管理员 -> to login page 修改密码 -> relaunch to login page(带上id, 带上redirect指示) -> 重新登录 或 登录为其他 -> redirect to index
3. 游客判断
loginAsVisitor -> 直接设置 isVisitor = ture
init时登录时间超过规定 -> 游客

## 云开发环境的切换
1. 使用服务端api, 本地也需要 init 一次, 由于云开发给了两个环境, 所以本地 init 需要设置环境参数, 而云端需要使用 getWXContext, updateConfig 函数动态设置云端环境, 注意 db = cloud.database() 需要在动态环境设置后才能使用

2. 微信开发工具 -> 界面 -> 编辑器 -> cloud 文件夹 -> function 文件夹 -> 环境设置: 用来上传云函数到哪个环境

## 导入数据及设置
### book
用替换方式去除每条数据之间的逗号(这是为了符合小程序云数据库json格式的要求), 最后导入
### user
// 看看能不能 excel 直接转为 json, 然后修改 batchHash.js
先转为 csv 格式, 然后用 batchHash.js 批量处理数据, 然后csv 转 json(否则 _id 的类型会变成 number ), 再用替换方式去除每条数据之间的逗号(这是为了符合小程序云数据库json格式的要求), 最后导入

注意:管理员需要人工在云数据库中增加 

### fav
加索引
1. uid 非唯一
2. uid bid 组合 唯一


## 数据库格式

### book
bid
isbn
title
author
summary
cover
book_type
total_num
can_borrow_num
master

### user
uid
name
pwd
salt

### borrow
uid
bid
title
cover
author
createTime

### fav
uid
bid
title
cover
author
createTime