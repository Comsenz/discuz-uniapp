# 命名约定

> https://juejin.im/entry/599d433cf265da24797b5c66

ECMAScript 规范中标识符采用驼峰大小写格式，驼峰命名法由小(大)写字母开始，后续每个单词首字母都大写。根据首字母是否大写，分为两种方式：

1. **Pascal Case 大驼峰式命名法：** 首字母大写。eg：StudentInfo、UserInfo、ProductInfo
2. **Camel Case 小驼峰式命名法：** 首字母小写。eg：studentInfo、userInfo、productInfo

    标识符，则包括变量、函数名、类名、属性名和函数或类的参数，每个命名方法又略有不同。

    另外这里还加入针对于文件和目录的命名方式：

3. **连接符全小写命名法（全部小写，可以包含连字符 `-`）：** ucenter、ucenter-setting

## 1. 文件|目录命名

- 命名方式：连接符全小写命名法
- 命名规范：前缀应当是名词
- 命名建议：尽量在文件或者目录名字中体现改文件或目录的主要用途

  在此项目中建议所有非外部组件命名都以 `qui-` 前缀开头。如果是引入外部组件，只将文件和目录的所有命名改成小写即可

  eg:
  ```
  |-- src
  | |-- components        组件
  | | |-- qui-page
  | | |-- qui-list
  | | |-- qui-list-item
  | | |-- qui-popup
  | | |-- ...
  | |-- pages             页面
  | | |-- index
  | | |-- ucenter
  | | | |-- index.vue
  | | | |-- setting.vue
  | | |-- ...
  ```

## 2. 变量

- 命名方法：小驼峰式命名法。
- 命名规范：前缀应当是名词。(函数的名字前缀为动词，以此区分变量和函数)
- 命名建议：尽量在变量名字中体现所属类型，如:length、count等表示数字类型；而包含name、title表示为字符串类型。

  eg:
  ```javascript
  // Good
  let maxCount = 10;
  let tableTitle = 'LoginTable';
  // Bad
  let setCount = 10;
  let getTitle = 'LoginTable';
  ```

## 3. 常量

- 命名方法：名称全部大写。
- 命名规范：使用大写字母和下划线来组合命名，下划线用以分割单词。

  eg:
  ```javascript
  const MAX_COUNT = 10;
  const URL = 'http://www.foreverz.com';
  ```

## 4. 函数

- 命名方法：小驼峰式命名法。

- 命名规范：前缀应当为动词。

- 命名建议：可使用常见动词约定

  | 动词	|含义	| 返回值 |
  |----|----|----|
  |can | 判断是否可执行某个动作(权限)	|函数返回一个布尔值。 true：可执行；false：不可执行 |
  |has	|判断是否含有某个值	|函数返回一个布尔值。true：含有此值；false：不含有此值|
  |is	|判断是否为某个值	|函数返回一个布尔值。true：为某个值；false：不为某个值|
  |get	|获取某个值	|函数返回一个非布尔值|
  |set	|设置某个值	|无返回值、返回是否设置成功或者返回链式对象|
  |load	|加载某些数据	|无返回值或者返回是否加载完成的结果|

  eg:
	```javascript
  // 是否可阅读
  function canRead() {
      return true;
  }
  // 获取名称
  function getName() {
      return this.name;
  }
  ```

## 5. 类 & 构造函数

- 命名方法：大驼峰式命名法，首字母大写。
- 命名规范：前缀为名称。

  eg:
  ```javascript
  class Person {
    constructor(name) {
      this.name = name;
    }
  }
  const person = new Person('mevyn');
  ```

## 6. 注释规范

> js 支持三种不同类型的注释：行内注释、单行注释和多行注释：

### 6.1 行内注释

- 说明：行内注释以两个斜线开始，以行尾结束。
- 语法：code // 这是行内注释
- 使用方式：//(双斜线)与代码之间保留一个空格，并且//(双斜线)与注释文字之间保留一个空格。
- 命名建议：

  ```javascript
  // 用来显示一个解释的评论
  // -> 用来显示表达式的结果，
  // >用来显示 console 的输出结果，
  eg:

  function test() { // 测试函数
    console.log('Hello World!'); // >Hello World!
    return 3 + 2; // ->5
  }
  ```

### 6.2 单行注释

- 说明：单行注释以两个斜线开始，以行尾结束。
- 语法：// 这是单行注释
- 使用方式：单独一行：//(双斜线)与注释文字之间保留一个空格。

  ```javascript
  eg：

  // 调用了一个函数；1)单独在一行
  setTitle();
  ```

### 6.3 多行注释

- 说明：以 /* 开头， */ 结尾
- 语法：/* 注释说明 */
- 使用方法：若开始/*和结束*/都在一行，推荐采用单行注释。若至少三行注释时，第一行为/*，最后行为*/，其他行以*开始，并且注释文字与*保留一个空格。
	```javascript
  /**
   * 代码执行到这里后会调用setTitle()函数
   * setTitle()：设置title的值
   */
  setTitle();
  ```
### 6.4 函数(方法)注释

- 说明：函数(方法)注释也是多行注释的一种，但是包含了特殊的注释要求，参照 [ESDoc]()
- 语法：
  ```javascript
  /**
   * 函数说明
   * @关键字
   */
  ```

- 常用注释关键字：(只列出一部分，并不是全部)

|注释名|	语法|	含义	|示例|
|----|----|----|----|
|@param|	@param {参数类型} 参数名 描述信息|	描述参数的信息|	@param name {String} 传入名称|
|@return|	@return {返回类型} 描述信息|	描述返回值的信息|	@return {Boolean} true:可执行;false:不可执行|
|@author|	@author 作者信息 [附属信息：如邮箱、日期]|	描述此函数作者的信息|	@author 张三 2015/07/21|
|@version|	@version XX.XX.XX	|描述此函数的版本号|	@version 1.0.3|
|@example|	@example 示例代码	|演示函数的使用|	@example setTitle(‘测试’)|

```javascript
/**
 * 合并Grid的行
 * @param {Ext.Grid.Panel} grid 需要合并的Grid
 * @param {Array} cols 需要合并列的Index(序号)数组；从0开始计数，序号也包含。
 * @param {Boolean} isAllSome 是否2个tr的cols必须完成一样才能进行合并。true：完成一样；false(默认)：不完全一样
 * @return void
 * @author polk6 2015/07/21
 * @example
 * _________________                             _________________
 * |  年龄 |  姓名 |                             |  年龄 |  姓名 |
 * -----------------      mergeCells(grid,[0])   -----------------
 * |  18   |  张三 |              =>             |       |  张三 |
 * -----------------                             -  18   ---------
 * |  18   |  王五 |                             |       |  王五 |
 * -----------------                             -----------------
 */
function mergeCells(grid: Ext.Grid.Panel, cols: Number[], isAllSome: boolean = false) {
  // Do Something
}
````
