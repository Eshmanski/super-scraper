const sleep = require('../utils/sleep');
const { KnownDevices } = require('puppeteer')
const YandexConfigurator = require('./Configurator');
const YandexScrapper  = require('./Scraper');
const ScraperError = require('../../ScraperError/ScraperError');

class YandexPage {
    pc;
    id;
    page;
    config;
    scrapper;

    removedInterface = false;

    options;

    constructor(page, id, pc, options){
        this.pc = pc;
        this.id = id;
        this.page = page;
        this.options  = options;
        
        this.config = new YandexConfigurator(this);
        this.scrapper  = new YandexScrapper(page);
    };

    static async init(id, pc, { size = [1000, 1000], mobile = true } = {}) {
        const browser  =  await pc.getBrowser(id); 
    
        if (typeof size === 'string') size = size.split('X').map(Number);

        const page = await browser.newPage();

        if (mobile) await page.emulate(KnownDevices['iPhone 6']);
        await page.setViewport({ width: size[0], height: size[1] });

        const context = browser.defaultBrowserContext();

        await context.overridePermissions(`https://yandex.ru/maps/`, ["geolocation"]);
        await page.setGeolocation({ latitude: 90, longitude: 20 });
        await page.goto(`https://yandex.ru/maps/`);

        await sleep(5000);

        await page.waitForSelector("input.input__control");

        return new YandexPage(page, id, pc, { size, mobile });
    };

    async getClickData(coordinate) {
        try {
            if (isNaN(coordinate[0]) || isNaN(coordinate[1])) throw new ScraperError('InvalidCoordinate', `Invalid coordinate: ${coordinate}`);

            await this.scrapper.moveToPoint(coordinate, this.options.zoom);
    
            const data = await this.scrapper.getFetchData(coordinate);
            
            await this.scrapper.checkData(data, coordinate);
    
            const formattedData = this.scrapper.formateData(data, coordinate);
    
            return formattedData;
        } catch (error) {
            throw error; 
        } finally {
            this.pc.closeBrowser(this.id);
        };
    };

    async getScreenshot(coordinate, pathToDir)  {
        try {
            if (isNaN(coordinate[0]) || isNaN(coordinate[1])) throw new ScraperError('InvalidCoordinate', `Invalid coordinate: ${coordinate}`);

            await this.scrapper.moveToPoint(coordinate, this.options.zoom);
    
            const data = await this.scrapper.getScreenshot(coordinate, pathToDir);
    
            return data;
        } catch (error) {
            throw error;
        } finally {
            this.pc.closeBrowser(this.id);
        };
    };
}

module.exports = YandexPage;