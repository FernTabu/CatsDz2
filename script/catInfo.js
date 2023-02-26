
export class CatInfo {
    constructor(
        selectorTemplate,
        handleEditCatInfo,
        handleDeleteCat,
        handleLikeCat) {
        this._selectorTemplate = selectorTemplate;
        this._handleEditCatInfo = handleEditCatInfo;
        this._handleDeleteCat = handleDeleteCat;
        this._handleLikeCat = handleLikeCat;
        this._data = {};
    }

    _getTemplate() {
        return document.querySelector(this._selectorTemplate).content.children[0];
    }

    _toggleContentEditable = () => {
        this.buttonEdited.classList.toggle('cat-info__edited_hidden');
        this.buttonSaved.classList.toggle('cat-info__saved_hidden');

        this.catDesc.contentEditable = !this.catDesc.isContentEditable;
        this.catName.contentEditable = !this.catName.isContentEditable;
        this.catAge.contentEditable = !this.catAge.isContentEditable;
    }

    _savedDataCats = () => {
        this._toggleContentEditable();

        this._data.name = this.catName.innerText;
        this._data.age = Number(this.catAge.innerText);
        this._data.description = this.catDesc.innerText;
        this._handleEditCatInfo(this._data, this._cardInstance)

    }
    getElement() {
        this.element = this._getTemplate().cloneNode(true);
        this.buttonEdited = this.element.querySelector('.cat-info__edited');
        this.buttonDeleted = this.element.querySelector('.cat-info__deleted');
        this.buttonSaved = this.element.querySelector('.cat-info__saved');
        this.buttonliked = this.element.querySelector('.cat-info__like');

        this.catImage = this.element.querySelector('.cat-info__image');
        this.catId = this.element.querySelector('.cat-info__id');
        this.catName = this.element.querySelector('.cat-info__name');
        this.catRate = this.element.querySelector('.cat-info__rate');
        this.catAge = this.element.querySelector('.cat-info__age-val');
        this.catAge1 = this.element.querySelector('.cat-info__age-text');
        this.catDesc = this.element.querySelector('.cat-info__desc');
        this.catLike = this.element.querySelector('.cat-info__like');
        this.setEventListener();
        return this.element;
    }
    _updateViewLike() {
        if (this._data.favourite) {
            this.buttonliked.classList.add('cat-info__like_active');
        } else {
            this.buttonliked.classList.remove('cat-info__like_active');
        }
    }

    setData(cardInstance) {
        this._cardInstance = cardInstance;
        this._data = this._cardInstance.getData();
        this.catImage.src = this._data.img_link;
        this.catId.innerText = `ID ${this._data.id}`;
        this.catName.innerText = this._data.name;
        this.catRate.innerText = `Рейтинг ${this._data.rate}`;
        this.catAge1.innerText = `Возраст`;
        this.catAge.innerText = this._data.age;
        this.catDesc.innerText = this._data.description;
        this.catDesc.id = this._data.favourite;
        if (this._data.favourite === true) {
            this.catLike.id = 'on'
        } else { this.catLike.id = '' };
        this._updateViewLike()

    }
    _setLikeCat = () => {
        this._data.favourite = !this._data.favourite;
        this._updateViewLike();
        this._handleLikeCat(this._data, this._cardInstance)
    }

    setEventListener() {
        this.buttonDeleted.addEventListener('click', () => this._handleDeleteCat(this._cardInstance));
        this.buttonEdited.addEventListener('click', () => this._toggleContentEditable());
        this.buttonSaved.addEventListener('click', this._savedDataCats);
        this.buttonliked.addEventListener('click', this._setLikeCat);
    }

}

