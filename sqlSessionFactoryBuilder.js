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
    getString(){
        return this.string
    }
    getNum(){
        return this.num
    }
}

class Lexer{
    constructor(project){
        this.reserveWord = new Array('null', 'true', 'false') // 保留字表 0-2
        this.operatorOrDelimiter = new Array('!', '(', ')', '>', '<', '>=', '<=', '==', '!=', '&&', '||') // 界符运算符表 3 - 9
        this.singleOperatorOrDelimiter = new Array('!', '(', ')','>', '<') //单字符界位运算符表  3 - 7
        this.doubleOperatorOrDelimiter = new Array('>=', '<=','==', '!=', '&&', '||') //双字符界位运算符表 8 - 13
        this.firstOperatorOrDelimiter = new Array('!', '(', ')', '=', '&', '|', '<', '>') // 界符运算符首字符表
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
                receiver += ch
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

class SemanticSymbol{
    constructor(symbol, behavior){
        this.symbol = symbol
        this.behavior = behavior
    }

    toBehavior(){
        this.behavior()
    }
}

class SemanticBehavior{
    constructor(string, fun){
        this.string = string
        this.fun = fun
    }
    execute(variableHeap, stack, id){
        this.fun(variableHeap, stack, id)
    }
    
}

class stringObject{
    constructor(string){
        this.string = string
    }

    toString(){
        return this.string
    }
}

class SyntacticAnalyzer{
    constructor(tokenArray){
        this.COUNT = 99
        this.ID = 100
        this.ip = -1 // 扫描指针
        this.tokenArray = tokenArray // token序列
        this.tokenArray.push(new Token('ε', 111))// ε =  Alt + 42693
        this.tokenArray.push('$')
        this.stack = new Array(new stringObject('$'),'E')
        this.outPut = new Array()
        this.predictiveAnTb = new Map() // 预测表
        this.terminalSymbol = new Array('E', 'B', 'F', 'C', 'O') // 非终结符
        this.variableStack = new Array()

        this.predictiveAnTb.set('E,null', new Array('E', '-', '>', 'F', 'O', 'F', new stringObject('{a1}'), 'B') ) 
        this.predictiveAnTb.set('E,ID', new Array('E', '-', '>', 'F', 'O', 'F', new stringObject('{a1}'), 'B') )
        this.predictiveAnTb.set('E,COUNT', new Array('E', '-', '>', 'F', 'O', 'F', new stringObject('{a1}'), 'B') )

        this.predictiveAnTb.set('B,&&', new Array('B', '-', '>', 'C', 'E', new stringObject('{a7}')))
        this.predictiveAnTb.set('B,||', new Array('B', '-', '>', 'C', 'E', new stringObject('{a7}')))
        this.predictiveAnTb.set('B,ε', new Array('B', '-', '>', 'ε') )

        this.predictiveAnTb.set('F,null', new Array('F','-','>','null', new stringObject('{a3}')))
        this.predictiveAnTb.set('F,ID', new Array('F', '-', '>', 'ID', new stringObject('{a4}')))
        this.predictiveAnTb.set('F,COUNT', new Array('F', '-', '>', 'COUNT', new stringObject('{a8}')))

        this.predictiveAnTb.set('O,==', new Array('O', '-', '>', '==', new stringObject('{a5}')))
        this.predictiveAnTb.set('O,!=', new Array('O', '-', '>', '!=', new stringObject('{a5}')))
        this.predictiveAnTb.set('O,>', new Array('O', '-', '>', '>', new stringObject('{a5}')))
        this.predictiveAnTb.set('O,<', new Array('O', '-', '>', '<', new stringObject('{a5}')))
        this.predictiveAnTb.set('O,>=', new Array('O', '-', '>', '>=', new stringObject('{a5}')))
        this.predictiveAnTb.set('O,<=', new Array('O', '-', '>', '<=', new stringObject('{a5}')))

        this.predictiveAnTb.set('C,&&', new Array('C', '-', '>', '&&', new stringObject('{a6}')))
        this.predictiveAnTb.set('C,||', new Array('C', '-', '>', '||', new stringObject('{a6}')))


        this.semanticSymbol = new Array() // 语义符号
        this.semanticSymbolSize = 8 
        this.semanticSymbolTb = new Map()
        this.semanticStack = new Array()
        
        for(var i = 1; i <= this.semanticSymbolSize; i++){
            this.semanticSymbol.push('{a' + i + '}')    
        }
        
        this.semanticSymbolTb.set('{a1}', new SemanticBehavior('{a1}', function(variableHeap, stack, id){ 
            var v
            if(stack[stack.length - 2] == '=='){
                v = stack[stack.length - 1] == stack[stack.length - 3]
            }
            else if(stack[stack.length - 2] == '!='){
                v = stack[stack.length - 1] != stack[stack.length - 3]
            }
            else if(stack[stack.length - 2] == '>'){
                v = stack[stack.length - 1] > stack[stack.length - 3]
            }
            else if(stack[stack.length - 2] == '>='){
                v = stack[stack.length - 1] >= stack[stack.length - 3]
            }
            else if(stack[stack.length - 2] == '<'){
                v = stack[stack.length - 1] < stack[stack.length - 3]
            }
            else if(stack[stack.length - 2] == '<='){
                v = stack[stack.length - 1] <= stack[stack.length - 3]
            }
            //console.log('xxxxxxxxxxxxxx                      ' + v)
            for(var i = 1; i <= 3; i++)
                stack.pop()
            stack.push(v)
        }))
        this.semanticSymbolTb.set('{a2}', new SemanticBehavior('{a2}', function(variableHeap, stack, id){
            // id {&&, ||}
            stack.push(id)
         }))
        this.semanticSymbolTb.set('{a3}', new SemanticBehavior('{a3}', function(variableHeap, stack, id){
            stack.push(null) 
           
        }))
        this.semanticSymbolTb.set('{a4}', new SemanticBehavior('{a4}', function(variableHeap, stack, id){
            stack.push(variableHeap[id]) 
        }))
        this.semanticSymbolTb.set('{a5}', new SemanticBehavior('{a5}', function(variableHeap, stack, id){
           stack.push(id)
        }))
        this.semanticSymbolTb.set('{a6}', new SemanticBehavior('{a6}', function(variableHeap, stack, id){
            stack.push(id)
        }))
        this.semanticSymbolTb.set('{a7}', new SemanticBehavior('{a7}', function(variableHeap, stack, id){
            var o = stack[stack.length - 2]
            var v 
            if(o == '&&'){
                v = stack[stack.length - 1] && stack[stack.length - 3]
            }
            else if(o == '||'){
                v = stack[stack.length - 1] || stack[stack.length - 3]
            }
            //console.log('xxxxxxxxxxxx                                                ' + v)
            for(var i = 1; i <= 3; i++)
                stack.pop()
            stack.push(v)
            
        }))
        this.semanticSymbolTb.set('{a8}', new SemanticBehavior('{a8}', function(variableHeap, stack, id){
            stack.push(id)
        }))

        

        // this.semanticSymbolTb.set('{a18}', new SemanticBehavior('{a18}', function(variableHeap, stack, id){
        //     stack[stack.length - 2].LLV = stack[stack.length - 1]
           
        // }))
        
        
       
    }

    selectPATb(a, b){
        return this.predictiveAnTb.get(a+','+b)
    }

    selectSSTb(a){
        return this.semanticSymbolTb.get('{' + a + '}')
    }

    toSemantic(x, variableHeap, stack, id){
        // console.log(x)
        var a = this.semanticSymbolTb.get(x)
        if(a == undefined)
            throw '语义动作不存在:' + x
        //console.log(a)
        a.execute(variableHeap, stack, id)
    }

  
    toAltToken(ch){
        if(ch.getNum() == this.COUNT)
            return ch = new Token('COUNT', this.COUNT)
        else if(ch.getNum() == this.ID)
            return ch = new Token('ID', this.ID)
        return ch
    }

    scanner(variableHeap){
        var x = this.stack[this.stack.length - 1] // 栈顶符号
        var ch = this.tokenArray[++this.ip]
        var saveCh = null
        while(x != '$'){ // 栈非空
            ch = this.tokenArray[this.ip]
            
            if(this.semanticSymbol.indexOf(x.toString()) != -1){ // x在语义行为符号表中
              
               // console.log(x)
                this.toSemantic(x.toString(), variableHeap, this.variableStack, saveCh.getString())
                this.stack.pop()
                //console.log(this.variableStack)
                x = this.stack[this.stack.length - 1]
               
                continue
            }
        
            saveCh = ch
            var chToken = this.toAltToken(ch)
           
            var selectPAValue = this.selectPATb(x, chToken.getString())
            var b = (x + ',' + chToken.getString())
            if(x == chToken.getString()){ // X等于ip所指的符号chToken,执行栈的弹出操作
                
                this.stack.pop()
                this.ip++ // 指针下移
            }
            else if(this.terminalSymbol.indexOf(x) == -1){ // x不在非终结符表中
               
                throw 'error, 语法错误: \'' + x + '\' 不在非终结符表中'
            }
            else if(selectPAValue == undefined){
                //console.log(this.predictiveAnTb)
                
                throw 'error, 语法错误: '  + b + ' 是一个报错条目'
            }
            else { // 输出产生式， 弹出栈顶符号
                // console.log(b +':  ' + selectPAValue)
                this.stack.pop()
                for(var a = selectPAValue.length - 1; a >= 0; a--){ // 把生成式倒序压入栈中
                    if(selectPAValue[a] == '>')
                        break;
                    this.stack.push(selectPAValue[a])
                }

                // 打印生成式
                var log = ''
                for(var b in selectPAValue){
                    if(selectPAValue[b] != ',')
                        log += selectPAValue[b]
                }
                console.log(log)

                // // 语义动作进栈
                // for(var c in selectSSValue){
                //     this.stack.push(selectSSValue[c])
                // }
                
            }
            x = this.stack[this.stack.length - 1]
        }
        console.log('成功')
        console.log(this.stack)
        console.log(this.variableStack)
    }

    // scanner(){
    //     var a12 = ''
    //     var x = this.stack[this.stack.length - 1] // 栈顶符号
    //     var ch = this.tokenArray[++this.ip]
    //     while(x != '$'){ // 栈非空
    //         ch = this.tokenArray[this.ip]
    //         var saveCh = ch
    //         console.log(this.stack)
    //         if(this.semanticSymbol.indexOf(x) != -1){ // x在语义行为符号表中
    //             a12 += this.stack.pop()
    //             continue
    //         }
    //         else if(ch.getNum() == this.COUNT)
    //             ch = new Token('COUNT', this.COUNT)
    //         else if(ch.getNum() == this.ID)
    //             ch = new Token('ID', this.ID)
    //         var selectPAValue = this.selectPATb(x, ch.getString())
    //         var selectSSValue = this.selectSSTb(x, ch.getString())
    //         var b = (x + ',' + ch.getString())
    //         if(x == ch.getString()){ // X等于ip所指的符号ch,执行栈的弹出操作
    //             this.stack.pop()
    //             this.ip++ // 指针下移
    //         }
    //         else if(this.terminalSymbol.indexOf(x) == -1){ // x不在非终结符表中
    //             console.log(this.stack)
    //             console.log(this.semanticSymbol)
    //             throw 'error, 语法错误: \'' + x + '\' 不在非终结符表中'
    //         }
    //         else if(selectPAValue == undefined){
    //             //console.log(this.predictiveAnTb)
    //             console.log(this.stack)
    //             throw 'error, 语法错误: '  + b + ' 是一个报错条目'
    //         }
    //         else { // 输出产生式， 弹出栈顶符号
    //             // console.log(b +':  ' + selectPAValue)
    //             this.stack.pop()
    //             for(var a = selectPAValue.length - 1; a >= 0; a--){ // 把生成式倒序压入栈中
    //                 if(selectPAValue[a] == '>')
    //                     break;
    //                 this.stack.push(selectPAValue[a])
    //             }

    //             // 打印生成式
    //             var log = ''
    //             for(var b in selectPAValue){
    //                 if(selectPAValue[b] != ',')
    //                     log += selectPAValue[b]
    //             }
    //             console.log(log)

    //             // // 语义动作进栈
    //             // for(var c in selectSSValue){
    //             //     this.stack.push(selectSSValue[c])
    //             // }
                
    //         }
    //         x = this.stack[this.stack.length - 1]
    //     }
    //     console.log('成功')
    //     console.log(this.semanticStack)
    // }

    tbToString(){
        return this.predictiveAnTb
    }
    
    equalToken(string, token){
        console.log(string, token.getString())
        if(string == token.getString())
            return true
        else if(string == 'COUNT' && token.getNum() == this.COUNT)
            return true
        else if(string == 'ID' && token.getNum() == this.ID)
            return true
        else
            return false
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

var project = 'user_Name == null && user_ID != 12 || users_Name != root'
var project2 = 'users_password != null && users_id >= 3 '
var heap = {
    'user_Name': 'lemon',
    'user_ID': '123',
    'users_Name': 'lemon-2',
    'root': 'root'
}

var heap2 = {
    'users_password': '123',
    'users_id': 4
}

var lexer = new Lexer(project2)
lexer.scannerProject()
console.log(project)
console.log(lexer.getTokenArray())
console.log('IDentifierTb: ')
console.log(lexer.IDentifierTbToString())




console.log('\n\n\n\n')
var syntacticAnalyzer = new SyntacticAnalyzer(lexer.getTokenArray())
console.log(lexer.getTokenArray)
console.log(syntacticAnalyzer)
console.log('\n\n\n\n')
syntacticAnalyzer.scanner(heap2)
// console.log(syntacticAnalyzer.tbToString())
// console.log(syntacticAnalyzer.selectTb('E','!'))
// console.log(syntacticAnalyzer.selectTb('E','!='))