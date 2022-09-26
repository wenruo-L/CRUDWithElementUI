<template>
  <basic-container>
    <div>about form:{{ form }}</div>
    <div>--------------------------------------------------------</div>
    <p-form
      :option="option"
      v-model="form"
      :uploadExceed="uploadExceed"
      @submit="submit"
      @uploadOnChange="onChange"
    ></p-form>
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
            label: "树型选择器",
            prop: "testValue",
            type: "tree",
            defaultExpandAll: true,
            labelWidth: 100,
            multiple: true,
            // parent: false,
            leafOnly: true,
            dataType: "array",
            value: [2, 3],
            dicData: [
              {
                label: "字典1",
                value: 0,
                children: [
                  {
                    label: "字典3",
                    value: 2,
                  },
                  {
                    label: "字典4",
                    value: 3,
                  },
                  {
                    label: "字典5",
                    value: 4,
                  },
                ],
              },
              {
                label: "字典2",
                value: 1,
                children: [
                  {
                    label: "字典6",
                    value: 5,
                  },
                ],
              },
            ],
            rules: [
              {
                required: true,
                message: "请输入测试句子",
                trigger: "blur",
              },
            ],
          },
          {
            label: "上传",
            prop: "upload",
            type: "upload",
            accept: ".jpg,.mp4,.png,.zip",
            autoUpload: false,
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
            limit: 2,
            fileSize: 2, //文件大小限制,单位M
            fileType: "jpg/jpeg", //逗号分隔
          },
          {
            label: "上传但picture-img",
            prop: "uploadPictureImg",
            value:
              "https://thirdwx.qlogo.cn/mmopen/vi_32/a1roqYfQFib4VhjwGALuVFg4ia6va8FibEpvNbXVU93kq7x5W791y6mun99d31DGStCZibIjdCRxNNegYjAapd87aw/132",
            type: "upload",
            autoUpload: false,
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
          // {
          //   label: "上传",
          //   prop: "test",
          //   type: "upload",
          //   accept: ".zip",
          //   fileSize: 100,
          //   autoUpload: false,
          // },
        ],
      },
      form: {},
      resourcesFile: null,
    };
  },
  // watch: {
  //   form: {
  //     handler(val) {
  //       console.log("about form change", val);
  //     },
  //     deep: true,
  //   },
  // },
  created() {
    console.log("about created form", this.form);
    // setTimeout(() => {
    //   this.form = {
    //     testValue: [4, 5],
    //     upload: [
    //       // {
    //       //   name: "卧槽车车",
    //       //   url: "https://auto1.sinaimg.cn/autoimg/car/95/90/131519095_950.JPG",
    //       // },
    //       // {
    //       //   name: "好康的",
    //       //   url: "https://1307918980.vod2.myqcloud.com/8a753638vodtranscq1307918980/5959edbc387702303012006247/v.f1417934.mp4",
    //       // },
    //     ],
    //     // uploadPictureImg:
    //     //   "https://1307918980.vod2.myqcloud.com/8a753638vodtranscq1307918980/5959edbc387702303012006247/v.f1417934.mp4",
    //     // uploadPictureImg:
    //     //   "https://thirdwx.qlogo.cn/mmopen/vi_32/a1roqYfQFib4VhjwGALuVFg4ia6va8FibEpvNbXVU93kq7x5W791y6mun99d31DGStCZibIjdCRxNNegYjAapd87aw/132",
    //   };
    // }, 1000);
  },
  methods: {
    uploadExceed(limit, files, fileList, column) {
      console.log("uploadExceed", limit, files, fileList, column);
    },
    onChange(file, fileList, column) {
      console.log("onChange", file, fileList, column);
      if (column.prop === "uploadPictureImg") {
        let reader = new FileReader();
        reader.readAsDataURL(file.raw);
        reader.onload = (e) => {
          this.form[column.prop] = e.target.result;
        };
        console.log("this.form[column.prop]", this.form[column.prop]);
      } else if (column.prop === "upload") {
        this.resourcesFile = file.raw;
      }
    },
    submit(form, done) {
      console.log("让我康康", form);
      console.log("resourcesFile", this.resourcesFile);
      done();
    },
  },
};
</script>
