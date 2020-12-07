# 多场景开发方案

多场景开发方案是指在在既有的DZQ的样式，布局，交互或功能上提供进一步的修改，用于扩充DZQ的能力，或者是用于自定义样式和交互。

为了可以使DZQ同时可以进行多场景自定义修改，还能支持对于持续更新维护的DZQ做进一步的更新，所以必须遵从以下规范进行开发。
- 对于多场景必须是建立一条长期维护分支，命名规范为（releases-xxx）。
- 如果遇到对于样式重写或交互布局重写等，必须遵从minxins开发方式进行修改。
- 如果多场景下对于原有功能不修改，补充新功能，必须做好判断以及使用多场景下对应自定义的环境变量进行条件编译

# 多场景开发命令

可以根据自己的场景进行命令，并替换下面代码中的pay即可

> package.json
```json
{
    // 以下命令为pay（支付场景下的命令）
    "scripts": {
        "dev:h5-pay": "cross-env NODE_ENV=development uniapp-cli custom --mode development \"h5-pay\"",
        "build:h5-pay": "cross-env NODE_ENV=production UNI_OUTPUT_DIR=dist/build/h5-pay uniapp-cli custom --mode production \"h5-pay\" --fix",
        "dev:mp-weixin-pay": "cross-env NODE_ENV=development UNI_PLATFORM=mp-weixin UNI_OUTPUT_DIR=dist/build/mp-weixin-pay uniapp-cli custom --mode development \"mp-weixin-pay\"",
        "build:mp-weixin-pay": "cross-env NODE_ENV=production UNI_PLATFORM=mp-weixin UNI_OUTPUT_DIR=dist/build/mp-weixin-pay uniapp-cli custom --mode production \"mp-weixin-pay\" --fix"
    },
    // 对自定义环境进行自定义的条件编译字段
    "uni-app": {
        "scripts": {
            "h5-pay": {
                "title": "h5-pay",
                "BROWSER": "Chrome",
                "env": {
                    "UNI_PLATFORM": "h5"
                },
                "define": {
                    "H5-PLAY": true
                }
            },
            "mp-weixin-pay": {
                "title": "mp-weixin-pay",
                "BROWSER": "Chrome",
                "env": {
                    "UNI_PLATFORM": "mp-weixin"
                },
                "define": {
                    "MP-WEIXIN-PLAY": true
                }
            }
        }
    }
}

```

## minxin开发方式

假如现在有一个A.vue文件，在你的场景下，需要对A.vue进行重写样式，或者大量修改来满足你的场景需要的情况，那么你可以采用这种方式来进行编写。

> home.vue

```javascript

<template>
  <A></A>
</template>

<script>
export default {
    //....
}
</script>
<style lang="scss">
// ....
</style>

```

> A.vue
```javascript

<template>
  <view>A.vue</view>
</template>

<script>
export default {

}
</script>
<style lang="scss">
// ....
</style>

```

那么可以考虑这样编写新的A组件

> A-pay.vue

```javascript

<template>
  <view>A-pay.vue</view>
</template>

<script>
export default {

}
</script>
<style lang="scss">
// ....
</style>

```

引用组件时，可以使用自定义的编译条件

> home.vue

```javascript

<template>
    <!-- #ifdef H5-PLAY --> 
    <A-pay></A-pay>
    <!-- #endif --> 
    <!-- #ifndef H5-PLAY --> 
    <A></A>
    <!-- #endif --> 
</template>

<script>
export default {
    //....
}
</script>
<style lang="scss">
// ....
</style>

```


# 文件输出

通过在新增的命令中配置`UNI_OUTPUT_DIR`参数，来控制不同环境变量下输出到不同的目录下，理论上不同的场景应该输出到对应不同的目录当中。

