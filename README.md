# 🌱 Soil Carbon Prospector

A Google Earth Engine application for assessing soil carbon sequestration potential across Australia using nationally available soil data.

## Overview

The Soil Carbon Prospector provides land managers, environmental consultants, and researchers with a rapid assessment tool to identify areas with high potential for soil carbon sequestration projects. The application uses publicly available soil data from the Soil and Landscape Grid of Australia (SLGA) to generate spatial assessments of carbon storage potential.

**Target Users:**
- Agricultural land managers considering soil carbon projects
- Environmental consultants conducting preliminary site assessments
- Researchers investigating carbon farming opportunities
- Regional planners evaluating landscape-scale carbon potential

## Key Features

- **Interactive Soil Property Visualisation**: View six key soil attributes across Australia
- **Carbon Sequestration Scoring**: Automated potential assessment based on soil properties
- **Categorical Rating System**: Simple 1-3 scale (Low/Medium/High potential)
- **Location Search**: Navigate to specific properties, towns, or postcodes
- **Real-time Analysis**: Instant visual feedback for any location in Australia

## Scoring Methodology

The Carbon Sequestration Potential score combines three critical soil properties using a weighted approach:

### Scoring Criteria

| Property | Weight | Low (1) | Medium (2) | High (3) |
|----------|--------|---------|------------|----------|
| **Clay Content** | 40% | 0-15% | 15-25% | >25% |
| **Available Water Capacity** | 40% | 0-8% | 8-15% | >15% |
| **Soil Depth** | 20% | 0-0.5m | 0.5-1.0m | >1.0m |

### Rationale

**Clay Content (40% weighting)**  
Clay minerals provide binding sites for organic carbon, increasing soil carbon stabilisation and reducing decomposition rates. Higher clay content correlates with greater carbon storage capacity.

**Available Water Capacity (40% weighting)**  
AWC indicates soil moisture retention, which supports plant productivity and microbial activity essential for carbon cycling. Higher AWC enables greater biomass production and organic matter inputs.

**Soil Depth (20% weighting)**  
Deeper soils provide greater volume for carbon storage throughout the soil profile. Depth also influences root penetration and subsoil carbon accumulation potential.

### Final Score Interpretation

- **1.0 - 1.6**: Low potential - May face challenges with carbon accumulation
- **1.7 - 2.3**: Medium potential - Suitable with appropriate management practices
- **2.4 - 3.0**: High potential - Favourable conditions for carbon sequestration

## Available Data Layers

1. **✨ Carbon Sequestration Potential** - Composite score (1-3 scale)
2. **Bulk Density** - Soil compaction indicator (g/cm³)
3. **Organic Carbon** - Existing soil carbon content (%)
4. **Clay Content** - Fine particle percentage (%)
5. **Available Water Capacity** - Water retention capacity (%)
6. **Depth of Soil** - Soil profile thickness (metres)

## How to Use

### Basic Navigation

1. **Launch the Application**: Open the script in Google Earth Engine Code Editor
2. **Run the Script**: Click the "Run" button at the top of the code editor
3. **View the Interface**: The control panel appears on the left side of the map
4. **Select a Layer**: Choose from the dropdown menu to view different soil properties

### Finding Your Location

Use the **Search Bar** at the top of the map interface to find:
- Property addresses (e.g., "123 Main Road, Wongan Hills WA")
- Town names (e.g., "Esperance, Western Australia")
- Postcodes (e.g., "6401")
- Geographic coordinates

### Interpreting Results

1. Select "✨ Carbon Sequestration Potential" from the layer dropdown
2. Navigate to your area of interest
3. Check the colour scale in the legend:
   - **Red/Orange**: Low potential (1.0-1.6)
   - **Yellow/Light Green**: Medium potential (1.7-2.3)
   - **Green/Dark Green**: High potential (2.4-3.0)
4. View individual soil properties to understand which factors drive the overall score

### Advanced Analysis

- **Compare neighbouring properties**: Pan across boundaries to assess spatial variation
- **Evaluate multiple layers**: Switch between properties to identify limiting factors
- **Check threshold information**: Review the scoring thresholds displayed for each layer
- **Cross-reference baseline**: View "Organic Carbon" layer to understand current carbon stocks

## Data Source

### Soil and Landscape Grid of Australia (SLGA)

**Provider**: CSIRO  
**Coverage**: Continental Australia (3 arc second resolution, ~90m pixels)  
**Depth Intervals**: 0-5cm, 5-15cm, 15-30cm, 30-60cm, 60-100cm, 100-200cm  
**Update Frequency**: Periodically updated by CSIRO  

This application uses the 0-5cm depth layer for most attributes, representing the topsoil zone most responsive to management practices.

### Citation

Viscarra Rossel, R.A., Chen, C., Grundy, M.J., Searle, R., Clifford, D., Odgers, N.P., Holmes, K., Griffin, T., Liddicoat, C., and Kidd, D. (2014): Soil and Landscape Grid National Soil Attribute Maps - Soil Attribute Release 1. v2. CSIRO. Data Collection. https://doi.org/10.4225/08/546EE212B0048

**Access**: Available through Google Earth Engine Data Catalogue  
**Licence**: Creative Commons Attribution 4.0 (CC BY 4.0)  
**Dataset ID**: `CSIRO/SLGA`

## Important Limitations

### 1. Screening Tool Only
This application provides **preliminary assessment** based on soil properties alone. It does not replace:
- Detailed soil sampling and laboratory analysis
- Professional agronomic advice
- Carbon Farming Initiative eligibility assessments
- Financial feasibility studies

### 2. Simplified Scoring
The scoring system uses threshold-based categories that may not capture:
- Soil biological factors (microbial biomass, fungal networks)
- Climate variables (rainfall, temperature, evapotranspiration)
- Management history (cultivation, grazing intensity, fertiliser use)
- Vegetation type and productivity
- Topographic influences (slope, aspect, erosion risk)

### 3. Data Resolution
SLGA data is modelled at ~90m resolution with prediction uncertainty that varies spatially. Actual soil properties may differ from mapped values, particularly in:
- Areas with high spatial variability
- Regions with limited source data
- Recently disturbed or modified landscapes

### 4. Temporal Considerations
- SLGA represents soil conditions circa 2000-2013
- Recent land use changes not reflected in the data
- Does not account for future climate scenarios
- Carbon sequestration is a dynamic process requiring long-term monitoring

### 5. Regulatory Compliance
This tool does **not** assess eligibility for:
- Australian Carbon Credit Unit (ACCU) scheme
- Emissions Reduction Fund projects
- State-based carbon incentive programmes
- Carbon credit verification protocols

## Next Steps for Soil Carbon Projects

If this assessment indicates medium-to-high potential for your property:

### 1. Desktop Assessment
- Review historical land use and management practices
- Check land title and legal rights for carbon project duration
- Assess current carbon stock using SLGA "Organic Carbon" layer
- Identify potential management changes (e.g., rotational grazing, no-till cropping)

### 2. Professional Consultation
Engage with:
- Accredited carbon project developers
- Agricultural consultants with soil carbon expertise
- Clean Energy Regulator-approved verifiers
- Financial advisors for cost-benefit analysis

### 3. Field Validation
Conduct on-ground assessment:
- Soil sampling following approved protocols
- Laboratory analysis (bulk density, organic carbon, texture)
- Mapping of carbon estimation areas (CEAs)
- Baseline establishment for monitoring

### 4. Regulatory Requirements
Review Clean Energy Regulator requirements:
- Eligible management activities (ERF Soil Carbon Method 2021)
- Minimum project area and duration
- Reporting and verification obligations
- Additionality and permanence requirements

**Resources:**
- Clean Energy Regulator: https://www.cleanenergyregulator.gov.au/
- Carbon Farming Guide: https://carbonfarming.org.au/
- CSIRO Soil Carbon Research: https://www.csiro.au/

## Technical Specifications

**Platform**: Google Earth Engine  
**Language**: JavaScript  
**Dependencies**: Google Earth Engine API, CSIRO/SLGA dataset  
**Browser Requirements**: Modern web browser (Chrome, Firefox, Safari, Edge)  
**Account**: Free Google Earth Engine account required  

### Code Structure
