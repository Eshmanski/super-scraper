const PuppeteerConfigurator = require('../PuppeteerConfigurator/PuppeteerConfigurator');

async function start() {
    const pc = new PuppeteerConfigurator({ args: ["--no-sandbox"], headless: false });

    
    const yPage = await pc.getYandexPage(browserId);

    await yPage.config.removeInterface().setZoom(20).setLayers(['map:ground']);
    
    await new Promise((resolve, reject) => {
        setTimeout(resolve, 10000);
    });

    pc.closeAllBrowsers();
}

module.exports = start;