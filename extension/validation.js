"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationRule = function (rule) {
    if (!(rule.players === 3 || rule.players === 4)) {
        return false;
    }
    if (!(rule.years > 0 && rule.years < 101)) {
        return false;
    }
    return true;
};
