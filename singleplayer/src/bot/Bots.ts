import Personality from "./Personality";

export default class Bot {
  name: string;
  personality: Personality;

  constructor(name: string, personality: Personality) {
    this.name = name;
    this.personality = personality;
  }
}

export const bene = new Bot(
  "Bené",
   new Personality(0.7, 0.7, 0.4, 0.6, 0.3)
);

export const ednaldo = new Bot(
  "Ednaldo",
  new Personality(0.7, 0.8, 0.4, 0.3, 0.3)
);

export const adivanir = new Bot(
  "Adivanir",
  new Personality(0.6, 0.4, 0.4, 0.5, 0.4)
);

export const baianinho = new Bot(
  "Baianinho de Mauá",
  new Personality(0.9, 0.9, 0.3, 0.5, 0.1)
);

export const katrina = new Bot(
  "Katrina",
  new Personality(0.7, 0.1, 0.7, 0.55, 0.65)
);

export const bots = [bene, ednaldo, adivanir, baianinho, katrina]

