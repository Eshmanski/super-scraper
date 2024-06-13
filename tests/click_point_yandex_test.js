const PuppeteerConfigurator = require('../PuppeteerConfigurator/PuppeteerConfigurator');

async function start() {
    const pc = new PuppeteerConfigurator({ args: ["--no-sandbox"], headless: false });

    const browserId = await pc.createBrowser();
    
    const yPage = await pc.getYandexPage(browserId);

    await yPage.config.removeInterface().setZoom(20).setLayers(['map:ground']);

    const data = await yPage.getClickData([37.703335, 55.554949]).catch(err => console.log(err));
    
    console.log(data);

    await new Promise((resolve, reject) => {
        setTimeout(resolve, 10000);
    });

    pc.closeAllBrowsers();
}

module.exports = start;