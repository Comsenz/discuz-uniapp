<template>
  <qui-page :data-qui-theme="theme">
    <view class="post-box" v-if="loadStatus">
      <view class="post-box__title" v-if="type === 1">
        <input
          v-if="type === 1"
          class="post-box__title-input"
          type="text"
          v-model="postTitle"
          :focus="type === 1"
          :placeholder="i18n.t('discuzq.post.pleaseEnterAPostTitle')"
        />
      </view>

      <view class="post-box__titles" v-if="type === 5">
        <qui-cell-item
          v-if="type === 5"
          :title="i18n.t('discuzq.post.askedUsers')"
          slot-right
          arrow
          @tap="changeAvatar"
        >
          <qui-avatar
            class="my-profile__avatar"
            :user="{ avatarUrl: userImage, username: beUserName }"
            style="margin-right: 20rpx;"
          />
          <view class="username">{{ beUserName }}</view>
        </qui-cell-item>
      </view>

      <!-- #ifdef MP-WEIXIN -->
      <view class="post-box__hd">
        <view class="post-box__hd-l">
          <qui-icon
            class="post-box__hd-l__icon"
            name="icon-expression"
            size="40"
            :color="emojiShow ? '#1878F3' : '#777'"
            @click="emojiclick"
          ></qui-icon>
          <qui-icon
            class="post-box__hd-l__icon"
            name="icon-call"
            size="40"
            color="#777"
            @click="callClick"
          ></qui-icon>
          <qui-icon
            class="post-box__hd-l__icon"
            name="icon-wei"
            size="40"
            color="#777"
            @click="topicPage"
          ></qui-icon>
        </view>
        <text class="post-box__hd-r" v-if="type !== 5">
          {{
        textAreaValue.length &lt;= textAreaLength
        ? i18n.t('discuzq.post.note', { num: textAreaLength - textAreaValue.length })
        : i18n.t('discuzq.post.exceed', { num: textAreaValue.length - textAreaLength })
          }}
        </text>
        <text class="post-box__hd-r" v-if="type === 5">
          {{
        textAreaValue.length &lt;= textAreaLength
        ? i18n.t('discuzq.post.note', { num: textAreaLength - textAreaValue.length })
        : i18n.t('discuzq.post.exceed', { num: textAreaValue.length - textAreaLength })
          }}
        </text>
      </view>
      <view class="emoji-bd" v-show="emojiShow">
        <qui-emoji
          position="absolute"
          top="20rpx"
          border-radius="10rpx"
          @click="getEmojiClick"
        ></qui-emoji>
      </view>
      <view class="post-box__con">
        <textarea
          id="textarea"
          ref="textarea"
          class="post-box__con-text"
          :placeholder="
            type !== 5
              ? i18n.t('discuzq.post.placeholder')
              : i18n.t('discuzq.post.placeholderQuestion')
          "
          placeholder-class="textarea-placeholder"
          v-model="textAreaValue"
          auto-height="true"
          :show-confirm-bar="barStatus"
          :adjust-position="true"
          cursor-spacing="30"
          cursor="cursor"
          :maxlength="10000"
          :focus="type !== 1"
          v-show="textShow"
          @blur="contBlur"
          @focus="focusEvent"
        ></textarea>
        <view class="post-box__con-text post-box__con-text--static" v-show="!textShow">
          <text class="text-cover">{{ textAreaValue }}</text>
        </view>
        <view class="markdown-box" v-if="markdownShow">
          <view>
            <qui-icon
              name="icon-bold"
              size="30"
              class="qui-icon"
              @click="toolBarClick('bold')"
            ></qui-icon>
          </view>
          <view>
            <qui-icon
              name="icon-title"
              size="30"
              class="qui-icon"
              @click="toolBarClick('title')"
            ></qui-icon>
          </view>
          <view>
            <qui-icon
              name="icon-italic"
              size="30"
              class="qui-icon"
              @click="toolBarClick('italic')"
            ></qui-icon>
          </view>
          <view>
            <qui-icon
              name="icon-quote"
              size="30"
              class="qui-icon"
              @click="toolBarClick('quote')"
            ></qui-icon>
          </view>
          <view>
            <qui-icon
              name="icon-code"
              size="30"
              class="qui-icon"
              @click="toolBarClick('code')"
            ></qui-icon>
          </view>
          <view>
            <qui-icon
              name="icon-link"
              size="30"
              class="qui-icon"
              @click="toolBarClick('link')"
            ></qui-icon>
          </view>
          <view>
            <qui-icon
              name="icon-strikethrough"
              size="30"
              class="qui-icon"
              @click="toolBarClick('strikethrough')"
            ></qui-icon>
          </view>
        </view>
      </view>
      <!-- #endif -->

      <!-- #ifdef H5 -->
      <view v-if="type !== 1">
        <view class="post-box__hd">
          <view class="post-box__hd-l">
            <qui-icon
              class="post-box__hd-l__icon"
              name="icon-expression"
              size="40"
              :color="emojiShow ? '#1878F3' : '#777'"
              @click="emojiclick"
            ></qui-icon>
            <qui-icon
              class="post-box__hd-l__icon"
              name="icon-call"
              size="40"
              color="#777"
              @click="callClick"
            ></qui-icon>
            <qui-icon
              class="post-box__hd-l__icon"
              name="icon-wei"
              size="40"
              color="#777"
              @click="topicPage"
            ></qui-icon>
          </view>
          <text class="post-box__hd-r" v-if="type !== 5">
            {{
          textAreaValue.length &lt;= textAreaLength
          ? i18n.t('discuzq.post.note', { num: textAreaLength - textAreaValue.length })
          : i18n.t('discuzq.post.exceed', { num: textAreaValue.length - textAreaLength })
            }}
          </text>
          <text class="post-box__hd-r" v-if="type === 5">
            {{
          textAreaValue.length &lt;= textAreaLength
          ? i18n.t('discuzq.post.note', { num: textAnswerLength - textAreaValue.length })
          : i18n.t('discuzq.post.exceed', { num: textAreaValue.length - textAnswerLength })
            }}
          </text>
        </view>
        <view class="emoji-bd" v-show="emojiShow">
          <qui-emoji
            position="absolute"
            top="20rpx"
            border-radius="10rpx"
            @click="getEmojiClick"
          ></qui-emoji>
        </view>
        <view class="post-box__con">
          <textarea
            id="textarea"
            ref="textarea"
            class="post-box__con-text"
            :placeholder="
              type !== 5
                ? i18n.t('discuzq.post.placeholder')
                : i18n.t('discuzq.post.placeholderQuestion')
            "
            placeholder-class="textarea-placeholder"
            v-model="textAreaValue"
            auto-height="true"
            :show-confirm-bar="barStatus"
            :adjust-position="true"
            cursor-spacing="30"
            cursor="cursor"
            :maxlength="10000"
            :focus="type !== 1"
            v-show="textShow"
            @blur="contBlur"
            @focus="focusEvent"
          ></textarea>
          <view class="post-box__con-text post-box__con-text--static" v-show="!textShow">
            <text class="text-cover">{{ textAreaValue }}</text>
          </view>
          <view class="markdown-box" v-if="markdownShow">
            <view>
              <qui-icon
                name="icon-bold"
                size="30"
                class="qui-icon"
                @click="toolBarClick('bold')"
              ></qui-icon>
            </view>
            <view>
              <qui-icon
                name="icon-title"
                size="30"
                class="qui-icon"
                @click="toolBarClick('title')"
              ></qui-icon>
            </view>
            <view>
              <qui-icon
                name="icon-italic"
                size="30"
                class="qui-icon"
                @click="toolBarClick('italic')"
              ></qui-icon>
            </view>
            <view>
              <qui-icon
                name="icon-quote"
                size="30"
                class="qui-icon"
                @click="toolBarClick('quote')"
              ></qui-icon>
            </view>
            <view>
              <qui-icon
                name="icon-code"
                size="30"
                class="qui-icon"
                @click="toolBarClick('code')"
              ></qui-icon>
            </view>
            <view>
              <qui-icon
                name="icon-link"
                size="30"
                class="qui-icon"
                @click="toolBarClick('link')"
              ></qui-icon>
            </view>
            <view>
              <qui-icon
                name="icon-strikethrough"
                size="30"
                class="qui-icon"
                @click="toolBarClick('strikethrough')"
              ></qui-icon>
            </view>
          </view>
        </view>
      </view>
      <view v-else>
        <view v-if="!vditor" style="text-align: center;"><u-loading size="40"></u-loading></view>
        <qui-vditor ref="vditor"></qui-vditor>
      </view>
      <!-- #endif -->

      <!-- #ifdef MP-WEIXIN -->
      <qui-uploader
        :url="`${url}api/attachments`"
        :form-data="formData"
        :file-preview="filePreview"
        name="file"
        :async-clear="true"
        ref="upload"
        v-if="type === 1 || type === 3 || type === 5"
        @change="uploadChange"
        @clear="uploadClear"
        @uploadClick="uploadClick"
      ></qui-uploader>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <qui-uploader
        :url="`${url}api/attachments`"
        :form-data="formData"
        :file-preview="filePreview"
        name="file"
        :async-clear="true"
        ref="upload"
        v-if="type === 3 || type === 5"
        @change="uploadChange"
        @clear="uploadClear"
        @uploadClick="uploadClick"
      ></qui-uploader>
      <!-- #endif -->
      <qui-upload-file
        :url="`${url}api/attachments`"
        ref="uploadFiles"
        :header="header"
        :attachment-list="attachmentList"
        :file-format="forums.set_attach && forums.set_attach.support_file_ext"
        :file-size="forums.set_attach && forums.set_attach.support_max_size"
        v-if="type === 1 && type !== 5 && forums.other && forums.other.can_upload_attachments"
        @deleteItem="deleteFile"
      ></qui-upload-file>
      <qui-upload-video
        v-if="type === 2"
        ref="uploadVideo"
        :type-status="operating"
        :url="url"
        :video-before-list="videoBeforeList"
        :controls="controlsStatus"
        :choose-type="chooseType"
        @videoDel="videoDel"
      ></qui-upload-video>
      <view class="post-box__audio" v-if="type === 4">
        <qui-upload-audio
          ref="uploadAudio"
          :audio-before-list="audioBeforeList"
          @change="uploadAudioChange"
          @audioDel="audioDel"
        ></qui-upload-audio>
      </view>
      <qui-cell-item
        :title="i18n.t('discuzq.post.lookPay')"
        :addon="showPayType"
        arrow
        v-if="type === 1 && forums.other && forums.other.can_create_thread_paid && ioshide"
        @click="lookPay"
      ></qui-cell-item>
      <view v-if="type === 1">
        <qui-cell-item
          :class="price > 0 ? 'cell-item-right-text' : ''"
          :title="i18n.t('discuzq.post.paymentAmount')"
          :addon="showPrice"
          arrow
          v-if="
            type !== 0 &&
              showHidden &&
              forums.paycenter &&
              forums.paycenter.wxpay_close &&
              payType !== 0 &&
              forums.other.can_create_thread_paid &&
              ioshide
          "
          @click="cellClick('pay')"
        ></qui-cell-item>
      </view>
      <view
        v-else-if="
          type !== 0 && type !== 5 && type !== 6 && forums.other.can_create_thread_paid && ioshide
        "
      >
        <qui-cell-item
          :class="price > 0 ? 'cell-item-right-text' : ''"
          :title="
            type === 4
              ? i18n.t('discuzq.post.payByListeningToAudio')
              : i18n.t('discuzq.post.paymentAmount')
          "
          :addon="showPrice"
          arrow
          v-if="
            type !== 0 &&
              showHidden &&
              forums.paycenter.wxpay_close &&
              forums.other.can_create_thread_paid &&
              ioshide
          "
          @click="cellClick('pay')"
        ></qui-cell-item>
      </view>
      <!-- 匿名提问 -->
      <view class="uni-list-cell uni-list-cell-pd" v-if="type === 5">
        <view class="uni-list-cell-db">{{ i18n.t('discuzq.post.anonymousQuestions') }}</view>
        <u-switch @change="changeCheck" v-model="checked" active-color="#1E78F3"></u-switch>
      </view>
      <!-- 他人围观 -->
      <view
        class="uni-list-cell uni-list-cell-pd"
        v-if="type === 5 && forums.other && forums.other.can_be_onlooker"
      >
        <view class="uni-list-cell-db">
          <view class="">
            {{ `${i18n.t('discuzq.post.otherPay')}${forums.set_site.site_onlooker_price}元` }}
          </view>
          <view class="watchpay">
            {{
              `${i18n.t('discuzq.post.youHaveTo')}
              ${haveDate}${i18n.t('discuzq.post.yuan')},
              ${i18n.t('discuzq.post.theAnswerIs')}
              ${answerIsDate}${i18n.t('discuzq.post.yuan')},
              ${i18n.t('discuzq.post.platform')}
              ${platformDate}${i18n.t('discuzq.post.yuan')}`
            }}
          </view>
        </view>
        <u-switch @change="changeCheck" v-model="watchChecked" active-color="#1E78F3"></u-switch>
      </view>

      <qui-cell-item
        :title="i18n.t('discuzq.post.freeWordCount')"
        :addon="i18n.t('discuzq.post.word', { num: word })"
        v-if="
          price > 0 &&
            type !== 3 &&
            type !== 2 &&
            type !== 0 &&
            type !== 4 &&
            type !== 5 &&
            payType !== 1 &&
            payType !== 0
        "
        arrow
        @click="cellClick('word')"
      ></qui-cell-item>
      <view v-if="type === 6">
        <view class="post-box__good" v-if="isShowGoods && type === 6 && dataGoodInfo">
          <view>
            <image class="post-box__good__image" lazy-load :src="dataGoodInfo.image_path" />
          </view>
          <view class="post-box__good__info">
            <view class="post-box__good__title">{{ dataGoodInfo.title }}</view>
            <view class="post-box__good__ft">
              <view class="post-box__good__price">￥{{ dataGoodInfo.price }}元</view>
              <qui-icon name="icon-delete" size="26" @click="deleteGoods"></qui-icon>
            </view>
          </view>
        </view>

        <view class="post-box__space" v-else @click="addGoods">
          <qui-icon name="icon-add" size="26"></qui-icon>
        </view>
      </view>
      <view class="post-box__position" v-if="forums.lbs && forums.lbs.lbs">
        <qui-cell-item arrow :slot-left="true" @click="choosePosition">
          <view>
            <qui-icon name="icon-weizhi" size="35" color="#777"></qui-icon>
            <text>
              {{
                currentPosition && currentPosition.location
                  ? currentPosition.location
                  : i18n.t('discuzq.post.addPosition')
              }}
            </text>
          </view>
        </qui-cell-item>
        <qui-icon
          name="icon-close1"
          size="32"
          color="#ccc"
          @tap="clearPosition"
          v-if="currentPosition && currentPosition.location"
        ></qui-icon>
      </view>

      <view class="post-box__ft">
        <text class="post-box__ft-tit">{{ i18n.t('discuzq.post.chooseCategory') }}</text>
        <view class="post-box__ft-categories">
          <qui-button
            v-for="(item, index) in allCategories"
            :key="item._jv.id"
            :type="Number(item._jv.id) === Number(categoryId) ? 'primary' : ''"
            :plain="Number(item._jv.id) === Number(categoryId)"
            :class="Number(item._jv.id) === Number(categoryId) ? 'cateActive' : ''"
            @click="checkClass(item, index)"
          >
            {{ item.name }}
          </qui-button>
        </view>
        <qui-button
          v-if="type !== 5"
          :loading="postLoading"
          type="primary"
          size="large"
          id="TencentCaptcha"
          :data-appid="(forums.qcloud && forums.qcloud.qcloud_captcha_app_id) || ''"
          @click="postClick"
          :disabled="textAreaValue.length > textAreaLength"
        >
          {{ i18n.t('discuzq.post.post') }}
        </qui-button>
        <qui-button
          v-if="type === 5"
          :loading="postLoading"
          type="primary"
          size="large"
          id="TencentCaptcha"
          :data-appid="(forums.qcloud && forums.qcloud.qcloud_captcha_app_id) || ''"
          @click="postAnswerClick"
          :disabled="textAreaValue.length > textAreaLength"
        >
          {{ i18n.t('discuzq.post.nextPay') }}
        </qui-button>
      </view>
      <!--支付组件-->
      <view v-if="payShowStatus">
        <qui-pay
          ref="payShow"
          :pay-type="payTypeText"
          :money="priceAsk"
          :wallet-status="user.canWalletPay"
          :balance="Number(user.walletBalance)"
          :pay-password="pwdVal"
          :pay-type-data="payTypeData"
          :to-name="beUserName"
          @paysureShow="paysureShow"
          @onInput="onInput"
          @radioChange="radioChange"
        ></qui-pay>
      </view>
      <uni-popup ref="lookPayPopup" type="bottom">
        <view class="popup-share">
          <view class="pay-type" @click="choicePayType(0)">
            {{ i18n.t('discuzq.post.TheContentAndTheAccessoriesIsFree') }}
          </view>
          <view class="pay-type" v-if="type === 1" @click="choicePayType(1)">
            {{ i18n.t('discuzq.post.TheContentIsFreeAndTheAccessoriesArePaid') }}
          </view>
          <view class="pay-type" @click="choicePayType(2)">
            {{ i18n.t('discuzq.post.TheContentAndTheAccessoriesIsPaid') }}
          </view>
          <view class="popup-share-content-space"></view>
          <text class="popup-share-btn" @click="cancelLookPay()">
            {{ i18n.t('discuzq.post.cancel') }}
          </text>
        </view>
      </uni-popup>
      <uni-popup ref="popupBtm" type="bottom">
        <view class="popup-share">
          <view class="popup-share-content">
            <text class="popup-title" v-if="type !== 5">
              {{
                setType === 'pay'
                  ? i18n.t('discuzq.post.selectToViewPaymentAmount')
                  : i18n.t('discuzq.post.selectToViewFreeWordCount')
              }}
            </text>
            <text class="popup-title" v-if="setType === 'pay' && type === 5">
              {{ i18n.t('discuzq.post.supportTheAuthorToContinueToCreate') }}
            </text>
            <view class="popup-content-btn" v-if="setType === 'pay'">
              <qui-button
                class="popup-btn"
                v-for="(item, index) in payNum"
                :key="index"
                :type="
                  payNumCheck.length > 0 && payNumCheck[0].name === item.name ? 'primary' : 'post'
                "
                plain
                size="post"
                @click="moneyClick(index)"
              >
                {{ item.name }}
              </qui-button>
            </view>
          </view>
          <view class="popup-share-content-space"></view>
          <text class="popup-share-btn" @click="cancel()">{{ i18n.t('discuzq.post.cancel') }}</text>
        </view>
      </uni-popup>
      <view v-if="popupStatus">
        <uni-popup ref="popup" type="center">
          <view class="popup-dialog">
            <view class="popup-dialog__top">
              <text>
                {{
                  setType === 'pay'
                    ? i18n.t('discuzq.post.enterToViewPaymentAmount')
                    : i18n.t('discuzq.post.enterTheWordCount')
                }}
              </text>
            </view>
            <view class="popup-dialog__cont">
              <qui-icon
                class="popup-dialog__cont-rmb"
                name="icon-rmb"
                size="40"
                v-if="setType === 'pay'"
              ></qui-icon>
              <text class="popup-dialog__cont-rmb" v-else>
                {{ i18n.t('discuzq.post.word', { num: '' }) }}
              </text>
              <input
                class="popup-dialog__cont-input"
                v-if="setType === 'pay'"
                v-model="inputPrice"
                type="digit"
                placeholder="0.0"
                :maxlength="maxLength"
                :focus="setType === 'pay'"
                @input="checkNum"
              />
              <input
                class="popup-dialog__cont-input"
                v-else
                v-model="inputWord"
                type="digit"
                placeholder="0"
                :maxlength="5"
                :focus="setType === 'word'"
              />
            </view>
            <view class="popup-dialog__ft">
              <button class="popup-btn--close" @click="diaLogClose">
                {{ i18n.t('discuzq.close') }}
              </button>
              <button
                class="popup-btn--ok"
                v-if="setType === 'pay'"
                :class="inputPrice > 0 ? 'popup-btn--ok--blue' : ''"
                :disabled="inputPrice === ''"
                @click="diaLogOk"
              >
                {{ i18n.t('discuzq.ok') }}
              </button>
              <button
                class="popup-btn--ok"
                v-else
                :class="inputWord > 0 ? 'popup-btn--ok--blue' : ''"
                :disabled="inputWord === ''"
                @click="diaLogOk"
              >
                {{ i18n.t('discuzq.ok') }}
              </button>
            </view>
          </view>
        </uni-popup>
      </view>
      <uni-popup ref="deletePopup" type="center">
        <uni-popup-dialog
          type="warn"
          :content="deleteTip"
          :before-close="true"
          @close="handleClickCancel"
          @confirm="handleClickOk"
        ></uni-popup-dialog>
      </uni-popup>
      <uni-popup ref="wechatPopup" type="center">
        <uni-popup-dialog
          type="warn"
          :content="wechatTip"
          :before-close="true"
          @close="handleWechatClickCancel"
          @confirm="handleWechatClickOk"
        ></uni-popup-dialog>
      </uni-popup>
      <qui-toast ref="toast"></qui-toast>
      <qui-loading-cover v-if="coverLoading" mask-zindex="111"></qui-loading-cover>
    </view>
  </qui-page>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { DISCUZ_REQUEST_HOST } from '@/common/const';
// import VodUploader from '@/common/cos-wx-sdk-v5.1';
import forums from '@/mixin/forums';
import user from '@/mixin/user';
import loginModule from '@/mixin/loginModule';
// #ifdef  H5
// import TcVod from 'vod-js-sdk-v6';
import tcaptchs from '@/utils/tcaptcha';
import appCommonH from '@/utils/commonHelper';
import choosePosition from '@/mixin/choosePosition';
// #endif
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog';

// 小程序与h5支付setInterval
let payWechat = null;
const payPhone = null;
export default {
  name: 'Post',
  components: { uniPopupDialog },
  mixins: [
    forums,
    user,
    loginModule,
    // #ifdef H5
    tcaptchs,
    choosePosition,
    appCommonH,
    // #endif
  ],
  data() {
    return {
      vditor: null,
      navTitle: '发布', // 导航栏标题
      loadStatus: '',
      textAreaValue: '', // 输入框内容
      markdownShow: false, // 是否显示markdown菜单
      barStatus: false, // 是否显示输入框获取焦点时完成的那一栏
      textAreaLength: 450, // 输入框可输入字
      textAnswerLength: 10000, // 问答输入框可输入字
      postTitle: '', // 标题
      checkClassData: [],
      type: 0, // 帖子类型
      price: 0, // 付费金额
      priceAsk: 0, // 提问价格
      pwdVal: '', // 提问价格的支付密码
      browser: 0, // 是不是浏览器
      inputPrice: '', // 付费金额输入框
      maxLength: 7, // 输入框长度
      inputWord: '', // 查看字数输入框
      operating: '', // 编辑或发布类型
      emojiShow: false, // 表情是否显示
      textShow: true, // 文本域是否显示
      header: {}, // 图片请求头部
      formData: {}, // 图片请求data
      captcha: null, // 腾讯云验证码实例
      captcha_ticket: '', // 腾讯云验证码返回票据
      captcha_rand_str: '', // 腾讯云验证码返回随机字符串
      userImage: '', // 被提问用户的头像
      beUserName: '', // 被提问用户的用户名
      checked: false, // 是否匿名
      watchChecked: false, // 他人围观
      watchShow: false, // 是否显示他人围观
      payShowStatus: true, // 是否显示支付
      haveDate: 0, // 你得
      answerIsDate: 0, // 回答者得
      platformDate: 0, // 平台得
      askingPrice: true, // 显示提问价格
      payNum: [
        {
          name: this.i18n.t('discuzq.post.TheContentAndTheAccessoriesIsFree'),
          pay: 0,
        },
        {
          name: '￥2',
          pay: 2,
        },
        {
          name: '￥5',
          pay: 5,
        },
        {
          name: '￥10',
          pay: 10,
        },
        {
          name: '￥20',
          pay: 20,
        },
        {
          name: '￥50',
          pay: 50,
        },
        {
          name: '￥88',
          pay: 88,
        },
        {
          name: '￥128',
          pay: 128,
        },
        {
          name: this.i18n.t('discuzq.post.customize'),
          pay: 0,
        },
      ], // 付费金额
      payNumCheck: [
        {
          name: '',
          pay: 0,
        },
      ], // 付费金额选中
      uploadFile: [], // 图片上传列表
      cursor: 0, // 内容输入框光标未知
      wordCountCheck: [
        {
          name: this.i18n.t('discuzq.post.word', { num: 0 }),
          num: 0,
        },
      ], // 查看字数选中
      word: 0, // 可查看字数
      setType: 'pay', // 金额或查看字
      controlsStatus: false, // 是否显示默认播放控件
      videoBeforeList: [], // 视频上传列表
      audioBeforeList: [], // 语音上传列表
      fullscreenStatus: false, // 视频全屏状态
      videoName: '', // 视频名称
      percent: 0, // 视频上传进度
      // videoPercent: 0, // 视频上传进度，用来控制进度条
      fileId: '', // 视频ID
      url: '', // 视频url
      postLoading: false, // 发布按钮loading状态
      allCategories: [], // 所有分类
      categoryIndex: '', // 分类下标
      categoryId: '', // 分类id
      threadId: '', // 编辑时主题id
      firstPostId: '', // 编辑时帖子id
      postDetails: {}, // 编辑时帖子详情
      filePreview: [], // 服务器上传
      uploadStatus: true, // 图片上传状态
      showHidden: true, // 付费金额的显示隐藏
      ticket: '',
      randstr: '',
      captchaResult: {},
      attachmentList: [], // 附件列表
      signatureVal: '',
      deleteType: '', // 删除类型 0为图片，1为附件，2为视频
      deleteId: '', // 当前点击要删除的图片Id
      deleteIndex: '', // 当前点击要删除的图片index
      deleteTip: '确定删除吗？', // 删除提示
      wechatTip: this.i18n.t('discuzq.wechatBind'), // 微信绑定提示
      currentPosition: {},
      watchMoeny: '1', // 他人付费需付费多少元
      beAskId: '', // 被提问人ID
      payTypeText: '', // 支付提问价格文案
      orderSn: '', // 提问支付订单号
      coverLoading: false, // 提问支付遮罩层
      payStatus: false, // 订单支付状态
      payTypeData: [
        {
          name: '微信支付',
          icon: 'icon-wxPay',
          color: '#09bb07',
          value: '0',
        },
        {
          name: '钱包支付',
          icon: 'icon-walletPay',
          color: '#1878f3',
          value: '1',
        },
      ], // 支付方式
      chooseType: 1, // 视频是从首页上传的还是从发布页上传的
      payType: 0, //  查看付费的方式，  0均免费， 1内容免费，附件付费，  2内容和附件都付费
      showPayType: '', // 选择的支付方式
      ioshide: false, // ios下付费隐藏
      isShowGoods: true,
      dataGoodInfo: {},
      goodsId: '', // 商品ID
      categoryid: 0,
      categoryindex: 0,
      postShow: false,
      popupStatus: false, // 这是自定义金额或者自定义字数弹框显示状态
    };
  },
  computed: {
    ...mapState({
      getAtMemberData: state => state.atMember.atMemberData,
    }),
    showPrice() {
      let pay = this.i18n.t('discuzq.post.free');
      if (this.price <= 0) {
        pay = this.i18n.t('discuzq.post.free');
      } else {
        pay = `￥${this.price + this.i18n.t('discuzq.post.yuan')}`;
      }
      return pay;
    },
    showAskPrice() {
      let payAsk = this.i18n.t('discuzq.post.free');
      if (this.priceAsk <= 0) {
        payAsk = this.i18n.t('discuzq.post.free');
      } else {
        payAsk = `￥${this.priceAsk + this.i18n.t('discuzq.post.yuan')}`;
      }
      return payAsk;
    },
    currentLoginId() {
      const userId = this.$store.getters['session/get']('userId');
      return parseInt(userId, 10);
    },
    // goodInfo() {
    //   const data = this.$store.getters['session/get']('good');
    //   // this.dataGoodInfo = data;
    //   console.log('取商品信息', data);
    //   if (data && data._jv) {
    //     return data;
    //   }
    //   return {};
    // },
  },
  updated() {
    if (this.forums) {
      this.platformDate = (
        this.forums.set_site.site_onlooker_price *
        (this.forums.set_site.site_master_scale / 10)
      ).toFixed(2);
      this.haveDate = ((this.forums.set_site.site_onlooker_price - this.platformDate) / 2).toFixed(
        2,
      );
      this.answerIsDate = (
        (this.forums.set_site.site_onlooker_price - this.platformDate) /
        2
      ).toFixed(2);
    }
    // #ifndef MP-WEIXIN
    this.$nextTick(() => {
      if (this.$refs.textarea) {
        this.$refs.textarea.$refs.textarea.style.overflowY = 'auto';
        this.$refs.textarea.$refs.textarea.style.paddingRight = '10px';
      }
    });
    // #endif
    uni.$on('uploadVideoOver', data => {
      // console.log('这是计算周期里获取到的上传后的数据', data);
      this.percent = 1;
      if (data.doneResult) {
        this.fileId = data.doneResult.fileId;
      }
      if (data.result) {
        this.fileId = data.result.fileId;
      }
    });
  },
  methods: {
    addGoods() {
      if (this.operating === 'edit') {
        uni.redirectTo({
          url: `/pages/topic/parse-goods?type=${this.type}&operating=edit&threadId=${this.threadId}`,
        });
      } else {
        uni.redirectTo({
          url: `/pages/topic/parse-goods?type=${this.type}`,
        });
      }
    },
    deleteGoods() {
      this.dataGoodInfo = [];
      this.isShowGoods = false;
    },
    // 允许围观
    changeCheck() {
      // this.checked !== this.checked;
    },
    choosePosition() {
      const that = this;
      if (that.currentPosition.location) {
        return;
      }
      // #ifdef H5
      this.saveThread();
      this.getPosition();
      // #endif
      // #ifdef MP-WEIXIN
      uni.getSetting({
        success(res) {
          if (!res.authSetting['scope.userLocation']) {
            uni.authorize({
              scope: 'scope.userLocation',
              success() {
                uni.chooseLocation({
                  success(res1) {
                    const positionData = res1;
                    positionData.location = res1.name;
                    that.currentPosition = positionData;
                  },
                });
              },
            });
          } else {
            uni.chooseLocation({
              success(res1) {
                const positionData = res1;
                positionData.location = res1.name;
                that.currentPosition = positionData;
              },
            });
          }
        },
      });
      // #endif
    },
    clearPosition() {
      this.currentPosition = {};
    },
    // 暂存帖子信息，以防选完地址回来页面刷新后丢失
    saveThread() {
      uni.removeStorageSync('current_thread');
      if (this.type === 1) {
        this.textAreaValue = this.vditor.getValue();
      }
      const thread = {};
      const items = [
        'postTitle',
        'price',
        'word',
        'fileId',
        'videoName',
        'textAreaValue',
        'categoryIndex',
        'categoryId',
        'checkClassData',
        'uploadFile',
        'videoBeforeList',
        'audioBeforeList',
        'checked',
        'watchChecked',
        'askingPrice',
        'watchShow',
        'priceAsk',
        'beAskId',
        'userImage',
        'beUserName',
        'type',
        'showHidden',
        'payType',
        'showPayType',
        'ioshide',
        'dataGoodInfo',
      ];
      items.forEach(key => {
        if (this[key]) {
          thread[key] = this[key];
        }
      });
      if (this.$refs.uploadFiles) {
        const fileList = this.$refs.uploadFiles.getValue();
        const attachmentList = [];
        fileList.forEach(v => {
          attachmentList.push({
            fileName: v.attributes.fileName,
            url: v.attributes.url,
            _jv: {
              id: v.id,
            },
          });
        });
        thread.attachmentList = attachmentList;
      }
      if (this.$refs.upload) {
        const imgList = this.$refs.upload.getValue();
        imgList.forEach((value, index) => {
          if (value.attributes) {
            imgList[index] = {
              path: value.attributes.thumbUrl,
              id: value.id,
              order: value.attributes.order,
              name: value.attributes.fileName,
              url: value.attributes.url,
            };
          }
        });
        thread.imgList = imgList;
      }
      uni.setStorageSync('current_thread', JSON.stringify(thread));
    },
    setThread() {
      let thread = uni.getStorageSync('current_thread');
      if (!thread) {
        return;
      }

      thread = JSON.parse(thread);
      // console.log(thread, '设置');
      this.dataGoodInfo = thread.dataGoodInfo;
      // console.log('这是商品信息', this.dataGoodInfo);
      Object.getOwnPropertyNames(thread).forEach(key => {
        if (key === 'imgList') {
          const threadImgList = thread[key];
          threadImgList.forEach((v, index) => {
            threadImgList[index] = {
              thumbUrl: v.path,
              _jv: {
                id: v.id,
              },
              order: v.order,
              fileName: v.name,
              url: v.url,
            };
          });
          const image = { firstPost: { images: [] } };
          image.firstPost.images = thread[key];
          this.setAnnex('img', image);
        } else {
          this[key] = thread[key];
        }
      });
      if (this.videoBeforeList.length > 0) {
        // this.videoPercent = 1;
        this.percent = 1;
      }

      uni.removeStorageSync('current_thread');
    },
    focusEvent() {
      // 这是获取焦点
    },
    toolBarClick(type) {
      let text = '';
      if (type === 'bold') {
        text = `${`${this.textAreaValue.slice(
          0,
          this.cursor,
        )}**粗体文字**${this.textAreaValue.slice(this.cursor)}`}`;
        this.cursor += 2;
        this.focusEvent(this.cursor);
      } else if (type === 'italic') {
        // this.textareaValue += '*斜体* ';
        text = `${`${this.textAreaValue.slice(0, this.cursor)}__${this.textAreaValue.slice(
          this.cursor,
        )}`}`;
        this.cursor += 1;
        this.focusEvent(this.cursor);
      } else if (type === 'title') {
        text = `${`${this.textAreaValue.slice(0, this.cursor)}\n### ${this.textAreaValue.slice(
          this.cursor,
        )}`}`;
        this.cursor += 4;
        this.focusEvent(this.cursor);
      } else if (type === 'quote') {
        text = `${`${this.textAreaValue.slice(0, this.cursor)}\n> ${this.textAreaValue.slice(
          this.cursor,
        )}`}`;
        this.cursor += 1;
        this.focusEvent(this.cursor);
      } else if (type === 'link') {
        text = `${`${this.textAreaValue.slice(0, this.cursor)}[](url)${this.textAreaValue.slice(
          this.cursor,
        )}`}`;
        this.cursor += 1;
        this.focusEvent(this.cursor);
      } else if (type === 'code') {
        text = `${`${this.textAreaValue.slice(0, this.cursor)}\`\`${this.textAreaValue.slice(
          this.cursor,
        )}`}`;
        this.cursor += 1;
        this.focusEvent(this.cursor);
      } else if (type === 'strikethrough') {
        text = `${`${this.textAreaValue.slice(0, this.cursor)}~~~~${this.textAreaValue.slice(
          this.cursor,
        )}`}`;
        this.cursor += 2;
        this.focusEvent(this.cursor);
      }
      this.textAreaValue = text;
    },
    ...mapMutations({
      setAtMember: 'atMember/SET_ATMEMBER',
    }),
    // 文章类型（0:文字  1:帖子  2:视频  3:图片）
    // 处理金额
    /* eslint-disable */
    checkNum(e) {
      let that = this;
      let price = e.target.value;
      let maxLength = price.indexOf('.');
      if (price.indexOf('.') < 0 && price != '') {
        // '超过4位则大于1万元';
        if (price.length > 6) {
          price = price.substring(0, price.length - 1);
          uni.showToast({
            title: that.c.TheAmountCannotExceedOneMillion,
            icon: 'none',
          });
        } else {
          price = parseFloat(price);
        }
      } else if (price.indexOf('.') == 0) {
        //'首位小数点情况'
        price = price.replace(/[^$#$]/g, '0.');
        price = price.replace(/\.{2,}/g, '.');
      } else if (!/^(\d?)+(\.\d{0,2})?$/.test(price)) {
        //去掉最后一位
        price = price.substring(0, price.length - 1);
      }
      that.$nextTick(function() {
        //'有小数点时，最大长度为9位，没有则是7位'
        that.maxLength = maxLength == -1 ? 7 : 10;
        that.inputPrice = price;
      });
    },
    // video相关方法
    videoDel() {
      this.deleteType = 2;
      // this.deleteId = id;
      // this.deleteIndex = del;
      this.$refs.deletePopup.open();
      this.deleteTip = this.i18n.t('core.deleteVideoSure');
    },
    playVideo(video) {
      // #ifdef MP-WEiXIN
      this.controlsStatus = true;
      this.videoContext.play();
      this.videoContext.requestFullScreen();
      // #endif
      // #ifdef H5
      uni.$emit('playVideo', video);
      // #endif
    },
    fullscreenchange(e) {
      this.fullscreenStatus = e.detail.fullScreen;
      if (!e.detail.fullScreen) {
        this.controlsStatus = false;
        this.videoContext.pause();
      }
    },
    // 点击表情
    emojiclick() {
      this.emojiShow = !this.emojiShow;
      this.textShow = !this.textShow;
    },
    // 弹框相关方法
    contBlur(e) {
      this.cursor = e.detail.cursor;
    },
    diaLogClose() {
      this.$refs.popup.close();
      this.popupStatus = false;
      this.textShow = true;
    },
    diaLogOk() {
      if (this.forums.set_site.site_minimum_amount === '') {
        if (this.inputPrice < '0.1') {
          uni.showToast({
            title: this.i18n.t('core.TheAmountCannotBeLessThanOneYuan'),
            icon: 'none',
          });
          return;
        }
      } else {
        if (this.inputPrice < this.forums.set_site.site_minimum_amount) {
          uni.showToast({
            title:
              this.i18n.t('core.TheAmountCannotBeLessThanMinMoney') +
              this.forums.set_site.site_minimum_amount +
              this.i18n.t('discuzq.post.yuan'),
            icon: 'none',
          });
          return;
        }
      }
      if (this.type === 5) {
        // if (this.inputPrice < '1.0') {
        //   uni.showToast({
        //     title: this.i18n.t('core.TheAmountCannotBeLessThanOneYuan'),
        //     icon: 'none',
        //   });
        //   return;
        // }
        this.priceAsk = this.inputPrice;
        this.$refs.popup.close();
        this.popupStatus = false;
        this.textShow = true;
        this.postClick();
        return;
      }

      if (this.setType === 'pay') {
        this.price = this.inputPrice;
      } else {
        this.word = this.inputWord;
      }
      this.$refs.popup.close();
      this.popupStatus = false;
      this.textShow = true;
    },
    moneyClick(index) {
      console.log(index, 'indexindex');
      // if (this.forums.set_site.site_onlooker_price === 0) {
      //   this.watchShow = false;
      // } else if (index === 0) {
      //   console.log('免费')
      //   this.payType = 0;
      //   // this.postClick();
      //   if (this.payType === 0) {
      //     this.showPayType = this.i18n.t('discuzq.post.TheContentAndTheAccessoriesIsFree');
      //   }
      //   this.watchShow = false;
      // } else {
      //   this.watchShow = true;
      // }
      if (this.forums.set_site.site_onlooker_price === 0) {
        this.watchShow = false;
      }
      if (index === 0) {
        this.postClick();
        // console.log('免费');
        this.payType = 0;
        if (this.payType === 0) {
          this.showPayType = this.i18n.t('discuzq.post.TheContentAndTheAccessoriesIsFree');
        }
        this.watchShow = false;
        return;
      } else {
        this.watchShow = true;
      }
      this.setType = 'pay';
      this.payNumCheck = [];
      this.payNumCheck.push(this.payNum[index]);
      // 自定义金额
      if (this.payNumCheck[0].name === this.i18n.t('discuzq.post.customize')) {
        console.log('自定义金额')
        this.textShow = false;
        this.$refs.popupBtm.close();
        this.popupStatus = true;
        this.$nextTick(() => {
          this.inputPrice = '';
          this.$refs.popup.open();
          this.textShow = false;
        });
      } else {
        if (this.type === 5 && index !== 0) {
          // console.log('选择金额')
          this.priceAsk = this.payNumCheck[0].pay;
          this.$refs.popupBtm.close();
          this.postClick();
          this.textShow = true;
          return;
        }
        this.price = this.payNumCheck[0].pay;
        this.$refs.popupBtm.close();
        this.textShow = true;
      }
    },
    // 点击显示查看支付的抽屉
    lookPay() {
      this.$refs.lookPayPopup.open();
    },
    // 取消查看支付选择
    cancelLookPay() {
      this.$refs.lookPayPopup.close();
    },
    // 选择支付查看的方式 0均免费， 1内容免费，附件付费，  2内容和附件都付费
    choicePayType(type) {
      // console.log(type, '类型');
      if (type === 0) {
        this.showPayType = this.i18n.t('discuzq.post.TheContentAndTheAccessoriesIsFree');
      } else if (type === 1) {
        this.payNumCheck = [];
        this.showPayType = this.i18n.t('discuzq.post.TheContentIsFreeAndTheAccessoriesArePaid');
      } else {
        this.payNumCheck = [];
        this.showPayType = this.i18n.t('discuzq.post.TheContentAndTheAccessoriesIsPaid');
      }
      this.payType = type;
      this.$refs.lookPayPopup.close();
    },
    cellClick(type) {
      this.setType = type;
      if (type === 'word') {
        this.popupStatus = true;
        this.$refs.popup.open();
      } else {
        this.$refs.popupBtm.open();
      }
      this.textShow = false;
    },
    // 提问价格
    postAnswerClick(type) {
      this.$refs.popupBtm.open();
      this.textShow = false;
    },
    cancel() {
      this.$refs.popupBtm.close();
      this.textShow = true;
    },
    // 图片上传相关方法
    uploadClick(e) {
      this.uploadStatus = e;
    },
    uploadChange(e, status) {
      this.uploadFile = e;
      this.uploadStatus = status;
    },
    uploadClear(list, del) {
      const id = list.id;
      this.deleteType = 0;
      this.deleteId = id;
      this.deleteIndex = del;
      this.$refs.deletePopup.open();
      this.deleteTip = this.i18n.t('core.deleteImgSure');
    },
    // 音频上传改变
    uploadAudioChange(e) {
      this.audioBeforeList = e;
    },
    audioDel() {
      this.deleteType = 3;
      this.$refs.deletePopup.open();
      this.deleteTip = this.i18n.t('core.deleteAudioSure');
    },
    // 表情点击事件
    getEmojiClick(code) {
      let text = '';
      text = `${this.textAreaValue.slice(0, this.cursor) +
        code +
        this.textAreaValue.slice(this.cursor)}`;
      this.cursor = text.length;
      this.textAreaValue = text;
      this.emojiShow = false;
      this.textShow = true;
    },
    // @人员跳转
    callClick() {
      uni.navigateTo({ url: '/pages/user/at-member' });
    },
    topicPage() {
      uni.navigateTo({ url: '/pages/topic/topic' });
    },
    // 分类点击
    checkClass(e, index) {
      // 单选功能
      this.categoryIndex = index;
      this.categoryId = e._jv.id;
      this.checkClassData = [];
      this.checkClassData.push(this.allCategories[index]);
    },
    // 主题提问价格
    payClickShow() {
      console.log('payClickshow');
      if (!this.$store.getters['session/get']('isLogin')) {
        // #ifdef MP-WEIXIN
        this.mpLoginMode();
        // #endif
        // #ifdef H5
        this.$store.dispatch('session/setUrl', this.curUrl);
        this.h5LoginMode();
        // #endif
      }
      this.payStatus = false;
      if (!this.forums.paycenter.wxpay_close) {
        this.payShowStatus = false;
        return;
      } else if (this.forums.paycenter.wxpay_close && this.forums.other.can_create_thread_paid) {
        // #ifndef H5
        if (this.system === 'ios') {
          this.postShow = true;
          this.payShowStatus = false;
          this.ioshide = false;
          return;
        } else {
          this.ioshide = true;
          this.payShowStatus = true;
        }
        // #endif
        // #ifdef H5
        this.ioshide = true;
        this.payShowStatus = true;
        // #endif
      } else {
        this.ioshide = false;
        this.payShowStatus = false;
        return;
      }
      this.payTypeText = this.t.pay + this.t.payAskingPrice;
      this.priceAsk = parseFloat(this.thread.price);
      this.$nextTick(() => {
        this.$refs.payShow.payClickShow(this.payTypeVal);
      });
    },
    // 支付方式选择完成点击确定时
    paysureShow(payType) {
      uni.setStorage({
        key: 'page',
        data: `/topic/post?type=5&categoryId=${this.categoryid}&categoryIndex=${this.categoryindex}`,
      });
      if (payType === 0) {
        // #ifdef H5
        if (this.isWeixin === true && this.user.wechat === undefined) {
          this.$refs.wechatPopup.open();
          return;
        }
        if (this.isWeixin === true && this.user.wechat && this.user.wechat.mp_openid === '') {
          this.$refs.wechatPopup.open();
          return;
        }
        // #endif

        // #ifdef MP-WEIXIN
        if (
          this.user.wechat === undefined ||
          (this.user.wechat && this.user.wechat.min_openid === '')
        ) {
          this.$refs.wechatPopup.open();
          return;
        }
        // #endif
        this.creatOrder(this.priceAsk, 5, '', payType);
      } else if (payType === 1) {
        // 这是详情页获取到的支付方式---钱包
      }
    },
    // 输入密码完成时
    onInput(val) {
      this.value = val;
      this.creatOrder(this.priceAsk, 5, val, 1);
    },
    creatOrder(amount, type, value, payType) {
      const params = {
        _jv: {
          type: 'orders',
        },
        type,
        payee_id: this.beAskId,
        amount,
        is_anonymous: this.checked ? '0' : '1',
      };
      this.$store
        .dispatch('jv/post', params)
        .then(res => {
          this.orderSn = res.order_sn;
          if (payType === 0) {
            // 微信支付
            if (this.browser == 0) {
              // 这是微信小程序内的支付
              this.orderPay(13, value, this.orderSn, payType, '0');
            } else {
              // 这是除微信小程序之外, this.isWeixin, this.isPhone
              if (this.isWeixin && this.isPhone) {
                // 这是微信浏览器
                this.orderPay(12, value, this.orderSn, payType, '1');
              } else if (this.isPhone) {
                this.orderPay(20, value, this.orderSn, 1, '2');
              } else {
                // 这是pc，没调接口之前
                this.orderPay(10, value, this.orderSn, payType, '3');
              }
            }
          } else if (payType === 1) {
            // 钱包支付
            this.orderPay(20, value, this.orderSn, payType);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 订单支付       broswerType: 0是小程序，微信1是浏览器，2是h5，3是pc
    orderPay(type, value, orderSn, payType, broswerType) {
      let params = {};
      if (payType === 0) {
        params = {
          _jv: {
            type: `trade/pay/order/${orderSn}`,
          },
          payment_type: type,
        };
      } else if (payType === 1) {
        params = {
          _jv: {
            type: `trade/pay/order/${orderSn}`,
          },
          payment_type: type,
          pay_password: value,
        };
      }
      this.$store
        .dispatch('jv/post', params)
        .then(res => {
          this.wxRes = res;
          if (payType === 0) {
            if (broswerType === '0') {
              this.wechatPay(
                res.wechat_js.timeStamp,
                res.wechat_js.nonceStr,
                res.wechat_js.package,
                res.wechat_js.signType,
                res.wechat_js.paySign,
              );
            } else if (broswerType === '1') {
              if (typeof WeixinJSBridge === 'undefined') {
                if (document.addEventListener) {
                  document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(res), false);
                } else if (document.attachEvent) {
                  document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady(res));
                  document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady(res));
                }
              } else {
                this.onBridgeReady(res);
              }
            } else if (broswerType === '2') {
              this.postThread().then(data => {
                // window.location.href = `${res.wechat_h5_link}&redirect_url=${encodeURIComponent(window.location.origin /topic/indexdex?id='+ data._jv.id)}`;
                this.postLoading = false;
                uni.hideLoading();
                if (res && res.isApproved === 1) {
                  this.$u.event.$emit('addThread', res);
                }
                if (res && res._jv && res._jv.json.data.id) {
                  uni.redirectTo({
                    url: `/topic/index?id=${res._jv.json.data.id}`,
                  });
                }
              });
            } else if (broswerType === '3') {
              if (res) {
                this.codeUrl = res.wechat_qrcode;
                this.payShowStatus = false;
                this.$refs.codePopup.open();
                this.qrcodeShow = true;
                payWechat = setInterval(() => {
                  if (this.payStatus === 1) {
                    clearInterval(payWechat);
                    return;
                  }
                  this.getOrderStatus(this.orderSn, broswerType);
                  uni.hideLoading();
                }, 3000);
              }
            }
          } else if (payType === 1) {
            if (res.wallet_pay.result === 'success') {
              this.$store.dispatch('jv/get', [`users/${this.currentLoginId}`, {}]);
              this.coverLoading = false;
              this.postThread().then(res => {
                this.postLoading = false;
                uni.hideLoading();
                if (res && res.isApproved === 1) {
                  this.$u.event.$emit('addThread', res);
                }
                if (res && res._jv.json.data.id) {
                  uni.redirectTo({
                    url: `/topic/index?id=${res._jv.json.data.id}`,
                  });
                }
              });
            }
            this.coverLoading = false;
          }
        })
        .catch(err => {
          // 清空支付的密码
          console.log(err);
          this.$refs.payShow.clearPassword();
        });
    },
    getOrderStatus(orderSn, broswerType) {
      this.$store
        .dispatch('jv/get', [`orders/${orderSn}`, { custom: { loading: false } }])
        .then(res => {
          this.payStatus = res.status;
          if (this.payStatus === 1) {
            if (broswerType === '2') {
              // return false;
            } else if (broswerType === '3') {
              // 这是pc扫码支付完成
              this.$refs.codePopup.close();
              this.qrcodeShow = false;
              this.postThread();
            } else if (broswerType === '0') {
              this.postThread().then(res => {
                this.postLoading = false;
                uni.hideLoading();
                if (res && res.isApproved === 1) {
                  this.$u.event.$emit('addThread', res);
                }
                if (res && res._jv.json.data.id) {
                  uni.redirectTo({
                    url: `/topic/index?id=${res._jv.json.data.id}`,
                  });
                }
              });
            } else if (broswerType === '1') {
              this.postThread().then(res => {
                this.postLoading = false;
                uni.hideLoading();
                if (res && res.isApproved === 1) {
                  this.$u.event.$emit('addThread', res);
                }
                if (res && res._jv.json.data.id) {
                  uni.redirectTo({
                    url: `/topic/index?id=${res._jv.json.data.id}`,
                  });
                }
              });
            }
            this.$refs.toast.show({ message: this.i18n.t('pay.paySuccess') });
          }
        })
        .catch(err => {
          console.log(err);
          this.coverLoading = false;
          this.$refs.toast.show({ message: this.i18n.t('pay.payFail') });
        });
    },
    wechatPay(timeStamp, nonceStr, packageVal, signType, paySign) {
      // 小程序支付。
      const _this = this;
      uni.requestPayment({
        provider: 'wxpay',
        timeStamp,
        nonceStr,
        package: packageVal,
        signType,
        paySign,
        success(res) {
          _this.coverLoading = true;
          payWechat = setInterval(() => {
            if (_this.payStatus === 1) {
              clearInterval(payWechat);
              return;
            }
            _this.getOrderStatus(_this.orderSn, '0');
          }, 3000);
        },
        fail(err) {
          _this.payShowStatus = false;
          _this.coverLoading = false;
          _this.$refs.toast.show({ message: _this.p.payFail });
        },
      });
    },
    // 非小程序内微信支付
    onBridgeReady(data) {
      // const that = this;
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        {
          appId: data.wechat_js.appId, // 公众号名称，由商户传入
          timeStamp: data.wechat_js.timeStamp, // 时间戳，自1970年以来的秒数
          nonceStr: data.wechat_js.nonceStr, // 随机串
          package: data.wechat_js.package,
          signType: 'MD5', // 微信签名方式：
          paySign: data.wechat_js.paySign, // 微信签名
        },
        function(data) {
          // alert('支付唤醒');
          if (data.err_msg == 'get_brand_wcpay_request:ok') {
            //微信支付成功，进行支付成功处理
          } else if (data.err_msg == 'get_brand_wcpay_request:cancel') {
            // 取消支付
            clearInterval(payWechat);
            resolve;
          } else if (data.err_msg == 'get_brand_wcpay_request:fail') {
            // 支付失败
            clearInterval(payWechat);
            resolve;
          }
        },
      );
      payWechat = setInterval(() => {
        if (this.payStatus === 1) {
          clearInterval(payWechat);
          return;
        }
        this.getOrderStatus(this.orderSn, '1');
      }, 3000);
    },
    // 选择支付方式，获取值
    radioChange(val) {
      // console.log(val, '支付方式')
    },
    // 发布按钮点击，检测条件是否符合，符合的话调用接口
    postClick() {
      this.payTypeText = this.i18n.t('topic.pay') + this.i18n.t('discuzq.post.payAskingPrice');
      // #ifdef H5
      if (this.type === 1) {
        this.textAreaValue = this.vditor.getValue().replace(/blob\:/g, '');
      }
      // #endif
      if (!this.categoryId) {
        this.$refs.toast.show({ message: this.i18n.t('discuzq.post.theclassifyCanNotBeBlank') });
        return false;
      }
      console.log(this.type, '~~~~', this.dataGoodInfo);
      let status = true;
      switch (this.type) {
        case 0:
          if (this.textAreaValue.length < 1) {
            this.$refs.toast.show({ message: this.i18n.t('discuzq.post.theContentCanNotBeBlank') });
            status = false;
          } else {
            status = true;
          }
          break;
        case 1:
          if (this.postTitle.length < 1) {
            this.$refs.toast.show({ message: this.i18n.t('discuzq.post.theTitleCanNotBeBlank') });
            status = false;
          } else if (this.textAreaValue.length < 1) {
            this.$refs.toast.show({ message: this.i18n.t('discuzq.post.theContentCanNotBeBlank') });
            status = false;
          } else if (!this.uploadStatus) {
            this.$refs.toast.show({
              message: this.i18n.t('discuzq.post.pleaseWaitForTheImageUploadToComplete'),
            });
            status = false;
          } else if (this.payType === 1) {
            // 内容免费，附件付费
            if (this.$refs.uploadFiles.getValue().length === 0) {
              // 附件不能为空
              this.$refs.toast.show({
                message: this.i18n.t('discuzq.post.attachmentCannotBeEmpty'),
              });
              status = false;
            } else if (this.price === 0) {
              // 选择付费后，价格不能为空
              // console.log('选择付费后，价格不能为空');
              this.$refs.toast.show({
                message: this.i18n.t('discuzq.post.priceCannotBeFree'),
              });
              status = false;
            } else {
              status = true;
            }
          } else if (this.payType === 2) {
            // 内容附件均付费
            if (this.price === 0) {
              this.$refs.toast.show({
                message: this.i18n.t('discuzq.post.priceCannotBeFree'),
              });
              status = false;
            } else {
              status = true;
            }
          } else {
            status = true;
          }
          break;
        case 2:
          if (this.videoBeforeList.length < 1) {
            this.$refs.toast.show({ message: this.i18n.t('discuzq.post.videoCannotBeEmpty') });
            status = false;
          } else if (this.percent !== 1) {
            this.$refs.toast.show({
              message: this.i18n.t('discuzq.post.pleaseWaitForTheVideoUploadToComplete'),
            });
            status = false;
          } else if (this.payType === 2) {
            // 内容附件均付费
            if (this.price === 0) {
              this.$refs.toast.show({
                message: this.i18n.t('discuzq.post.priceCannotBeFree'),
              });
              status = false;
            } else {
              status = true;
            }
          } else {
            status = true;
          }
          break;
        case 3:
          if (this.operating !== 'edit') {
            if (!this.uploadStatus) {
              this.$refs.toast.show({
                message: this.i18n.t('discuzq.post.pleaseWaitForTheImageUploadToComplete'),
              });
              status = false;
            } else if (this.uploadFile.length < 1) {
              this.$refs.toast.show({
                message: this.i18n.t('discuzq.post.imageCannotBeEmpty'),
              });
              status = false;
            } else if (this.payType === 2) {
              // 内容附件均付费
              if (this.price === 0) {
                this.$refs.toast.show({
                  message: this.i18n.t('discuzq.post.priceCannotBeFree'),
                });
                status = false;
              } else {
                status = true;
              }
            } else {
              status = true;
            }
          } else {
            if (!this.uploadStatus) {
              this.$refs.toast.show({
                message: this.i18n.t('discuzq.post.pleaseWaitForTheImageUploadToComplete'),
              });
              status = false;
            } else if (this.payType === 2) {
              // 内容附件均付费
              if (this.price === 0) {
                this.$refs.toast.show({
                  message: this.i18n.t('discuzq.post.priceCannotBeFree'),
                });
                status = false;
              } else {
                status = true;
              }
            } else {
              status = true;
            }
          }
          break;
        case 4:
          if (this.audioBeforeList.length < 1) {
            this.$refs.toast.show({
              message: this.i18n.t('discuzq.post.audioCannotBeEmpty'),
            });
            status = false;
          } else {
            status = true;
          }
          break;
        case 5:
          if (this.beAskId === '') {
            this.$refs.toast.show({
              message: this.i18n.t('discuzq.post.pleaseSelectTheUserToBeAsked'),
            });
            status = false;
          } else if (this.textAreaValue.length < 1) {
            this.$refs.toast.show({ message: this.i18n.t('discuzq.post.theContentCanNotBeBlank') });
            status = false;
          } else if (this.watchShow) {
            console.log(this.watchShow, 'this.watchShow');
            this.payShowStatus = true;
            this.$nextTick(() => {
              this.$refs.payShow.payClickShow();
            });
          }
          break;
        case 6:
          console.log(this.dataGoodInfo.length, '^^^^~~~~~~~~');
          if (this.dataGoodInfo === '' || this.dataGoodInfo.length === 0) {
            this.$refs.toast.show({ message: this.i18n.t('core.productInformationDoesNotExist') });
            status = false;
          } else {
            status = true;
          }
          break;
        default:
          status = false;
          this.$refs.toast.show({ message: this.i18n.t('core.postTypesDoNotMatch') });
      }
      if (status) {
        if (this.type !== 5) {
          this.postLoading = true;
          uni.showLoading();
        }
        if (this.operating === 'edit') {
          // if (this.type === 5) {
          //   // this.beUserName =
          // }
          this.$u.event.$emit('updateLocation', this.postDetails._jv.id, this.currentPosition);
          if (this.type === 3) {
            if (this.uploadFile.length < 1) {
              this.$refs.toast.show({
                message: this.i18n.t('discuzq.post.imageCannotBeEmpty'),
              });
              uni.hideLoading();
              this.postLoading = false;
            } else {
              this.editThread().then(res => {
                this.postLoading = false;
                uni.hideLoading();
                // uni.navigateBack({
                //   delta: 1,
                // });
                if (res && this.threadId) {
                  uni.redirectTo({
                    url: `/topic/index?id=${this.threadId}`,
                  });
                }
              });
            }
          } else {
            console.log('!!!!!!!~~~~~~~~~~~~~~~~~');
            this.editThread().then(res => {
              this.postLoading = false;
              uni.hideLoading();
              // uni.navigateBack({
              //   delta: 1,
              // });
              if (res && this.threadId) {
                uni.redirectTo({
                  url: `/topic/index?id=${this.threadId}`,
                });
              }
            });
          }
        } else {
          if (this.forums.qcloud.qcloud_captcha && this.forums.other.create_thread_with_captcha) {
            if (!this.ticket || !this.randstr) {
              this.toTCaptcha();
              return false;
            }
          }
          if (!this.watchShow || this.type !== 5) {
            this.postThread().then(res => {
              this.postLoading = false;
              uni.hideLoading();
              if (res && res.isApproved === 1) {
                this.$u.event.$emit('addThread', res);
              }
              if (res && res._jv.json.data.id) {
                uni.redirectTo({
                  url: `/topic/index?id=${res._jv.json.data.id}`,
                });
              }
            });
          }
        }
      }
    },
    // 编辑回显主题，处理附件
    setAnnex(type, data) {
      switch (type) {
        case 'img':
          let filePreview = [];
          data.firstPost.images.map(item => {
            filePreview.push({
              path: item.thumbUrl,
              id: item._jv.id,
              order: item.order,
              name: item.fileName,
              url: item.url,
            });
            return item;
          });
          this.filePreview = filePreview;
          break;
        case 'video':
          this.videoBeforeList.push({
            path: data.threadVideo.media_url,
          });
          // this.videoPercent = 1;
          break;
        case 'audio':
          this.audioBeforeList.push({
            fileName: data.threadAudio.file_name,
            url: data.threadAudio.media_url,
            id: data.threadAudio.file_id,
          });
          break;
        case 'goods':
          this.dataGoodInfo = data.firstPost.postGoods;
          // this.audioBeforeList.push({
          //   fileName: data.threadAudio.file_name,
          //   url: data.threadAudio.media_url,
          //   id: data.threadAudio.file_id,
          // });
          break;
        default:
          console.log('没有匹配模式');
          break;
      }
    },
    // 发布主题，处理图片
    addImg() {
      const attachments = {};
      attachments.data = [];
      this.uploadFile.forEach(item => {
        if (item) {
          attachments.data.push({
            type: 'attachments',
            id: item.id,
          });
        }
      });
      // 附件
      // if (this.type === 1 && this.$refs.uploadFiles) {
      //   const newAttachmentList = this.$refs.uploadFiles.getValue();
      //   newAttachmentList.forEach(item => {
      //     if (item.id) {
      //       attachments.data.push({
      //         type: 'attachments',
      //         id: item.id,
      //       });
      //     }
      //   });
      // }
      return attachments;
    },
    // 发布主题，处理附件
    addFile() {
      const attachments = {};
      attachments.data = [];
      // if (this.type === 1 && this.$refs.uploadFiles) {
      const newAttachmentList = this.$refs.uploadFiles.getValue();
      newAttachmentList.forEach(item => {
        if (item.id) {
          attachments.data.push({
            type: 'attachments',
            id: item.id,
          });
        }
      });
      // }
      return attachments;
    },
    // 发布问题
    addQuestion() {
      const question = {
        data: {
          be_user_id: this.beAskId,
          price: this.priceAsk,
          is_onlooker: this.watchChecked,
          order_id: this.orderSn,
        },
      };
      // if(!this.watchShow){
      //   delete question.data.order_id
      // }
      return question;
    },
    // 删除附件显示弹框
    deleteFile(id) {
      this.deleteTip = this.i18n.t('core.deleteEnclosureSure');
      this.$refs.deletePopup.open();
      this.deleteType = 1;
      this.deleteId = id;
    },
    // 删除附件调用删除接口
    deleteFileSure(id) {
      const params = {
        _jv: {
          type: 'attachments',
          id,
        },
      };
      this.$store.dispatch('jv/delete', params).then(res => {
        this.$refs.uploadFiles.deleteSure();
      });
    },
    // 接口请求
    getCategories() {
      this.$store.dispatch('jv/get', ['categories?filter[createThread]=1', {}]).then(res => {
        this.allCategories = res;
        res.map(item => {
          // console.log(item, 'itemitemitemitem');
          if (item._jv) {
            if (Number(item._jv.id) === Number(this.categoryId)) {
              this.checkClassData.push(item);
            }
          }
          return item;
        });
      });
    },
    postThread() {
      const params = {
        _jv: {
          type: 'threads',
          relationships: {
            category: {
              data: {
                type: 'categories',
                id: this.checkClassData[0]._jv.id,
              },
            },
          },
          links: {
            self:
              'threads?include=user,category,firstPost,firstPost.images,firstPost.postGoods,question,question.beUser,question.beUser.groups,question.images',
          },
        },
        content: this.textAreaValue,
        type: this.type,
        price: this.price,
        free_words: this.word,
        captcha_ticket: this.ticket,
        captcha_rand_str: this.randstr,
        is_anonymous: this.checked,
      };
      if (this.payType === 1) {
        params.attachment_price = this.price;
        params.price = '';
      } else if (this.payType === 0) {
        params.attachment_price = '';
        params.price = this.price;
      }
      console.log(params, '这是参数');
      const currentPosition = this.currentPosition;
      params.longitude = currentPosition.longitude || '';
      params.latitude = currentPosition.latitude || '';
      params.location = currentPosition.location || '';
      params.address = currentPosition.address || '';
      const postPromise = new Promise((resolve, reject) => {
        switch (this.type) {
          case 0:
            resolve();
            break;
          case 1:
            params.title = this.postTitle;
            params._jv.relationships.attachments = this.addFile();
            resolve();
            break;
          case 2:
            params.file_id = this.fileId;
            params.file_name = this.videoName;
            resolve();
            break;
          case 3:
            params._jv.relationships.attachments = this.addImg();
            resolve();
            break;
          case 4:
            params.file_id = this.audioBeforeList[0].id;
            params.file_name = this.audioBeforeList[0].fileName;
            resolve();
            break;
          case 5:
            params._jv.relationships.attachments = this.addImg();
            params._jv.relationships.question = this.addQuestion();
            resolve();
            break;
          case 6:
            params.post_goods_id = this.dataGoodInfo._jv.id;
            resolve();
            break;
          default:
            reject();
            this.$refs.toast.show({ message: this.i18n.t('core.postTypesDoNotMatch') });
        }
      });
      return postPromise.then(() => {
        return this.$store
          .dispatch('jv/post', params)
          .then(res => {
            console.log(res, '这是发布时接口返回的');
            return res;
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    delAttachments(id, index) {
      if (this.operating === 'edit') {
        // console.log('这是编辑');
        this.$u.event.$emit('deleteImg', {
          threadId: this.postDetails._jv.id,
          index,
        });
        const post = this.$store.getters['jv/get'](`posts/${this.postDetails.firstPost._jv.id}`);
        post.images.splice(index, 1);
        post._jv.relationships.images.data.splice(index, 1);
      }
    },
    handleClickOk() {
      this.$refs.deletePopup.close();
      if (this.deleteType === 0) {
        // 删除类型为图片
        this.delAttachments(this.deleteId, this.deleteIndex);
        this.$refs.upload.clear(this.deleteIndex);
        // this.delAttachments(this.deleteId, this.deleteIndex).then(() => {
        //   this.$refs.upload.clear(this.deleteIndex);
        // });
      } else if (this.deleteType === 2) {
        // 删除类型为视频
        this.videoBeforeList = [];
        this.percent = 0;
        // this.videoPercent = 0;
      } else if (this.deleteType === 3) {
        this.audioBeforeList = [];
      }
    },
    handleClickCancel() {
      this.$refs.deletePopup.close();
    },
    // 确认去绑定微信
    handleWechatClickOk() {
      // #ifdef MP-WEIXIN
      this.mpLogin();
      // #endif
      // #ifdef H5
      if (this.isWeixin) {
        this.wxh5Login(0, 0);
      } else {
        uni.showToast({
          icon: 'none',
          title: this.i18n.t('user.unLogin'),
          duration: 2000,
        });
      }
      // #endif
    },
    // 取消去绑定微信
    handleWechatClickCancel() {
      this.$refs.wechatPopup.close();
    },
    delAttachments(id, index) {
      if (this.operating === 'edit') {
        console.log('这是编辑');
        this.$u.event.$emit('deleteImg', {
          threadId: this.postDetails._jv.id,
          index,
        });
        const post = this.$store.getters['jv/get'](`posts/${this.postDetails.firstPost._jv.id}`);
        post.images.splice(index, 1);
        post._jv.relationships.images.data.splice(index, 1);
      }
      this.uploadFile.forEach((value, key, item) => {
        value.id == id && item.splice(key, 1);
      });
    },
    getSignature(callBack) {
      this.$store.dispatch('jv/get', ['signature', {}]).then(res => {
        // #ifndef MP-WEIXIN
        callBack(() => res.signature);
        // #endif
        // #ifdef MP-WEIXIN
        callBack(res.signature);
        // #endif
      });
    },
    postVideo(fileId) {
      const params = {
        _jv: {
          type: 'thread/video',
        },
        file_id: fileId,
        type: 0,
      };
      this.$store.dispatch('jv/post', params);
    },
    // 获取当前编辑的主题数据
    getPostThread(option) {
      const params = {
        include: [
          'firstPost',
          'firstPost.images',
          'threadVideo',
          'threadAudio',
          'category',
          'firstPost.attachments',
          'question',
          'onlookers',
          'question.beUser',
          'question.images',
          'firstPost.postGoods',
        ],
      };
      this.$store.dispatch('jv/get', [`threads/${this.threadId}`, { params }]).then(res => {
        if (res.question) {
          this.beUserName = res.question.beUser.username;
          this.beAskId = res.question.beUser.id;
          this.userImage = res.question.beUser.avatarUrl;
        }
        this.postDetails = res;
        this.firstPostId = res.firstPost._jv.id;
        this.type = res.type;

        // #ifdef MP-WEIXIN
        this.markdownShow = false;
        // #endif
        // #ifdef H5
        if (this.type === 1) {
          this.markdownShow = true;
        }
        // #endif
        this.attachmentList = res.firstPost.attachments || [];
        this.textAreaValue = res.firstPost.content;
        this.categoryId = res.category._jv.id;
        this.checkClassData.push(res.category);
        if (res.threadVideo) {
          this.fileId = res.threadVideo.file_id;
          this.percent = 1;
        }
        // this.uploadFile = res.firstPost.images;
        if (res.firstPost.images) {
          res.firstPost.images.forEach(item => {
            if (item) {
              this.uploadFile.push({
                type: 'attachments',
                id: item._jv.id,
                order: item.order,
                name: item.fileName,
                url: item.url,
                path: item.thumbUrl ? item.thumbUrl : '',
              });
            }
          });
        }
        if (this.type === 6 && res.firstPost.postGoods) {
          this.dataGoodInfo = res.firstPost.postGoods;
          this.isShowGoods = true;
          console.log(this.dataGoodInfo, this.isShowGoods, '这是~~~~~~~~~~~~~~~');
        }
        this.loadStatus = true;
        if (Number(res.price) > 0) {
          this.price = res.price;
          this.word = res.freeWords;
          this.payType = 2;
          this.showPayType = this.i18n.t('discuzq.post.TheContentAndTheAccessoriesIsPaid');
        } else if (Number(res.attachmentPrice) > 0) {
          this.price = res.attachmentPrice;
          this.payType = 1;
          this.showPayType = this.i18n.t('discuzq.post.TheContentIsFreeAndTheAccessoriesArePaid');
        } else {
          this.showPayType = this.i18n.t('discuzq.post.TheContentAndTheAccessoriesIsFree');
        }

        this.textAreaLength = this.type === 1 ? 10000 : 450;
        switch (Number(res.type)) {
          case 0:
            break;
          case 1:
            this.postTitle = res.title;
            this.setAnnex('img', res);
            break;
          case 2:
            this.percent = 1;
            this.setAnnex('video', res);
            break;
          case 3:
            this.setAnnex('img', res);
            break;
          case 4:
            this.setAnnex('audio', res);
            break;
          case 6:
            this.setAnnex('goods', res);
            break;
          default:
            console.log('未知类型');
        }
        // 微信里面的定位
        if (option.name) {
          let currentPosition = {};
          const data = option.latng.split(',');
          currentPosition.longitude = data[1];
          currentPosition.latitude = data[0];
          currentPosition.location = option.name;
          currentPosition.address = option.addr;
          this.currentPosition = currentPosition;
        } else {
          this.currentPosition.longitude = res.longitude || '';
          this.currentPosition.latitude = res.latitude || '';
          this.currentPosition.location = res.location || '';
          this.currentPosition.address = res.address || '';
        }
        if (this.operating === 'edit' && this.goodsId) {
          this.getGoodsInfo();
        }
        this.setThread();
      });
    },

    // 获取商品信息
    getGoodsInfo() {
      console.log('获取');
      this.$store.dispatch('jv/get', `goods/${this.goodsId}`).then(res => {
        console.log('这是取到的商品信息', res);
        this.dataGoodInfo = res;
        console.log(this.dataGoodInfo._jv.id, '商品id');
        this.isShowGoods = true;
      });
    },

    // 编辑帖子接口
    async editThread() {
      console.log('编辑');
      let state = 0;
      const posts = {
        _jv: {
          type: 'posts',
          // id: `${this.firstPostId}?include=user,thread,images`,
          id: this.firstPostId,
          relationships: {},
          links: {
            self: `posts/${this.firstPostId}?include=user,thread,images`,
          },
        },
        content: this.textAreaValue,
      };
      const threads = {
        _jv: {
          type: 'threads',
          id: this.threadId,
          relationships: {
            category: {
              data: {
                type: 'categories',
                id: this.checkClassData[0]._jv.id,
              },
            },
          },
        },
      };
      const currentPosition = this.currentPosition;
      threads.longitude = currentPosition.longitude || '';
      threads.latitude = currentPosition.latitude || '';
      threads.location = currentPosition.location || '';
      threads.address = currentPosition.address || '';
      switch (this.type) {
        case 0:
          break;
        case 1:
          threads.title = this.postTitle;
          // threads.price = this.price;
          if (this.payType === 1) {
            // console.log(this.price, '价格');
            threads.attachment_price = this.price;
            threads.price = '';
          } else if (this.payType === 2) {
            threads.attachment_price = '';
            threads.price = this.price;
          } else if (this.payType === 0) {
            threads.attachment_price = '';
            threads.price = '';
          }
          threads.free_words = this.word;
          posts._jv.relationships.attachments = this.addFile();
          break;
        case 2:
          threads.file_id = this.fileId;
          threads.file_name = this.videoName;
          threads.price = this.price;
          break;
        case 3:
          threads.price = this.price;
          posts._jv.relationships.attachments = this.addImg();
          break;
        case 4:
          threads.price = this.price;
          threads.file_id = this.audioBeforeList[0].id;
          threads.file_name = this.audioBeforeList[0].fileName;
          break;
        case 5:
          posts._jv.relationships.attachments = this.addImg();
          // params._jv.relationships.question = this.addQuestion();
          break;
        case 6:
          console.log('666666');
          posts.post_goods_id = this.dataGoodInfo._jv.id;
          console.log(threads, '666666');
          break;
        default:
          break;
      }
      console.log(posts, '这是posts');
      await this.$store.dispatch('jv/patch', posts).then(res => {
        console.log(res, '返回');
        if (res._jv.json.data.id) state += 1;
        if (res._jv.json.data.attributes.isApproved === 1) {
          this.$u.event.$emit('refreshImg', {
            id: this.firstPostId,
            threadId: this.threadId,
            images: this.addImg(),
          });
          this.$u.event.$emit('refreshGoods', {
            id: this.firstPostId,
            threadId: this.threadId,
            goods: this.dataGoodInfo,
          });
        }
        // 更新详情页的信息
        this.$u.event.$emit('refreshFiles');
        return res;
      });
      console.log(threads, '这是编辑时传的参数');
      await this.$store.dispatch('jv/patch', threads).then(res => {
        if (res._jv.json.data.id) state += 1;
      });
      if (state === 2) {
        return state;
      }
      throw new Error('出错了');
    },
    // 小程序内发布按钮验证码验证
    toTCaptcha() {
      // #ifdef MP-WEIXIN
      let _this = this;
      wx.navigateToMiniProgram({
        appId: 'wx5a3a7366fd07e119',
        path: '/pages/captcha/index',
        envVersion: 'release',
        extraData: {
          appId: this.forums.qcloud.qcloud_captcha_app_id, //您申请的验证码的 appId
        },
        success(res) {
          // 验证码成功打开
        },
        fail(err) {
          uni.hideLoading();
          _this.postLoading = false;
        },
      });
      // #endif
      // h5内发布按钮验证码验证
      // #ifdef H5
      this.captcha = new TencentCaptcha(this.forums.qcloud.qcloud_captcha_app_id, res => {
        if (res.ret === 0) {
          this.ticket = res.ticket;
          this.randstr = res.randstr;
          // 验证通过后发布
          this.postClick();
        }
        if (res.ret === 2) {
          this.postLoading = false;
          uni.hideLoading();
        }
      });
      // 显示验证码
      this.captcha.show();
      // #endif
    },
    // 问答贴点击头像跳转选择被提问人
    changeAvatar() {
      uni.navigateTo({ url: '/pages/user/at-member?name=select' });
    },
  },
  onLoad(option) {
    console.log(option, 'optionopton');
    if (option.type === '5') {
      console.log('55555555555');
      this.payNum[0].name = this.i18n.t('discuzq.post.noReward');
    }
    this.categoryid = option.categoryId;
    this.categoryindex = option.categoryIndex;
    uni.$on('radioChange', item => {
      this.beUserName = item.username;
      this.beAskId = item.id;
      this.userImage = item.avatarUrl;
    });
    // 问答编辑不显示提问价格
    if (this.forums && this.forums.paycenter) {
      if (option.operating === 'edit' || !this.forums.paycenter.wxpay_close) {
        this.askingPrice = false;
      } else {
        // 初始化默认内容附件均免费
        this.showPayType = this.i18n.t('discuzq.post.TheContentAndTheAccessoriesIsFree');
      }
    }

    if (option.type) this.type = Number(option.type);
    // #ifdef MP-WEIXIN
    const data = uni.getSystemInfoSync();
    if (data.platform === 'ios' && this.type === 5) {
      this.askingPrice = false;
      // this.postClick = true;
    }
    // #endif
    // #ifdef H5
    const { isWeixin } = appCommonH.isWeixin();
    this.isWeixin = isWeixin;
    this.isPhone = appCommonH.isWeixin().isPhone; // 这是h5
    if (this.isWeixin === false) {
      this.payTypeData[0].hide = true;
    }
    this.browser = 1;
    if (this.type === 1) {
      uni.$on('vditor', (vditor, vditorComponent) => {
        this.vditor = vditor;
        this.vditor.setValue(this.textAreaValue);
        vditorComponent.setPostComponent(this);
      });
    }
    // #endif
    this.url = DISCUZ_REQUEST_HOST;
    const token = uni.getStorageSync('access_token');
    this.header = {
      authorization: `Bearer ${token}`,
    };
    this.formData = {
      type: 1,
    };
    this.getCategories();
    if (option.operating) this.operating = option.operating;
    if (option.threadId) this.threadId = option.threadId;
    if (option.categoryIndex) {
      if (option.categoryIndex === '0') {
        this.categoryIndex = '';
      } else {
        this.categoryIndex = Number(option.categoryIndex);
      }
    }
    if (option.categoryId)
      this.categoryId = Number(option.categoryId) === 0 ? '' : Number(option.categoryId);
    this.textAreaLength = Number(option.type) === 1 ? 10000 : 450;
    if (this.operating === 'edit') {
      this.loadStatus = false;
      this.getPostThread(option);
    } else {
      this.loadStatus = true;
      if (option.name) {
        let currentPosition = {};
        const data = option.latng.split(',');
        currentPosition.longitude = data[1];
        currentPosition.latitude = data[0];
        currentPosition.location = option.name;
        currentPosition.address = option.addr;
        this.currentPosition = currentPosition;
      }
    }
    try {
      const res = uni.getSystemInfoSync();
      if (
        this.forums &&
        this.forums.paycenter.wxpay_close &&
        this.forums.other.can_create_thread_paid
      ) {
        // #ifndef H5
        if (res.platform === 'ios') {
          // if (this.forums.paycenter.wxpay_ios === false) {
          //   this.showHidden = false;
          // } else {
          //   this.showHidden = true;
          // }
          this.ioshide = false;
        } else {
          this.ioshide = true;
          this.showHidden = true;
        }
        // #endif
        // #ifdef H5
        this.ioshide = true;
        this.showHidden = true;
        // #endif
      } else {
        this.ioshide = false;
        this.showHidden = false;
      }
    } catch (e) {
      // error
    }
    // #ifdef MP-WEIXIN
    this.markdownShow = false;
    // #endif
    // #ifdef H5
    if (this.type === 1) {
      this.markdownShow = true;
    }
    // #endif
    // 接受验证码captchaResult
    this.$u.event.$on('captchaResult', result => {
      this.ticket = result.ticket;
      this.randstr = result.randstr;
      this.postClick();
    });
    this.$u.event.$on('closeChaReault', () => {
      this.postLoading = false;
      uni.hideLoading();
    });
    uni.$on('clickTopic', data => {
      if (data.keywords)
        this.textAreaValue = `${this.textAreaValue.slice(0, this.cursor)}  #${data.keywords.replace(
          /\s+/g,
          '',
        )}#${this.textAreaValue.slice(this.cursor)}  `;
      this.cursor = this.textAreaValue ? this.textAreaValue.length : 0;
    });
    if (this.type === 6) {
      this.goodsId = option.goodsId;
      console.log(option, this.goodsId, '这是参数');
    }
    if (
      (this.type === 6 && option.operating !== 'edit' && option.threadId !== '' && this.goodsId) ||
      (this.type === 6 && this.goodsId)
    ) {
      this.getGoodsInfo();
    }
    // 接收来自首页的数据，并渲染或者报错时提示
    if (this.type === 2 || this.type === 3) {
      console.log('这是接收首页的数据');
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.on('acceptDataFromOpenerPage', data => {
        if (this.type === 3) {
          // console.log(data, '这是在首页上传图片后传过来的数据');
          if (data.data.data && data.data.data.attributes) {
            // 当首页上传图片成功时
            this.uploadFile.push({
              type: 'attachments',
              id: data.data.data.id,
              order: data.data.data.attributes.order,
              name: data.data.data.attributes.fileName,
              url: data.data.data.attributes.url,
              path: data.data.data.attributes.thumbUrl ? data.data.data.attributes.thumbUrl : '',
            });
            this.filePreview.push({
              path: data.data.data.attributes.thumbUrl,
              id: data.data.data.id,
              order: data.data.data.attributes.order,
              name: data.data.data.attributes.fileName,
              url: data.data.data.attributes.url,
            });
            // console.log(this.uploadFile, '这是首页上传后追加到的列表');
          }
          if (data.data.errors) {
            // 当首页上传图片失败时
            data.data.errors.forEach(error => {
              const title = error.detail
                ? Array.isArray(error.detail)
                  ? error.detail[0]
                  : error.detail
                : this.i18n.t(`core.${error.code}`);
              setTimeout(() => {
                uni.showToast({
                  icon: 'none',
                  title: title,
                });
              }, 1000);
            });
          }
        }
        if (this.type === 2) {
          // console.log(data, '这是在首页上传视频·····后传过来的数据');
          if (data.data) {
            if (data.data.doneResult) {
              this.fileId = data.data.doneResult.fileId;
            } else {
              this.fileId = data.data.result.fileId;
            }
            // console.log(data.data, '这是视频地址');
            this.videoBeforeList.push({
              path: data.data.uploadVideoRes.tempFilePath,
            });
            this.chooseType = 0;
            this.percent = 1;
            // console.log(this.videoBeforeList, '这是视频列表');
          }
        }
      });
    }
  },
  onShow() {
    let atMemberList = '';
    this.getAtMemberData.map(item => {
      atMemberList += `@${item.username} `;
      return atMemberList;
    });
    this.textAreaValue = `${this.textAreaValue.slice(0, this.cursor) +
      atMemberList +
      this.textAreaValue.slice(this.cursor)}`;
    this.setAtMember([]);
    this.cursor = this.textAreaValue ? this.textAreaValue.length : 0;
    if (!this.threadId) {
      this.setThread();
    }
  },
  onReady() {
    this.videoContext = uni.createVideoContext('video');
  },
  onUnload() {
    this.$u.event.$off('captchaResult');
    this.$u.event.$off('closeChaReault');
    this.$u.event.$off('radioChange');
    this.$u.event.$off('radioEditChange');
    // #ifdef H5
    uni.$off('clickTopic');
    uni.$off('clickImage');
    uni.$off('clickAttach');
    // #endif
    // 隐藏验证码
    if (this.captcha) {
      this.captcha.destroy();
    }
    clearInterval(payWechat);
    clearInterval(payPhone);
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';
.post-box {
  width: 100vw;
  height: 100%;
  padding: 40rpx;
  overflow: hidden;
  background-color: --color(--qui-BG-2);
  box-sizing: border-box;
  &__title {
    display: flex;
    align-items: center;
    width: 100vw;
    height: 100rpx;
    margin-bottom: 30rpx;
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
    &-input {
      width: 100%;
      padding-right: 80rpx;
      font-size: $fg-f5;
    }
  }
  &__titles {
    margin-bottom: 30rpx;
  }
  &__hd {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-l {
      &__icon {
        margin-right: 54rpx;
      }
    }
    &-r {
      font-size: $fg-f2;
      color: --color(--qui-FC-777);
    }
  }
  &__con {
    width: 100%;
    // max-height: 900rpx;
    padding: 10rpx 0 0;
    margin-top: 20rpx;
    overflow: hidden;
    background-color: --color(--qui-BG-1);
    border: 1rpx solid --color(--qui-BOR-DDD);
    border-radius: 7rpx;
    box-sizing: border-box;
  }
  &__con-text {
    z-index: 0;
    width: 100%;
    max-height: 900rpx;
    min-height: 400rpx;
    padding: 10rpx 20rpx 20rpx;
    font-size: $fg-f4;
    line-height: 40rpx;
    box-sizing: border-box;
    .text-cover {
      font-size: $fg-f4;
      line-height: 40rpx;
    }
    &--static {
      overflow: auto;
    }
  }
  &__ft {
    &-tit {
      display: block;
      margin: 30rpx 0;
      font-size: $fg-f4;
      color: --color(--qui-FC-7D7979);
    }
    &-categories {
      margin-bottom: 40rpx;
    }
  }

  &__good {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin: 30rpx 0;
    font-size: $fg-f3;

    &__image {
      width: 160rpx;
      height: 160rpx;
      margin: 0 30rpx 0 0;
      border-radius: 5rpx;
    }

    &__info {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    &__title {
      max-height: 120rpx;
      overflow: hidden;
      font-weight: bold;
      line-height: 40rpx;
      color: --color(--qui-FC-333);
    }

    &__ft {
      position: absolute;
      bottom: 0;
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      line-height: 45rpx;
      color: --color(--qui-FC-777);
    }

    &__price {
      display: inline-block;
      font-size: $fg-f5;
      color: --color(--qui-RED);
    }

    &__btn {
      display: inline-block;
    }
  }

  &__space {
    width: 100%;
    height: 160rpx;
    margin: 30rpx 0;
    line-height: 160rpx;
    color: --color(--qui-FC-B5);
    text-align: center;
    background-color: --color(--qui-FC-f7);
    border: 1rpx solid --color(--qui-BOR-ED);
    border-radius: 5rpx;
  }

  &__position /deep/ {
    position: relative;
    color: --color(--qui-FC-777);
    .icon-weizhi {
      margin-right: 10rpx;
    }
    .icon-close1 {
      position: absolute;
      top: 36rpx;
      right: 0;
      z-index: 100;
    }
  }
}
.play-load {
  .post-box__video__play__load__mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: --color(--qui-BG-ED);
    border: 1px solid --color(--qui-BOR-ED);
    border-radius: 5rpx;
    opacity: 0.7;
  }
  .post-box__video__play__load__text {
    position: relative;
    z-index: 2;
    font-size: $fg-f4;
    line-height: 36rpx;
    color: --color(--qui-FC-34);
  }
  progress {
    position: absolute;
    bottom: 9.5rpx;
    z-index: 3;
    width: 87.5%;
  }
}
.post-box__ft-categories /deep/ .qui-button--button {
  margin-top: 10rpx;
  margin-right: 20rpx;
  margin-bottom: 10rpx;
  &[size='default'] {
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
}
.post-box__ft-categories /deep/ .qui-button--button:after {
  border: none;
  border-radius: 0;
}
.post-box__ft-categories /deep/ .cateActive {
  &[size='default'] {
    border: 1px solid #1878f3;
  }
}
.popup-content-btn {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .popup-btn {
    margin-top: 20rpx;
  }
}
.popup-share {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  background: --color(--qui-BG-2);
}
.popup-share-content {
  height: 477rpx;
  padding: 40rpx 45rpx;
  text-align: center;
  box-sizing: border-box;
  .popup-title {
    font-size: $fg-f4;
  }
}
.popup-share-content-space {
  width: 100%;
  height: 9rpx;
  background: --color(--qui-BG-ED);
}
.emoji-bd {
  position: relative;
  width: 100%;
}
/deep/ textarea .textarea-placeholder {
  font-size: $fg-f4;
  color: --color(--qui-FC-B5);
}
/deep/ input .input-placeholder {
  font-size: $fg-f5;
  color: --color(--qui-FC-AAA);
}
.cell-item-right-text {
  /deep/ .cell-item__body__right-text {
    color: --color(--qui-RED);
  }
}
/deep/ .cell-item__body__right .cell-item__body__right-text {
  font-size: $fg-f5;
}
/deep/ .cell-item__body__content-title {
  color: --color(--qui-FC-777);
}
/deep/ .uni-list-cell {
  display: flex;
  justify-content: space-between;
  height: 100rpx;
  align-items: center;
  font-size: $fg-f4;
  color: --color(--qui-FC-777);
  border-bottom: 2rpx solid #ededed;
}
/deep/ .my-profile__avatar {
  position: relative;
}
// /deep/ .avatar-box {
//   padding-left: 0;
// }
/deep/ .avatar-box__r__tit {
  color: --color(--qui-FC-TAG);
}
/deep/ .uni-list-cell .uni-list-cell-pd {
  position: relative;
}
.popup-dialog {
  width: 670rpx;
  height: 342rpx;
  background-color: --color(--qui-BG-2);
  border-radius: 14rpx;
  &__top {
    padding-top: 40rpx;
    text-align: center;
    text {
      font-size: $fg-f4;
      color: --color(--qui-FC-333);
    }
  }
  &__cont {
    position: relative;
    display: flex;
    align-items: center;
    padding: 24rpx 52rpx 40rpx;
    &-rmb {
      position: absolute;
      margin-left: 25rpx;
    }
    &-input {
      width: 100%;
      height: 100rpx;
      padding: 0 25rpx 0 80rpx;
      font-size: 40rpx;
      text-align: right;
      border: 1px solid --color(--qui-BOR-DDD);
      border-radius: 7rpx;
      box-sizing: border-box;
    }
  }
  &__ft {
    display: flex;
    align-items: center;
    height: 100rpx;
    border-top: 2rpx solid --color(--qui-BOR-DDD);
    box-sizing: border-box;
    button {
      width: 50%;
      color: --color(--qui-FC-777);
      background-color: --color(--qui-BG-2);
      border-radius: 0;
      &:after {
        border: none;
      }
      &:last-of-type {
        border-left: 2rpx solid --color(--qui-BOR-DDD);
        border-bottom-right-radius: 10rpx;
      }
      &:first-of-type {
        border-bottom-left-radius: 10rpx;
      }
    }
    .popup-btn--ok--blue {
      color: --color(--qui-BG-HIGH-LIGHT);
    }
  }
}
/deep/ .uni-video-cover {
  display: none;
}
/deep/ .cell-item__body__right {
  display: contents;
}
.markdown-box {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  height: 60rpx;
  line-height: 60rpx;
  background: --color(--qui-BG-FFF);
  border-top: 1px solid --color(--qui-BOR-DDD);
}
.username {
  max-width: 200rpx;
  overflow: hidden;
  font-size: $fg-f3;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pay-type {
  font-size: $fg-f4;
  line-height: 100rpx;
  text-align: center;
  border-bottom: 1px solid --color(--qui-BOR-ED);
}
.watchpay {
  font-size: $fg-f3;
  color: --color(--qui-FC-AAA);
}
</style>
