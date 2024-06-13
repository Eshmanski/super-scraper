const PuppeteerConfigurator = require('../PuppeteerConfigurator/PuppeteerConfigurator');

const PATH = 'C:/Users/Kuraj/Desktop/screens/'

async function start() {
    const pc = new PuppeteerConfigurator({ args: ["--no-sandbox"], headless: false });

    const browserId = await pc.createBrowser();
    
    const yPage = await pc.getYandexPage(browserId, { size: '4000X4000' });

    await yPage.config.removeInterface().setZoom(20).setLayers(['map:ground']);

    const data = await yPage.getScreenshot([37.703335, 55.554949], PATH);

    console.log(data);
    
    await new Promise((resolve, reject) => {
        setTimeout(resolve, 10000);
    });

    pc.closeAllBrowsers();
}

module.exports = start;