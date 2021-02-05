"use strict";
var discord_1 = require("./discord");
var game_1 = require("./game");
var players_1 = require("./players");
module.exports = function (nodecg) {
    game_1.game(nodecg);
    players_1.players(nodecg);
    discord_1.discord(nodecg);
};
