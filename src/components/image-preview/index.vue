<template>
  <div v-if="isShow" class="viewer__image__video">
    <div class="mask" v-if="ops.mask" @click="close"></div>
    <span class="el-image-viewer__btn el-image-viewer__close" @click="close">
      <i class="el-icon-circle-close"></i>
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
          <img
            v-if="getFileType(item.url) === 'img'"
            :style="styleName"
            class="preview__img"
            :src="item.url"
            alt="无法展示"
          />
          <video
            class="preview__video"
            v-if="getFileType(item.url) === 'video'"
            :src="item.url"
            autoplay
            controls
          ></video>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div
      class="el-image-viewer__btn el-image-viewer__actions"
      v-show="shouldShowControls"
    >
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
    shouldShowControls() {
      let type = this.getFileType(this.datas[this.index]);
      return !(type === "video");
    },
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

    getFileType(url) {
      // 照片
      if (this.fileType.img.test(url)) {
        return "img";
      }
      // 视频
      if (this.fileType.video.test(url)) {
        return "video";
      }
      return "not support!";
    },
    handleChange() {
      this.scale = 1;
      this.rotate = 0;
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

<style lang='scss'>
@import "./style.scss";
</style>