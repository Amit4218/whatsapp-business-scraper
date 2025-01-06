// Add an event listener to the button
document.getElementById("btn").addEventListener("click", () => {
  // console.log("Button clicked!");

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
            return node ? node.textContent : "";
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

          // Get the text from the elements
          const phoneText = getTextByXPath(phoneNO);
          const nameText = getTextByXPath(name);
          const productTypeText = getTextByXPath(productType);
          const addressText = getTextByXPath(address);
          const emailText = getTextByXPath(email);
          const locationText = getTextByXPath(location);
          const link1Text = getTextByXPath(link1);
          const link2Text = getTextByXPath(link2);
          const phoneNo2Text = getTextByXPath(phoneNo2);
          const location2Text = getTextByXPath(location2);

          // console.log({
          //   phone: phoneText,
          //   name: nameText,
          //   productType: productTypeText,
          //   address: addressText,
          //   email: emailText,
          //   location: locationText,
          //   link1: link1Text,
          //   link2: link2Text,
          //   phoneNo2: phoneNo2Text,
          //   location2: location2Text,
          // });

          // Return all the results as an object
          return {
            phone: phoneText,
            name: nameText,
            productType: productTypeText,
            address: addressText,
            email: emailText,
            location: locationText,
            link1: link1Text,
            phoneNo2: phoneNo2Text,
            location2: location2Text,
          };
        },
      },
      (results) => {
        // Extract the returned data
        const data = results[0].result;

        // Convert data to CSV format
        const csvContent = `Phone,Phone_2,Name,Product Type,address,Email,Location,Location_2,Link1, Link2 \n${data.phone},${data.phoneNo2},${data.name},${data.productType},${data.address},${data.email}, ${data.location},${data.location2} ,${data.link1}, ${data.link2}`;

        // Create a Blob and trigger the download
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        // Create a temporary download link
        const a = document.createElement("a");
        a.href = url;
        a.download = "scraped_data.csv"; // Filename for the downloaded file
        a.click();

        // Clean up
        URL.revokeObjectURL(url);
      }
    );
  });
});
