const uniqid = require('uniqid');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

class PuppeteerConfigurator {
    options;
    browsers = new Map();

    constructor(options = {}) {
        this.options = options;
    };

    async createBrowser(options = {}) {
        const id = uniqid();

        const browser = await puppeteer.launch(Object.assign(this.options, options));

        this.browsers.set(id, browser);

        return id;
    };

    closeBrowser(id)  {
        const browser  = this.browsers.get(id);

        if(browser)  {
            browser.close();
            this.browsers.delete(id);
        }
    };

    closeAllBrowsers()  {
        for(const browser of this.browsers.values())   {
            browser.close();
        }

        this.browsers.clear();
    }
}

module.exports = PuppeteerConfigurator;