const NeftregionScraper = require('./Scraper');
const ScraperError = require('../../ScraperError/ScraperError');
const sleep = require('../utils/sleep');
const { KnownDevices } = require('puppeteer')

class NeftregionPage {
    browser;
    page;
    config = null;
    scrapper;


    constructor(page, browser, options){
        this.browser= browser;
        this.page = page;
        this.options  = options;
        

        this.scrapper  = new NeftregionScraper(page);
    };

    static async init(browser, { size = [1000, 1000], mobile = true } = {}) {
        if (typeof size === 'string') size = size.split('X').map(Number);

        const page = await browser.newPage();

        if (mobile) await page.emulate(KnownDevices['iPhone 6']);
        await page.setViewport({ width: size[0], height: size[1] });

        await page.goto(`https://neftregion.ru/`);

        await page.waitForSelector('#tableindex');

        return new NeftregionPage(page, browser, { size, mobile });
    };

    async getList() {
        return await this.scrapper.getListRegions();
    };

    async getRegionData({ text, href }) {
        await this.scrapper.gotoTable(href);
        
        const data = await this.scrapper.getTableInfo();

        for (const item  of  data)  {
            const companyInfo = await this.scrapper.getCompanyInfo(item.company.url);

            item.company = { ...item.company, ...companyInfo };
        }

        return data;
    };
}

module.exports = NeftregionPage;