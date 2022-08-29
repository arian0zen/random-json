const fetch = require("node-fetch");
const express = require("express");
const app = express();

app.use(express.static("public"));



const LEETCODE_API_ENDPOINT = "https://leetcode.com/graphql";
const DAILY_CODING_CHALLENGE_QUERY = `
query questionOfToday {
	activeDailyCodingChallengeQuestion {
		date
		userStatus
		link
		question {
			acRate
			difficulty
			freqBar
			frontendQuestionId: questionFrontendId
			isFavor
			paidOnly: isPaidOnly
			status
			title
			titleSlug
			hasVideoSolution
			hasSolution
			topicTags {
				name
				id
				slug
			}
		}
	}
}`;


/*Sync LeetCode daily coding challenge to Todoist*/


const syncLeetCodeCodingChallenge = async () => {
  const question = await fetchDailyCodingChallenge();
//   console.log(question);
  const questionInfo = question.data.activeDailyCodingChallengeQuestion;
//   console.log(questionInfo);

  return questionInfo;

};

const fetchDailyCodingChallenge = async () => {
  console.log(`Fetching daily coding challenge from LeetCode API.`);

  const init = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: DAILY_CODING_CHALLENGE_QUERY }),
  };

  const response = await fetch(LEETCODE_API_ENDPOINT, init);
  
  return response.json();
};








app.get("/", async (req, res) => {
    const ok = await syncLeetCodeCodingChallenge();
    console.log(ok);
    res.send(ok);
  });



app.listen(80, () => {
    console.log("listening on port 80");
  });