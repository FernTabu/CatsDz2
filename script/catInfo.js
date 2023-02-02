
export class CatInfo {
    constructor(selectorTemplate, handleDeleteCat) {
        this._selectorTemplate = selectorTemplate;
        this._handleDeleteCat = handleDeleteCat;
        this._data = {};
    }

    _getTemplate() {
        return document.querySelector(this._selectorTemplate).content.children[0];
    }

    getElement() {
        this.element = this._getTemplate().cloneNode(true);
        this.buttonEdited = this.element.querySelector('.cat-info__edited')
        this.buttonDeleted = this.element.querySelector('.cat-info__deleted')
        this.catImage = this.element.querySelector('.cat-info__image')
        this.catId = this.element.querySelector('.cat-info__id')
        this.catName = this.element.querySelector('.cat-info__name')
        this.catRate = this.element.querySelector('.cat-info__rate')
        this.catAge = this.element.querySelector('.cat-info__age-val')
        this.catDesc = this.element.querySelector('.cat-info__desc')
        this.catLike = this.element.querySelector('.cat-info__like')
        console.log(this.catLike);
        this.setEventListener()
        return this.element;
    }

    setData(cardInstance) {
        this._cardInstance = cardInstance;
        console.log(cardInstance);
        this._data = this._cardInstance.getData();
        console.log(this._data);
        this.catImage.src = this._data.img_link
        this.catId.innerText = `ID ${this._data.id}`
        this.catName.innerText = this._data.name
        this.catRate.innerText = `Рейтинг ${this._data.rate}`
        this.catAge.innerText = `Возраст ${this._data.age}`
        this.catDesc.innerText = this._data.description
        this.catDesc.id = this._data.favourite
        if (this._data.favourite === true) {
            this.catLike.id = 'on'  
        } else { this.catLike.id = '' }
        console.log(this._data.favourite)

    }
    setEventListener() {
        this.buttonDeleted.addEventListener('click', () => this._handleDeleteCat(this._cardInstance))
    }
}

