import { Card, cards as orderedCards } from "truco-common";
import Player from "./Player";

export default class Deck {
  cards: Array<Card>;
  turned: Card;
  playerCards = new Map<Player, Array<Card>>();

  constructor(players: Array<Player>) {
    this.cards = this.getRandomCards();

    this.turned = this.cards[0];

    let index = 1;
    players.forEach(player => {
      this.playerCards.set(player, this.cards.slice(index, index + 3));
      index += 3;
    });
  }

  private getRandomInt(minInclusive: number, maxInclusive: number) {
    return Math.floor(Math.random() * maxInclusive) + minInclusive;
  }

  private getRandomCards(): Array<Card> {
    let cards = new Array<Card>();

    while (cards.length !== orderedCards.length) {
      let index = this.getRandomInt(0, orderedCards.length - 1);

      let card: Card;

      do {
        card = orderedCards[index];

        if (index === orderedCards.length - 1) {
          index = 0;
        } else {
          index++;
        }
      } while (cards.includes(card));

      cards.push(card);
    }

    return cards;
  }
}
