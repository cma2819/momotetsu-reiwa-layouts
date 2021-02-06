"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var validation_1 = require("./validation");
exports.game = function (nodecg) {
    var logger = new nodecg.Logger(nodecg.bundleName + ":game");
    var defaultGame = {
        rule: {
            players: 0,
            years: 0,
            isDuel: false,
        },
        status: {
            year: 0,
            month: 0,
            settleYear: 0,
            goal: {
                name: '東京',
                isCardShop: false,
            },
            poor: null,
        }
    };
    var gameRep = nodecg.Replicant('game', { defaultValue: defaultGame });
    var playersRep = nodecg.Replicant('players', {
        defaultValue: [
            {
                id: uuid_1.v4(),
                name: 'example player',
                thumbnail: null,
                status: {
                    rank: 1,
                    kiloYens: 10000
                },
                discord: null
            },
        ]
    });
    var editRule = function (rule) {
        if (!gameRep.value || !playersRep.value) {
            return false;
        }
        if (!validation_1.validationRule(rule)) {
            logger.warn("Failed to validation for game.rule: " + JSON.stringify(rule) + ".");
            return false;
        }
        gameRep.value.rule = Object.assign({}, rule, {
            players: Math.floor(rule.players),
            years: Math.floor(rule.years),
        });
        playersRep.value = playersRep.value.filter(function (_, index) {
            return index < rule.players;
        });
        logger.info("game rule changed to " + JSON.stringify(rule));
        return true;
    };
    var resetStatus = function () {
        if (!gameRep.value) {
            return;
        }
        gameRep.value.status = {
            year: 0,
            month: 0,
            settleYear: 0,
            goal: {
                name: '東京',
                isCardShop: false,
            },
            poor: null,
        };
        logger.info('game status is reset.');
    };
    var nextMonth = function () {
        if (!gameRep.value) {
            return false;
        }
        var newMonth = (gameRep.value.status.month + 1) % 12;
        var newYear = (gameRep.value.status.month == 11)
            ? gameRep.value.status.year + 1 : gameRep.value.status.year;
        // newYear == rule.years means complete the game.
        if (!(newYear < gameRep.value.rule.years)) {
            return false;
        }
        gameRep.value.status = Object.assign({}, gameRep.value.status, { year: newYear, month: newMonth });
        return true;
    };
    var prevMonth = function () {
        if (!gameRep.value) {
            return false;
        }
        var newMonth = ((gameRep.value.status.month - 1) + 12) % 12;
        var newYear = (gameRep.value.status.month == 0)
            ? gameRep.value.status.year - 1 : gameRep.value.status.year;
        if (newYear < 0) {
            return false;
        }
        gameRep.value.status = Object.assign({}, gameRep.value.status, { year: newYear, month: newMonth });
        return true;
    };
    var changePoor = function (type) {
        if (!gameRep.value) {
            return false;
        }
        if (gameRep.value.status.poor === null) {
            gameRep.value.status.poor = {
                with: 0,
                type: type
            };
            return true;
        }
        gameRep.value.status.poor.type = type;
        return true;
    };
    var leavePoor = function () {
        if (!gameRep.value) {
            return false;
        }
        gameRep.value.status.poor = null;
        return true;
    };
    var poorTo = function (player) {
        if (!gameRep.value || !gameRep.value.status.poor) {
            return false;
        }
        if (!(gameRep.value.rule.players > player)) {
            return false;
        }
        gameRep.value.status.poor.with = player;
        logger.info("Poor go with Player:" + player);
        return true;
    };
    var settlement = function (year) {
        if (!gameRep.value) {
            return false;
        }
        if (year > gameRep.value.rule.years) {
            return false;
        }
        gameRep.value.status.settleYear = year;
        return true;
    };
    var setGoal = function (goal) {
        if (!gameRep.value) {
            return false;
        }
        gameRep.value.status.goal = goal;
        return true;
    };
    nodecg.listenFor('game:reset', function (_, cb) {
        resetStatus();
        if (cb && !cb.handled) {
            cb(null);
        }
    });
    nodecg.listenFor('game:next-month', function (_, cb) {
        nextMonth();
        if (cb && !cb.handled) {
            cb(null);
        }
    });
    nodecg.listenFor('game:prev-month', function (_, cb) {
        prevMonth();
        if (cb && !cb.handled) {
            cb(null);
        }
    });
    nodecg.listenFor('game:change-poor', function (data, cb) {
        changePoor(data);
        if (cb && !cb.handled) {
            cb(null);
        }
    });
    nodecg.listenFor('game:leave-poor', function (_, cb) {
        leavePoor();
        if (cb && !cb.handled) {
            cb(null);
        }
    });
    nodecg.listenFor('game:poor-to', function (player, cb) {
        poorTo(player);
        if (cb && !cb.handled) {
            cb(null);
        }
    });
    nodecg.listenFor('game:settlement', function (data, cb) {
        settlement(data);
        if (cb && !cb.handled) {
            cb(null);
        }
    });
    nodecg.listenFor('game:edit-rule', function (data, cb) {
        var status = editRule(data);
        if (cb && !cb.handled) {
            if (!status) {
                cb('ゲームルールの更新に失敗しました.');
            }
            cb(null);
        }
    });
    nodecg.listenFor('game:set-goal', function (data, cb) {
        setGoal(data);
        if (cb && !cb.handled) {
            cb(null);
        }
    });
    logger.info('Initialize game extensions.');
};
