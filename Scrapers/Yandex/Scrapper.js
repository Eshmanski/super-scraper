const path = require('path');
const ScraperError = require('../../ScraperError/ScraperError');

class YandexScraper {
    page;

    constructor(page) {
        this.page = page;
    }

    async getFetchData(coordinate) {
        let resListener = null;

        try {
            const data = await new Promise(async (resolve, reject) => {
                resListener = async (res) => {
                    if (res.url().includes('https://yandex.ru/maps/api/search') || res.url().includes('https://yandex.ru/maps/api/masstransit/getStopInfo')) {

                        const data = (await res.json()).data;

                        resolve(data);
                    }
                }

                this.page.on('response', resListener);

                await this.page.click('.ymaps3x0--map');

                setTimeout(async () => {
                    reject(``)
                }, 50000);
            });

            return data;
        } catch (err) {
            throw new ScraperError('TimeOut', `Timeout exceeded while waiting for event, coordinates: ${coordinate}`);
        } finally {
            if (resListener !== null) this.page.off('response', resListener);
        }
    };

    async moveToPoint(coordinate, zoom) {
        await this.page.evaluate(async (coordinate, zoom) => {
            await new Promise((resolve) => {
                const fn = () => {
                    this.yandex_map._mainEngine.engine._eventListenersHash['tilesReady'].delete(fn);
                    resolve()
                }

                this.yandex_map._mainEngine.engine.group().on('tilesReady', fn);

                if (zoom) this.yandex_map.setZoom(zoom);
                this.yandex_map.setCenter(coordinate);

                setTimeout(() => {
                    this.yandex_map._mainEngine.engine._eventListenersHash['tilesReady'].delete(fn);
                    resolve()
                }, 5000);
            });

            return 1;
        }, coordinate, zoom);
    };

    async checkData(data, coordinate) {
        if (!data) throw new ScraperError('NonData', `No data, coordinate: ${coordinate}`);

        if (!data.exactResult) {
            if (data.items && data.items.length > 0 && data.items[0].type === 'business') throw new ScraperError('BusinessIcon', `Click on Business. coordinate: ${coordinate}`);
            else throw new ScraperError('NonData', `Property "exactResult" is\`n exist in "data" object.  type: ${!data.items || data.items.length === 0 ? 'none' : data.items[0].type} coordinate: ${coordinate}`);
        }

        if (data.exactResult.kind !== 'house') throw new ScraperError('IncorrectKind', `Kind of object click is\`n house. coordinate: ${coordinate} | kind: ${data.exactResult.kind}`);

        if (!data.exactResult.displayGeometry?.geometries) throw new ScraperError('NonGeom', `Don\`t have geometry coordinate: ${coordinate}`);
    };

    async getScreenshot(coordinate, pathToDir) {
        const bBox = this.page.evaluate(async => this.yandex_map.bounds);

        const nameFile = `ynxd-map-screenshot-${coordinate[1] + '-' + coordinate[0]}.png`;

        await this.page.screenshot({ path: path.resolve(__dirname, pathToDir, nameFile) });

        return {
            image: nameFile,
            bbox: bBox,
        };
    }

    formateData(data, coordinate) {
        const yandexData = {
            locality: data.exactResult.compositeAddress.locality || null,
            street: data.exactResult.compositeAddress.street || null,
            house: data.exactResult.compositeAddress.house || null,
            postalCode: data.exactResult.postalCode || null,
            address: data.exactResult.address || null,
            yandexId: data.exactResult.id || null,
            geom: this.formateGeom(data.exactResult.displayGeometry) || null,
            clickPoint: coordinate,
        };

        return yandexData;
    }

    formateGeom(displayGeometry) {
        if (!displayGeometry) return undefined

        const newGeom = {
            type: 'MultiPolygon',
            coordinates: []
        };

        const geoCoordinates = displayGeometry.geometries.map(polygon => polygon.coordinates);

        newGeom.coordinates = geoCoordinates.map((polygonCoordinates) => {
            return polygonCoordinates.map(polygon => {
                let first_coordinate = polygon[0];
                let p = [[]];

                p[0] = polygon.map((c) => c);
                p[0].push(first_coordinate);

                return p;
            })[0]
        });

        return newGeom;
    }
}

module.exports = YandexScraper;