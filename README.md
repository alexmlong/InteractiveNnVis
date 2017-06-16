# Interactive Neural Network Visualization

A basic interactive visualization of a neural network trained to learn the XOR operation. Based on one of iamtrask's awesome neural network tutorials: http://iamtrask.github.io/2015/07/12/basic-python-network/.

In the visualization, the edge thicknesses represent the magnitude of the weight (thicker means larger) and the color indicates positive or negative.

The various neuron values can be modified in the visualization, and the results of the changes will be propagated through the rest of the network.

There is a 3rd input neuron to the network however this is essentially a red herring. The training data is simply the results of doing an XOR of the first two inputs, so the network should learn to ignore the 3rd input. You can see in the visualization that it did learn to ignore the 3rd input because the edges are line and gray, indicating those weights are near 0.

![nn vis](https://user-images.githubusercontent.com/794661/27206475-e6f4b628-5205-11e7-803e-a7f57d3656e0.gif)

# Running

Train the network by running `python nn.py`.

Then browse to `frontend` and run `npm install`, then `npm start`.
