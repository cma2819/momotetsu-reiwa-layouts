"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var uuid_1 = require("uuid");
var clone_1 = tslib_1.__importDefault(require("clone"));
exports.players = function (nodecg) {
    var logger = new nodecg.Logger(nodecg.bundleName + ":players");
    var playersRep = nodecg.Replicant('players');
    var gameRep = nodecg.Replicant('game');
    var initialMillions = function () {
        if (!gameRep.value) {
            return 0;
        }
        return gameRep.value.rule.isDuel ? 100 : 10;
    };
    var addPlayer = function (name) {
        if (!playersRep.value || !gameRep.value) {
            return false;
        }
        if (!name) {
            return false;
        }
        if (playersRep.value.length === gameRep.value.rule.players) {
            return false;
        }
        var newPlayer = {
            id: uuid_1.v4(),
            name: name,
            thumbnail: null,
            discord: null,
            status: {
                rank: playersRep.value.length + 1,
                millions: initialMillions()
            },
        };
        playersRep.value.push(newPlayer);
        return true;
    };
    var editPlayer = function (edit) {
        if (!playersRep.value) {
            return false;
        }
        if (!edit.name) {
            return false;
        }
        var index = playersRep.value.findIndex(function (player) { return player.id === edit.id; });
        if (index < 0) {
            return false;
        }
        playersRep.value[index] = Object.assign({}, playersRep.value[index], {
            name: edit.name
        });
        return true;
    };
    var addDiscordPlayer = function (discord) {
        if (!playersRep.value || !gameRep.value) {
            return false;
        }
        if (playersRep.value.length === gameRep.value.rule.players) {
            return false;
        }
        var newPlayer = {
            id: uuid_1.v4(),
            name: discord.username,
            thumbnail: "https://cdn.discordapp.com/avatars/" + discord.id + "/" + discord.avatar + ".png",
            discord: discord,
            status: {
                rank: playersRep.value.length + 1,
                millions: initialMillions()
            },
        };
        playersRep.value.push(newPlayer);
        return true;
    };
    var removePlayer = function (id) {
        if (!playersRep.value) {
            return false;
        }
        playersRep.value = playersRep.value.filter(function (player) { return player.id !== id; });
        return true;
    };
    var clearPlayer = function () {
        if (!playersRep.value) {
            return false;
        }
        playersRep.value = [];
        return true;
    };
    var settleMillions = function (playerMillions) {
        if (!playersRep.value || playerMillions.length !== playersRep.value.length) {
            return false;
        }
        var floored = playerMillions.map(function (millions) { return Math.floor(millions); });
        var sorted = clone_1.default(floored).sort(function (l, r) { return r - l; });
        var ranks = floored.map(function (v) {
            return sorted.indexOf(v) + 1;
        });
        playersRep.value = playersRep.value.map(function (player, index) {
            return Object.assign({}, player, {
                status: {
                    rank: ranks[index],
                    millions: floored[index],
                }
            });
        });
        return true;
    };
    var resetSettlements = function () {
        if (!playersRep.value) {
            return false;
        }
        playersRep.value = playersRep.value.map(function (player) {
            return Object.assign({}, player, {
                status: {
                    rank: 1,
                    millions: initialMillions(),
                }
            });
        });
        return true;
    };
    var reorderPlayers = function (idOrders) {
        if (!playersRep.value || idOrders.length !== playersRep.value.length) {
            return false;
        }
        var players = clone_1.default(playersRep.value);
        players.sort(function (l, r) {
            return idOrders.indexOf(l.id) - idOrders.indexOf(r.id);
        });
        playersRep.value = players;
        logger.info("reorder players to: " + JSON.stringify(idOrders));
        return true;
    };
    nodecg.listenFor('player:add-player', function (data, cb) {
        var result = addPlayer(data);
        if (cb && !cb.handled) {
            if (!result) {
                cb('プレイヤーの追加に失敗しました.');
            }
            else {
                cb(null);
            }
        }
    });
    nodecg.listenFor('player:edit-player', function (data, cb) {
        var result = editPlayer(data);
        if (cb && !cb.handled) {
            if (!result) {
                cb('プレイヤー情報の編集に失敗しました.');
            }
            else {
                cb(null);
            }
        }
    });
    nodecg.listenFor('player:remove-player', function (data, cb) {
        var status = removePlayer(data);
        if (cb && !cb.handled) {
            if (!status) {
                cb('プレイヤーの削除に失敗しました.');
            }
            else {
                cb(null);
            }
        }
    });
    nodecg.listenFor('player:clear-player', function (_, cb) {
        clearPlayer();
        if (cb && !cb.handled) {
            cb(null);
        }
    });
    nodecg.listenFor('player:settle-millions', function (data, cb) {
        var status = settleMillions(data);
        if (cb && !cb.handled) {
            if (!status) {
                cb('決算総資産の設定に失敗しました.');
            }
            cb(null);
        }
    });
    nodecg.listenFor('player:reorder-players', function (data, cb) {
        reorderPlayers(data);
        if (cb && !cb.handled) {
            cb(null);
        }
    });
    nodecg.listenFor('game:reset', function (_, cb) {
        resetSettlements();
        if (cb && !cb.handled) {
            cb(null);
        }
    });
    nodecg.listenFor('player:add-discord-player', function (data, cb) {
        addDiscordPlayer(data);
        if (cb && !cb.handled) {
            cb(null);
        }
    });
    logger.info('Initialize players extensions.');
};
