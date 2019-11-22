import * as React from "react";
// import DeckDisplay from "./components/DeckDisplay";
import Table from "./components/Table";

import Game from "./game/Game";
import Player from "./game/Player";

import ComputerGameplayer from "./Computer";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";

export interface AppState {
  game: Game;
}

class App extends React.Component<{}, AppState> {
  state = { game: new Game([new Player("player"), new Player("computer")]) };

  constructor(props: Readonly<AppState>) {
    super(props);
    this.state.game.startGame();
    new ComputerGameplayer(this.state.game.players[1], this.state.game);
  }

  render() {
    return (
      <div className="App">
        <Table game={this.state.game} />
      </div>
    );
  }
}

export default App;
