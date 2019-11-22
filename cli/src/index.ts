import Logger from "./utils/Logger";
import Player from "./game/Player";
import Game from "./game/Game";
import { Card } from "truco-common";
import { ReadStream } from "fs";

const player = new Player("player");
const computer = new Player("computer");

const game = new Game([player, computer]);
game.startGame();

function play(player: Player, card: Card) {
  if (!game.hand.round.isPlayerTurn(player)) {
    Logger.error("It's not your turn!");
    return;
  }

  game.play(player, card);

  if (game.hand.round.isPlayerTurn(computer)) {
    play(computer, game.hand.deck.playerCards.get(computer)![0]);
  }
}

Logger.info(`Turned: ${game.hand.deck.turned}`);
Logger.you(`Hand: ${game.hand.deck.playerCards.get(player)}`);

var stdin = process.openStdin();
stdin.addListener("data", function(data: ReadStream) {
  const input = data.toString().trim();

  if (input.toUpperCase() === "TRUCO") {
    try {
      game.truco(player);
      game.acceptTruco(computer);
    } catch (e) {
      Logger.error(e);
    }
    return;
  }

  const cards = game.hand.deck.playerCards.get(player)!;
  let cardNumber = 0;
  try {
    cardNumber = Number.parseInt(input);
    if (
      Number.isNaN(cardNumber) ||
      cards.length < cardNumber ||
      cardNumber <= 0
    )
      throw new Error();
  } catch (e) {
    Logger.error(
      "Please, enter the position of the card you want to play in current hand"
    );
    return;
  }

  play(player, cards[cardNumber - 1]);
  Logger.info(
    `Hands - you: ${game.getPlayerScore(
      player
    )} / computer: ${game.getPlayerScore(computer)}`
  );
  Logger.info(`Turned: ${game.hand.deck.turned}`);
  Logger.you(`Hand: ${game.hand.deck.playerCards.get(player)}`);
});
