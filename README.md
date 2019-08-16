<img alt='logo' src='https://user-images.githubusercontent.com/7885757/63141030-bd583980-c016-11e9-8d30-4f42de853589.png' width='75px'/>

##介绍
对图书借阅情况进行记录

### 功能
1. 读者
三种方式搜索图书(书名, 作者名, 书的类别)
收藏图书
正在借阅图书的情况

2. 管理员
扫码借书还书
查看逾期名单

3. 都有的功能
修改密码

##版本
### 3.0
[点击链接可看截图](https://github.com/chenvan/lib_taro/issues/1)


## 待修复
1. 导入数据不需要使用 csv, 直接使用json
2. 书类搜索的动画效果
3. 借阅栏的 css
4. 账号导入是否能绕开csv格式, 看 excel 能否直接转为 json, 然后修改 batchHash.js 直接处理 json

## 思路整理
### 登录和权限
1. 权限: 
管理员, 用户, 游客(1:真游客, 2:用户或管理员登录时间太长导致降权,需要重新登录)

2. 登录逻辑:
真游客 -> home page => navigate to login page -> 用户或管理员 -> navigateback 2 delta

降权游客(需重新登录的用户或管理员) -> home page => navigate to login page(带上id) -> 重新登录 或 登录为其他 -> navigateback 2 delta

两类游客都无法修改密码, 无法登出

用户, 管理员 -> home page => logout => redirect to login page(带上redirect指示) -> 重新登录 或 登录为其他 -> redirect to index

用户, 管理员 -> home page => to login page for password change -> relaunch to login page(带上id, 带上redirect指示) -> 重新登录 或 登录为其他 -> redirect to index

3. 游客判断
loginAsVisitor -> 直接设置 isVisitor = ture

init时检查登录时间超过规定 -> 游客

## 云开发环境的切换
1. 由于云开发给了两个环境, 所以客户端 init 时需要设置环境参数, 而云端需要使用 getWXContext, updateConfig 函数动态设置云端环境, 注意 db = cloud.database() 需要在动态环境设置后才能使用, 否则使用的是默认环境下的数据库

2. 微信开发工具 -> 界面 -> 编辑器 -> cloud 文件夹 -> function 文件夹 -> 环境设置: 用来上传云函数到哪个环境

## 导入数据, 数据库的设置及注意事项
### book
用替换方式去除每条数据之间的逗号(这是为了符合小程序云数据库json格式的要求), 最后导入
### user
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
type
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

### type
name