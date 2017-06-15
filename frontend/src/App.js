import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import _ from 'lodash';
import P5Wrapper from 'react-p5-wrapper';
import sketch from './sketch';
var math = require('mathjs');

const sigmoid = function({x}) {
	return math.exp(math.multiply(x, -1)).map(n => 1 / (1 + n));
};

const exp = function(x) {
  return math.exp(x);
};

const propagateChanges = function({network, layerIndex}) {
  let newNetwork = network;
  const {neuronLayers, synapseLayers} = newNetwork;

  const product = math.multiply(neuronLayers[layerIndex], synapseLayers[layerIndex]);
  newNetwork.neuronLayers[layerIndex + 1] = sigmoid({x: product});

  if (neuronLayers.length - 2 > layerIndex) {
    newNetwork = propagateChanges({
      network: newNetwork,
      layerIndex: layerIndex + 1,
    });
  }

  return newNetwork;
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      network: {},
    };
    this.handleNeuronUpdate = this.handleNeuronUpdate.bind(this);
  }
  componentDidMount() {
    setTimeout(() => {
     axios.get("network.json")
       .then(response => {
         const network = response.data;
         this.setState({network});
       });
    }, 1000);
  }

  handleNeuronUpdate({layerIndex, neuronIndex, neuron}) {
    let newNetwork = this.state.network;
    newNetwork.neuronLayers[layerIndex][neuronIndex] = parseFloat(neuron);
    this.setState({
      network: propagateChanges({network: newNetwork, layerIndex}),
    });
  }

  render() {
    const {neuronLayers, synapseLayers} = this.state.network;

    /*
     * OLD NODE LINK GRAPH
    const graph = {
      nodes: 
        _.flatten(neuronLayers)
        .map((neuron, index) => ({id: index, label: neuron.toFixed(2)})),
      edges: 
        _(synapseLayers)
        .map((synapseLayer, synapseLayerIndex) =>
          synapseLayer.map((neuronsSynapses, neuronsSynapsesIndex) =>
            neuronsSynapses.map((synapse, synapseIndex) => ({
              from: 
                _(neuronLayers.slice(0, synapseLayerIndex))
                .flatten()
                .value()
                .length
                + neuronsSynapsesIndex,
              to: 
                _(neuronLayers.slice(0, synapseLayerIndex + 1))
                .flatten()
                .value()
                .length
                + synapseIndex,
              label: synapse.toFixed(2),
            }))
          )
        )
        .flatten()
        .value()
    };
    */

    /*
     * old synapse and neurons nodes
    return (
      <div className="network">
        {
          neuronLayers && 
            neuronLayers.map((neurons, index) =>
              [
                <div className="layer" key={`neuronLayer-index`}>
                {
                  neurons.map((neuron, index) =>
                    <div key={index}>{neuron.toFixed(2)}</div>
                  )
                }
                </div>,
                <div className="layer" key={`synapseLayer-index`}>
                {
                  _.flatten(synapseLayers[index]).map((neuron, index) =>
                    <div key={index}>{neuron.toFixed(2)}</div>
                  )
                }
                </div>,
              ]
          )
        }
      </div>
    );
    */
    return (
      <div className="network">
        <P5Wrapper 
          sketch={sketch} 
          network={this.state.network}
          onChange={this.handleNeuronUpdate}
        />
        {
          neuronLayers && 
            neuronLayers.map((neurons, index) =>
              [
                <div className="boringLayer" key={`neuronLayer-${index}`}>
                {
                  neurons.map((neuron, index) =>
                    <div key={index}>{neuron.toFixed(2)}</div>
                  )
                }
                </div>,
                <div className="layer" key={`synapseLayer-${index}`}>
                {
                  _.flatten(synapseLayers[index]).map((neuron, index) =>
                    <div key={index}>{neuron.toFixed(2)}</div>
                  )
                }
                </div>,
              ]
          )
        }
      </div>
    );
  }
}

export default App;
