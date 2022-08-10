<template>
  <basic-container>
    <p-form :option="option" v-model="form" @submitForm="submit"></p-form>
  </basic-container>
</template>

<script>
// import pForm from "@/packages/p-form/p-form";
export default {
  name: "about",
  // components: {
  //   pForm,
  // },
  data() {
    return {
      option: {
        column: [
          {
            label: "上传",
            prop: "upload",
            type: "upload",
            accept: ".jpg,.mp4",
            hide: true,
            propsHttp: {
              domain: "http://www.liulongbin.top:3006", //图片前缀，如果需要的话
            },
            data: {
              test: 123,
            }, //上传文件流时附带的参数
            headers: {
              token: "123",
            }, //上传文件流时附带的请求头
            action: "http://www.liulongbin.top:3006/api/upload/avatar",
            multiple: true,
            limit: 3,
            fileSize: 2, //文件大小限制,单位M
            fileType: "jpg/jpeg", //逗号分隔
          },
          {
            label: "上传但picture-img",
            prop: "uploadPictureImg",
            type: "upload",
            dataType: "string",
            hide: "true",
            listType: "picture-img",
            action: "http://www.liulongbin.top:3006/api/upload/avatar",
            propsHttp: {
              domain: "http://www.liulongbin.top:3006",
            },
          },
          {
            label: "上传但picture-card",
            prop: "uploadPictureCard",
            type: "upload",
            hide: "true",
            listType: "picture-card",
            action: "http://www.liulongbin.top:3006/api/upload/avatar",
            propsHttp: {
              domain: "http://www.liulongbin.top:3006",
            },
            dataType: "array",
          },
          {
            label: "上传但拖拽",
            prop: "uploadPictureDrag",
            type: "upload",
            hide: "true",
            drag: true,
            multiple: true,
            action: "http://www.liulongbin.top:3006/api/upload/avatar",
            propsHttp: {
              domain: "http://www.liulongbin.top:3006",
            },
            dataType: "array",
          },
        ],
      },

      form: {},
    };
  },
  created() {
    setTimeout(() => {
      this.form = {
        upload: [
          {
            name: "卧槽车车",
            url: "https://auto1.sinaimg.cn/autoimg/car/95/90/131519095_950.JPG",
          },
          {
            name: "好康的",
            url: "https://1307918980.vod2.myqcloud.com/8a753638vodtranscq1307918980/5959edbc387702303012006247/v.f1417934.mp4",
          },
        ],
        uploadPictureImg:
          "https://1307918980.vod2.myqcloud.com/8a753638vodtranscq1307918980/5959edbc387702303012006247/v.f1417934.mp4",
      };
    }, 700);
  },
  methods: {
    submit(form, done) {
      console.log("让我康康", form);
      done();
    },
  },
};
</script>
