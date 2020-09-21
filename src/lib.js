const DOMParser = require("dom-parser");
const fetch = require("node-fetch");
const querystring = require("querystring");

async function getAthlete(competitorId) {
    competitorId = parseInt(competitorId)
    var document = await getDocument(
        `https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=cc&competitorid=${competitorId}`
    );
    return parseAthlete(document, competitorId);
}

async function searchAthletes(params) {
    url = `https://data.fis-ski.com/fis_athletes/ajax/athletessearchfunctions/load_athleteslist.html?${querystring.stringify(
        params
    )}&search=true`;
    var document = await getDocument(url);
    return parseAthletes(document);
}

async function getRace(raceId) {
    var document = await getDocument(
        `https://www.fis-ski.com/DB/general/results.html?sectorcode=CC&raceid=${raceId}`
    );
    return { race: parseRace(document) };
}

function parseAthlete(document, competitorId) {
    obj = {
        id: competitorId,
        name: document.getElementsByClassName("athlete-profile__name")[0].textContent.trim().replace(/ +/g, " "),
        photo: `https://data.fis-ski.com/general/load-competitor-picture/${competitorId}.html`,
        country: document.getElementsByClassName("country__name-short")[0]
            .textContent,
        team: document.getElementsByClassName("athlete-profile__team")[0]
            .textContent
    };
    profile = document.getElementsByClassName("profile-info")[0];
    for (el of profile.getElementsByTagName("li")) {
        key = el.getAttribute("id");
        value = el.childNodes[3];
        if (key && value) {
            key = key.trim().toLowerCase().replace(" ", "_");
            value = value.textContent.trim();
            if (value === "– –") value = null;
            obj[key] = value;
        }
    }
    return obj;
}

function getDocument(link) {
    return fetch(link)
        .then(function (response) {
            // When the page is loaded convert it to text
            return response.text();
        })
        .then(function (html) {
            // Initialize the DOM parser
            var parser = new DOMParser();

            // Parse the text
            var doc = parser.parseFromString(html, "text/html");
            return doc;
        })
        .catch(function (err) {
            console.log("Failed to fetch page: ", err);
        });
}

function parseRace(document) {
    results = [];
    keys = [
        "rank",
        "bib",
        "fis_code",
        "athlete",
        "year",
        "nation",
        "time",
        "time_diff",
        "fis_points",
    ];
    eventInfo = document.getElementsByClassName("event-header")[0];
    let [place, cup] = eventInfo
        .getElementsByClassName("event-header__name")[0]
        .textContent.trim()
        .split("\n ");
    title = eventInfo.getElementsByClassName("event-header__kind")[0]
        .textContent;
    date = eventInfo.getElementsByClassName("date__full")[0].textContent;
    obj = {
        title: title,
        place: place,
        cup: cup,
        date: date,
    };
    events = document
        .getElementById("events-info-results")
        .getElementsByClassName("table-row");
    for (item of events) {
        values = item.childNodes[1].textContent
            .trim()
            .split("\n ")
            .filter((n) => n.trim());
        results.push(
            Object.assign(
                {},
                ...keys.map((n, index) => ({ [n]: values[index] }))
            )
        );
    }
    obj["results"] = results;
    return obj;
}

function parseAthletes(document) {
    keys = [
        "status",
        "fis_code",
        "athlete",
        "nation",
        "age",
        "birthdate",
        "gender",
        "disc.",
        "club",
        "ski/snowboard",
    ];
    results = [];
    athletes = document.getElementsByClassName("table-row");
    for (item of athletes) {
        href = item.getAttribute("href").replace("amp;", "");
        values = item.childNodes[1].textContent
            .trim()
            .split("\n ")
            .filter((n) => n.trim());
        if (values.length == 9) {
            values.unshift("Not active");
        }
        info = Object.assign(
            {},
            ...keys.map((n, index) => ({ [n]: values[index] }))
        );
        info["fis_link"] = href;
        const myURL = new URL(href);
        info["id"] = myURL.searchParams.get("competitorid");
        info["link"] = `/athletes/${info["id"]}`;
        results.push(info);
    }
    return results;
}

module.exports = {
    getAthlete,
    getRace,
    searchAthletes,
};
