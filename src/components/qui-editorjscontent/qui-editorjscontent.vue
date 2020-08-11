<template>
  <view class="content">
    <view id="sg1" class="container px-4">
      <view v-for="(block, i) in input.blocks" :key="i">
        <view v-if="block.type == 'header'">
          <h1 v-if="block.data.level == 1" v-html="block.data.text"></h1>
          <h2 v-if="block.data.level == 2" v-html="block.data.text"></h2>
          <h3 v-if="block.data.level == 3" v-html="block.data.text"></h3>
          <h4 v-if="block.data.level == 4" v-html="block.data.text"></h4>
          <h5 v-if="block.data.level == 5" v-html="block.data.text"></h5>
          <h6 v-if="block.data.level == 6" v-html="block.data.text"></h6>
        </view>

        <view v-else-if="block.type == 'paragraph'">
          <p v-html="block.data.text"></p>
        </view>
        <view v-else-if="block.type == 'Markdown'">
          <p v-html="block.data.text"></p>
        </view>
        <view v-else-if="block.type == 'image'">
          <img :src="block.data.file.url" alt />
        </view>

        <view v-else-if="block.type == 'delimiter'">
          <view class="ce-delimiter text-center"></view>
        </view>

        <view v-else-if="block.type == 'list'">
          <ol v-if="block.data.style == 'ordered'" class="list-decimal list-inside mb-2">
            <li v-for="(item, key) in block.data.items" :key="key" v-html="item"></li>
          </ol>

          <ul v-else class="list-disc list-inside mb-2">
            <li v-for="(item, key) in block.data.items" :key="key" v-html="item"></li>
          </ul>
        </view>

        <view v-else-if="block.type == 'warning'">
          <view class="flex bg-yellow-200 max-w-sm mb-4">
            <view class="w-16 bg-yellow-400">
              <view class="p-4">
                <svg
                  class="h-8 w-8 text-white fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    d="M503.191 381.957c-.055-.096-.111-.19-.168-.286L312.267 63.218l-.059-.098c-9.104-15.01-23.51-25.577-40.561-29.752-17.053-4.178-34.709-1.461-49.72 7.644a66 66 0 0 0-22.108 22.109l-.058.097L9.004 381.669c-.057.096-.113.191-.168.287-8.779 15.203-11.112 32.915-6.569 49.872 4.543 16.958 15.416 31.131 30.62 39.91a65.88 65.88 0 0 0 32.143 8.804l.228.001h381.513l.227.001c36.237-.399 65.395-30.205 64.997-66.444a65.86 65.86 0 0 0-8.804-32.143zm-56.552 57.224H65.389a24.397 24.397 0 0 1-11.82-3.263c-5.635-3.253-9.665-8.507-11.349-14.792a24.196 24.196 0 0 1 2.365-18.364L235.211 84.53a24.453 24.453 0 0 1 8.169-8.154c5.564-3.374 12.11-4.381 18.429-2.833 6.305 1.544 11.633 5.444 15.009 10.986L467.44 402.76a24.402 24.402 0 0 1 3.194 11.793c.149 13.401-10.608 24.428-23.995 24.628z"
                  />
                  <path
                    d="M256.013 168.924c-11.422 0-20.681 9.26-20.681 20.681v90.085c0 11.423 9.26 20.681 20.681 20.681 11.423 0 20.681-9.259 20.681-20.681v-90.085c.001-11.421-9.258-20.681-20.681-20.681zM270.635 355.151c-3.843-3.851-9.173-6.057-14.624-6.057a20.831 20.831 0 0 0-14.624 6.057c-3.842 3.851-6.057 9.182-6.057 14.624 0 5.452 2.215 10.774 6.057 14.624a20.822 20.822 0 0 0 14.624 6.057c5.45 0 10.772-2.206 14.624-6.057a20.806 20.806 0 0 0 6.057-14.624 20.83 20.83 0 0 0-6.057-14.624z"
                  />
                </svg>
              </view>
            </view>
            <view class="w-auto text-gray-700 items-center p-4">
              <span class="text-lg font-bold pb-4">{{ block.data.title }}</span>
              <p class="leading-tight" v-html="block.data.message"></p>
            </view>
          </view>
        </view>

        <view v-else-if="block.type == 'embed'">
          <iframe
            width="560"
            height="315"
            :src="block.data.embed"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    // 图片
    input: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
};
</script>
<style lang="scss" scoped></style>
