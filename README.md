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

The UniversalTab Extension for SwarmUI allows you to add a new tab that is an iFrame. This tab can display any webpage you want, providing a flexible way to integrate external content into your SwarmUI interface.

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

* The deafult page is set to the Hartsy.AI homepage (This can be changed). You can also add as many new tabs as you would like.
* Customize the URL of the webpage and the tab name to display in the new tab.
* Currently, extra tabs do not persist across refreshes or restarts. Support for this feature will be added in the future.

> [!NOTE]
> Future Features:
> Add the ability to persist tabs across refreshes and restarts.
> Allow users Swarm instance to interact with the iFrame content.

## Prerequisites
----------------

Before you install the UniversalTab Extension, ensure that you have the following prerequisites:

* You need to have SwarmUI installed on your system. If you don't have it installed, you can download it from [here](https://github.com/mcmonkeyprojects/SwarmUI).
* HartsyCore is required for this extension to function. Make sure to install the HartsyCore extension first.

## Installation
--------------

To install the UniversalTab Extension, follow these steps:

1. Close your SwarmUI instance and navigate to the `SwarmUI/src/Extensions` directory.
2. Clone the UniversalTab repository there. Open cmd and `cd` to the directory above and run `git clone https://github.com/your-repo/SwarmUI-UniversalTab`.
3. Make sure you have run `update-windows.bat` or `update-linuxmac.sh` to recompile SwarmUI. This only needs to be done on first install.
4. Restart your SwarmUI instance and refresh your browser. You should now have a new tab under the "Utilities" tab called "UniversalTab".

## Usage
--------

1. When you open your SwarmUI instance, navigate to the "Utilities" tab.                                  nmmmmm``
2. Click on the "UniversalTab" sub-tab.
3. Click on the settings icon to open the tab settings.
4. To edit a tab: Enter the new name of the tab and teh URL of the webpage you want to display and click save.
5. To add a new tab: Click on the "Add New Tab" button and enter the name of the tab and the URL of the webpage you want to display.

## Configuration
----------------

The UniversalTab Extension does not require any configuration. Simply enter the URL of the webpage you want to display in the tab settings.

## Troubleshooting
-----------------

If you encounter any issues, check these common solutions before you open an issue on GitHub.

* Check the logs for any error messages or warnings.
* Ensure that the extension is properly installed and configured.
* If you still have issues, open an issue on GitHub or join the [Hartsy Discord Community](https://discord.gg/nWfCupjhbm).

## Changelog
------------

* Version 0.1: Initial beta release
* Version 0.2: Added the ability to add multiple tabs and the removal of HartsyCore dependency.

## License
----------

Hartsy Extensions including this one are licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Contributing
---------------

Contributions to the extension are welcome. Please ask before working on anything big. I may already be working on it.

Join the Discord server to ask questions or get help with the extension. You can also open an issue on GitHub if you encounter any bugs or have feature requests.

1. Fork the extension's repository on GitHub.
2. Make your changes and commit them to your fork.
3. Open a pull request and wait for a review.

## Acknowledgments
------------------

These extensions would not have been made without the existence of SwarmUI. I would like to thank the developer [mcmonkey](https://github.com/mcmonkey4eva) for being the GOAT he is.

Special thanks to the following people:

* The Hartsy dev team.  
* [Hartsy AI](https://hartsy.ai) for the daily inspiration. If you work hard, dreams can come true.
