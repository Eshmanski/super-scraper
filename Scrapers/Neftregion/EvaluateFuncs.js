class EvaluateFuncs {
    getTableDOM() {
        const table = [];
        let i = 0;

        for (const tr of document.querySelectorAll('#tableindex tr')) {
            if (i === 2) break;

            if (Array.from(tr.children[0].classList).includes('h3region')) {
                i++;
                continue;
            };

            if (i === 1) table.push(tr);
        }

        return table;
    };

    getFields(table) {
        const arr = Array.from(table[0].children);

        const fields = [];

        for (const [i, td] of Object.entries(arr)) {
            if (i == 0) continue;

            fields.push(td.textContent);
        }

        return fields;
    };

    parseData(table, fields) {
        table = table.slice(1);

        const data = [];

        class Item {
            company = {
                url: null,
                name: null,
                address: null,
                inn: null,
                ogrn: null,
            };

            info = {};
            date = null;
        }

        let item = new Item();

        for (let i = 0; i < table.length; i++) {
            const tr = Array.from(table[i].children);

            switch ((i + 1) % 4) {
                case 1:
                    const update = Array.from(tr.pop().querySelectorAll('span'));
                    const logo = tr.shift();

                    item.company.url = logo.querySelector('a')?.href;
                    item.company.name = logo.querySelector('img')?.alt;

                    item.date = new Date(update[1].textContent.split('.').reverse().join('-') + 'T' + update[2].textContent).toISOString();
                case 2:
                case 3:
                    let key;

                    for (const [index, td] of Object.entries(tr)) {
                        if (index == 0) {
                            key = td.querySelector('div').textContent;

                            item.info[key] = {};
                        } else {
                            let content = td.querySelector('span.pr')?.textContent ?? td.textContent;

                            item.info[key][fields[index - 1]] = content === '-' ? null : Number(content.replace(' ', ''));
                        }
                    }

                    break;
                case 0:
                default:
                    data.push(item);
                    item = new Item();
            }
        }

        return data;
    };

    getCompanyInfo() {
        const info = {
            address: null,
            inn: null,
            ogrn: null,
        };

        const innBlock = document.querySelector('.company-header-inn-block')?.outerText;

        info.address = this.document.querySelector('.company-header-address-block')?.outerText ?? this.document.querySelector('.company-header-address')?.outerText ?? null;
        if (innBlock) {
            info.inn = innBlock.match(/ИНН:?\s?(\d*)/)?.[1];
            info.ogrn = innBlock.match(/ОГРН:?\s?(\d*)/)?.[1];
        }

        info.address = info.address?.replaceAll('\n', '');

        return info;
    };

    getCompanyInfoComplexity() {
        const info = {
            address: null,
            inn: null,
            ogrn: null,
        };

        function search(els, str) {
            for (let el of els) {
                if (el?.outerText?.includes(str)) {
                    return el?.outerText;
                } else {
                    const res = search(el.children)
                    if (res) return res;
                }
            }

            return null;
        }

        const pArr = document.querySelectorAll('.content p');

        const innText = search(pArr, 'ИНН');
        const ogrnText = search(pArr, 'ОГРН');
        const addressText = search(pArr, 'Адрес');

        if (innText) info.inn = innText.match(/ИНН:?\s?(\d*)/)?.[1];
        if (ogrnText) info.ogrn = ogrnText.match(/ОГРН:?\s?(\d*)/)?.[1];
        if (addressText) info.address = addressText.match(/Адрес:?\s?(.*)\n/)?.[1];

        return info;
    }
}

module.exports = EvaluateFuncs;