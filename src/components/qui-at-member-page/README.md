# AtMemberPage @人员页面

## 使用

单独页面，按照路径跳转即可。
`components/qui-at-member-page/qui-at-member-page`

### 页面说明

```text
 第一次进入页面，是加载用户关注的人。在搜索框内搜索的话，是从站点成员里面搜索并加载。
```

### 选中按钮

```text
 选择成员后，点击按钮后，会把用户信息存到vuex里，然后返回上一页。返回后直接去vuex里获取值即可。
 选中成员列表存的值是:atMemberData，所在模型为：atMember
```

### 获取多选成员示例

```javascript
import { mapState } from 'vuex';

computed: {
  ...mapState({
    getAtMemberData: state => state.atMember.atMemberData,
  })
}

methods:{
  getAtMember() {
    return this.getAtMemberData;
  }
}
```
