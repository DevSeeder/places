export class MongoDBHelper {
  static generateObjectID(length = 16): string {
    const timestamp = ((new Date().getTime() / 1000) | 0).toString(length);
    return (
      timestamp +
      'x'
        .repeat(length)
        .replace(/[x]/g, function () {
          return ((Math.random() * length) | 0).toString(length);
        })
        .toLowerCase()
    );
  }
}
