class ScraperError {
    EC = 'scraper';
    type;
    error;

    constructor(type, error) {
        this.type = type;
        this.error = error;
    }
}