<template>
  <div class="home">
    <p-form ::option="option" :submit="submit"></p-form>
  </div>
</template>

<script>
import pForm from "@/utils/CURD/p-form/p-form";
export default {
  name: "Home",
  components: {
    pForm,
  },
  data() {
    return {
      option: {
        column: [
          {
            label: "上传",
            prop: "upload",
            type: "upload",
            hide: true,
            listType: "text",
            dataType: "array",
            propsHttp: {
              domain: "http://www.liulongbin.top:3006", //图片前缀，如果需要的话
              res: "response", //结构体的层次，例如返回data:{url:'',name:''},则res配置为data
              url: "url", //上传服务器后返回图片的对应字段
              name: "", //上传服务器后返回图片的对应名字
              fileName: "", //上传文件流时的名称,
            },
            data: {
              test: 123,
            }, //上传文件流时附带的参数
            headers: {
              token: "123",
            }, //上传文件流时附带的请求头
            action: "http://www.liulongbin.top:3006/api/upload/avatar",

            limit: 3,
            fileSize: 2, //文件大小限制,单位M
            fileType: "jpg/jpeg", //逗号分隔
          },
          {
            label: "上传但picture-card",
            prop: "uploadPicture",
            type: "upload",
            hide: "true",
            listType: "picture-card",
            action: "http://www.liulongbin.top:3006/api/upload/avatar",
            propsHttp: {
              domain: "http://www.liulongbin.top:3006",
              res: "response",
              url: "url",
            },
            dataType: "array",
          },
        ],
      },
    };
  },
  methods: {
    submit(form, done) {
      console.log("让我康康", form);
      done();
    },
  },
};
</script>
