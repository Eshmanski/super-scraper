class ScraperError {
    EC = 'scraper';
    type;
    message;
    error;

    constructor(type, message) {
        this.type = type;
        this.message  = message;
        this.error = new Error(message);
    }
}