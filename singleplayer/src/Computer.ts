import Player from "./game/Player";
import Game, { LockHolder } from "./game/Game";
import Bot, { bots } from "./bot/Bots";
import { suits, Card } from "truco-common";

export default class ComputerGameplayer {
  player: Player;
  opponent: Player;
  game: Game;
  bot: Bot;
  constructor(player: Player, game: Game) {
    this.game = game;
    this.player = player;
    this.opponent = this.game.players[0];
    this.addListeners();
    this.bot = bots[Math.floor(Math.random() * (bots.length - 1))];
    console.log(this.bot.name);
  }

  private compareCards(card: Card, strongestCard: Card | undefined): Card {
    if (strongestCard === undefined) return card;

    if (strongestCard === card) return card;

    if (card.value === this.game.hand.round.trump.value) {
      if (strongestCard.value === this.game.hand.round.trump.value) {
        if (card.suit.power < strongestCard.suit.power) {
          return card;
        } else {
          return strongestCard;
        }
      }
      return card;
    }

    if (card.value.power < strongestCard.value.power) strongestCard = card;

    return strongestCard;
  }

  private sortCards(): Array<Card> {
    const cards = this.game.hand.deck.playerCards.get(this.player)!;
    const orderedCards = new Array<Card>();

    while (orderedCards.length !== cards.length) {
      let strongestCard: Card | undefined;
      strongestCard = undefined;
      cards.forEach(card => {
        if (!orderedCards.includes(card))
          strongestCard = this.compareCards(card, strongestCard);
      });
      orderedCards.push(strongestCard!);
    }
    return orderedCards;
  }

  private minimunToWin(
    opponentCard: Card,
    orderedCards: Array<Card>
  ): Card | undefined {
    let currentCard: Card | undefined;

    orderedCards.forEach(card => {
      if (
        currentCard !== undefined &&
        this.compareCards(card, opponentCard) === card
      )
        currentCard = card;
    });
    return currentCard;
  }

  handlePlay = () => {
    if (this.game.hand.round.isPlayerTurn(this.player)) {
      if (this.game.isLocked()) {
        return;
      }

      const lockHolder = new LockHolder("computer handle play");
      this.game.lock(lockHolder);

      const orderedCards = this.sortCards();
      let cardIndex = orderedCards.length - 1;

      if (this.game.hand.rounds.length === 2) {
        if (this.game.hand.rounds[0].winner === null) {
          cardIndex = 0;
        } else if (this.game.hand.rounds[0].winner !== this.player) {
          const opponentCard = this.game.hand.round.playedCards.get(
            this.opponent
          )!;

          const card = this.minimunToWin(opponentCard, orderedCards);

          if (card !== undefined) cardIndex = orderedCards.indexOf(card);
        } else {
          if (Math.random() > 0.15) {
            cardIndex = 0;
          }
        }
      } else if (this.game.hand.rounds.length === 1) {
        const opponentCard = this.game.hand.round.playedCards.get(
          this.opponent
        );

        if (opponentCard === undefined) {
          if (Math.random() > 0.2) {
            cardIndex = Math.floor(Math.random() * 2);
          }
        } else {
          if (Math.random() > 0.2) {
            const card = this.minimunToWin(opponentCard, orderedCards);
            if (card !== undefined) cardIndex = orderedCards.indexOf(card);
          }
        }
      }

      setTimeout(() => {
        this.game.unlock(lockHolder);
        try {
          this.game.play(this.player, orderedCards[cardIndex]);
        } catch (e) {
          console.log(e);
          this.handlePlay();
          return;
        }
      }, 1000);
    }
  };

  private getCardScore(card: Card): number {
    if (card.value === this.game.hand.round.trump.value) {
      if (card.suit === suits[0]) {
        return 0.5;
      } else {
        return 0.3;
      }
    } else if (card.value.power >= 1 && card.value.power <= 3) {
      return 0.1 + (6 - card.value.power * 2) / 100;
    }
    return 0.0;
  }

  handleTruco = (player: Player) => {
    if (player === this.player) return;

    const lockHolder = new LockHolder("computer handle truco");
    this.game.lock(lockHolder);

    let scenarioBias = 0.0;

    if (
      this.game.hand.rounds.length === 2 &&
      this.game.hand.rounds[0].winner === this.player
    ) {
      scenarioBias += 0.25;
    } else if (this.game.hand.rounds.length === 3) {
      if (this.game.hand.rounds[0].winner === this.player) {
        scenarioBias += 0.25;
      }
    }

    const cards = this.game.hand.deck.playerCards.get(this.player)!;

    cards.forEach(card => {
      scenarioBias += this.getCardScore(card);
    });

    const playedCard = this.game.hand.round.playedCards.get(this.player);
    const opponentCard = this.game.hand.round.playedCards.get(this.opponent);

    if (playedCard !== undefined) {
      scenarioBias += this.getCardScore(playedCard!);
    }

    if (opponentCard !== undefined) {
      scenarioBias -= this.getCardScore(opponentCard);
    }

    scenarioBias += (this.game.getPlayerScore(this.player) / 100) * 1.5;
    scenarioBias -= (this.game.getPlayerScore(this.opponent) / 100) * 1.5;

    this.game.hands
      .filter(
        hand => hand.lastTrucker === this.opponent && hand !== this.game.hand
      )
      .forEach(hand => {
        if (hand.points === 1) {
          scenarioBias += 0.05;
        } else if (hand.winner === player) {
          scenarioBias += 0.1;
        } else if (hand.winner === this.opponent) {
          scenarioBias -= 0.15;
        }
      });

    if (this.game.getPlayerScore(this.opponent) == 11) {
      scenarioBias = 2.0;
    }

    setTimeout(() => {
      this.game.unlock(lockHolder);
      try {
        const probability = this.bot.personality.getTrucoResponseProbability(
          scenarioBias
        );
        if (Math.random() < probability) {
          this.game.acceptTruco(this.player);
        } else {
          this.game.declineTruco(this.player);
        }
      } catch (e) {
        console.log(e);
        return;
      }
    }, 1000);
  };

  private addListeners() {
    this.game.addListener("played", this.handlePlay);
    this.game.addListener("newRound", this.handlePlay);
    this.game.addListener("newHand", this.handlePlay);

    this.game.addListener("truco", this.handleTruco);
  }
}
