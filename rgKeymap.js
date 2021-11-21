const RgKeymap = keys => {
    const objectMerge = (a, b) => {
        for (const i in b) {
            if (typeof a[i] === 'undefined' || typeof b[i] !== 'object') {
                a[i] = b[i];
                continue;
            }
            if (typeof a[i] !== 'object') {
                continue;
            }
            a[i] = objectMerge(a[i], b[i]);
        }

        return a;
    };

    const buildConfig = config => {
        let arr, func, obj = {};
        [arr, func] = config;
        let key = arr.shift();

        if (arr.length > 0) {
            obj[key] = buildConfig([arr, func]);
        } else {
            funcStorage.push(func);
            obj[key] = funcStorage.length - 1;
        }

        return obj;
    };

    const keymapSearch = k => {
        let waitingConf = objectMerge({}, data.keyArr);
        switch (typeof data.temp[k]) {
            case 'undefined':
                data.temp = waitingConf;
                break;
            case 'number':
                funcStorage[data.temp[k]]();
                activeButtons = [];
                data.temp = waitingConf;
                break;
            default:
                data.temp = objectMerge(waitingConf, data.temp[k]);
        }
    };

    let funcStorage = [], activeButtons = [], data = {temp: [], keyArr: []};

    keys.forEach(val => data.keyArr = objectMerge(data.keyArr, buildConfig(val)));
    data.temp = objectMerge({}, data.keyArr);

    document.addEventListener('keydown', e => {
        if (typeof activeButtons[e.code] != 'undefined') {
            return;
        }

        keymapSearch(e.code);
        activeButtons[e.code] = true;
    });

    document.addEventListener('keyup', e => {
        delete activeButtons[e.code];
        keymapSearch('-' + e.code);
    });
}


RgKeymap([
    [['ShiftLeft', 'KeyZ', '-KeyZ', 'KeyZ', '-KeyZ'], () => alert('ShiftLeft + z + z')],
    [['ShiftRight', 'KeyZ', '-KeyZ', 'KeyZ', '-KeyZ'], () => alert('ShiftRight + z + z')],
    [['ShiftLeft', 'KeyZ', '-KeyZ', 'KeyX', '-KeyX'], () => alert('ShiftLeft + z + x')],
]);
