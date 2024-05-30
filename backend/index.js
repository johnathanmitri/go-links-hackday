import express from 'express';
import octokit from './octokit-config.js';

const app = express()  

// this function was mostly provided by GitHub's API documentation. They know the best way to use the features of the API, so why not use what they give us.
async function getPaginatedData(url) {
    const nextPattern = /(?<=<)([\S]*)(?=>; rel="Next")/i;  
    let pagesRemaining = true;
    let data = [];
  
    while (pagesRemaining) {
      const response = await octokit.request(`GET ${url}`, {
        per_page: 100,
        headers: {
          "X-GitHub-Api-Version":
            "2022-11-28",
        },
      });
      
      const parsedData = parseData(response.data)
      data = [...data, ...parsedData];
  
      const linkHeader = response.headers.link;
  
      pagesRemaining = linkHeader && linkHeader.includes(`rel=\"next\"`);
  
      if (pagesRemaining) {
        url = linkHeader.match(nextPattern)[0];
      }
    }
  
    return data;
}

function parseData(data) {
    if (!data)
        return []
    else
        return data;
}
  
function getUserInfo(username) {
    return octokit.request(`GET https://api.github.com/users/${username}`, {
        headers: {
          "X-GitHub-Api-Version":
            "2022-11-28",
        },
    });
}

app.get('/user-statistics/:username', async (req, res) => {
    const username = req.params.username;

    console.log("Request for", username);

    const userInfo = await getUserInfo(username);  // make a separate request, in case we have a user with 0 repos, in which case there won't be an owner attribute to look at.

    const repos = await getPaginatedData(`/users/${username}/repos`);

    console.log(repos)

    const languagePromises = repos.map(async repo => {
        const languagesInfo = await octokit.request(`GET ${repo.languages_url}`, {
            headers: {
              "X-GitHub-Api-Version":
                "2022-11-28",
            },
        });
        return languagesInfo.data;
    });

    // Wait for all promises to resolve
    const allRepoLanguages = await Promise.all(languagePromises);


    const languageTotals = {};
    let totalBytesOfCode = 0;
    for (let repoLanguages of allRepoLanguages) {
        for (const [language, bytes] of Object.entries(repoLanguages)) {
            totalBytesOfCode += bytes;
            if (languageTotals[language])
                languageTotals[language] += bytes;
            else
                languageTotals[language] = bytes;
        }
    }
    const sortedLanguageArray = Object.entries(languageTotals)
    .map(([language, bytes]) => [language, bytes])
    .sort((a, b) => b[1] - a[1]);

    

    let totalForkCount = 0;
    let totalStarsCount = 0;
    let totalSizeKB = 0;
    for (const repo of repos) {
        totalForkCount += repo.forks_count;
        totalStarsCount += repo.stargazers_count;
        totalSizeKB += repo.size;
    }

    let num_repos = repos.length;
    let response = {
        username: username,
        avatar_url: userInfo.data.avatar_url,
        total_repositories: num_repos,
        total_forks: totalForkCount, 
        total_stars: totalStarsCount,
        average_repo_size_kb: Math.round(totalSizeKB / num_repos),
        language_bytes: sortedLanguageArray,
        total_bytes_of_code: totalBytesOfCode
    };
    res.send(response);
});

app.listen(8080)