// 数据处理相关的都写在这里吧
/**
 * 合并关联数据
 * 主要是 reststate/vuex 的 loadAll action 对于请求到的数据进行关联数据的合并，
 * 这样比较好用于渲染。不用再单独处理数据了。
 * @param {string} parentType 父类型
 * @param {object} options 请求传入的参数
 * @param {function} rootGetters store的dispatch
 * @param {object|function} rootGetters store的rootGetters
 * @return {promise}
 */
export const mergeRelatedData = (parentType, options, dispatch, rootGetters) => {
  const action = `${parentType}/loadAll`;
  const getter = `${parentType}/all`;
  return new Promise(resolve => {
    dispatch(action, { options }, { root: true }).then(() => {
      const allData = rootGetters[getter];
      const mergedData = allData.map(item => {
        const elem = { ...item };
        if (elem.relationships) {
          Object.keys(elem.relationships).map(relation => {
            const relatedType = elem.relationships[relation].data.type;
            const relatedAction = `${relatedType}/related`;
            elem[relation] = rootGetters[relatedAction]({
              parent: {
                type: parentType,
                id: elem.id,
              },
              relationship: relation,
            });
            return relation;
          });
        }
        return elem;
      });
      resolve(mergedData);
    });
  });
};
