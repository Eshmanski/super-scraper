const PuppeteerConfigurator = require('../PuppeteerConfigurator/PuppeteerConfigurator');

async function start() {
    const pc = new PuppeteerConfigurator({ args: ["--no-sandbox"], headless: false });

    const browser = await pc.createBrowser();

    await new Promise((resolve, reject) => {
        setTimeout(resolve, 1000);
    });

    pc.closeAllBrowsers();
}

module.exports = start;