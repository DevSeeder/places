export class MongooseHelper {
  static buildSelectAggregated(groupSelect: object = {}) {
    const objGroup = {};
    if (Object.keys(groupSelect).length > 0) {
      Object.keys(groupSelect).forEach((key) => {
        objGroup[key] = {
          $first: `$${groupSelect[key]}`
        };
      });
    }
    return objGroup;
  }

  static buildRegexFilterQuery(objSearch: object = {}) {
    const objSearchRegex = {};
    Object.keys(objSearch).forEach(function (key) {
      if (objSearch[key] == null) return;
      objSearchRegex[key] = objSearch[key];
      if (typeof objSearch[key] === 'string')
        objSearchRegex[key] = new RegExp(`^${objSearch[key]}$`, 'i');
    });
    return objSearchRegex;
  }
}
