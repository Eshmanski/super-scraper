const PuppeteerConfigurator = require('../PuppeteerConfigurator/PuppeteerConfigurator');
const fs = require('fs');

async function start() {
    const pc = new PuppeteerConfigurator({ args: ["--no-sandbox"], headless: false });

    const browserId = await pc.createBrowser();
    
    const nPage = await pc.getNeftregionPage(browserId);

    const list = await nPage.getList();

    for (let i = 50; i < list.length; i++) {

        console.log(i, list[i]);

        const data = await nPage.getRegionData(list[i]);

        fs.writeFileSync(`C:/Users/Kuraj/Desktop/files/${list[i].text}.json`, JSON.stringify(data));
    }

    await new Promise((resolve, reject) => {
        setTimeout(resolve, 50000);
    });

    pc.closeAllBrowsers();
}

module.exports = start;