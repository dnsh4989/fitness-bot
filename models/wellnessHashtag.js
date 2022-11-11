const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

module.exports = class WellnessHashtag {
  constructor(term, mid) {
    this.term = term;
    this._id = mid ? new mongodb.ObjectId(mid) : null;
  }

  save() {
    const db = getDb();
    return db
      .collection("hashtags2")
      .insertOne(this)
      .then((res) => {
        console.log("Wellness Hashtag insertion successfull!!!");
        // console.log(res);
      })
      .catch((error) => {
        console.log("Wellness Hashtag insertion failed!!!");
        // console.log(err);
      });
  }

  static fetchAllHashtags() {
    const db = getDb();
    return db
      .collection("hashtags2")
      .find()
      .toArray()
      .then((hashtags) => {
        console.log("Fetch All Wellness Hashtags successfull!!!");
        return hashtags;
      })
      .catch((error) => {
        console.log("Fetch All Wellness Hashtags failed!!!");
        console.log(error);
      });
  }
};
