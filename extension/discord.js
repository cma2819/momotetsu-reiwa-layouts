"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var axios_1 = tslib_1.__importDefault(require("axios"));
var express_1 = tslib_1.__importDefault(require("express"));
exports.discord = function (nodecg) {
    var logger = new nodecg.Logger(nodecg.bundleName + ":discord");
    var getAuthUri = function (clientId, redirectUri) {
        return 'https://discord.com/api/oauth2/authorize'
            + ("?response_type=code&client_id=" + clientId + "&scope=identify&redirect_uri=" + redirectUri + "&prompt=consent");
    };
    var callbackAuth = function (clientId, clientSecret, code, redirectUri) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var data, query, response, accessToken, meResponse, e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = {
                        'client_id': clientId,
                        'client_secret': clientSecret,
                        'grant_type': 'authorization_code',
                        'code': code,
                        'redirect_uri': redirectUri,
                        'scope': 'identify',
                    };
                    query = new URLSearchParams(data);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, axios_1.default.post('https://discord.com/api/oauth2/token', query.toString(), {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            }
                        })];
                case 2:
                    response = _a.sent();
                    accessToken = response.data.access_token;
                    return [4 /*yield*/, axios_1.default.get('https://discord.com/api/users/@me', {
                            headers: {
                                'Authorization': "Bearer " + accessToken,
                            }
                        })];
                case 3:
                    meResponse = _a.sent();
                    return [2 /*return*/, meResponse.data];
                case 4:
                    e_1 = _a.sent();
                    logger.warn('Failed to get discord authorization.');
                    if (e_1.response) {
                        logger.warn('Error response:' + JSON.stringify(e_1.response.data));
                    }
                    else {
                        logger.warn('Error:' + e_1.message);
                    }
                    throw e_1;
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var app = express_1.default();
    app.get('/discord-callback', function (req, res, _) {
        var _a;
        if (!nodecg.bundleConfig.discord.useDiscordOAuth
            || !nodecg.bundleConfig.discord.clientSecret
            || !nodecg.bundleConfig.discord.clientId
            || !nodecg.bundleConfig.discord.redirectUri) {
            res.send('Discord config is undefined.');
            return;
        }
        if (!((_a = req.query.code) === null || _a === void 0 ? void 0 : _a.toString())) {
            res.send('Authorization Code is not found.');
            return;
        }
        callbackAuth(nodecg.bundleConfig.discord.clientId, nodecg.bundleConfig.discord.clientSecret, req.query.code.toString(), nodecg.bundleConfig.discord.redirectUri).then(function (discord) {
            logger.info("Add discord player:" + JSON.stringify(discord));
            nodecg.sendMessage('player:add-discord-player', discord);
            res.send('Success to auth your discord user. Feel free to close this window!');
        }).catch(function () {
            res.send('Failed to get your discord user. Close this window and try again.');
        });
    });
    nodecg.mount("/" + nodecg.bundleName, app);
    nodecg.listenFor('discord:auth-uri', function (_, cb) {
        if (!nodecg.bundleConfig.discord.useDiscordOAuth
            || !nodecg.bundleConfig.discord.clientId
            || !nodecg.bundleConfig.discord.redirectUri) {
            logger.warn('Discord config is undefined.');
            if (cb && !cb.handled) {
                cb('Discord認証の設定が無効です.');
            }
            return;
        }
        var uri = getAuthUri(nodecg.bundleConfig.discord.clientId, nodecg.bundleConfig.discord.redirectUri);
        if (cb && !cb.handled) {
            cb(null, uri);
        }
    });
    logger.info('Initialize discord extensions.');
};
