class YandexConfigurator {
    object;
    task;

    constructor(object) {
        this.object = object;
        this.task = Promise.resolve(object);
    }

    doTask(cb) { return this.task = this.task.then(cb); };
 
    then(cb) { cb(this.task); };

    removeInterface() {
        this.doTask(async () => {
            await this.object.page.evaluate(() => {
                document.querySelector('.app').remove();
                document.querySelector('._noprint')?.remove();

                document.querySelector('.map-container').style.cssText = 'top: 0px; left: 0px; right: 0px; bottom: 0px; z-index: 998';
                document.querySelector('.body').style.cssText = 'top: 0px; left: 0px; right: 0px; bottom: 0px; z-index: 998';

                this.yandex_map._margin = [0, 0, 0, 0];
                this.yandex_map.resize();
            });

            this.object.removedInterface = true;

            return this.object;
        });

        return this;
    };

    setZoom(zoom)  {
        this.doTask(async  ()  =>  {
            await this.object.page.evaluate((zoom) => {
                this.yandex_map.setZoom(zoom);
            }, zoom);
            
            this.object.options.zoom = zoom;

            return this.object;
        });

        return this;
    };

    setLayers(layers) {
        this.doTask(async ()   =>   {
            await this.object.page.evaluate((layers) => {
                if (layers) this.yandex_map.setLayers({ mainLayers: layers, topRasterLayers: [] });
                else this.yandex_map.setLayers({ topRasterLayers: [] });
            }, layers);

            return this.object;
        });

        return this;
    };
}

module.exports = YandexConfigurator;