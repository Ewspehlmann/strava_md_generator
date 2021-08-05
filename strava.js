const {clientId, secret, authToken} = require('../strava_secrets.js');
const fetch = require('node-fetch');
const fs = require('fs').promises;

const getToken = async () => {

    const token = authToken
    const url = "https://www.strava.com/oauth/token"
    const req = {
    method: "POST",
    headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(
        { 
        'client_id':`${clientId}`,
        'client_secret':`${secret}`,
        'code':`${token}`,
        grant_type:'authorization_code'
        })
    }

    await fetch(url, req)
    .then(response => response.json())
    .then( data => fs.writeFile("./data/auth.json", JSON.stringify(data))
                        .then(s => console.log("success"))
                        .catch(e => console.log(e))
                        )
    .catch( e => console.log(e))
    
}
/*
* hits athlete activites end point and returns most recent activity 
* saves json file
*/
const  getActivities = async () => {

    let token = await fs.readFile("./data/auth.json")
                        .then(data => JSON.parse(data))
                        .then(authData => authData.access_token)
                        .catch(e => console.log(e))
    let req = { 
        method: "GET",
        headers: {
            Authorization: 'Bearer '+`${token}`
        }}

    await fetch("https://www.strava.com/api/v3/athlete/activities", req)
    .then(response => response.json())
    .then( data => {
        fs.writeFile("./data/activities.json", JSON.stringify(data))
        .then(complete => console.log("success"))
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
}
getActivities()

module.exports.getActivites = getActivities;