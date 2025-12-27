# Year-End Animal Collage Generator

- [Year-End Animal Collage Generator](#year-end-animal-collage-generator)
  - [Summary](#summary)
  - [Overview](#overview)
  - [Requirements](#requirements)
  - [How It Works](#how-it-works)
  - [Usage](#usage)
    - [Running the Script](#running-the-script)
    - [Template Requirements](#template-requirements)
  - [Configuration](#configuration)
  - [Output](#output)
  - [Features](#features)
  - [License](#license)

## Summary

A Photoshop script (`filler.jsx`) that automates the creation of multi-image collages for Lucky Dog Animal Rescue's year-end campaigns.

## Overview

This script takes a folder of animal photos and automatically places them into circular masks on a PSD template, generating batch collages perfect for social media and marketing materials.

## Requirements

- **Adobe Photoshop 2024** (v27.3.0 or compatible)
- A PSD template file with layers named exactly `mask` (one for each position where an animal photo should appear)
- A folder containing animal images (JPG, PNG, TIF, or PSD formats)

## How It Works

1. **Template Setup**: The script identifies all layers named exactly `mask` in your template
2. **Batch Processing**: Groups animal images by the number of masks (e.g., 5 masks = groups of 5 images)
3. **Smart Placement**: Each image is:
   - Placed as a smart object
   - Scaled to fit within its mask bounds (80% safety margin)
   - Centered within the circular mask
   - Clipped to the mask layer
4. **Output**: Saves each collage as `Animal_Set_1.png`, `Animal_Set_2.png`, etc.

## Usage

### Running the Script

1. Open Adobe Photoshop
2. Go to **File** → **Scripts** → **Browse**
3. Select `filler.jsx`
4. Choose:
   - Input folder (containing animal photos)
   - Template PSD file (with `mask` layers)
   - Output folder (where collages will be saved)

### Template Requirements

Your PSD template must have:
- One or more layers named exactly `mask` (no suffix or prefix)
- Each mask layer should be a circular or shaped layer where you want an animal photo
- Masks should be arranged in your desired collage layout

## Configuration

The script includes commented-out hard-coded paths that can be uncommented for faster workflow:

```javascript
var inputFolder = "/Users/username/Desktop/testpics";
var templateFile = "/Users/username/Desktop/template.psd";
var outputFolder = "/Users/username/Desktop/output";
```

## Output

- **Format**: PNG with compression level 9
- **Naming**: `Animal_Set_1.png`, `Animal_Set_2.png`, etc.
- **Behavior**: If you have 15 images and 5 masks, you'll get 3 collages

## Features

- ✅ Automatic mask detection
- ✅ Smart image fitting (contains images within bounds, no overflow)
- ✅ Automatic centering
- ✅ Batch processing
- ✅ Progress notification when complete

## License

Created for Lucky Dog Animal Rescue's year-end collage campaigns.
