/*

  Based on "OCEAN".
  Check: 
    https://textimgs.s3.amazonaws.com/boundless-psychology/convert-crop-0-0-729-769.jpe
    https://courses.lumenlearning.com/boundless-psychology/chapter/trait-perspectives-on-personality/
*/

export class Trait {
  name: string;
  description: string;
  value: number;

  constructor(name: string, description: string, value: number) {
    this.name = name;
    this.description = description;
    if (value > 1) {
      throw new Error("The value cannot be more than 1");
    }
    this.value = value;
  }
}

export interface WeightedAvgEntry {
  weight: number;
  value: number;
}

export default class Personality {
  openness: Trait;
  conscientiousness: Trait;
  extroversion: Trait;
  agreeableness: Trait;
  neuroticism: Trait;

  constructor(
    openness: number,
    conscientiousness: number,
    extroversion: number,
    agreeableness: number,
    neuroticism: number
  ) {
    this.openness = new Trait(
      "openness",
      "Imagination, feelings, actions, ideas",
      openness
    );
    this.conscientiousness = new Trait(
      "conscientiousness",
      "Competence, self-discipline, goal-driven",
      conscientiousness
    );
    this.extroversion = new Trait(
      "extroversion",
      "Sociability, assertiveness, emotional expression",
      extroversion
    );
    this.agreeableness = new Trait(
      "agreeableness",
      "Cooperative, trustworthy, good-natured",
      agreeableness
    );
    this.neuroticism = new Trait(
      "neuroticism",
      "tendency toward unstable emotions",
      neuroticism
    );
  }

  calcWeightedAvg(...entries: WeightedAvgEntry[]) {
    let avg = 0;
    let totalWeight = 0;
    entries.forEach(entry => {
      let { value, weight } = entry;

      if (weight < 0) {
        weight = weight * -1;
        value = 1 - value;
      }

      totalWeight += weight;
      avg += value * weight;
    });

    return avg / totalWeight;
  }

  getAvgWithWeight(
    opennessWeight: number,
    conscientiousnessWeight: number,
    extroversionWeight: number,
    agreeablenessWeight: number,
    neuroticismWeight: number
  ) {
    return this.calcWeightedAvg(
      {
        value: this.openness.value,
        weight: opennessWeight
      },
      {
        value: this.conscientiousness.value,
        weight: conscientiousnessWeight
      },
      {
        value: this.extroversion.value,
        weight: extroversionWeight
      },
      {
        value: this.agreeableness.value,
        weight: agreeablenessWeight
      },
      {
        value: this.neuroticism.value,
        weight: neuroticismWeight
      }
    );
  }

  private withScenarioBias(
    personalityProbablity: number,
    scenarioBias?: number
  ) {
    if (!scenarioBias) return personalityProbablity;

    return this.calcWeightedAvg(
      { value: scenarioBias, weight: 2 },
      { value: personalityProbablity, weight: 1 }
    );
  }

  getTrucoResponseProbability(scenarioBias?: number): number {
    return this.withScenarioBias(
      this.getAvgWithWeight(1, -2, 3, 3, -2),
      scenarioBias
    );
  }

  getTrucoProbability(scenarioBias?: number): number {
    return this.withScenarioBias(
      this.getAvgWithWeight(2, -1, 2, 2, 3),
      scenarioBias
    );
  }

  getFalseTrucoProbability(scenarioBias?: number): number {
    return this.withScenarioBias(
      this.getAvgWithWeight(2, -4, 4, 1, 3),
      scenarioBias
    );
  }
}
