## Website Performance Optimization portfolio project

### Dev Documentation

to see the Documentation for Developers go to the doc folder

### Optimizations

For the pagespeed project, in order to get the score of 90 in pagespeed insight of google
many optimizations were implemented. Css files were combined and minified
(also I could inline all the css in order to improve the score).
Scripts were marked to run asyncronously and also combined and minified
also the Images were resized and compressed.

For the second part of the project.
Refactored the code functionality to resize the pizzas in the menu, and also refactored the code
that let the background pizza animates during the scrolling of the page for this I used the translate3d
functionality in order to force elements into their own composite layer.
Also I tried to reduce number of background pizzas being rendered.
(https://github.com/udacity/fend-office-hours/tree/master/Web%20Optimization/Effective%20Optimizations%20for%2060%20FPS)


### Getting started
To view web pages you can visit this live demo pages at:
  http://g0ng0n.github.io/FEND-website-performance-optimization/

or you can clone the repo a run a localserver

1. to run a local server with python:

  ```bash
  $> cd /path/to/your-project-folder
  $> python -m SimpleHTTPServer 8080
  ```
  ```
2.Open a browser and visit localhost:8080


