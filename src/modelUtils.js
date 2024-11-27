import * as tf from "@tensorflow/tfjs";

export const buildModel = () => {
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [2], units: 64, activation: "relu" }));
  model.add(tf.layers.dense({ units: 64, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1, activation: "linear" }));
  return model;
};

export const trainModel = async (model, inputs, outputs) => {
  const inputTensor = tf.tensor2d(inputs, [inputs.length, inputs[0].length]);
  const outputTensor = tf.tensor2d(outputs, [outputs.length, 1]);

  model.compile({
    optimizer: tf.train.adam(),
    loss: "meanSquaredError",
  });

  await model.fit(inputTensor, outputTensor, {
    epochs: 50,
    batchSize: 16,
    shuffle: true,
  });

  inputTensor.dispose();
  outputTensor.dispose();
};

export const predictSales = (model, inputs) => {
  const inputTensor = tf.tensor2d(inputs, [inputs.length, inputs[0].length]);
  const predictions = model.predict(inputTensor).dataSync();
  inputTensor.dispose();
  return Array.from(predictions);
};
