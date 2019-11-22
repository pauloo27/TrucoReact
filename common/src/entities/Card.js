"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Suit_1 = require("./Suit");
var CardValue = /** @class */ (function () {
    function CardValue(name, power) {
        this.name = name;
        this.power = power;
    }
    return CardValue;
}());
exports.CardValue = CardValue;
exports.cardValues = [
    new CardValue("A", 3),
    new CardValue("2", 2),
    new CardValue("3", 1),
    new CardValue("4", 10),
    new CardValue("5", 9),
    new CardValue("6", 8),
    new CardValue("7", 7),
    new CardValue("Q", 6),
    new CardValue("J", 5),
    new CardValue("K", 4)
];
function toTrumpValue(cardValue) {
    return new CardValue(cardValue.name, 0);
}
exports.toTrumpValue = toTrumpValue;
var Card = /** @class */ (function () {
    function Card(value, suit) {
        this.value = value;
        this.suit = suit;
    }
    Card.prototype.toString = function () {
        return "" + this.value.name + this.suit.icon;
    };
    Card.prototype.isTrump = function () {
        return this.value.power === 0;
    };
    return Card;
}());
exports.default = Card;
var cards = new Array();
exports.cards = cards;
Suit_1.suits.forEach(function (suit) {
    exports.cardValues.forEach(function (value) {
        cards.push(new Card(value, suit));
    });
});
function getNextCard(card) {
    var index = cards.indexOf(card) + 1;
    // if its the last one, return the first one
    if (index === cards.length) {
        return cards[0];
    }
    return cards[index];
}
exports.getNextCard = getNextCard;
