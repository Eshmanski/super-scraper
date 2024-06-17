const uniqid = require('uniqid');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const YandexPage = require('../Scrapers/Yandex/Page');
const NeftregionPage  = require('../Scrapers/Neftregion/Page');
const path = require('path');
const fs  = require('fs');

puppeteer.use(StealthPlugin());

class PuppeteerConfigurator {
    tmpPath = path.resolve(__dirname, 'tmp');
    options;
    browsers = new Map();

    constructor(options = {}) {
        this.removeCacheAll();

        this.options = options;
    };

    getBrowser(id)  {
        return this.browsers.get(id);
    }

    async createBrowser(options = {}) {
        const id = uniqid();

        const browser = await puppeteer.launch(Object.assign({ userDataDir: path.resolve(this.tmpPath, `${id}`) }, options));

        this.browsers.set(id, browser);

        return id;
    };

    async getYandexPage(id, options = {})   {
        const browser  = id ? this.browsers.get(id) : this.createBrowser();

        const yPage = await YandexPage.init(id, this, options);
        
        return yPage;
    };

    async getNeftregionPage(id, options  = {})  {
        const browser  = id ? this.browsers.get(id) : this.createBrowser();

        const nPage = await NeftregionPage.init(id, this, options);

        return nPage;
    }

    async closeBrowser(id)  {
        const browser  = this.browsers.get(id);

        if(browser)  {
            await browser.close();
            this.browsers.delete(id);

            this.removeCache(id);
        }
    };

    async closeAllBrowsers()  {
        for(const browser of this.browsers.values())   {
            await browser.close();
        }

        this.browsers.clear();
        this.removeCacheAll();
    };

    removeCache(id) {
        if (fs.existsSync(this.tmpPath, id))  {
            fs.rmSync(path.resolve(this.tmpPath, `${id}`), { recursive: true });
        };
    };

    removeCacheAll()  {
        if (fs.existsSync(this.tmpPath))   {
            fs.rmSync(this.tmpPath,  { recursive: true  });
        }
    };
}

module.exports = PuppeteerConfigurator;