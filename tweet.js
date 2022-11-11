const client = require("./config/client");
const { getDb } = require("./util/database");
const WellnessConfig = require("./models/wellnessConfig");
const WellnessProfile = require("./models/wellnessProfile");
const PreviousWellnessProfile = require("./models/previousWellnessProfile");
const PreviousRetweet = require("./models/previousRetweet");
const WellnessHashtag = require("./models/wellnessHashtag");
const PreviousWellnessHashtag = require("./models/previousWellnessHashtag");

const searchTweetsByTerm = (query = "100DaysOfCode", max_results = 10) => {
  const result = client.v2.get("tweets/search/recent", {
    query: query,
    max_results: max_results,
  });
  return result;
};

const getRandomItem = (items) => {
  return items[Math.floor(Math.random() * items.length)];
};

const getTweetsByUser = (user, max_results = 5) => {
  return client.v2.userTimeline(user.id, {
    exclude: ["replies", "retweets"],
    max_results: max_results,
  });
};

const addUserToDb = (user) => {
  const newUser = new PreviousWellnessProfile(
    user.id,
    user.name,
    user.username
  );
  newUser.save();
};

const retweetLatestFromUser = (user, response = null) => {
  console.log(user);
  getTweetsByUser(user)
    .then((last5Tweets) => {
      const currentTweet = getRandomItem(last5Tweets.data.data);
      console.log("currentTweet");
      console.log(currentTweet);
      currentTweet["userId"] = user.id;
      client.v2
        .retweet("1588443148383965184", currentTweet.id)
        .then((res) => {
          console.log(res);
          if (response && response.send) {
            response.send(res);
          }
          addUserToDb(user);
          incrementTweetTypeIndex();
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

const addHashtagToDb = (currentHashtag) => {
  const prevHashtag = new PreviousWellnessHashtag(currentHashtag.term);
  prevHashtag.save();
};

const tweetFromTerms = (res = null) => {
  WellnessHashtag.fetchAllHashtags()
    .then((hashtags) => {
      PreviousWellnessHashtag.fetchAllPreviousHashtags().then((prevHashes) => {
        const filteredHashes = hashtags.filter((hash) => {
          let hasHash = false;
          prevHashes.map((prevhash) => {
            if (prevhash.term === hash.term) {
              hasHash = true;
            }
          });
          return !hasHash;
        });
        console.log("Filtered Hashes:");
        if (filteredHashes.length) {
          const currentHashtag = getRandomItem(filteredHashes);
          searchTweetsByTerm(currentHashtag.term).then((tweets) => {
            console.log(
              "Following 10 Tweets aquared from the Hashtag - " +
                currentHashtag.term
            );
            const currentTweet = tweets.data[0];
            client.v2
              .retweet("1588443148383965184", currentTweet.id)
              .then((resp) => {
                console.log(resp);
                if (res && res.send) {
                  res.send(resp);
                }
                addHashtagToDb(currentHashtag);
                incrementTweetTypeIndex();
              })
              .catch((err) => {
                console.log(err);
              });
          });
        } else {
          console.log("Dropping PreviousWellnessHashtags Collection");
          PreviousWellnessHashtag.removeAllPreviousHashtags().then(() => {
            tweetSmart(res);
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const tweetFromUserProfiles = (res = null) => {
  WellnessProfile.fetchAllUsers()
    .then((users) => {
      PreviousWellnessProfile.fetchAllPreviousProfiles().then(
        (prevWellnessProfiles) => {
          const filteredUseres = users.filter((usr) => {
            let hasUser = false;
            prevWellnessProfiles.map((prevProf) => {
              if (prevProf.id === usr.id) {
                hasUser = true;
              }
            });
            return !hasUser;
          });
          if (filteredUseres.length) {
            const currentUser = getRandomItem(filteredUseres);
            retweetLatestFromUser(currentUser, (response = res));
          } else {
            console.log("Dropping PreviousProfiles Collection");
            PreviousWellnessProfile.removeAllPreviousProfiles().then(() => {
              tweetSmart(res);
            });
          }
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
};

const incrementTweetTypeIndex = async () => {
  const currentIndex = await WellnessConfig.getIndex();
  const newIndex =
    currentIndex.currentIndex === 3 ? 0 : currentIndex.currentIndex + 1;
  const NewWellnessConfig = new WellnessConfig(
    null,
    newIndex,
    "63661ad61b4c74995baed943"
  );
  console.log(NewWellnessConfig);
  return NewWellnessConfig.saveIndex();
};

const checkMainProfiles = () => {
  const sadguruProfile = {
    username: "SadhguruJV",
    id: "67611162",
  };
  return getTweetsByUser(sadguruProfile);
};

const getTweetType = async () => {
  const tweetTypePattern = await WellnessConfig.getPattern();
  const currentIndex = await WellnessConfig.getIndex();
  console.log("CONFIGGGGG");
  console.log(tweetTypePattern.tweetTypePattern);
  console.log("Current Index is: " + currentIndex.currentIndex);
  return tweetTypePattern.tweetTypePattern[currentIndex.currentIndex];
};

const tweetFromOtherProfiles = (res) => {
  getTweetType().then((tweetType) => {
    console.log("TWEEET TYPE --");
    console.log(tweetType);
    if (tweetType === "user") {
      console.log("TYPE ---> user");
      tweetFromUserProfiles(res);
    } else if (tweetType === "hashtag") {
      console.log("TYPE ---> hashtag");
      tweetFromTerms(res);
    }
  });
};

const tweetSmart = (res = null) => {
  const checkDbConnectionJob = setInterval(() => {
    if (getDb()) {
      clearInterval(checkDbConnectionJob);
      checkMainProfiles().then((mainProf) => {
        console.log(mainProf.data.data);
        currentTweet = new PreviousRetweet(
          mainProf.data.data[0].id,
          mainProf.data.data[0].text,
          mainProf.data.data[0].edit_history_tweet_ids,
          null
        );
        PreviousRetweet.fetchAllPreviousRetweets().then((prevRetweets) => {
          console.log(prevRetweets);
          if (prevRetweets.find((reTweet) => reTweet.id === currentTweet.id)) {
            console.log("Main profile tweet already tweeted");
            tweetFromOtherProfiles(res);
          } else {
            console.log("Tweeting from the Main profile..!");
            client.v2
              .retweet("1588443148383965184", currentTweet.id)
              .then((resp) => {
                console.log("Tweeted successfully!");
                if (prevRetweets.length === 50) {
                  PreviousRetweet.removeAllPreviousRetweets();
                }
                currentTweet.save();
                console.log(resp);
                if (res && res.send) {
                  res.send(resp);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        });
      });
    }
  }, 500);
};

module.exports = tweetSmart;
