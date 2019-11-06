[TOC]
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
#### 2.3.3HouseLease
|字段 |注释 | 类型 |主键 |外键 |备注 |
--|--|--|--|--|--|
|HouseLease_LeaseID | 房屋租赁ID |int | 是 |   |自增
|HouseLease_HouseID | 房屋ID     |int |   | 是 |
|HouseLease_LeaseMoney | 租金金额 | int | | | not Null
|HouseLease_CashDeposit| 定金| int | | | not null
|HosueLease_ContactInf | 手机号码 | varchar(20) | | | not Null
|HouseLease_OpenTime | 公开时间 | data | | | not Null
|HouseLease_Mode| 租赁方式| varchar(10)(year or month) | | |not Null
|HouseLease_ElectronicContractTemplate| 电子合同模板 |varchar(255)(UUID)| | | not null
|HouseLease_IsBan| 被屏蔽| int(2)(1 or 0) | | | not Null 1被屏蔽

#### 2.3.4HouseLeaseOrderForm
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
