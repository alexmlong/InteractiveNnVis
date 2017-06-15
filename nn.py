import numpy as np
import json

def nonlin(x,deriv=False):
	if(deriv==True):
	    return x*(1-x)

	return 1/(1+np.exp(-x))

trainingData = [
    [[0,0,0], 0],
    [[1,0,0], 1],
    [[0,1,0], 1],
    [[1,1,0], 0],
    [[0,0,1], 0],
    [[1,0,1], 1],
    [[0,1,1], 1],
    [[1,1,1], 0],
]

X = np.array([x[0] for x in trainingData])
y = np.array([x[1] for x in trainingData])

syn0 = 2*np.random.random((3,4)) - 1
syn1 = 2*np.random.random((4,1)) - 1
for j in xrange(100000):
    trainingIndex = j % len(X)
    l0 = np.array([X[trainingIndex]])
    l1 = nonlin(np.dot(l0, syn0))
    l2 = nonlin(np.dot(l1,syn1))
    l2_error = y[trainingIndex] - l2
    l2_delta = l2_error*(l2*(1-l2))
    l1_error = l2_delta.dot(syn1.T)
    l1_delta = l1_error * nonlin(l1,deriv=True)
    syn1 += l1.T.dot(l2_delta)
    syn0 += l0.T.dot(l1_delta)
    if j % 10000 == 0:
        print "Error:" + str(np.mean(np.abs(l2_error)))
        with open("./frontend/public/network.json", "w") as file:
            json.dump({
                "neuronLayers": [
                    l0.tolist()[0],
                    l1.tolist()[0],
                    l2.tolist()[0],
                ],
                "synapseLayers": [
                    syn0.tolist(),
                    syn1.tolist(),
                ],
            }, file)

print syn0.tolist()
print syn1.tolist()
for ex in X:
    print "example: %s" % ex
    l1 = nonlin(np.dot(ex, syn0))
    print "layer 1: %s" % l1
    print "layer 2: %s" % nonlin(np.dot(l1, syn1))
