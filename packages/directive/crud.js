export default function (crud) {
    let mixins = {
        data() {
            return {
                loading: true,
                query: {},
                data: [],
                page: {
                    pageSize: 10,
                    currentPage: 1,
                    total: 0,
                },
                selectionList: [],
            }
        },
        computed: {
            ids() {
                let ids = [];
                this.selectionList.forEach((ele) => {
                    ids.push(ele.id);
                });
                return ids.join(",");
            },
        },
        methods: {
            searchReset() {
                this.query = {};
                this.onLoad(this.page);
            },
            searchChange(params, done) {
                this.query = params;
                this.page.currentPage = 1;
                this.onLoad(this.page, params);
                done();
            },
            selectionChange(rows) {
                this.selectionList = rows;
            },
            selectionClear() {
                this.selectionList = [];
                this.$refs.crud && this.$refs.crud.toggleSelection();
            },
            currentChange(currentPage) {
                this.page.currentPage = currentPage;
            },
            sizeChange(pageSize) {
                this.page.pageSize = pageSize;
            },
            refreshChange() {
                this.onLoad(this.page, this.query);
            },
        }
    }
    crud.mixins = crud.mixins || [];
    crud.mixins.push(mixins)
    return crud
}