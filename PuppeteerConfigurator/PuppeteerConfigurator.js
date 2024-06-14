const uniqid = require('uniqid');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const YandexPage = require('../Scrapers/Yandex/Page');
const NeftregionPage  = require('../Scrapers/Neftregion/Page');

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

    async getYandexPage(id, options = {})   {
        const browser  = id ? this.browsers.get(id) : this.createBrowser();

        const yPage = await YandexPage.init(browser, options);
        
        return yPage;
    };

    async getNeftregionPage(id, options  = {})  {
        const browser  = id ? this.browsers.get(id) : this.createBrowser();

        const nPage = await NeftregionPage.init(browser, options);

        return nPage;
    }

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
    };
}

module.exports = PuppeteerConfigurator;