# Git 分支 - 分支开发工作流

## 分支命名和职责

![分支开发工作流](https://user-gold-cdn.xitu.io/2019/5/21/16ad91bdb94c4675?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 一、长期存在的分支

1. `master` 分支

    `master` 为主分支，也是用于部署生产环境的分支，确保 `master` 分支稳定性</br>
    `master` 分支一般由 `dev` 以及 `hotfix` 分支合并，任何时间都不能直接修改代码

2. `dev` 分支

    `dev` 为开发分支，始终保持最新完成以及 bug 修复后的代码</br>
    一般开发的新功能时，`feature` 分支都是基于 `dev` 分支下创建的

### 二、建议的其它分支

1. `feature` 分支

   开发新功能时，以 `dev` 为基础创建 `feature` 分支</br>
   分支命名: `feature/` 开头的为特性分支， 命名规则: `feature/user-module`、 `feature/cart-module`

2. `hotfix` 分支

    分支命名: `hotfix/` 开头的为修复分支，它的命名规则与 `feature` 分支类似</br>
    线上出现紧急问题时，需要及时修复，以 `master` 分支为基线，创建 `hotfix` 分支，修复完成后，需要合并到 `master` 分支和 `dev` 分支

3. `release` 分支

	`release` 为预上线分支，发布提测阶段，会以 `release` 分支代码为基准提测

> 当有一组 `feature` 开发完成，首先会合并到 `dev` 分支，进入提测时，会创建 `release` 分支。
> 如果测试过程中若存在bug需要修复，则直接由开发者在 `release` 分支修复并提交。
> 当测试完成之后，合并 `release` 分支到 `master` 和 `dev` 分支，此时 `master` 为最新代码，用作上线。

## 标签，版本管理

采用 [semver 语义化版本](https://semver.org/lang/zh-CN/) 标准

- 版本格式：主版本号.次版本号.修订号
  1. 主版本号：当你做了不兼容的 API 修改，
  2. 次版本号：当你做了向下兼容的功能性新增，
  3. 修订号：当你做了向下兼容的问题修正。

推荐可以使用 [standard-version](https://github.com/conventional-changelog/standard-version) 进行版本管理，如本项目在 `package.json` 中添加该依赖并且加入了相关的命令(这个可以配合 CI 流程进行)

```json
"release:major": "standard-version -r major -n", // 主版本更改
"release:minor": "standard-version -r minor -n", // 次版本更改
"release:patch": "standard-version -r patch -n", // 修复版本更改
"prerelease:alpha": "standard-version -p alpha -n", // alpha 版本
"prerelease:beta": "standard-version -p beta -n" // beta 版本
```

## 常见任务

1. 增加新功能

   ```bash
   (dev)$: git checkout -b feature/xxx            # 从 dev 建立特性分支
   (feature/xxx)$: blabla                         # 开发
   (feature/xxx)$: git add xxx										 # 添加文件的时候注意一定不要将不相关的文件都带到远程仓库
   (feature/xxx)$: git commit -m 'feat: 功能说明'
   (dev)$: git merge feature/xxx --no-ff          # 把特性分支合并到 dev
   ```

2. 修复紧急 bug

   ```bash
   (master)$: git checkout -b hotfix/xxx         # 从master建立 hotfix 分支
   (hotfix/xxx)$: blabla                         # 开发
   (hotfix/xxx)$: git add xxx										# 添加文件的时候注意一定不要将不相关的文件都带到远程仓库
   (hotfix/xxx)$: git commit -m 'commit comment'
   (master)$: git merge hotfix/xxx --no-ff       # 把 hotfix 分支合并到 master，并上线到生产环境
   (dev)$: git merge hotfix/xxx --no-ff          # 把 hotfix 分支合并到 dev，同步代码
   ```

3. 测试|预发布环境

   ```bash
   (release)$: git merge dev --no-ff             # 把dev分支合并到release，然后在测试环境拉取并测试
   ```

4. 生成环境代码

   ```bash
   (master)$: git merge release --no-ff          # 把release测试好的代码合并到master，运维人员操作
   # 打 tag 标签：这个根据实际情况来进行 alpha、patch、minor、major 版本发布
   (master)$: npm run prerelease:alpha|release:patch|release:minor|release:major
   ```


