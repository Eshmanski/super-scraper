const launchBrowserTest = require('./launch_browser_test.js');
const launchYandexTest = require('./launch_yandex_test.js');
const clickYandexTest = require('./click_point_yandex_test.js');
const screenYandexTest = require('./screen_yandex_test.js');

const argv = process.argv.filter(str => str[0] === '-');

async function check(type, value) {
    switch(type) {
        case '-m':
            switch(value)  {
                case 'bs':
                    await launchBrowserTest();
                    break;
                case 'ys':
                    await launchYandexTest();
                    break;
                case 'ycp':
                    await clickYandexTest();
                    break;
                case 'ysp':
                    await screenYandexTest();
                    break;
                default:
                    console.log('Error. Available options: bs, ys, ycp');
            }

            break;
        case '-h':
        default:
            console.log('Example -m=bs -m=ys');
            break;
    }
}

async function main() {
    for(const arg of argv)  {
        const [type, value] = arg.split('=');
        await check(type, value);
    }
}

main();