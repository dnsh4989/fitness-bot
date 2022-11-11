const { getDb } = require("../util/database");

module.exports = class PreviousRetweet {
  constructor(id, text, edit_history_tweet_ids, userId) {
    this.id = id;
    this.text = text;
    this.edit_history_tweet_ids = edit_history_tweet_ids;
    this.userId = userId;
    this.reTweetedAt = new Date();
  }

  save() {
    const db = getDb();
    db.collection("previousRetweets")
      .insertOne(this)
      .then((res) => {
        console.log("Retweet insertion successfull!!!");
        console.log(res);
      })
      .catch((error) => {
        console.log("Retweet insertion failed!!!");
        console.log(err);
      });
  }

  static fetchAllPreviousRetweets() {
    const db = getDb();
    return db
      .collection("previousRetweets")
      .find()
      .toArray()
      .then((profiles) => {
        console.log("Fetch All Previous Retweets successfull!!!");
        return profiles;
      })
      .catch((error) => {
        console.log("Fetch All Previous Retweets failed!!!");
        console.log(error);
      });
  }

  static removeAllPreviousRetweets = () => {
    const db = getDb();
    return db.collection("previousRetweets").remove();
  };
};
