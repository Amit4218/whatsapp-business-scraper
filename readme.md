Chrome Extension: Scrape

Overview

The "Scrape" Chrome Extension is designed to extract specific business data from WhatsApp Business and save it in JSON or ZIP format. This lightweight extension offers a user-friendly interface with buttons to initiate scraping processes for text data and product details, including images.

Features

General Features

Data Extraction: Extracts various types of business data including phone numbers, names, product types, addresses, emails, and links.

Download Options:

Downloads text data in JSON format.

Downloads product data (including images) as a ZIP file.

Simple Interface: Two distinct buttons in the popup for different scraping functionalities.

Specific Functionalities

Scrape Business Data:

Extracts data from predefined XPath locations on the webpage.

Downloads the extracted data as a JSON file.

Scrape Product Data:

Scrolls through a specific section of the webpage to load all items.

Extracts product titles, descriptions, prices, and image URLs.

Downloads a ZIP file containing:

A JSON file with product data.

Images associated with the products.

Files and Structure

1. manifest.json

Defines the extension’s metadata and permissions:

Manifest Version: 3

Name: Scrape

Version: 1.0.0

Description: Scraping data from WhatsApp Business

Permissions: Requires activeTab, scripting, and storage permissions.

Action: Specifies the popup (index.html) and icons for different resolutions.

Web Accessible Resources: Includes jszip.min.js for handling ZIP file creation.

2. index.html

Defines the popup’s user interface:

Two buttons to trigger scraping functions:

Button 1: Initiates scraping of business data.

Button 2: Initiates scraping of product data.

Minimal design with embedded CSS for styling.

3. popup.js

Contains the core logic of the extension:

Button 1: Scrape Business Data

Attaches a click event listener to the button.

Uses the Chrome Scripting API to execute scripts in the active tab.

Extracts data using XPath and processes it into JSON format.

Triggers a file download for the scraped data as a JSON file.

Button 2: Scrape Product Data

Loads the jszip.min.js library dynamically.

Scrolls through the webpage section containing product data.

Extracts product details (title, description, price, image URLs).

Creates a ZIP file containing:

JSON data for the products.

Downloaded images.

Triggers a download of the ZIP file.

4. scripts/jszip.min.js

A third-party library used to create ZIP files dynamically.

5. README.md


How to Use

Installation

Clone or download this repository.

Open Chrome and navigate to chrome://extensions/.

Enable Developer Mode in the top right corner.

Click on Load unpacked and select the folder containing the extension files.

The extension icon will appear in your Chrome toolbar.

Usage

Navigate to a webpage on WhatsApp Business containing the target data.

Click the extension icon to open the popup.

Use one of the following buttons:

Button 1: Scrapes business data and downloads it as a JSON file.

Button 2: Scrapes product data and downloads it as a ZIP file containing JSON data and images.

Permissions

activeTab: Allows interaction with the content of the active tab.

scripting: Executes scripts on the currently active tab to extract data.

storage: Manages temporary storage if needed.

Dependencies

Chrome Scripting API: Used to run scripts in the context of the active tab.

JSZip: Dynamically creates ZIP files containing JSON data and images.

Customization

To adapt this extension for different use cases:

Modify the XPath selectors in popup.js to match the elements on your target webpage.

Update the manifest.json file if additional permissions are required.

License

This project is licensed under the MIT License. Feel free to use and modify it for personal or commercial purposes.

