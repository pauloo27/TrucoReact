import Suit, { suits } from "./Suit";

export class CardValue {
  name: string;
  power: number;
  constructor(name: string, power: number) {
    this.name = name;
    this.power = power;
  }
}

export const cardValues = [
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

export function toTrumpValue(cardValue: CardValue) {
  return new CardValue(cardValue.name, 0);
}

export default class Card {
  value: CardValue;
  suit: Suit;

  constructor(value: CardValue, suit: Suit) {
    this.value = value;
    this.suit = suit;
  }

  toString() {
    return `${this.value.name}${this.suit.icon}`;
  }

  isTrump(): boolean {
    return this.value.power === 0;
  }
}

const cards = new Array<Card>();

suits.forEach(suit => {
  cardValues.forEach(value => {
    cards.push(new Card(value, suit));
  });
});

export { cards };

export function getNextCard(card: Card) {
  const index = cards.indexOf(card) + 1;
  // if its the last one, return the first one
  if (index === cards.length) {
    return cards[0];
  }
  return cards[index];
}
