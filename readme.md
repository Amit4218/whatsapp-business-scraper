# Chrome Extension: Test

## Overview
The "Scape" Chrome Extension is designed to scrape specific business data from whatsapp web  and save it in CSV format. This lightweight extension provides a simple user interface, where a button click initiates the scraping process. The extracted data includes details such as phone numbers, names, product types, addresses, emails, and links.

---

## Features
- **Scraping Specific Data**: Extracts data from predefined XPath locations on a webpage.
- **CSV Download**: Converts the extracted data into CSV format for easy storage and use.
- **Simple Interface**: Includes a popup with a single button to trigger the scraping process.

---

## Files and Structure
### 1. `manifest.json`
The manifest file defines the extension's metadata and permissions:
- **Manifest Version**: 3
- **Name**: Scrape
- **Version**: 1.0.0
- **Description**: Scraping data from whatsapp business
- **Permissions**: Requires `activeTab` and `scripting` permissions.
- **Action**: Specifies the popup (`index.html`) and icons for different resolutions.

### 2. `index.html`
The popup's user interface:
- A minimal design with a single button (`Click me to scrape`) styled with embedded CSS.
- JavaScript (`popup.js`) included to handle button functionality.

### 3. `popup.js`
The core logic of the extension:
- Attaches a click event listener to the button.
- Uses the Chrome Scripting API to execute a function in the active tab.
- Extracts data using XPath and converts it into a CSV format.
- Triggers a file download for the scraped data.

---

## How to Use
1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer Mode** in the top right corner.
4. Click on **Load unpacked** and select the folder containing the extension files.
5. The extension icon will appear in your Chrome toolbar.
6. Navigate to a webpage with the target data.
7. Click the extension icon and then the `Click me to scrape` button.
8. The scraped data will automatically download as a CSV file.

---

## Permissions
- **`activeTab`**: Allows the extension to interact with the content of the active tab.
- **`scripting`**: Executes scripts on the currently active tab to extract data.

---

## Dependencies
- **Chrome Scripting API**: Used to run scripts in the context of the active tab.
- **JavaScript**: Handles data extraction, processing, and file download.

---

## Customization
To adapt this extension for different use cases:
1. Modify the XPath selectors in `popup.js` to match the elements on your target webpage.
2. Update the `manifest.json` file if additional permissions are required.

---

## License
This project is licensed under the MIT License. Feel free to use and modify it for personal or commercial purposes.

