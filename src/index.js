const express = require("express");
const lib = require("./lib");

const app = express();
const port = process.env.PORT || 3000;


app.get("/api/v1/races/:raceId", async (req, res) => {
    return res.json(await lib.getRace(req.params.raceId));
});

app.get("/api/v1/athletes", async (req, res) => {
    return res.json(await lib.searchAthletes(req.query));
});

app.get("/api/v1/athletes/:competitorId", async (req, res) => {
    return res.json(await lib.getAthlete(req.params.competitorId));
});


app.listen(port, () => {
    console.log(`FIS parser listening at http://localhost:${port}`);
});
