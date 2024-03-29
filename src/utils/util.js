import { validatenull } from "@/utils/validate";

export const arraySort = (list = [], prop, callback) => {
  return list
    .filter((ele) => !validatenull(ele[prop]))
    .sort((a, b) => callback(a, b))
    .concat(list.filter((ele) => validatenull(ele[prop])));
};

export const setPx = (val, defval = "") => {
  if (validatenull(val)) val = defval;
  if (validatenull(val)) return "";
  val = val + "";
  if (val.indexOf("%") === -1) {
    val = val + "px";
  }
  return val;
};

// 获取slot的列表
// slotArr 插槽列表
// slotType 要过滤的插槽类型
// needCut 是否需要切割替换成Form插槽
export const getSlot = (slotArr, slotType, needCut = false) => {
  let result = [];
  for (let key in slotArr) {
    if (
      !key.endsWith("Form") &&
      !key.endsWith("Search") &&
      slotType == "table"
    ) {
      result.push(key);
    } else if (key.endsWith(slotType)) {
      key = needCut ? `${key.substring(0, key.lastIndexOf(slotType))}` : key;
      result.push(key);
    }
  }
  return result;
};

// 设置默认值
// 参数：设置的类型  设置的值
export const changeValueType = (dataType, value) => {
  let result;
  if (dataType === "array") {
    result = value ? (value.indexOf(",") != -1 ? value.split(",") : value) : [];
  } else if (dataType === "number") {
    result = value ? Number(value) : 0;
  } else if (dataType == "time") {
    result = value ? value : [new Date(), new Date()];
  } else {
    result = value ? value.toString() : "";
  }
  return result;
};
export const getObjType = (obj) => {
  var toString = Object.prototype.toString;
  var map = {
    "[object Boolean]": "boolean",
    "[object Number]": "number",
    "[object String]": "string",
    "[object Function]": "function",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object RegExp]": "regExp",
    "[object Undefined]": "undefined",
    "[object Null]": "null",
    "[object Object]": "object",
  };
  if (obj instanceof Element) {
    return "element";
  }
  return map[toString.call(obj)];
};

export const deepClone = (data) => {
  var type = getObjType(data);
  var obj;
  if (type === "array") obj = [];
  else if (type === "object") obj = {};
  else return data;
  if (type === "array") {
    for (var i = 0, len = data.length; i < len; i++) {
      data[i] = (() => {
        if (data[i] === 0) {
          return data[i];
        }
        return data[i];
      })();
      if (data[i]) {
        delete data[i].$parent;
      }
      obj.push(deepClone(data[i]));
    }
  } else if (type === "object") {
    for (var key in data) {
      if (data) {
        delete data.$parent;
      }
      obj[key] = deepClone(data[key]);
    }
  }
  return obj;
};

/**
 * 获取提示语
 * 1.1 当有提示语的时候使用提示语来提示
 * 1.2 当有校验规则的时候使用检验规则的提示
 * 1.3 以上都没有就根据类型来提示
 */
export const getPlaceHolder = (column) => {
  if (column.placeHolder) return column.placeHolder;
  let placeHolder = `请输入${column.label}`;
  let inputType = ["input", "textarea", "password"];
  let columnType = column.type || "input";
  if (!inputType.includes(columnType)) {
    placeHolder = `请选择${column.label}`;
  }
  if (column.rules && column.rules.length) {
    placeHolder = column.rules[0].message;
  }
  return placeHolder;
};

// 字符串数据类型转化
export const detailDataType = (value, type) => {
  if (validatenull(value)) return value;
  if (type === "number") {
    return Number(value);
  } else if (type === "string") {
    return value + "";
  } else {
    return value;
  }
};
