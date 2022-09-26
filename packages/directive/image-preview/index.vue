<template>
  <div v-if="isShow" class="viewer__image__video">
    <div class="mask" v-if="ops.mask" @click="close"></div>
    <span class="el-image-viewer__btn el-image-viewer__close" @click="close">
      <i class="el-icon-circle-close"></i>
    </span>
    <span
      v-if="ops.showDownload"
      class="el-image-viewer__btn el-image-viewer__download"
      @click="handleDownload"
    >
      <i class="el-icon-download"></i>
    </span>
    <span
      class="el-image-viewer__btn el-image-viewer__prev"
      @click="handlePrev()"
      v-if="shouldShowRrrow"
    >
      <i class="el-icon-arrow-left"></i>
    </span>
    <span
      class="el-image-viewer__btn el-image-viewer__next"
      @click="handleNext()"
      v-if="shouldShowRrrow"
    >
      <i class="el-icon-arrow-right"></i>
    </span>
    <div class="image-box">
      <el-carousel
        ref="carousel"
        class="carousel"
        :show-indicators="false"
        :initial-index="index"
        :initial-swipe="index"
        :interval="0"
        arrow="never"
        @change="handleChange"
        indicator-position="none"
      >
        <el-carousel-item
          v-for="item in datas"
          :key="item.id"
          @click.native.self="ops.closeOnClickModel ? close() : ''"
        >
          <div
            class="describe"
            v-if="ops.showDescribe && item.describe.length != 0"
          >
            <el-card>
              <div
                v-for="itemDescribe in item.describe"
                :key="itemDescribe.value"
              >
                {{ itemDescribe.label }}{{ itemDescribe.value }}
              </div>
            </el-card>
          </div>
          <component
            :is="getIsVideo(item.url)"
            :style="styleName"
            :src="item.url"
            alt="无法展示"
            autoplay
            controls
          ></component>
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- v-show="shouldShowControls" -->
    <div class="el-image-viewer__btn el-image-viewer__actions">
      <div class="el-image-viewer__actions__inner">
        <i class="el-icon-zoom-out" @click="subScale"></i>
        <i class="el-icon-zoom-in" @click="addScale"></i>
        <i class="el-image-viewer__actions__divider"></i>
        <i class="el-icon-refresh" @click="handleChange"></i>
        <i class="el-image-viewer__actions__divider"></i>
        <i class="el-icon-refresh-left" @click="rotate = rotate - 90"></i>
        <i class="el-icon-refresh-right" @click="rotate = rotate + 90"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "image-preview",
  data() {
    return {
      isShow: false,
      datas: [],
      index: 0,
      fit: "fill",
      scale: 1,
      rotate: 0,
      fileType: {
        img: /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)/,
        video: /\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|ogg|mp4)/,
      },
    };
  },
  computed: {
    styleName() {
      return {
        transform: `scale(${this.scale}) rotate(${this.rotate}deg)`,
        maxWidth: "100%",
        maxHeight: "100%",
      };
    },
    shouldShowRrrow() {
      return this.datas.length > 1;
    },
  },
  created() {
    console.log("ops.showDescribe", this.ops.showDescribe);
  },
  methods: {
    handlePrev() {
      this.$refs.carousel.prev();
      this.index = this.$refs.carousel.activeIndex;
    },
    handleNext() {
      this.$refs.carousel.next();
      this.index = this.$refs.carousel.activeIndex;
    },
    addScale() {
      this.scale = parseFloat((this.scale + 0.2).toFixed(2));
    },
    subScale() {
      console.log("subScale");
      if (this.scale != 0.2) {
        this.scale = parseFloat((this.scale - 0.2).toFixed(2));
      }
    },
    getIsVideo(url) {
      if (this.fileType.video.test(url)) {
        return "video";
      }
      return "img";
    },
    handleChange() {
      this.scale = 1;
      this.rotate = 0;
    },
    handleDownload() {
      console.log("handleDownload  this.ops", this.ops);
      if (
        this.ops.showDownload === true &&
        typeof this.ops.handleDownload === "function"
      ) {
        this.ops.handleDownload(this.datas, this.index);
      }
    },
    close() {
      if (typeof this.ops.beforeClose === "function") {
        this.ops.beforeClose(this.datas, this.index);
      }
      this.isShow = false;
    },
  },
};
</script>

<style lang="scss">
@import "./style.scss";
</style>
