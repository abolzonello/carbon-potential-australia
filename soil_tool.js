// ==============================================================
// 1. DATA CONFIGURATION & SCORING (MUST BE FIRST)
// ==============================================================

// Center the map
Map.setCenter(115.86, -31.95, 6);

// Define Palettes
var soilPalette = ['FFFFE5', 'FFF7BC', 'FEE391', 'FEC44F', 'FE9929', 'EC7014', 'CC4C02', '8C2D04'];
var phPalette = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue'];
var waterPalette = ['brown', 'white', 'blue'];
var scorePalette = ['red', 'yellow', 'green', 'darkgreen'];

// --- CALCULATE CARBON SEQUESTRATION POTENTIAL SCORE ---
function calculateCarbonScore() {
  var clay = ee.ImageCollection('CSIRO/SLGA').filter(ee.Filter.eq('attribute_code', 'CLY')).select('CLY_000_005_EV').mosaic();
  var awc = ee.ImageCollection('CSIRO/SLGA').filter(ee.Filter.eq('attribute_code', 'AWC')).select('AWC_000_005_EV').mosaic();
  var depth = ee.ImageCollection('CSIRO/SLGA').filter(ee.Filter.eq('attribute_code', 'DES')).select('DES_000_200_EV').mosaic();

  // Normalize inputs
  var clayNorm = clay.divide(60); 
  var awcNorm = awc.divide(0.15); 
  var depthNorm = depth.divide(2.0); 

  // Weighted Sum
  var score = clayNorm.multiply(0.4)
              .add(awcNorm.multiply(0.4))
              .add(depthNorm.multiply(0.2))
              .multiply(100); 

  return score.rename('Carbon_Score');
}

var carbonScoreLayer = calculateCarbonScore();

// MASTER LAYER LIST (Defined early so the UI can see it!)
var layers = [
  {
    label: '✨ Carbon Sequestration Score', 
    code: 'SCORE',
    customImage: carbonScoreLayer, 
    vis: {min: 20, max: 80, palette: scorePalette},
    unit: '0-100 Index'
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
    unit: '%'
  },
  {
    label: 'Available Water Capacity',
    code: 'AWC',
    band: 'AWC_000_005_EV',
    vis: {min: 0, max: 0.2, palette: waterPalette},
    unit: 'fraction'
  },
  {
    label: 'Depth of Soil',
    code: 'DES',
    band: 'DES_000_200_EV',
    vis: {min: 0.1, max: 2.0, palette: ['8d6738', '252525']},
    unit: 'm'
  }
];

// ==============================================================
// 2. LOGIC FUNCTIONS (Must be before UI uses them)
// ==============================================================

function updateMap(selection) {
  var layerConfig = layers.filter(function(l) { return l.label === selection; })[0];
  
  var image;
  if (layerConfig.code === 'SCORE') {
    image = layerConfig.customImage; 
  } else {
    var dataset = ee.ImageCollection('CSIRO/SLGA').filter(ee.Filter.eq('attribute_code', layerConfig.code));
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
  
  // Labels
  var labelPanel = ui.Panel({
    layout: ui.Panel.Layout.flow('horizontal'),
    style: {stretch: 'horizontal', backgroundColor: '#f4f4f4'}
  });
  labelPanel.add(ui.Label(config.vis.min));
  labelPanel.add(ui.Label('', {stretch: 'horizontal'}));
  labelPanel.add(ui.Label(config.vis.max));
  legendPanel.add(labelPanel);
  
  if (config.code === 'SCORE') {
     legendPanel.add(ui.Label('Low Potential ---------------- High Potential', {fontSize: '10px', color: 'gray'}));
  }
}

// ==============================================================
// 3. UI SETUP (Panel, Search, & Controls)
// ==============================================================

var panel = ui.Panel({
  style: {width: '320px', padding: '10px', backgroundColor: '#f4f4f4'}
});
ui.root.insert(0, panel);

// Title
panel.add(ui.Label({
  value: '🌱 Soil Carbon Prospector',
  style: {fontWeight: 'bold', fontSize: '24px', margin: '10px 0', color: '#2c3e50'}
}));

panel.add(ui.Label('Analyse soil suitability for carbon projects.'));

// Search Widget
panel.add(ui.Label({
  value: '🔍 Find Location (Postcode/Town)', 
  style: {fontWeight: 'bold', margin: '20px 0 0 0'} // Corrected Margin
}));

var placesSearch = ui.Textbox({
  placeholder: 'Enter Postcode (e.g., 6000) or Town...',
  onChange: function(text) {
    Map.setControlVisibility({layerList: false, zoomControl: true, mapTypeControl: true});
  }
});

panel.add(ui.Label('Tip: Use the search bar at the top of the map to fly to a specific Lot or Postcode.'));

// Layer Select
panel.add(ui.Label({
  value: 'Select Analysis Layer:', 
  style: {fontWeight: 'bold', margin: '20px 0 0 0'} // Corrected Margin
}));

// Now that 'layers' is defined above, this will work!
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
