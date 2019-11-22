"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SuitColor;
(function (SuitColor) {
    SuitColor["RED"] = "#e74c3c";
    SuitColor["BLACK"] = "#2c3e50";
})(SuitColor || (SuitColor = {}));
var Suit = /** @class */ (function () {
    function Suit(name, icon, power, suitColor, iconUrl) {
        this.name = name;
        this.icon = icon;
        this.power = power;
        this.suitColor = suitColor;
        this.iconUrl = iconUrl;
    }
    return Suit;
}());
exports.default = Suit;
// Clubs (paus) ♣ > Hearts (copas) ♥ > Spades (espadas) ♠ > Diamonds (ouros) ♦
exports.suits = [
    new Suit("Clubs", "♣", 1, SuitColor.BLACK, "https://upload.wikimedia.org/wikipedia/commons/8/8a/SuitClubs.svg"),
    new Suit("Hearts", "♥", 2, SuitColor.RED, "https://upload.wikimedia.org/wikipedia/commons/e/ec/Suit_Hearts.svg"),
    new Suit("Spades", "♠", 3, SuitColor.BLACK, "https://upload.wikimedia.org/wikipedia/commons/5/5b/SuitSpades.svg"),
    new Suit("Diamond", "♦", 4, SuitColor.RED, "https://upload.wikimedia.org/wikipedia/commons/d/db/SuitDiamonds.svg")
];
