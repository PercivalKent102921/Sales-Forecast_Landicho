import * as tf from '@tensorflow/tfjs';

export const buildModel = () => {
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [2], units: 16, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
  return model;
};

export const trainModel = async (model, data, labels) => {
  const xs = tf.tensor2d(data);
  const ys = tf.tensor2d(labels, [labels.length, 1]);

  await model.fit(xs, ys, { epochs: 50 });
  return model;
};

export const predictSales = (model, inputData) => {
  const xs = tf.tensor2d(inputData);
  const predictions = model.predict(xs);
  return Array.from(predictions.dataSync());
};
