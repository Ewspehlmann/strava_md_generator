const strava = require("./strava.js");
const fs = require('fs').promises;
const activities = require("./data/activities.json") //reads the file

const getRecentActivityMD = async ( activity ) => {

    const milesInMeters = 0.000621371;
    const metersInFeet = 3.28084;
    const name = activity.name;
    const type = activity.type;
    const distance = Math.round(activity.distance * milesInMeters);
    const hours = (activity.moving_time / 60) / 60;
    const mins = (activity.moving_time / 60) % 60;
    const timeString = (hours.toFixed(0)) +'h-'+ mins.toFixed(0) +'m';
    const elevation = activity.total_elevation_gain * metersInFeet;
    const avgMilePerHour = distance / hours;
    const seconds = (((((activity.moving_time) / distance)/60) / 10) * 60).toFixed(0);
    const avgMins =  Math.floor(((activity.moving_time) / distance )/ 60);
    const avgMinPerMile = avgMins + ":" + seconds;
    let today = new Date(activity.start_date);
    const filename = today.getFullYear() + "-" + ("0"+today.getMonth()).slice(-2) + "-" + today.getDate() +"_strava.md";
    const md = `---\nactivity:\n\tname: ${name}\n\ttype: ${type}\n\tdistance: ${distance.toFixed(2)}\n\ttime: ${timeString}\n\televation: ${elevation.toFixed(2)}\n\tavgSpeed: ${avgMilePerHour.toFixed(2)}\n\tavgMinPerMile: ${avgMinPerMile}\n---`;
    await fs.writeFile(`./stravafiles/${filename}`,md)
        .then(d => console.log("saved" + filename))
        .catch(error => console.log(error));
    
}

const makeFiles = async () => {

    activities.forEach( activity => {
          getRecentActivityMD(activity)
    });
}
makeFiles()
module.exports.makeFiles = makeFiles
