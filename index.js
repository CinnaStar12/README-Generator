const fs = require("fs")
const util = require("util")

const axios = require("axios")
const inquirer = require("inquirer")

const readFileAsync = util.promisify(fs.readFile)
const writeFileAsync = util.promisify(fs.writeFile)


inquirer.prompt({
    message: "Hello!\nEnter your GitHub username to begin!",
    name: "username"
})
.then(function({ username }){
    const queryURL = `https://api.github.com/users/${username}/repos?per_page=100`;

    axios.get(queryURL).then(function(res) {
        const repoNames = res.data.map(function(repo) {
            return repo.name;
        });
        const userProfileUrl = res.data[0].owner.avatar_url
        const repos = [];
        
        inquirer.prompt({
            type: "list",
            message: "Which repo would you like to create a README for?",
            choices: repoNames,
            name: "repoChoice"
        }).then(function({ repoChoice }){
            const repoUrl = `https://api.github.com/repos/${username}/${repoChoice}`;
            axios.get(repoUrl).then(function(res) {
                console.log(res.data)
            })
        })
        
    })

})