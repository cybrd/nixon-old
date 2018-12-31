export function arrayToObject(array: any, keyField: any) {
  return array.reduce((obj: any, item: any) => {
    obj[item[keyField]] = item;
    return obj;
  }, {});
}
