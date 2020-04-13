## 整体流程

统一规范：使用WEB前端框架[AngularJS]的[Git信息提交规范]

## 统一规范
### Commit信息的格式

每次提交，Commit信息都包括三个部分：`header`，`body`，`footer`。

```
<type>(<scope>): <subject> // header
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

例如：

```
fix(release): need to depend on latest rxjs and zone.js

The version in our package.json gets copied to the one we publish, and users need the latest of these.
```

### 1. Header

其中`header`是必须的，包括`type`、`scope`、`subject`三个字段，`header`的`scope`字段是可选的。

### 1.1 Type （ [AngularJS]框架中给出的规范）

- feat： 新功能（feature）
- fix：bug修补
- docs：文档的更改
- perf：代码更改提高性能
- style： 格式的更改（不影响代码运行的变动，比如：空格，代码格式化，丢失分号等）
- refactor：重构（即不是新增功能，也不是修改bug的代码变动）
- test：增加测试或者更正已经存在的测试
- chore：构建过程或辅助工具的变动
- build：更改影响构建系统或者额外的依赖（例如：gulp，npm）
- ci：更改CI配置文件和脚本（例如：Travis，Circle）
- revert: 如果返回之前的提交时说明的 type 类型使用 revert

### 1.2 Scope

用于描述更改内容影响的范围或文件，例如：

```
docs(changelog): update change log to beta.5
docs(readme.md): update readme
```

### 1.3 Subject

主要是对于提交目的的简短描述。

### 2. Body

Body部分主要是针对本次 `commit` 的详细描述。使用现在时；而且应该说明代码变动的动机，以及和上一次变动行为进行对比。

### 3. Footer

包括两种情况

1）Breaking changes （不兼容变动）
> [Breaking changes wiki] A change in one part of a software system that potentially causes other components to fail; occurs most often in shared libraries of code used by multiple applications
> 软件系统的一个部分发生变化，可能导致其他组件发生故障;在多个应用程序使用的共享代码库中经常出现.

需要以 `BREAKING CHANGE:` 开头，紧跟一个空格或者两个空行，后面是本次变动的描述信息。

2） Referencing issues （引用问题）

本次代码的变动如果也针对某个 `issue` 的关闭，那么以 `"Closes"` 关键词开头，如：

```
Closes #234
```

### 例子

```
fix($compile): couple of unit tests for IE9

Older IEs serialize html uppercased, but IE9 does not...
Would be better to expect case insensitive, unfortunately jasmine does
not allow to user regexps for throw expectations.

Closes #392
Breaks foo.bar api, foo.baz should be used instead
```

```
feat($compile): simplify isolate scope bindings

Changed the isolate scope binding options to:
  - @attr - attribute binding (including interpolation)
  - =model - by-directional model binding
  - &expr - expression execution binding

This change simplifies the terminology as well as
number of choices available to the developer. It
also supports local name aliasing from the parent.

BREAKING CHANGE: isolate scope bindings definition has changed and
the inject option for the directive controller injection was removed.

To migrate the code follow the example below:

Before:

scope: {
  myAttr: 'attribute',
  myBind: 'bind',
  myExpression: 'expression',
  myEval: 'evaluate',
  myAccessor: 'accessor'
}

After:

scope: {
  myAttr: '@',
  myBind: '@',
  myExpression: '&',
  // myEval - usually not useful, but in cases where the expression is assignable, you can use '='
  myAccessor: '=' // in directive's template change myAccessor() to myAccessor
}

The removed `inject` wasn't generaly useful for directives so there should be no code using it.
```

## 参考

1. [AngularJS Git Commit Message Conventions]

[Git信息提交规范]: (https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit)
[AngularJS]: (https://github.com/angular/angular)
[Commitizen]: (https://github.com/ctaodream/cz-cli)
[conventional-changelog-cli]: (https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli)
[Breaking changes wiki]: (https://en.wiktionary.org/wiki/breaking_change)
[AngularJS Git Commit Message Conventions]: (https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#)
[TortoiseGit]: (https://tortoisegit.org/)
[Sourcetree]: (https://www.sourcetreeapp.com/)
