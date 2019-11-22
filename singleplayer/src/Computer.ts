import Player from "./game/Player";
import Game, { LockHolder } from "./game/Game";

export default class ComputerGameplayer {
  player: Player;
  game: Game;
  constructor(player: Player, game: Game) {
    this.player = player;
    this.game = game;
    this.addListeners();
  }

  handlePlay = () => {
    if (this.game.hand.round.isPlayerTurn(this.player)) {
      if (this.game.isLocked()) {
        return;
      }
      const lockHolder = new LockHolder("computer handle play");
      this.game.lock(lockHolder);
      setTimeout(() => {
        this.game.unlock(lockHolder);
        try {
          this.game.play(
            this.player,
            this.game.hand.deck.playerCards.get(this.player)![0]
          );
        } catch (e) {
          console.log(e);
          this.handlePlay();
          return;
        }
      }, 1000);
    }
  };

  handleTruco = (player: Player) => {
    if (player === this.player) return;

    const lockHolder = new LockHolder("computer handle truco");
    this.game.lock(lockHolder);
    setTimeout(() => {
      this.game.unlock(lockHolder);
      try {
        if (Math.random() * 100 > 50) {
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
