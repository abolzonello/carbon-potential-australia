// ==============================================================
// 1. DATA CONFIGURATION & CATEGORICAL SCORING
// ==============================================================

// Center the map (Perth focus)
Map.setCenter(115.86, -31.95, 6);

// Define Palettes
var soilPalette = ['FFFFE5', 'FFF7BC', 'FEE391', 'FEC44F', 'FE9929', 'EC7014', 'CC4C02', '8C2D04'];
var phPalette = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue'];
var waterPalette = ['brown', 'white', 'blue'];
var scorePalette = ['#d73027', '#fc8d59', '#fee08b', '#d9ef8b', '#91cf60', '#1a9850'];

// --- CALCULATE CATEGORICAL CARBON SEQUESTRATION SCORE ---
function calculateCarbonScore() {
  var clay = ee.ImageCollection('CSIRO/SLGA')
    .filter(ee.Filter.eq('attribute_code', 'CLY'))
    .select('CLY_000_005_EV').mosaic();
    
  var awc = ee.ImageCollection('CSIRO/SLGA')
    .filter(ee.Filter.eq('attribute_code', 'AWC'))
    .select('AWC_000_005_EV').mosaic();
    
  var depth = ee.ImageCollection('CSIRO/SLGA')
    .filter(ee.Filter.eq('attribute_code', 'DES'))
    .select('DES_000_200_EV').mosaic();

  // CATEGORICAL SCORING
  // Clay Content: 0-15% = 1, 15-25% = 2, >25% = 3
  var clayScore = ee.Image(1)
    .where(clay.gte(15).and(clay.lt(25)), 2)
    .where(clay.gte(25), 3);
  
  // Available Water Capacity: 0-8% = 1, 8-15% = 2, >15% = 3
  var awcScore = ee.Image(1)
    .where(awc.gte(8).and(awc.lt(15)), 2)
    .where(awc.gte(15), 3);
  
  // Soil Depth: 0-0.5m = 1, 0.5-1.0m = 2, >1.0m = 3
  var depthScore = ee.Image(1)
    .where(depth.gte(0.5).and(depth.lt(1.0)), 2)
    .where(depth.gte(1.0), 3);

  // Weighted Average Score (maintains 1-3 scale)
  var totalScore = clayScore.multiply(0.4)
                   .add(awcScore.multiply(0.4))
                   .add(depthScore.multiply(0.2));

  return totalScore.rename('Carbon_Score');
}

var carbonScoreLayer = calculateCarbonScore();

// MASTER LAYER LIST
var layers = [
  {
    label: '✨ Carbon Sequestration Potential', 
    code: 'SCORE',
    customImage: carbonScoreLayer, 
    vis: {min: 1.0, max: 3.0, palette: scorePalette},
    unit: 'Rating (1-3)',
    legend: ['1.0 - Low', '1.5', '2.0 - Medium', '2.5', '3.0 - High']
  },
  {
    label: 'Bulk Density',
    code: 'BDW',
    band: 'BDW_000_005_EV', 
    vis: {min: 1.0, max: 1.8, palette: soilPalette},
    unit: 'g/cm³'
  },
  {
    label: 'Organic Carbon',
    code: 'SOC',
    band: 'SOC_000_005_EV',
    vis: {min: 0, max: 5, palette: ['black', 'brown', 'orange', 'yellow']},
    unit: '%'
  },
  {
    label: 'Clay Content',
    code: 'CLY',
    band: 'CLY_000_005_EV',
    vis: {min: 0, max: 60, palette: soilPalette},
    unit: '%',
    thresholds: '0-15% (Low) | 15-25% (Medium) | >25% (High)'
  },
  {
    label: 'Available Water Capacity',
    code: 'AWC',
    band: 'AWC_000_005_EV',
    vis: {min: 0, max: 20, palette: waterPalette},
    unit: '%',
    thresholds: '0-8% (Low) | 8-15% (Medium) | >15% (High)'
  },
  {
    label: 'Depth of Soil',
    code: 'DES',
    band: 'DES_000_200_EV',
    vis: {min: 0.1, max: 2.0, palette: ['8d6738', '252525']},
    unit: 'm',
    thresholds: '0-0.5m (Low) | 0.5-1.0m (Medium) | >1.0m (High)'
  }
];

// ==============================================================
// 2. LOGIC FUNCTIONS
// ==============================================================

function updateMap(selection) {
  var layerConfig = layers.filter(function(l) { return l.label === selection; })[0];
  
  var image;
  if (layerConfig.code === 'SCORE') {
    image = layerConfig.customImage; 
  } else {
    var dataset = ee.ImageCollection('CSIRO/SLGA')
      .filter(ee.Filter.eq('attribute_code', layerConfig.code));
    image = dataset.select(layerConfig.band).mosaic();
  }
  
  Map.layers().reset();
  Map.addLayer(image, layerConfig.vis, layerConfig.label);
  updateLegend(layerConfig);
}

function updateLegend(config) {
  legendPanel.clear();
  legendPanel.add(ui.Label({value: config.label, style: {fontWeight: 'bold'}}));
  
  // Create gradient image
  var colorBar = ui.Thumbnail({
    image: ee.Image.pixelLonLat().select(0),
    params: {
      bbox: [0, 0, 1, 0.1],
      dimensions: '200x20',
      format: 'png',
      min: 0, max: 1,
      palette: config.vis.palette
    },
    style: {stretch: 'horizontal', margin: '5px 0', maxHeight: '20px'}
  });
  legendPanel.add(colorBar);
  
  // Labels for categorical score
  if (config.code === 'SCORE') {
    var scoreLabels = ui.Panel({
      layout: ui.Panel.Layout.flow('vertical'),
      style: {padding: '5px 0'}
    });
    scoreLabels.add(ui.Label('1.0 - Low Potential', {fontSize: '11px', color: '#d73027'}));
    scoreLabels.add(ui.Label('2.0 - Medium Potential', {fontSize: '11px', color: '#fee08b'}));
    scoreLabels.add(ui.Label('3.0 - High Potential', {fontSize: '11px', color: '#1a9850'}));
    legendPanel.add(scoreLabels);
  } else {
    // Standard min/max labels
    var labelPanel = ui.Panel({
      layout: ui.Panel.Layout.flow('horizontal'),
      style: {stretch: 'horizontal', backgroundColor: '#f4f4f4'}
    });
    labelPanel.add(ui.Label(config.vis.min));
    labelPanel.add(ui.Label('', {stretch: 'horizontal'}));
    labelPanel.add(ui.Label(config.vis.max));
    legendPanel.add(labelPanel);
  }
  
  // Add threshold information if available
  if (config.thresholds) {
    legendPanel.add(ui.Label({
      value: '📊 Scoring: ' + config.thresholds,
      style: {fontSize: '10px', color: '#555', margin: '5px 0', whiteSpace: 'pre-wrap'}
    }));
  }
}

// ==============================================================
// 3. UI SETUP (Panel & Controls)
// ==============================================================

var panel = ui.Panel({
  style: {width: '340px', padding: '10px', backgroundColor: '#f4f4f4'}
});
ui.root.insert(0, panel);

// Title
panel.add(ui.Label({
  value: '🌱 Soil Carbon Potential',
  style: {fontWeight: 'bold', fontSize: '24px', margin: '10px 0', color: '#2c3e50'}
}));

panel.add(ui.Label('Analyse soil suitability for carbon sequestration projects.'));

// Scoring Info Box
panel.add(ui.Label({
  value: 'Scoring System',
  style: {fontWeight: 'bold', margin: '15px 0 5px 0', fontSize: '14px'}
}));

panel.add(ui.Label({
  value: 'Properties rated 1-3:\n1 = Low potential\n2 = Medium potential\n3 = High potential',
  style: {fontSize: '12px', color: '#555', backgroundColor: '#fff', padding: '8px', border: '1px solid #ddd'}
}));

// --- LOCATION SEARCH ---
panel.add(ui.Label({
  value: 'Find Location', 
  style: {fontWeight: 'bold', margin: '20px 0 0 0'}
}));

panel.add(ui.Label({
  value: 'Use the Search Bar at the top of the map to find specific locations.',
  style: {color: '#555', fontSize: '12px', margin: '5px 0 15px 0'}
}));

// Layer Select
panel.add(ui.Label({
  value: 'Select Analysis Layer:', 
  style: {fontWeight: 'bold', margin: '20px 0 5px 0'}
}));

var select = ui.Select({
  items: layers.map(function(l) { return {label: l.label, value: l.label}; }),
  placeholder: 'Select a layer...',
  onChange: updateMap
});
panel.add(select);

// Legend Panel
var legendPanel = ui.Panel({style: {padding: '10px 0', backgroundColor: '#f4f4f4'}});
panel.add(legendPanel);

// Initialize Map with first layer
select.setValue(layers[0].label);

