import { Octokit, App } from "octokit";
import dotenv from 'dotenv';


dotenv.config();
const authKey = process.env.GITHUB_AUTH_KEY;
if (!authKey) {
    console.error('GITHUB_AUTH_KEY is not defined!');
    process.exit(1); 
}

const octokit = new Octokit({
    auth: authKey
})

export default octokit;