export default function () {
    return {
        methods: {
            // 获取上传展示类型
            getListType(listType) {
                return listType ? listType : 'picture-card'
            },
            // 上传前
            beforeUpload(file, column) {
                let fileType, fileSize = null;
                if (column.fileSize) {
                    fileSize = column.fileSize;
                }
                if (column.fileType && column.fileType !== '') {
                    fileType = column.fileType;
                }
                let isOverSize = fileSize ? file.size / 1024 / 1024 < fileSize : null;
                let isRightType = fileType ? fileType.split('/').includes(file.type.split('/')[1]) : null;
                if (!isOverSize) {
                    this.$message.error(`上传文件大小不能超过${fileSize}MB!`);
                    return false
                }

                if (!isRightType) {
                    this.$message.error(`上传文件类型只能是${fileType}格式`);
                    return false
                }
            },
            // 上传成功
            handleOnSuccess(res, column) {
                console.log('handleOnSuccess', res);
                let url = '';
                if (column.propsHttp.res && res[column.propsHttp.res]) {
                    url = `${column.propsHttp.domain?column.propsHttp.domain:''}${res[column.propsHttp.res?column.propsHttp.res:'data'][column.propsHttp.url?column.propsHttp.url:'url']}`
                } else {
                    url = `${column.propsHttp.domain?column.propsHttp.domain:''}${res[column.propsHttp.url?column.propsHttp.url:'url']}`
                }
                this.PForm[column.prop].push({
                    name: url,
                    url
                })
            },
            // 上传失败
            handleOnError(err, file, fileList) {
                console.log('err', err, file, fileList);
            },
            // 预览
            handlePreview(file, fileList) {
                console.log('handlePreview', file);
                console.log('fileList', fileList);
                // this.uploadDataUrl = file.url;
                let index = fileList.findIndex((item) => {
                    return item.url === file.url;
                })
                let previewList = fileList.map((item) => {
                    return item.url
                })
                this.$ImagePreview(previewList, index)
            },
            // 文件数量限制提示
            handleExceed(files, fileList, column) {
                this.$message.warning(`当前限制选择 ${column.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            // 删除
            handleRemove(file, column) {
                this.PForm[column.prop] = this.PForm[column.prop].filter((item) => {
                    return item.url != file.url
                })
            },
        }
    }
}