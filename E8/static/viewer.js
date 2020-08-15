/*
Visualization proyect

Proyect by Alex Rod.
2018/06/10
*/

var radius = 360;

var radii = []; // x, x_off, y, y_off
var rad = [0, 0, 0, 0];
var layers = 6;
var nodes = 8;
var nodeMult = 1;
var shifts = 6;
hues = [];
sat = [];
bright = [];
wiggle = [];
colors = [];
nums = [];

var btn, ups, downs;

roaming = [];

rots = [];

star = true;
layerColors = true;
inward = false;

var points = [];
var rot = [];

function budge(points) {
  newP = points;
  //print(newP.length)
  for (l in points) {
    num = points[l].length;
    for (p in points[l]) {
      pt = newP[l][p];

      r = radius * pow((layers - l) / layers, radiusSpread);

      shift = (TWO_PI / shifts / num) * (l % shifts);
      pt.x_ori =
        cos((TWO_PI / num) * p + rot[l] + shift) * cos(rad[0] * pow(l + 1, 0.8) + rad[1]) * r;
      pt.y_ori =
        sin((TWO_PI / num) * p + rot[l] + shift) * cos(rad[2] * pow(l + 1, 0.8) + rad[3]) * r;

      pt.x = pt.x_ori;
      pt.y = pt.y_ori;

      var w = l * wiggle[0] + wiggle[1];

      pt.x += random(-w, w);
      pt.y += random(-w, w);
    }
  }
  return newP;
}

function drawPoints() {
  strokeWeight(strokeW);
  for (l1 in points) {
    for (l_2 = l; l_2 < layers; l_2++) {
      if (inward) {
        l = layers - 1 - l1;
        l2 = layers - 1 - l_2;
      } else {
        l = l1;
        l2 = l_2;
      }
      col = [l, floor((int(l) + int(l2)) / 2), ceil((int(l) + int(l2)) / 2), l2][layerMode];
      //print(l+' '+l2+' '+col+' '+ (l+l2))
      for (p in points[l]) {
        for (p2 in points[l2]) {
          if (layerColors) {
            stroke([hues[col], sat[col], bright[col]]); // /(layers-points[p2].layer)  ])
          } else {
            stroke(colors[l2][p]);
          }
          if (!star || l != l2)
            line(points[l][p].x, points[l][p].y, points[l2][p2].x, points[l2][p2].y);
        }
        // fill(75 * l);
        // ellipse(points[l][p].x, points[l][p].y, 3, 3)
      }
    }
  }
}

function addPoint(i, j) {
  points.push({
    layer: i,
    n: j
  });
}

function setup() {
  colorMode(HSB, 360, 100, 100);
  createCanvas(window.innerWidth, window.innerHeight);
  background(0);

  for (i = 0; i < layers; i++) {
    rots.push(0)
    rot.push(0);

    hues.push(random(360))
    sat.push(100)
    bright.push(50 + (50 / layers) * i)
  }
  ups = [];
  wiggle = [0,0]
  radii = [0,0,0,0]
  radiusSpread = 1
  layerMode = 0
  strokeW = 0.5
  fade = 0.5

  for (i = 0; i < layers; i++) {
    num = int(nodes * pow(nodeMult, layers - i - 1)); //number of nodes in this layer

    shift = (TWO_PI / shifts / num) * (i % shifts);

    if (!layerColors) {
      colors.push([]);
    }
    points.push([]);
    for (j = 0; j < num; j++) {
      points[i].push({});
      if (!layerColors) {
        colors[i].push([random(255), random(255), random(255)]);
      }
    }
  }
}

function draw() {
  push();

  translate(width / 2, height / 2);
  fill(255);
  background(0, fade);
  points = budge(points);
  drawPoints();

//   roam();
  for (i = 0; i < layers; i++) {
    rot[i] += rots[i]
  }
  rad[0] += radii[0];
  rad[1] += radii[1];
  rad[2] += radii[2];
  rad[3] += radii[3];

  pop();
}