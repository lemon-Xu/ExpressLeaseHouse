var path = require("path");
var fs = require("fs");
var mysql2 = require("mysql2")

const parsed = false;


class SqlSessionFactoryBuilder{
    
    constructor(){
        this.sqlMapConfigUrl = path.resolve(__dirname, 'sqlMapConfig.json')
        this.parsed = false
        this.config = null
        this.connectionConfig = new Object()
        this.pool = null
    }

    getResource(resource){
        if(this.config != null)
            throw '不能重复加载SqlSessionFactoryBuilder配置文件'
        var data = fs.readFileSync(resource)
        this.config = JSON.parse(data)
    }
    
    getResource(){
        if(this.config != null)
            throw '不能重复加载SqlSessionFactoryBuilder配置文件'
        var data = fs.readFileSync(this.sqlMapConfigUrl)
        this.config = JSON.parse(data)
    }
    
    configToSting(){
        if(this.connectionConfig == null)
            throw '没有构建SQLSession'
        return JSON.stringify(this.connectionConfig)
    }

    build(){
        if(this.parsed)
            throw '不能重复构建SQLSession'
        if(this.config == null)
            throw '配置文件为空，请使用getResourceAsReader读入sqlSessionFactoryBuilder配置文件'
        this.connectionConfig.host = this.config.host 
        this.connectionConfig.user = this.config.user
        this.connectionConfig.password = this.config.password
        this.connectionConfig.database = this.config.database

        this.connectionConfig.waitForConnections = this.config.waitForConnections | null 
        this.connectionConfig.connectionLimit = this.config.connectionLimit | null
        this.connectionConfig.queueLimit = this.config.queueLimit | null
        try{
            this.pool = mysql2.createConnection(this.connectionConfig)
        } catch(err) {
            console.log(err);
            console.log('创建数据库池失败请检查SqlSessionFactoryBuilder配置文件')
        }
       return this.pool;
    }

}

class MapperSQLParser{
    constructor(){
        this.url = path.resolve(__dirname, 'mapperSQL.json')
        this.config = null // 配置文件转换后的JS对象
        this.mapperSQL = new Map()
    }

    getResource(resource){
        if(this.config != null)
            throw '不能重复加载mapperSQL配置文件'
        var data = fs.readFileSync(resource)
        this.config = JSON.parse(data)
    }
    
    getResource(){
        if(this.config != null)
            throw '不能重复加载mapperSQL配置文件'
        var data = fs.readFileSync(this.url)
        this.config = JSON.parse(data)
    }

    mapperSQLToSting(){
        if(this.config == null)
            throw '没有读入mapperSQL配置文件'
        return JSON.stringify(this.config)
    }

    build(){
        for(var id in this.config){
            console.log(id)
            console.log(this.config[id])
            this.mapperSQL.set(id, new sqlNodeParser(this.config[id]))
        }
        console.log(this.mapperSQL)
    }

    getRetSQL(id,parameter){
        this.mapperSQL.get(id).getRetSQL(parameter)
    }
}

class sqlNodeParser{
    constructor(sqlNode){
        this.sql = sqlNode['sql']
        this.if = null
        this.when = null
        this.otherwise = null
        this.where = null
        this.set = null
        this.foreach = null

        if(sqlNode['if'] != null)
            this.if = new ifNodeParser(sqlNode['if'])
        if(sqlNode['when'] != null)
            this.when = new whenNodeParser(sqlNode['when'])
        if(sqlNode['otherwise'] != null)
            this.otherwise = new otherwiseNodeParser(sqlNode['otherwise'])
        if(sqlNode['where'] != null)
            this.where = new whereNodeParser(sqlNode['where'])
        if(sqlNode['set'] != null)
            this.set = new setNodeParser(sqlNode['set'])
        if(sqlNode['foreach'] != null)
            this.foreach = new foreachNodeParser(sqlNode['foreach'])

        this.retSQL = "";
    }

    build(){
    
    }

    getRetSQL(parameter){
        if(this.if != null)
            this.if.getRetSQL(parameter)
        if(this.when != null)
            this.when.getRetSQL(parameter)
        if(this.otherwise != null)
            this.otherwise.getRetSQL(parameter)
        if(this.where != null)
            this.where.getRetSQL(parameter)
        if(this.set != null)
            this.set.getRetSQL(parameter)
        if(this.foreach != null)
            this.foreach.getRetSQL(parameter)

        
    }

}

class nodeParser{
    constructor(node){
        this.logic = new Array();
        this.sql = new Array();
        this.parserSQL = null;
        for(var a in node){
            this.logic.push(node[a]['logic'])
            this.sql.push(node[a]['sql'])
        }
        console.log(this.logic)
        console.log(this.sql)
        console.log(node.length)

    }

    getRetSQL(parameter){
        var arrayLogic = new Array();
        for(var a in this.logic){
            arrayLogic.push(this.logic[a].split(/\s+/))
            console.log(this.logic[a].split(/\s+/))
        }
    }


}

class ifNodeParser extends nodeParser{
    constructor(node){
        super(node)
    }
}

class whenNodeParser extends nodeParser{
    constructor(node){
        super(node)
    }
}

class otherwiseNodeParser extends nodeParser{
    constructor(node){
        super(node)
    }
}

class whereNodeParser extends nodeParser{
    constructor(node){
        super(node)
    }
}

class setNodeParser extends nodeParser{
    constructor(node){
        super(node)
    }
}

class foreachNodeParser extends nodeParser{
    constructor(node){
        super(node)
    }
}

class Token{
    constructor(string, num){
        if(string == null)
            throw '单词不能为空'
        if(num < 0)
            throw '种别码不能是负数'
        this.string = string
        this.num = num
    }
    toString(){
        return '<'+ this.string +',' + this.num + '>'
    }
}

class Lexer{
    constructor(project){
        this.reserveWord = new Array('null', 'true', 'false') // 保留字表 0-2
        this.operatorOrDelimiter = new Array('!', '(', ')', '==', '!=', '&&', '||') // 界符运算符表 3 - 9
        this.singleOperatorOrDelimiter = new Array('!', '(', ')') //单字符界位运算符表  3 - 5
        this.doubleOperatorOrDelimiter = new Array('==', '!=', '&&', '||') //双字符界位运算符表 6 - 9
        this.firstOperatorOrDelimiter = new Array('!', '(', ')', '=', '&', '|') // 界符运算符首字符表
        this.IDentifierTb = new Array() // 标识符表   100
        this.ip = -1 // 扫描指针
        this.tokenArray = new Array()
        this.project = project // 要扫描的文本
    }
    
    searchReserve(word){ // 查找保留字
        for(var a in this.reserveWord) {
            if(word == this.reserveWord[a])
                return parseInt(a)
        }
        return -1
    }

    isLetter(word){ // 判断字母
        if(word >= 'a' && word <= 'z' || word >= 'A' && word <= 'Z')
            return true
        return false
    }

    isDigit(word){ // 判断数字
        if(word >= '0' && word <= '9')
            return true
        return false
    }

    isSingleOperatorOrDelimiter(word){ // 判断单界位符运算符
        if(this.singleOperatorOrDelimiter.indexOf(word) == -1)
            return false
        return true
    }

    isDoubleOperatorOrDelimiter(word){ // 判断双界位符运算符
        if(this.doubleOperatorOrDelimiter.indexOf(word) == -1)
            return false
        return true
    }

    isFirstOperatorOrDelimiter(word){ // 判断界位符运算符的首字符
        if(this.firstOperatorOrDelimiter.indexOf(word) == -1)
            return false
        return true
    }

    
    filterResource(){ // 编译预处理 去除无关字符  换行和注释
       
    }

    scannerProject(){
        while(this.ip < this.project.length)
            this.scanner()
    }

    scanner(){
        var receiver = ''
        var ch = this.project[++this.ip] // 读入的字符

        while(ch == ' '){ // 过滤空格
            ch = this.project[++this.ip]
        }

        if(this.isLetter(ch)){ // 开头为字母
            receiver += ch // 收集
            ch = this.project[++this.ip] //下移
            while(this.isLetter(ch) || this.isDigit(ch) || ch == '_') { // 后跟字母或数字或下划线
                receiver += ch 
                ch = this.project[++this.ip]
            }
            var syn = this.searchReserve(receiver)
            if(syn == -1){  // 是标识符
                var token = new Token(receiver, 100)
                this.tokenArray.push()
                this.tokenArray.push(token)
                this.IDentifierTb.push(token)
                return 
            }
            this.tokenArray.push(new Token(receiver, syn)) // 关键字
            return 
        }
        else if(this.isDigit(ch)){ // 首字符为数字
            receiver += ch
            ch = this.project[++this.ip]
            while(this.isDigit(ch)){ // 后跟数字
                receiver.push(ch)
                ch = this.project[++this.ip]
            }
            this.tokenArray.push(new Token(receiver, 99)) // 常数
            return  
        }
        else if(this.isFirstOperatorOrDelimiter(ch)){ //为界位符运算符首字符
            receiver += ch
            ch = this.project[++this.ip]
            var ch2 = this.project[this.ip - 1] + ch
            if(this.isDoubleOperatorOrDelimiter(ch2)) {// 为双界位符运算符
                receiver += ch
                this.tokenArray.push(new Token(receiver, this.reserveWord.length + this.singleOperatorOrDelimiter.length + this.doubleOperatorOrDelimiter.indexOf(ch2) + 1) )
                return 
            }
            else{ // 为单位界位运算符
                this.tokenArray.push(new Token(receiver, this.reserveWord.length + this.singleOperatorOrDelimiter.indexOf(ch) + 1) )
                return 
            }
        }
    }

    getTokenArray(){
        return this.tokenArray
    }

    IDentifierTbToString(){
        return this.IDentifierTb
    }
}

var sqlSession = new SqlSessionFactoryBuilder()
sqlSession.getResource();
sqlSession.build();
// console.log(sqlSession.configToSting())
console.log("**********")

var mapperSQL = new MapperSQLParser()
mapperSQL.getResource()
mapperSQL.build()
// console.log(mapperSQL.mapperSQLToSting())
mapperSQL.getRetSQL("selectUsers",1)
console.log("**********")

var project = 'user_Name == null && user_ID != 2'

var lexer = new Lexer(project)
lexer.scannerProject()
console.log(project)
console.log(lexer.getTokenArray())
console.log('IDentifierTb: ')
console.log(lexer.IDentifierTbToString())