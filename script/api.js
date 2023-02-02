// - переменная для оптимизации при работе с запросами
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
    // - запрашиваем данные по всем котам
    getAllCats() {
        return fetch(`${this._url}/show`, {
            method: 'GET'
        })
        //     .then(res =>
        //     res.ok ? res.json() : Promise.reject({ ...res, message: 'error' })
        // ); 
    } 

    // - добавляем нового кота
    addNewCat(data) {
        return fetch(`${this._url}/add`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: this._headers
        })
    }
    // - изменяем данные о коте
    updateCatById(idCat, data) {
        return fetch(`${this._url}/update/${idCat}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: this._headers
        })
    }

    // - запрашиваем данные по ID кота
    getCatById(idCat) {
        return fetch(`${this._url}/show/${idCat}`, {
            method: 'GET',
        })
    }
    // - запрашиваем массив всех существующих id
    getAllIds() {
        return fetch(`${this._url}/show/ids`, {
            method: 'GET',
        })
    }

    // - удаляем информацию о коте
    deleteCatById(idCat) {
        return fetch(`${this._url}/delete/${idCat}`, {
            method: 'DELETE',
        })
    }
}

export const api = new Api(CONFIG_API);


