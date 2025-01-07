// Add an event listener to the button
document.getElementById("btn").addEventListener("click", () => {
  // Query the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];

    // Execute the script in the current tab
    chrome.scripting.executeScript(
      {
        target: { tabId: activeTab.id },
        func: () => {
          // Function to extract text by XPath
          function getTextByXPath(xpath) {
            const node = document.evaluate(
              xpath,
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            ).singleNodeValue;
            return node ? node.textContent.trim() : "N/A";
          }

          // Define the XPaths
          const phoneNO =
            "/html/body/div[1]/div/div/div[3]/div/div[5]/span/div/span/div/div/section/div[1]/div[3]/div[1]/div/div/span";
          const name =
            "/html/body/div[1]/div/div/div[3]/div/div[5]/span/div/span/div/div/section/div[1]/div[3]/div[2]";
          const productType =
            "/html/body/div[1]/div/div/div[3]/div/div[5]/span/div/span/div/div/section/div[4]/div[1]/div/span/span";
          const address =
            "/html/body/div[1]/div/div/div[3]/div/div[5]/span/div/span/div/div/section/div[4]/div[3]/div/span";
          const email =
            "/html/body/div[1]/div/div/div[3]/div/div[5]/span/div/span/div/div/section/div[4]/div[5]/div/a";
          const location =
            "/html/body/div[1]/div/div/div[3]/div/div[5]/span/div/span/div/div/section/div[3]/div[3]/div/span";
          const link1 =
            "/html/body/div[1]/div/div/div[3]/div/div[5]/span/div/span/div/div/section/div[3]/div[4]/div/a";
          const link2 =
            "/html/body/div[1]/div/div/div[3]/div/div[5]/span/div/span/div/div/section/div[3]/div[5]/div/div[1]/a";
          const phoneNo2 =
            "/html/body/div[1]/div/div/div[3]/div/div[5]/span/div/span/div/div/section/div[8]/div[3]/div/div/span/span";
          const location2 =
            "/html/body/div[1]/div/div/div[3]/div/div[5]/span/div/span/div/div/section/div[3]/div[1]/div/span";

          // Extract data from the page
          return {
            phone: getTextByXPath(phoneNO),
            name: getTextByXPath(name),
            productType: getTextByXPath(productType),
            address: getTextByXPath(address),
            email: getTextByXPath(email),
            location: getTextByXPath(location),
            link1: getTextByXPath(link1),
            link2: getTextByXPath(link2),
            phoneNo2: getTextByXPath(phoneNo2),
            location2: getTextByXPath(location2),
          };
        },
      },
      (results) => {
        if (!results || !results[0] || !results[0].result) {
          console.error("No data returned from content script.");
          return;
        }

        const data = results[0].result;

        // Convert data to JSON string
        const content = JSON.stringify(data, null, 2);

        // Create a Blob and trigger the download
        const blob = new Blob([content], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        // Create a temporary download link
        const a = document.createElement("a");
        a.href = url;
        a.download = "scraped_data.txt"; // Use .json for JSON file
        a.click();

        // Clean up
        URL.revokeObjectURL(url);
      }
    );
  });
});

// for product image, product name and product price

document.getElementById("btn2").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];

    chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      func: () => {
        // Define the getTextByXPath function
        function getTextByXPath(xpath) {
          const node = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;
          return node ? node.textContent.trim() : "N/A";
        }

        // Defining xpath for the scroll body
        let scrollBox =
          "/html/body/div[1]/div/div/div[3]/div/div[5]/span/div/span/div/div[2]";
        let body = document.evaluate(
          scrollBox,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;

        // Ensure the body element is scrollable
        if (body && body.scrollTop !== undefined) {
          // Return a Promise that resolves after scrolling
          function scroll() {
            return new Promise((resolve, reject) => {
              try {
                let scrollInterval = setInterval(() => {
                  body.scrollTop += 200;
                }, 100);

                setTimeout(() => {
                  clearInterval(scrollInterval);
                  resolve(); // Resolve after scrolling is done
                }, 15000); // Scroll for 15 seconds
              } catch (error) {
                reject("Can't scroll: " + error);
              }
            });
          }

          // Wait for scrolling to finish before scraping data
          scroll()
            .then(() => {
              // Scrape product data after scrolling
              const products = Array.from(
                document.querySelectorAll('div[tabindex="0"][role="button"]')
              ).map((item) => {
                const titleElement = item.querySelector("span[title]");
                const descriptionElement =
                  item.querySelector("div._ak8k ._ao3e");
                const imageElement = item.querySelector("div[style]");

                // Custom XPath to target the price
                const priceXPath =
                  './/span[contains(@class, "x1iyjqo2") and contains(text(), "₹")]';

                // Execute the XPath expression
                const priceElement = document.evaluate(
                  priceXPath,
                  item,
                  null,
                  XPathResult.FIRST_ORDERED_NODE_TYPE,
                  null
                ).singleNodeValue;

                const price = priceElement
                  ? priceElement.innerText.trim()
                  : "No price available";
                const title = titleElement
                  ? titleElement.getAttribute("title")
                  : "No title available";
                const description = descriptionElement
                  ? descriptionElement.innerText.trim()
                  : "No description available";
                const imageUrl = imageElement
                  ? (imageElement.style.backgroundImage.match(
                      /url\("(.+)"\)/
                    ) || [])[1]
                  : "No image available";

                return { title, description, price, imageUrl };
              });

              // Create a JSON file from the products data
              const jsonData = JSON.stringify(products, null, 2);
              const jsonFile = new Blob([jsonData], {
                type: "application/json",
              });
              const jsonFileURL = URL.createObjectURL(jsonFile);

              // Download the JSON data as a .txt file
              const downloadJson = document.createElement("a");
              downloadJson.href = jsonFileURL;
              downloadJson.download = "products_data.txt";
              downloadJson.click();
              URL.revokeObjectURL(jsonFileURL);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      },
    });
  });
});


