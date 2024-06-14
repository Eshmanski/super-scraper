const EvaluateFuncs  = require('./EvaluateFuncs');
const sleep = require('../utils/sleep');
const { timeout } = require('puppeteer');

class NeftregionScraper {
    page;

    e = new EvaluateFuncs();

    constructor(page) {
        this.page = page;
    };

    clickOnRegionsBtn() {
        this.page.click('#buttonselregionnow');
    };

    async getListRegions() {
        const list = await this.page.evaluate(async () => {
            const linkList = document.querySelector('#regionsnow').querySelectorAll('li>a');
            const strList = [].map.apply(linkList, [(a) => { return { text: a.text, href: a.href }; }]);

            return strList;
        });

        return list;
    };

    async gotoTable(href) {
        await this.page.goto(href);

        await this.page.waitForSelector('#tableindex');

        return 1;
    }

    async getTableInfo() {
        const tableDOM = await this.page.evaluateHandle(this.e.getTableDOM);
        const fields = await this.page.evaluateHandle(this.e.getFields, tableDOM);
        const result = await this.page.evaluateHandle(this.e.parseData, tableDOM, fields);

        const data = await result.jsonValue()
        await result.dispose();
        
        return data;
    };

    async getCompanyInfo(url) {
        await this.page.goto(url, { timeout: 100000 });
        await this.page.waitForSelector('.content');

        let info = await this.page.evaluate(this.e.getCompanyInfo);

        if (!info.inn && !info.ogrn && !info.address)  info = await this.page.evaluate(this.e.getCompanyInfoComplexity);

        return info;
    } 
    
}

module.exports = NeftregionScraper;