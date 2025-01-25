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

    chrome.scripting.executeScript(
      {
        target: { tabId: activeTab.id },
        files: ["scripts/jszip.min.js"], // Dynamically load JSZip
      },
      () => {
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          func: scrapeAndDownload,
        });
      }
    );
  });
});

function scrapeAndDownload() {
  // Define the scrolling and scraping logic
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

  const scrollBoxXPath =
    "/html/body/div[1]/div/div/div[3]/div/div[5]/span/div/span/div/div[2]";
  const body = document.evaluate(
    scrollBoxXPath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;

  if (body && body.scrollTop !== undefined) {
    const scroll = () =>
      new Promise((resolve) => {
        const scrollInterval = setInterval(() => {
          body.scrollTop += 200;
        }, 100);

        setTimeout(() => {
          clearInterval(scrollInterval);
          resolve();
        }, 15000); // Scroll for 15 seconds
      });

    scroll()
      .then(() => {
        const products = Array.from(
          document.querySelectorAll('div[tabindex="0"][role="button"]')
        ).map((item) => {
          const titleElement = item.querySelector("span[title]");
          const descriptionElement = item.querySelector("div._ak8k ._ao3e");
          const imageElement = item.querySelector("div[style]");

          const priceXPath =
            './/span[contains(@class, "x1iyjqo2") and contains(text(), "₹")]';
          const priceElement = document.evaluate(
            priceXPath,
            item,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;

          const title = titleElement
            ? titleElement.getAttribute("title")
            : "Na";
          const description = descriptionElement
            ? descriptionElement.innerText.trim()
            : "Na";
          const price = priceElement ? priceElement.innerText.trim() : 0;
          const imageUrl = imageElement
            ? (imageElement.style.backgroundImage.match(/url\("(.+)"\)/) ||
                [])[1]
            : "Na";

          const imageName = title;

          return { title, description, price, imageUrl, imageName };
        });

        const data = products.map((product) => ({
          title: product.title,
          description: product.description,
          price: product.price,
          imageName: product.imageName,
        }));

        const zip = new JSZip();
        const jsonData = JSON.stringify(data, null, 2);

        // Add JSON data to ZIP
        zip.file("0_products_data.txt", jsonData);

        // Download images and add to ZIP
        const imagePromises = products.map((product, index) => {
          if (product.imageUrl !== "Na") {
            return fetch(product.imageUrl)
              .then((response) => response.blob())
              .then((blob) => {
                const fileName = `${product.title}.png`;
                zip.file(fileName, blob);
              })
              .catch((error) =>
                console.error("Error downloading image:", error)
              );
          }
        });

        // Read the 0_products_data.txt file and filter out unwanted entries
        zip
          .file("0_products_data.txt")
          .async("string")
          .then((data) => {
            const products = JSON.parse(data);
            const filteredProducts = products.filter(
              (product) =>
                product.title !== "Na" ||
                product.description !== "Na" ||
                product.price !== 0 ||
                product.imageName !== "Na"
            );

            // Update the JSON data in the ZIP file
            const updatedJsonData = JSON.stringify(filteredProducts, null, 2);
            zip.file("0_products_data.txt", updatedJsonData);
          });

        // Generate ZIP after all images are downloaded
        Promise.all(imagePromises).then(() => {
          zip.generateAsync({ type: "blob" }).then((content) => {
            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(content);
            downloadLink.download = "data_and_images.zip";
            downloadLink.click();
          });
        });
      })
      .catch((error) => console.error("Error:", error));
  }
}
