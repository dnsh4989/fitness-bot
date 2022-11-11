const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

module.exports = class WellnessConfig {
  constructor(tweetTypePattern, currentIndex, mid = null) {
    this.currentIndex =
      currentIndex || currentIndex === 0 ? currentIndex : null;
    this.tweetTypePattern = tweetTypePattern ? tweetTypePattern : null;
    this._id = mid ? new mongodb.ObjectId(mid) : null;
  }

  saveIndex() {
    const db = getDb();
    return db
      .collection("config2")
      .updateOne(
        { _id: new mongodb.ObjectId("63661ad61b4c74995baed943") },
        { $set: this }
      );
  }

  static getIndex() {
    const db = getDb();
    return db
      .collection("config2")
      .findOne({ _id: new mongodb.ObjectId("63661ad61b4c74995baed943") });
  }

  static getPattern() {
    const db = getDb();
    return db
      .collection("config2")
      .findOne({ _id: new mongodb.ObjectId("636618e61b4c74995baed93e") });
  }
};
