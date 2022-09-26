<template>
  <div :element-loading-text="loadText" v-loading.lock="loading">
    <el-upload
      class="pUpload"
      :class="[
        {
          'pUpload--list': listType == 'picture-img',
          'pUpload--upload': disabled,
        },
      ]"
      :action="action"
      :accept="acceptList"
      :data="data"
      :headers="headers"
      :multiple="multiple"
      :limit="limit"
      :drag="drag"
      :show-file-list="isPictureImg ? false : showFileList"
      :list-type="listType"
      :disabled="disabled"
      :file-list="fileList"
      :autoUpload="autoUpload"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :on-preview="handlePreview"
      :http-request="httpUpload"
      :on-exceed="handleExceed"
      :on-change="handleOnChange"
    >
      <template v-if="listType == 'picture-card'">
        <i class="el-icon-plus"></i>
      </template>
      <template v-else-if="listType === 'picture-img'">
        <template>
          <component
            v-if="imgUrl"
            :is="getIsVideo"
            :src="imgUrl"
            alt="无法展示"
            @mouseover="menu = true"
            :disabled="disabled"
            class="pUpload__avatar"
          ></component>
          <!--  -->
          <i v-else class="el-icon-plus pUpload__icon"></i>
          <div
            class="pUpload__menu"
            v-if="menu"
            @mouseover="menu = true"
            @mouseout="menu = false"
            @click.stop="stop"
          >
            <i
              class="el-icon-zoom-in"
              @click.stop="handlePreview({ url: imgUrl })"
            ></i>
            <i
              class="el-icon-delete"
              v-if="!disabled"
              @click.stop="handleRemove(text[0], [])"
            ></i>
          </div>
        </template>
      </template>
      <template v-else-if="drag">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </template>
      <template v-else>
        <el-button size="small" type="primary" :disabled="disabled"
          >点击上传</el-button
        >
      </template>
      <div slot="tip" class="el-upload__tip" v-if="accept">
        <span v-if="acceptList !== ''"> 只能上传{{ acceptList }}文件 </span>
        <span v-if="fileSize"> ，且不超过{{ fileSize }}MB </span>
      </div>
    </el-upload>
  </div>
</template>

<script>
// 表单组件中upload的东西较多，特意独立处理
import pFormConfig from "../../config/p-form-config";
import { getObjType } from "@/utils/util";

export default {
  name: "p-upload",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: [String, Array],
      default: "",
    },
    column: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 上传地址
    action: {
      type: String,
      default: "#",
    },
    // 设置上传的请求头部
    headers: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 是否支持多选文件
    multiple: {
      type: Boolean,
      default: false,
    },
    // 上传时附带的额外参数
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 上传服务器后返回资源的名字对应字段
    name: {
      type: String,
      default: "name",
    },
    // 上传文件流时的名称
    fileName: {
      type: String,
      default: "file",
    },
    // 文件资源前缀，如域名前缀等，不需要不要传
    domain: {
      type: String,
      default: "",
    },
    // 结构体的层次，例如返回data:{url:'',name:''},则res配置为data
    res: {
      type: String,
      default: "data",
    },
    // 上传服务器后返回资源的对应字段
    url: {
      type: String,
      default: "url",
    },
    // 数据类型
    dataType: {
      type: String,
      default: "array",
    },
    // 支持发送 cookie 凭证信息
    withCredentials: {
      type: Boolean,
      default: false,
    },
    // 是否显示已上传文件列表
    showFileList: {
      type: Boolean,
      default: true,
    },
    // 是否启用拖拽上传
    drag: {
      type: Boolean,
      default: false,
    },
    // 接受上传的文件类型（thumbnail-mode 模式下此参数无效）
    accept: {
      type: String,
      default: "",
    },
    // 文件列表的类型
    listType: {
      type: String,
      default: "text",
    },
    // 是否在选取文件后立即进行上传
    autoUpload: {
      type: Boolean,
      default: true,
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 最大允许上传个数
    limit: {
      type: Number,
      default: 10,
    },
    // 单文件大小限制
    fileSize: {
      type: Number,
      default: 10,
    },
    loadText: {
      type: String,
      default: "文件上传中,请稍等",
    },
    onRemove: Function,
    onChange: Function,
    httpRequest: Function,
    uploadExceed: Function,
    uploadAfter: Function,
    uploadDelete: Function,
    uploadPreview: Function,
  },
  data() {
    return {
      text: [],
      menu: false,
      loading: false,
    };
  },
  watch: {
    value: {
      handler() {
        this.initVal();
      },
    },
  },
  computed: {
    isArray() {
      return this.dataType === "array";
    },
    acceptList() {
      if (Array.isArray(this.accept)) {
        return this.accept.join(",");
      }
      return this.accept;
    },
    isPictureImg() {
      return this.listType === "picture-img";
    },
    imgUrl() {
      if (this.text.length && this.text[0].url !== "") {
        return this.getFileUrl(this.domain, this.text[0].url);
      }
      return null;
    },
    getIsVideo() {
      if (pFormConfig.fileType.video.test(this.imgUrl)) {
        return "video";
      }
      return "img";
    },
    fileList() {
      let list = [];
      (this.text || []).forEach((el, index) => {
        if (el && el.url) {
          list.push({
            uid: index + Math.random(),
            status: "done",
            isImage: pFormConfig.fileType.img.test(el.url),
            name: el.name,
            url: el.url,
          });
        }
      });
      return list;
    },
  },
  created() {
    this.initVal();
  },
  methods: {
    handleOnChange(file, fileList) {
      this.onChange && this.onChange(file, fileList, this.column);
      // this.handleValueChange();
    },
    handleValueChange() {
      let result = this.text;
      let getValueList = (isArray) => {
        if (isArray) {
          result = this.text.map((item) => {
            return { name: item.name, url: item.url };
          });
        } else {
          result = this.text.map((item) => {
            return item.url;
          });
        }
      };
      result = getValueList(this.isArray);
      this.$emit("change", this.isArray ? result : result.join());
    },
    initVal() {
      if (getObjType(this.value) === "string") {
        let textItem = {
          url: this.value,
        };
        if (this.listType === "picture-img") {
          this.text = [textItem];
        } else {
          this.text.push(textItem);
        }
      } else if (getObjType(this.value) === "array") {
        this.value.forEach((el) => {
          let textItem = {
            name: el.name ? el.name : el.url,
            url: el.url,
          };
          this.text.push(textItem);
        });
      }
    },

    stop() {
      return false;
    },
    getFileUrl(domain, uri = "") {
      this.menu = false;
      return uri.match(/(^http:\/\/|^https:\/\/|^\/\/|data:image\/)/)
        ? uri
        : domain + uri;
    },
    handlePreview(file) {
      // console.log("handlePreview", file);
      const callback = () => {
        let index = this.fileList.findIndex((ele) => {
          return ele.url === file.url;
        });
        if (index === -1) {
          return this.$message.warning("暂不支持预览该格式资源");
        }
        this.$ImagePreview(this.fileList, index);
      };
      if (typeof this.uploadPreview === "function") {
        this.uploadPreview(file, this.column, callback);
      } else {
        callback();
      }
    },
    handleRemove(file, fileList) {
      this.onRemove && this.onRemove(file, fileList, this.column);
      this.text = fileList.length
        ? fileList.map((item) => {
            return { name: item.name, url: item.url };
          })
        : [];
      this.menu = false;
    },
    beforeRemove(file) {
      if (typeof this.uploadDelete === "function") {
        return this.uploadDelete(file, this.column);
      } else {
        return Promise.resolve();
      }
    },
    httpUpload(config) {
      console.log("httpUpload", config);
      if (typeof this.httpRequest === "function") {
        this.httpRequest(config);
        return;
      }
      let vaildUploadData = this.vaildUploadData(config.file);
      // console.log("fileList", this.fileList);
      if (!vaildUploadData) return;
      this.loading = true;
      const headers = Object.assign(this.headers, {
        "Content-Type": "multipart/form-data",
      });
      let params = new FormData();
      const done = () => {
        let url = this.action;
        if (JSON.stringify(this.data) != "{}") {
          for (let key in this.data) {
            params.append(key, this.data[key]);
          }
        }
        params.append(this.fileName, config.file);
        this.$axios
          .post(url, params, { headers })
          .then((res) => {
            this.handleSuccess(res);
          })
          .catch((error) => {
            this.handleError(error);
          });
      };
      done();
    },
    handleSuccess(result) {
      let resourcesUrl = `${this.domain}${result[this.res][this.url]}`;
      let resourcesName = result[this.res][this.name] || resourcesUrl;
      let resourcesItem = {
        name: resourcesName,
        url: resourcesUrl,
      };
      this.text.push(resourcesItem);
      this.menu = false;
      if (typeof this.uploadAfter === "function") {
        this.uploadAfter(
          result,
          () => {
            this.loading = false;
          },
          this.column
        );
      } else {
        this.loading = false;
      }
    },
    handleError(error) {
      // console.log("handleError error", error);
      this.menu = false;
      this.loading = false;
      this.$message.error(error);
    },
    vaildUploadData(file) {
      let fileSize = this.fileSize;
      let isOverSize = fileSize ? file.size / 1024 / 1024 < fileSize : null;
      if (!isOverSize) {
        this.$message.error(`上传文件大小不能超过${fileSize}MB!`);
        return false;
      }
      return true;
    },
    handleExceed(files, fileList) {
      this.uploadExceed &&
        this.uploadExceed(this.limit, files, fileList, this.column);
      this.$message.warning(
        `当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，已选择了 ${fileList.length} 个文件`
      );
    },
  },
};
</script>

<style lang="scss">
@import "/src/style/upload.scss";
</style>
