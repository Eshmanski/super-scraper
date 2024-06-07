const launchBrowserTest = require('./launch_browser_test.js');

const argv = process.argv.filter(str => str[0] === '-');

async function check(type, value) {
    switch(type) {
        case '-m':
            switch(value)  {
                case 'bs':
                    await launchBrowserTest('bs');
                    break;
                default:
                    console.log('Error. Available options: bs');
            }

            break;
        case '-h':
        default:
            console.log('default');
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