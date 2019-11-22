enum SuitColor {
  RED = "#e74c3c",
  BLACK = "#2c3e50"
}

export default class Suit {
  name: string;
  icon: string;
  iconUrl: string;
  suitColor: SuitColor;
  power: number;

  constructor(
    name: string,
    icon: string,
    power: number,
    suitColor: SuitColor,
    iconUrl: string
  ) {
    this.name = name;
    this.icon = icon;
    this.power = power;
    this.suitColor = suitColor;
    this.iconUrl = iconUrl;
  }
}

// Clubs (paus) ♣ > Hearts (copas) ♥ > Spades (espadas) ♠ > Diamonds (ouros) ♦
export const suits = [
  new Suit(
    "Clubs",
    "♣",
    1,
    SuitColor.BLACK,
    "https://upload.wikimedia.org/wikipedia/commons/8/8a/SuitClubs.svg"
  ),
  new Suit(
    "Hearts",
    "♥",
    2,
    SuitColor.RED,
    "https://upload.wikimedia.org/wikipedia/commons/e/ec/Suit_Hearts.svg"
  ),
  new Suit(
    "Spades",
    "♠",
    3,
    SuitColor.BLACK,
    "https://upload.wikimedia.org/wikipedia/commons/5/5b/SuitSpades.svg"
  ),
  new Suit(
    "Diamond",
    "♦",
    4,
    SuitColor.RED,
    "https://upload.wikimedia.org/wikipedia/commons/d/db/SuitDiamonds.svg"
  )
];
