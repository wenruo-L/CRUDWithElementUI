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
                if (fileSize && !isOverSize) {
                    this.$message.error(`上传文件大小不能超过${fileSize}MB!`);
                    return false
                }
                if (fileType && !isRightType) {
                    this.$message.error(`上传文件类型只能是${fileType}格式`);
                    return false
                }
            },
            // 上传成功
            handleOnSuccess(res, column) {
                console.log('handleOnSuccess', res);
                let url = '';
                if (column.propsHttp.res && res[column.propsHttp.res]) {
                    url = `${column.propsHttp.imgDomain?column.propsHttp.imgDomain:''}${res[column.propsHttp.res?column.propsHttp.res:'data'][column.propsHttp.url?column.propsHttp.url:'url']}`
                } else {
                    url = `${column.propsHttp.imgDomain?column.propsHttp.imgDomain:''}${res[column.propsHttp.url?column.propsHttp.url:'url']}`
                }
                this.form[column.prop].push({
                    name: url,
                    url
                })
            },
            // 上传失败
            handleOnError(err, file, fileList) {
                console.log('err', err, file, fileList);
            },
            // 预览
            handlePreview(file) {
                // console.log('handlePreview', file);
                this.uploadDataUrl = file.url;
                this.uploadDialog = true;
            },
            // 文件数量限制提示
            handleExceed(files, fileList, column) {
                this.$message.warning(`当前限制选择 ${column.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            // 删除前
            beforeRemove() {
                return this.$confirm(`确定移除？`);
            },
            // 删除
            handleRemove(file, column) {
                this.form[column.prop] = this.form[column.prop].filter((item) => {
                    return item.url != file.url
                })
            },
        }
    }
}