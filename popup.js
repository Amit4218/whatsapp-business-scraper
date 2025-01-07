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
        function getTextByXPath() {
          const node = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;
          return node ? node.textContent.trim() : "N/A";
        }

        // Get the scrollable container using XPath
        let scrollBody =
          "/html/body/div[1]/div/div/div[3]/div/div[5]/span/div/span/div/div[2]";
        let container = getTextByXPath(scrollBody)

        function dragScrollbarToBottomWithDynamicLoading() {
          if (!container) {
            console.error("Scrollable container not found.");
            return;
          }

          let lastScrollHeight = container.scrollHeight; // Track the scrollable height
          let noContentTimer = null; // Timer to detect end of content loading

          let scrollInterval = setInterval(() => {
            // Scroll down by 100 pixels
            container.scrollTop += 100;

            // Check if more content has loaded
            if (container.scrollHeight > lastScrollHeight) {
              // Update the last scroll height
              lastScrollHeight = container.scrollHeight;

              // Reset the timer since new content loaded
              clearTimeout(noContentTimer);
            }

            // If we reach the bottom and no new content is loaded, set a timer to stop scrolling
            if (
              container.scrollTop + container.clientHeight >=
              container.scrollHeight
            ) {
              if (!noContentTimer) {
                noContentTimer = setTimeout(() => {
                  console.log("No more content to load. Stopping scrolling.");
                  clearInterval(scrollInterval); // Stop scrolling
                }, 2000); // Wait 2 seconds to ensure all content is loaded
              }
            } else {
              // Clear the timer if scrolling continues
              clearTimeout(noContentTimer);
            }
          }, 100); // Scroll every 100 milliseconds
        }

        // Start the enhanced scrolling
        dragScrollbarToBottomWithDynamicLoading();
      },
    });
  });
});
