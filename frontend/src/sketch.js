import _ from 'lodash';
import p5dom from 'p5/lib/addons/p5.dom';

export default function sketch (p) {
  const ORIGIN_OFFSET = 50;
  const NEURON_SIZE = 20;
  const LAYER_WIDTH = 150;
  const NEURON_SPACING = 50;
  const NEURON_TEXT_OFFSET = {
    x: -1 * NEURON_SIZE * 0.30,
    y: NEURON_SIZE * 0.10,
  };
  const SYNAPSE_RANGE = 10;
  const BACKGROUND_TONE = 1.4;

  let state = {
    network: {
      neuronLayers: [],
      synapseLayers: [],
    },
    neuronTexts: {},
    selectedNeuronText: null,
    inputsDrawn: false,
  };

  p.setup = function () {
    p.createCanvas(400, 400);
    p.frameRate(3);
  };

  p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
    const {network, onChange} = props;
    state.onChange = onChange;
    if (network && network.neuronLayers && !_.isEqual(state.network, network)) {
      state.network = network;
      console.log("new network!");
      p.redraw();
    }
  };

  function drawNetwork(network) {
    const {neuronLayers, synapseLayers} = network;
    const {inputsDrawn} = state;

    synapseLayers.forEach((layer, layerIndex) =>
      layer.forEach((synapseGroup, synapseGroupIndex) =>
        synapseGroup.forEach((synapse, synapseIndex) => {
          const startX = layerIndex * LAYER_WIDTH + ORIGIN_OFFSET;
          const startY = synapseGroupIndex * NEURON_SPACING + ORIGIN_OFFSET;
          const normalizedSynapse = ((synapse + SYNAPSE_RANGE) / (SYNAPSE_RANGE * 2));
          p.stroke(255 * normalizedSynapse);
          p.strokeWeight(Math.max(10 * Math.abs(normalizedSynapse - 0.5), 1));
          p.line(
            startX,
            startY,
            startX + LAYER_WIDTH,
            synapseIndex * NEURON_SPACING + ORIGIN_OFFSET,
          );
          p.stroke(255);
          p.strokeWeight(1);
        })
      )
    );
    neuronLayers.forEach((layer, layerIndex) =>
      layer.forEach((neuron, neuronIndex) => {
        const x = layerIndex * LAYER_WIDTH + ORIGIN_OFFSET;
        const y = neuronIndex * NEURON_SPACING + ORIGIN_OFFSET;
        p.ellipse(
          x,
          y,
          NEURON_SIZE * neuron + 25, 
          NEURON_SIZE * neuron + 25,
        );
        if (!inputsDrawn) {
          const neuronText = p.createInput();
          neuronText.value(neuron.toFixed(2));
          neuronText.position(
            x + NEURON_TEXT_OFFSET.x - 7, 
            y + NEURON_TEXT_OFFSET.y - 10,
          );
          neuronText.size(30, 8);
          neuronText.changed(e => state.onChange({
            layerIndex, 
            neuronIndex, 
            neuron: e.target.value,
          }));
            console.log("neuronTexts:");
            console.log(state.neuronTexts);
          state.neuronTexts = {
            ...state.neuronTexts,
            [layerIndex]: {
              ...state.neuronTexts[layerIndex],
              [neuronIndex]: neuronText,
            }
          };
          state.inputsDrawn = true;
        } else {
          const neuronText = state.neuronTexts[layerIndex][neuronIndex];
          if (neuronText.value() !== neuron.toFixed(2) && neuronText.elt !== document.activeElement) {
            neuronText.value(neuron.toFixed(2));
          }
        }
      })
    );
  }
  p.draw = function () {
    console.log("draw:");
    const {network} = state;

    p.background(150 * BACKGROUND_TONE, 100 * BACKGROUND_TONE, 200 * BACKGROUND_TONE);
    if (network) {
      drawNetwork(network);
    }
    p.pop();
  };
};
