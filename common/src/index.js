"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Card_1 = __importStar(require("./entities/Card"));
exports.Card = Card_1.default;
exports.cards = Card_1.cards;
exports.cardValues = Card_1.cardValues;
exports.getNextCard = Card_1.getNextCard;
exports.toTrumpValue = Card_1.toTrumpValue;
var Suit_1 = __importStar(require("./entities/Suit"));
exports.Suit = Suit_1.default;
exports.suits = Suit_1.suits;
