const lib = require("../src/lib.js");

it("it should return athlete", async () => {
    var expected = {
        "id": 12150,
        "name": "Bjoern DAEHLIE",
        "photo": "https://data.fis-ski.com/general/load-competitor-picture/12150.html",
        "country": "NOR",
        "team": "Nannestad IL",
        "fis_code": "1006181",
        "birthdate": "1967",
        // "age": "53",
        "status": "Not active",
        "gender": "Male",
        "marital_status": "Single",
        "children": null,
        "occupation": "Cross-country skier",
        "nickname": null,
        "residence": "Nannestad",
        "languages": "Norwegian, English, German",
        "hobbies": "Hunting, Dog, Fishing, TV show together with",
        "skis": null,
        "boots": null,
        "poles": null
    }
    var athlete = await lib.getAthlete(12150)
    expect(athlete).toEqual(expect.objectContaining(expected));
});
