class RgKeymap {
    constructor() {
        this.funcStorage = [];
        this.activeButtons = [];
        this.data = {temp: [], keyArr: []};

        this.initListeners();
    }

    objectMerge(a, b) {
        for (const i in b) {
            if (typeof a[i] === 'undefined' || typeof b[i] !== 'object') {
                a[i] = b[i];
                continue;
            }
            if (typeof a[i] !== 'object') {
                continue;
            }
            a[i] = this.objectMerge(a[i], b[i]);
        }

        return a;
    }

    buildConfig(config) {
        let arr, func, obj = {};
        [arr, func] = config;
        let key = arr.shift();

        if (arr.length > 0) {
            obj[key] = this.buildConfig([arr, func]);
        } else {
            this.funcStorage.push(func);
            obj[key] = this.funcStorage.length - 1;
        }

        return obj;
    }

    keymapSearch(k, e) {
        let waitingConf = this.objectMerge({}, this.data.keyArr);
        switch (typeof this.data.temp[k]) {
            case 'undefined':
                this.data.temp = waitingConf;
                break;
            case 'number':
                e.preventDefault();
                this.funcStorage[this.data.temp[k]]();
                this.activeButtons = [];
                this.data.temp = waitingConf;
                break;
            default:
                this.data.temp = this.objectMerge(waitingConf, this.data.temp[k]);
        }
    }

    initListeners() {
        document.addEventListener('keydown', e => {
            if (typeof this.activeButtons[e.code] != 'undefined') {
                return;
            }

            this.activeButtons[e.code] = true;
            this.keymapSearch(e.code, e);
        });

        document.addEventListener('keyup', e => {
            delete this.activeButtons[e.code];
            this.keymapSearch('-' + e.code, e);
        });
    }

    add(keys, callback) {
        keys = keys
            .flatMap(k => /^\+.*$/.test(k) ? k.replace(/^\+(.*)/, '$1,-$1').split(',') : [k])
            .map(k => /^-?\w$/.test(k) ? k.toUpperCase().replace(/^(-?)(\w)$/, '$1Key$2') : k);

        this.data.keyArr = this.objectMerge(this.data.keyArr, this.buildConfig([keys, callback]));
        this.data.temp = this.objectMerge({}, this.data.keyArr);
    }
}
