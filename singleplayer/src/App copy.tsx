import * as React from "react";
// import DeckDisplay from "./components/DeckDisplay";
import Table from "./components/Table";

import Game from "./game/Game";
import Player from "./game/Player";

import ComputerGameplayer from "./Computer";

import $ from "jquery";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";

export interface AppState {
  game: Game;
}

class App extends React.Component<{}, AppState> {
  state = { game: new Game([new Player("player"), new Player("computer")]) };
  index = 0;
  popoverFricker = new Map<string, number>();

  constructor(props: Readonly<AppState>) {
    super(props);
    this.state.game.startGame();
    new ComputerGameplayer(this.state.game.players[1], this.state.game);
  }

  handleClick = () => {
    const element = "#fucked-title";
    const messages = [
      "help",
      "helpme",
      "aaa",
      "plz",
      "aaaaaa",
      "'",
      "wtf",
      "asdhuasdh"
    ];
    if (this.index === messages.length) this.index = 0;
    const timeMs = 5000;
    console.log(messages[this.index]);
    $(element).popover("dispose");
    $(element).popover({
      content: messages[this.index],
      placement: "bottom"
    });
    this.index++;
    let current = this.popoverFricker.get(element);
    if (!current) current = 0;
    if (current === 500) {
      current = 0;
    }
    this.popoverFricker.set(element, ++current);
    $(element).popover("show");
    setTimeout(() => {
      console.log(current);
      if (this.popoverFricker.get(element) !== current) return;
      $(element).popover("dispose");
    }, timeMs);
  };

  render() {
    return (
      <div className="App">
        <h1
          id="fucked-title"
          onClick={this.handleClick}
          style={{ textAlign: "center" }}
        >
          CLICK ON ME!
        </h1>
        {/* <Table game={this.state.game} /> */}
      </div>
    );
  }
}

export default App;
