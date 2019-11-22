import Hand from "./Hand";
import Player from "./Player";
import { Card } from "truco-common";
import Logger from "../utils/Logger";

export default class Game {
  hands = new Array<Hand>();
  players: Array<Player>;
  firstPlayerIndex = 0;

  constructor(players: Array<Player>) {
    this.players = players;
  }

  getPlayerScore(player: Player): number {
    return this.hands
      .filter(hand => hand.winner === player)
      .map(hand => hand.points)
      .reduce((sum, element) => (sum += element), 0);
  }

  startNewHand() {
    this.hands.push(new Hand(this.players, this.firstPlayerIndex));
  }

  truco(player: Player) {
    this.hand.truco(player);
  }

  acceptTruco(player: Player) {
    this.hand.acceptTruco(player);
  }

  declineTruco(player: Player) {
    this.hand.declineTruco(player);
  }

  startGame() {
    this.startNewHand();
  }

  get hand(): Hand {
    return this.hands[this.hands.length - 1];
  }

  play(player: Player, card: Card) {
    this.hand.play(player, card);

    if (this.hand.winner !== undefined) {
      if (this.hand.winner === null) {
        Logger.game("Hand draw");
      } else {
        Logger.game(`${this.hand.winner.name} won hand`);
      }

      if (this.firstPlayerIndex === this.players.length - 1) {
        this.firstPlayerIndex = 0;
      } else {
        this.firstPlayerIndex++;
      }
      if(this.hand.winner) {
        if(this.getPlayerScore(this.hand.winner) >= 12)  {
          Logger.game(`${this.hand.winner.name} won the game`)
          process.exit(0)
        }
      }
      this.startNewHand();
    }
  }
}
