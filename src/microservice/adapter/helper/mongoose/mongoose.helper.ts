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

  /* istanbul ignore next */
  static buildLookupAggregate(
    from: string,
    joinFrom: string,
    joinLet: string,
    match: any = {}
  ) {
    const letObj = {};
    letObj[`${joinFrom}`] = `\$${joinLet}`;

    return {
      $lookup: {
        from,
        let: letObj,
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: [`\$${joinFrom}`, `\$\$${joinFrom}`] },
                  ...MongooseHelper.BuildMatchArrayLookup(match)
                ]
              }
            }
          },
          {
            $limit: 1
          }
        ],
        as: 'aggElement'
      }
    };
  }

  /* istanbul ignore next */
  static BuildMatchArrayLookup(match: any = {}) {
    if (Object.keys(match).length === 0) return [];

    const arrLookup = [];
    const keys = Object.keys(match);
    const values = Object.values(match);

    for (let i = 0; i < keys.length; i++) {
      const arrObj = [];
      arrObj.push(`\$${keys[i]}`);
      arrObj.push(values[i]);
      arrLookup.push({
        $eq: arrObj
      });
    }

    return arrLookup;
  }
}
