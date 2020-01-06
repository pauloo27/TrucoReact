# Truco

This project is an adaptation of the famous Truco Card Game.

![Brazilian Boomers playing Truco](https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Truco_saopaulo_brazil.jpg/1200px-Truco_saopaulo_brazil.jpg)

## How to play

See [How to Run](#how-to-run) to run it locally.

## Learn the game

This game is based in the "Truco Paulista". Here are some basic rules.

### Card ranking

> 3 > 2 > A > K > J > Q > 7 > 6 > 5 > 4

_(3 is the strongest and 4 the weakest)_

In each hand, each player receive 3 cards. A card is turned up side and the next card (in ordinal order) becomes the strongest card (the "trumps"). For example, if the card turned is the `5`, then `6` is the trump (strongest) card.

The hands have 2 or 3 rounds (3 if a player won the first one and another player the second one).

### Score system

Each hand worth 1 point, unless if the hand is "trucked". If it's trucked, then the hand worth 3, 6 or 9 points. The game ends when one player reach 12 points.

### Truco

When a player ask for truco, the hand will worth 3 points if the opponent accept it, if the opponent declined, then who asked receive 1 point.

The player who got ask for truco can reply with "6", that will make the hand worth 6 if accepted and if it's declined he receive 3 points.

The same with "9".

### Trumps

Each hand, a card is turned and the next card in ordinal order becomes the strongest in that hand. For normal cards, the suit doesn't matter, but with trumps, there's a ranking:

> Clubs > Hearts > Spades > Diamonds

So the Clubs trump is the strongest card in the game and it's called "zap".

## How to run

### Building the common module

In the `common` folder run:

> yarn install

This will install all the dependencies. Then:

> yarn build

To compile the TypeScript files.

### Running the React Singleplayer Application

Then in the `singleplayer` folder, run:

> yarn install

Then start the React server using:

> yarn start

Your default browser will open when it's ready to be played.

## Changelog

See the [Changelog file](./CHANGELOG.md)

## License

![GPLv2 Logo](https://i.imgur.com/AuQQfiB.png)

This project is licensed under [GNU General Public License v2.0](./LICENSE).
