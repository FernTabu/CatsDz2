
const CONFIG_API = {
    url: 'https://sb-cats.herokuapp.com/api/2/olga_tabueva',
    headers: {
        'Content-type': 'application/json'
    }
}

class Api {
    constructor(config) {
        this._url = config.url;
        this._headers = config.headers;
    }

    getAllCats() {
        return fetch(`${this._url}/show`, {
            method: 'GET'
        })
 
    } 


    addNewCat(data) {
        return fetch(`${this._url}/add`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: this._headers
        })
    }

    updateCatById(idCat, data) {
        return fetch(`${this._url}/update/${idCat}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: this._headers
        })
    }


    getCatById(idCat) {
        return fetch(`${this._url}/show/${idCat}`, {
            method: 'GET',
        })
    }

    getAllIds() {
        return fetch(`${this._url}/show/ids`, {
            method: 'GET',
        })
    }


    deleteCatById(idCat) {
        return fetch(`${this._url}/delete/${idCat}`, {
            method: 'DELETE',
        })
    }
}

export const api = new Api(CONFIG_API);


