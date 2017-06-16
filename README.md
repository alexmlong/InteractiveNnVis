# InteractiveNnVis

A basic interactive visualization of a neural network trained to learn the XOR operation.

There is a 3rd input neuron to the network however this is essentially a red herring. The training data is simply the results of doing an XOR of the first two inputs, so the network should learn to ignore the 3rd input.

In the visualization, the edge thicknesses represent the magnitude of the weight (thicker means larger) and the color indicates positive or negative.

The various neuron values can be modified in the visualization, and the results of the changes will be propagated through the rest of the network.

# Running

Train the network by running `python nn.py`.

Then browse to `frontend` and run `npm install`, then `npm start`.
