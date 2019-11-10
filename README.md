  [TOC]
[MENU]
# 1.ExpressLeaseHouse
大三上,完成工程实践，开发一个房屋租聘系统。
环境：node、Express、antd、Webpack4、mysql

npm script：
* "start": "supervisor index" 启动项目工程热更新
* "build": "webpack"  webpack4  打包
* "dev": "webpack-dev-server" 热更新

## 2.数据库设计
### 2.1名命规范
表名: Table  
字段名: Table_FieldName
### 2.2字段详细设计

####  2.3.1User
|字段 |注释 | 类型 |主键 |外键 |备注 |
--|--|--|--|--|--|
User_ID|	用户ID|	int|	主键|	|	自增
User_Name|	用户昵称|	Varchar(20)|	|	| 	Not null，为空自动字符串设置
User_PassWord|	用户密码|	Varchar(20)|	|	|	MD5加密非空
User_Rank|	用户身份|	Varchar(20)|	||		not null，默认’游客’
User_IsBan|	被屏蔽|	Int(2) (1 or 0 )|	||		not null， 1被屏蔽
####  2.3.2LandLord
|字段 |注释 | 类型 |主键 |外键 |备注 |
--|--|--|--|--|--|
|LandLor_ID |房东ID | int |是 | |自增 |
|LandLor_UserID |用户ID | int | |是 |not null |
|LandLor_ContacInf |房东联系方式 | varchar(20) | | |not null |
|LandLor_Profile |房东简介 | varchar(300)| | |not null，限制140字，为空则自动生成  |
|LandLor_IsBan| 被屏蔽| int(2)(1 or 0) | | | not Null 1被屏蔽

####  2.3.3Administrator
|字段 |注释 | 类型 |主键 |外键 |备注 |
--|--|--|--|--|--|
Administrator_Id|	管理员ID|	Int|	主键|		|自增
|Administrator_UserID |用户ID | int | |是 |not null |

####  2.3.4Tenant
|字段 |注释 | 类型 |主键 |外键 |备注 |
--|--|--|--|--|--|
Tenant_Id|	租客id|	int|	主键|	|	自增
Tenantr_UserID |用户ID | int | |是 |not null |
Tenant_ Profile|	租客简介|	varchar(200)|	|	| 	Not null，为空自动设置
Tenant_Name|租客昵称	|	Varchar(20)|	|	|	 not null
Tenant_ ContactInformation|	联系方式|	varchar(20)| | |	 		not null

####  2.3.5House
|字段 |注释 | 类型 |主键 |外键 |备注 |
--|--|--|--|--|--|
|House_ID |房源ID | int |是 | |自增 |
|House_LandLordID |房东ID | int | |是 | |
|House_Area |房屋面积 | int | | |not null |
|House_Profile |房屋简介 | varchar(300) | | |not null, 限制140字，为空则自动生成 |
|House_Address |房屋地址 | varchar(40) | | |not null 以-为分隔符 |
|House_Headline |房屋标题 | varchar(40) | | |not null |
|House_IsBan| 被屏蔽| int(2)(1 or 0) | | | not Null 1被屏蔽

####  2.3.6HouseLease
|字段 |注释 | 类型 |主键 |外键 |备注 |
--|--|--|--|--|--|
|HouseLease_LeaseID | 房屋租赁ID |int | 是 |   |自增
|HouseLease_HouseID | 房源ID     |int |   | 是 |
|HouseLease_LeaseMoney | 租金金额 | int | | | not Null
|HouseLease_CashDeposit| 定金| int | | | not null
|HosueLease_ContactInf | 手机号码 | varchar(20) | | | not Null
|HouseLease_OpenTime | 公开时间 | data | | | not Null
|HouseLease_Mode| 租赁方式| varchar(10)(year or month) | | |not Null
|HouseLease_ElectronicContractTemplate| 电子合同模板 |varchar(255)(UUID)| | | not null
|HouseLease_IsBan| 被屏蔽| int(2)(1 or 0) | | | not Null 1被屏蔽

####  2.3.7HouseLeaseOrderForm
|字段 |注释 | 类型 |主键 |外键 |备注 |
--|--|--|--|--|--|
|HouseLeaseOrderForm_OrderFormID | 房屋租赁订单ID |int | 是 |   |自增
|HouseLeaseOrderForm_HouseID | 房屋ID     |int |   | 是 |
|HouseLeaseOrderForm_UserID | 租客ID | int | | 是 | 
|HouseLeaseOrderForm_LeaseMoney | 租金金额 | int(20) | | | not Null
|HouseLeaseOrderForm_ContactInf | 手机号码 | varchar(20) | | | not Null
|HouseLeaseOrderForm_StartTime| 开始时间| data | | | not Null
|HouseLeaseOrderForm_EndTime | 结束时间 | data | | | not Null
|HouseLeaseOrderForm_Mode| 租赁方式| string(10)(year or month) | | |not Null
|HouseLeaseOrderForm_ElectronicContract | 电子合同 | varchar(255)(UUID) | | | not Null
|HouseLeaseOrderForm_IsBan| 被屏蔽| int(2)(1 or 0) | | | not Null 1被屏蔽


## 3.后台API接口
### 3.1接口规范
采用RETSful API设计规范
* GET：读取（Read）
* POST：新建（Create）
* PUT：更新（Update）
* PATCH：更新（Update），通常是部分更新
* DELETE：删除（Delete
### 3.2接口API
