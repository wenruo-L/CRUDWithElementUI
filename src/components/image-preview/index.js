import Main from './index.vue'
import Vue from 'vue'

const imagePreview = (() => {
    let MessageConstructor = Vue.extend(Main);
    const obj = (datas = [], index = 0, ops) => {
        let options = {
            datas: datas,
            index: index,
            ops: Object.assign({
                closeOnClickModel: false,
                beforeClose: null,
                mask: true
            }, ops)
        }
        let instance = new MessageConstructor({
            data: options
        })
        instance.vm = instance.$mount();
        document.body.appendChild(instance.vm.$el);
        instance.vm.isShow = true;
        instance.dom = instance.vm.$el;
        return instance.vm
    }
    return obj
})()

export default imagePreview