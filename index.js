const fs = require("fs")
const util = require("util")
const licenses = require("./licenses")

const axios = require("axios")
const inquirer = require("inquirer")

const appendFileAsync = util.promisify(fs.appendFile)
const writeFileAsync = util.promisify(fs.writeFile)


inquirer.prompt({
    message: "Hello!\nEnter your GitHub username to begin!",
    name: "username"
})
    .then(function ({ username }) {
        const queryURL = `https://api.github.com/users/${username}/repos?per_page=100`;

        axios.get(queryURL).then(function (res) {
            const repoNames = res.data.map(function (repo) {
                return repo.name;
            });

            inquirer.prompt({
                type: "list",
                message: "Which repo would you like to create a README for?",
                choices: repoNames,
                name: "repoChoice"
            }).then(function ({ repoChoice }) {
                const repoUrl = `https://api.github.com/repos/${username}/${repoChoice}`;

                axios.get(repoUrl).then(function (res) {
                    const { name, description } = res.data;
                    const { login, avatar_url } = res.data.owner;
                    const readMe = `#${name}
##${description}
                        
* [Installation](#installation)
* [Usage](#usage)
* [Credits](#credits)
* [License](#license)
* [Contributing](#contributing)
* [Tests](#tests)
* [Questions](#questions)
                        
##Installation
                        
                        
##Usage
                        
                        
##Credits
Made by: ${login}
![Creator](${avatar_url})                       
##License
                        
                        
                        `
                    writeFileAsync("README.md", readMe, function (err) {
                        if (err) {
                            throw err
                        }
                    })
                }).catch(function (err) {
                    if (err) {
                        throw err
                    }
                })
                inquirer.prompt({
                    type: "list",
                    message: "What license would you like to use?",
                    choices: ["MIT", "Apache License 2.0", "GNU GPL v3.0"],
                    name: "licenseChoice"
                })
                    .then(function ({ licenseChoice }) {
                        console.log(licenseChoice);
                        if (licenseChoice === "MIT") {
                            const license = licenses.l.mit
                            const licenseAppend =`${license}
                            
##Contributing

##Tests

##Questions
`
                            appendFileAsync("README.md", licenseAppend).then(function(){
                                console.log("README generated!\n\n Make sure to fill out all the relevant information in each section of the readme and license");
                            });
                            
                        }
                        else if (licenseChoice === "Apache License 2.0") {
                            const license = licenses.l.apache
                            
                            appendFileAsync("README.md", licenseAppend).then(function(){
                                console.log("README generated!\n\n Make sure to fill out all the relevant information in each section of the readme and license");
                            });
                        }
                        else if (licenseChoice === "GNU GPL v3.0") {
                            const license = licenses.l.gnu
                            appendFileAsync("README.md", license).then(function(){
                            console.log("README generated!\n\n Make sure to fill out all the relevant information in each section of the readme and license");
                        })}
                        
                        


                    }).catch(function (err) {
                        if (err) {
                            throw err
                        }
                    })

            }).catch(function (err) {
                if (err) {
                    throw err
                }
            });

        }).catch(function (err) {
            if (err) {
                throw err
            }
        })

    }).catch(function (err) {
        if (err) {
            throw err
        }
    })

