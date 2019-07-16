## 导入数据
### book
json 格式转变为 csv 格式, 然后导入
### user
先转为 csv 格式, 然后用 batchHash.js 批量处理数据, 然后导入 

注意:管理员需要人工在云数据库中增加 



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