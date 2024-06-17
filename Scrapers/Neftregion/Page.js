const NeftregionScraper = require('./Scraper');
const ScraperError = require('../../ScraperError/ScraperError');
const sleep = require('../utils/sleep');
const { KnownDevices } = require('puppeteer')

class NeftregionPage {
    pc;
    id;
    browser;
    page;
    config = null;
    scrapper;


    constructor(page, id, pc, options){
        this.pc = pc;
        this.id = id;
        this.page = page;
        this.options  = options;
        
        this.scrapper  = new NeftregionScraper(page);
    };

    static async init(id, pc, { size = [1000, 1000], mobile = true } = {}) {
        const browser  =  await pc.getBrowser(id);

        if (typeof size === 'string') size = size.split('X').map(Number);

        const page = await browser.newPage();

        if (mobile) await page.emulate(KnownDevices['iPhone 6']);
        await page.setViewport({ width: size[0], height: size[1] });

        await page.goto(`https://neftregion.ru/`);

        await page.waitForSelector('#tableindex');

        return new NeftregionPage(page, id, pc, { size, mobile });
    };

    async getList() {
        return await this.scrapper.getListRegions();
    };

    async getRegionData({ text, href }) {
        try {
            await this.scrapper.gotoTable(href);
        
            const data = await this.scrapper.getTableInfo();
    
            for (const item  of  data)  {
                const companyInfo = await this.scrapper.getCompanyInfo(item.company.url);
    
                item.company = { ...item.company, ...companyInfo };
            }
    
            return data;
        } catch (error)  {
            throw error;
        } finally {
            this.pc.closeBrowser(this.id);
        };
    };
}

module.exports = NeftregionPage;