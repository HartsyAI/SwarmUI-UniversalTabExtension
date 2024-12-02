# SwarmUI UniversalTab Extension
===========================================================================

![HartsySwarm](https://github.com/HartsyAI/SwarmUI-HartsyCore/blob/main/Images/universal_tab.png?raw=true)

## Table of Contents
-----------------

1. [Introduction](#introduction)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Configuration](#configuration)
7. [Troubleshooting](#troubleshooting)
8. [Changelog](#changelog)
9. [License](#license)
10. [Contributing](#contributing)
11. [Acknowledgments](#acknowledgments)

## Introduction
---------------

The UniversalTab Extension for SwarmUI allows you to add new tabs that are iFrames. These tabs can display any webpage you want, providing a flexible way to integrate external content into your SwarmUI interface.

* Usage Example:
- Add your local LLM interface.
- Add SwarmUI documentation pages.
- Photopea for image editing.
- Huggingface or Hartsy.AI for model downloads and image uploads.
- Literally anything you want that supports iFrames.

> [!WARNING]
> Uninstall and remove HartsyCore Extension. It was removed to comply with the SwarmUI extension guidelines.
> Always back up your SwarmUI configuration before making changes.

## Features
------------

* Create multiple universal tabs with custom names and URLs
* Tabs persist across refreshes and restarts
* Settings panel for each tab to customize name and URL
* Add, edit, and delete tabs dynamically
* Default page is set to the Hartsy.AI homepage
* Automatic URL validation to ensure iFrame compatibility
* Safe tab deletion with automatic default tab creation if all tabs are removed

> [!NOTE]
> Future Features:
> - Allow users Swarm instance to interact with the iFrame content
> - Tab reordering functionality
> - Import/export tab configurations

## Prerequisites
----------------

Before you install the UniversalTab Extension, ensure that you have SwarmUI installed on your system. If you don't have it installed, you can download it from [here](https://github.com/mcmonkeyprojects/SwarmUI).

## Installation
--------------

### Preferred Method (Via SwarmUI)

1. Open your SwarmUI instance
2. Navigate to the Server → Extensions tab
3. Find "UniversalTab Extension" in the list
4. Click the Install button
5. Restart SwarmUI when prompted

### Manual Installation

If you prefer to install manually:

1. Close your SwarmUI instance and navigate to the `SwarmUI/src/Extensions` directory
2. Clone the UniversalTab repository: `git clone https://github.com/your-repo/SwarmUI-UniversalTab`
3. Run `update-windows.bat` or `update-linuxmac.sh` to recompile SwarmUI
4. Restart your SwarmUI instance and refresh your browser

## Usage
--------

1. Navigate to the "Utilities" tab in SwarmUI
2. Click on the "UniversalTab" sub-tab
3. Use the settings icon (⚙️) to:
   - Edit tab name and URL
   - Add new tabs
   - Delete tabs
4. Changes are automatically saved and will persist across sessions

## Configuration
----------------

The UniversalTab Extension saves its configuration automatically. No manual configuration is required. Your tabs and their settings will be preserved across sessions.

## Troubleshooting
-----------------

If you encounter any issues, check these common solutions:

* Check the logs for any error messages or warnings
* Ensure that the webpage you're trying to load supports iFrames
* If a tab doesn't load, try using the settings panel to verify the URL
* Make sure you have the necessary permissions to access the URLs
* If you still have issues, open an issue on GitHub or join the [Hartsy Discord Community](https://discord.gg/nWfCupjhbm)

## Changelog
------------

* Version 0.1: Initial beta release
* Version 0.2: Added the ability to add multiple tabs
* Version 0.3: Added tab persistence, settings panel improvements, and URL validation

## License
----------

Hartsy Extensions including this one are licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Contributing
--------------

We welcome contributions! Please feel free to submit a Pull Request.

## Acknowledgments
------------------

These extensions would not have been made without the existence of SwarmUI. I would like to thank the developer [mcmonkey](https://github.com/mcmonkey4eva) for being the GOAT he is.

Special thanks to the following people:

* The Hartsy dev team.  
* [Hartsy AI](https://hartsy.ai) for the daily inspiration. If you work hard, dreams can come true.
