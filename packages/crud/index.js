import crud from './crud.vue'

crud.install = (Vue) => {
    Vue.component(crud.name, crud)
}

export default crud