import * as tf from "@tensorflow/tfjs";

// Build the TensorFlow.js model
export const buildModel = () => {
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [2], units: 16, activation: "relu" }));
  model.add(tf.layers.dense({ units: 8, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1 })); // Single output: quantity_sold
  model.compile({ optimizer: "adam", loss: "meanSquaredError" });
  return model;
};

// Normalize a value
export const normalizeData = (value, min, max) => (value - min) / (max - min);

// Denormalize a value
export const denormalizeData = (value, min, max) => value * (max - min) + min;

// Train the model
export const trainModel = async (model, inputs, outputs) => {
  const inputTensor = tf.tensor2d(inputs, [inputs.length, inputs[0].length]);
  const outputTensor = tf.tensor2d(outputs, [outputs.length, 1]);

  await model.fit(inputTensor, outputTensor, {
    epochs: 50,
    batchSize: 4,
    verbose: 0,
  });

  inputTensor.dispose();
  outputTensor.dispose();
};

// Predict future sales
export const predictSales = (model, futureData) => {
  const futureTensor = tf.tensor2d(futureData, [futureData.length, futureData[0].length]);
  const predictions = model.predict(futureTensor);
  const predictionArray = Array.from(predictions.dataSync());
  futureTensor.dispose();
  return predictionArray;
};
