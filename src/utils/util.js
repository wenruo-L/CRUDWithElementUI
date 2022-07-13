import {
    validatenull
} from '@/utils/validate'


export const arraySort = (list = [], prop, callback) => {
    return list.filter(ele => !validatenull(ele[prop])).sort((a, b) => callback(a, b)).concat(list.filter(ele => validatenull(ele[prop])));
}

export const setPx = (val, defval = '') => {
    if (validatenull(val)) val = defval;
    if (validatenull(val)) return '';
    val = val + '';
    if (val.indexOf('%') === -1) {
        val = val + 'px';
    }
    return val;
};

// 过滤除表格以外的
export const getTableSlot = (slotArr) => {
    // 要剔除的插槽类型
    let result = [];
    for (let key in slotArr) {
        if (!key.endsWith('Form') && !key.endsWith('Search')) {
            result.push(key)
        }
    }
    return result;
};

// 设置默认值
// 参数：设置的类型  设置的值
export const changeValueType = (dataType, value) => {
    let result;
    if (dataType === 'array') {
        result = value ?
            value.indexOf(',') != -1 ?
            value.split(',') :
            value : []
    } else if (dataType === 'number') {
        result = value ?
            Number(value) :
            0
    } else if (dataType == 'time') {
        result = value ?
            value : [new Date(), new Date()]
    } else {
        result = value ?
            value.toString() :
            ''
    }
    return result;

}