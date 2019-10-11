var Genemo = require('genemo');

const distances = require('./dist.json');

const cities = [...Array(distances.length).keys()];

const generateIndividual = Genemo.randomSequenceOf(cities, cities.length);

// Fitness is measured as a path total length
const fitnessFunction = (individual) => {
  const lastToFirstDistance = distances[individual[individual.length - 1]][individual[0]];
  const totalDistance = individual.slice(0, -1).reduce((distance, city, index) => {
    const nextCity = individual[index + 1];
    const currentDistance = distances[city][nextCity];
    return distance + currentDistance;
  }, 0) + lastToFirstDistance;
  return totalDistance;
};




Genemo.run({
    generateInitialPopulation: Genemo.generateInitialPopulation({
      generateIndividual, // Here, provide a function which generates an individual
      size: 200,
    }),
    selection: Genemo.selection.roulette({ minimizeFitness: false }),
    reproduce: Genemo.reproduce({
      crossover: Genemo.crossover.singlePoint(),
      mutate: Genemo.mutation.transformRandomGene(Genemo.mutation.flipBit()),
      mutationProbability: 0.02,
    }),
    evaluatePopulation: Genemo.evaluatePopulation({ fitnessFunction }), // You need to provide your own fitness function
    stopCondition: Genemo.stopCondition({ maxIterations: 100 }),
  }).then(({ evaluatedPopulation }) => {
    // ...
  }).catch(console.error);