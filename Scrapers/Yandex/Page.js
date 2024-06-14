const sleep = require('../utils/sleep');
const { KnownDevices } = require('puppeteer')
const YandexConfigurator = require('./Configurator');
const YandexScrapper  = require('./Scraper');
const ScraperError = require('../../ScraperError/ScraperError');

class YandexPage {
    browser;
    page;
    config;
    scrapper;

    removedInterface = false;

    options;

    constructor(page, browser, options){
        this.browser= browser;
        this.page = page;
        this.options  = options;
        
        this.config = new YandexConfigurator(this);
        this.scrapper  = new YandexScrapper(page);
    };

    static async init(browser, { size = [1000, 1000], mobile = true } = {}) {
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

        return new YandexPage(page, browser, { size, mobile });
    };

    async getClickData(coordinate) {
        if (isNaN(coordinate[0]) || isNaN(coordinate[1])) throw new ScraperError('InvalidCoordinate', `Invalid coordinate: ${coordinate}`);

        await this.scrapper.moveToPoint(coordinate, this.options.zoom);

        const data = await this.scrapper.getFetchData(coordinate);
        
        await this.scrapper.checkData(data, coordinate);

        const formattedData = this.scrapper.formateData(data, coordinate);

        return formattedData;
    };

    async getScreenshot(coordinate, pathToDir)  {
        if (isNaN(coordinate[0]) || isNaN(coordinate[1])) throw new ScraperError('InvalidCoordinate', `Invalid coordinate: ${coordinate}`);

        await this.scrapper.moveToPoint(coordinate, this.options.zoom);

        const data = await this.scrapper.getScreenshot(coordinate, pathToDir);

        return data;
    };
}

module.exports = YandexPage;