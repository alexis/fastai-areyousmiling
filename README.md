# Areyousmiling 

My study project for Jeremy Howard's [deep learning course](https://course.fast.ai).

It's a tiny [web app](http://areyousmiling.smolianinov.com:8080) powered by the Starlette framework. It basically serves as a very simple interface for a neural network model (ResNet-50, pretrained on ImageNet), which, in turn, was trained by me to classify photos of people into 3 classes, depending on their facial expression: positive, neutral and negative.

Several datasets were used for training, including a custom dataset of images collected with Google Image Search and [KDEF](http://kdef.se/) dataset.

Also, many thanks to Anurag Goel for his Starter kit for deploying fast.ai models on Render.
