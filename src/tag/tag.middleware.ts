
export const arrangeMetaTagList = (
    metaTagList: any
) => {
    // 使用 reduce 方法按类别分组
    const groupedByCategory = metaTagList.reduce((group, item) => {
        // 如果当前类别的数组不存在，则创建一个新数组
        group[item.category] = group[item.category] || [];
        // 将当前项添加到对应类别的数组中
        group[item.category].push(item);
        return group;
      }, {});

      // 将对象转换为数组
      const groupedArray = Object.keys(groupedByCategory).map(category => {
        return {
          category,
          tags: groupedByCategory[category]
        };
      });

      return groupedArray
}