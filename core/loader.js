const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const uuidv1 = require('uuid/v1');
const request = require('request');

class Loader {

    constructor(satId, label) {

        if(typeof satId === "undefined")
            throw new Error("Missing constructor params");


        this._createFileStructure();

        this.satId = satId;
        this.label = label;

        this.axiosClient = axios.create({
            timeout: 5000,
            baseURL: 'https://network.satnogs.org/api/observations',
            headers: {
                'content-type': 'application/json'
            }
        });
    }

    _createFileStructure() {

        if(!fs.existsSync(path.join(process.cwd(), 'out'))) {
            fs.mkdirSync(path.join(process.cwd(), 'out'));
        }

        if(!fs.existsSync(path.join(process.cwd(), 'out/bad'))) {
            fs.mkdirSync(path.join(process.cwd(), 'out/bad'));
        }

        if(!fs.existsSync(path.join(process.cwd(), 'out/good'))) {
            fs.mkdirSync(path.join(process.cwd(), 'out/good'));
        }
    }

    get() {
        this.axiosClient.get('',{
            params: {
                'sattelite__norad_cat_id': this.satId,
                'vetted_status': this.label
            }
        }).then(res => {
            res['data'].forEach(data => {
                console.log(data['waterfall']);
                this._download(data['waterfall'],uuidv1()+'.png');
            });
        });
    }

    _download(uri, filename){
        try {
            if(this.label === "good") {
                request(uri).pipe(fs.createWriteStream(path.join(process.cwd(),'out/good/'+filename)));
            } else {
                request(uri).pipe(fs.createWriteStream(path.join(process.cwd(),'out/bad/'+filename)));
            }
        } catch(e) {
            console.log(e);
        }
      };
}

module.exports = Loader;