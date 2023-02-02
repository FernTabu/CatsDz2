export class Card {// класс работы с карточкой принимает экземпляр и селектор (отображение на странице)
    constructor(dataCat, selectorTemplate, handleCatImage, handleCatTitle) {
        this._data = dataCat;
        this._selectorTemplate = selectorTemplate;
        this._handleCatImage = handleCatImage;
        this._handleCatTitle = handleCatTitle;
    }

    _getTemplate(){ //ищет этот элемент, возвращает содержимое шаблона в виде узла ДОМ
        return document.querySelector(this._selectorTemplate).content.querySelector('.card');
    }
    // _означает внутренняя функция(желательно собл)
    // <template> предназначен для хранения «образца» разметки, невидимого и предназначенного для вставки куда-либо. Легковесная версия узла node

    getElement() { // ловим элемент и складываем в переменную, из нее достаем то, что необходимо, меняем необходимые поля возвращаем
        this.element = this._getTemplate().cloneNode(true); //клонируем полученное содержимое из шаблона, чтобы не было перезаписи одной и той же карточки
        this.cardTitle = this.element.querySelector('.card__name');// поиск и 
        this.cardImage = this.element.querySelector('.card__image');
        this.cardLike = this.element.querySelector('.card__like');
        
        if(!this._data.favourite){
            this.cardLike.remove()
        }

        this.cardTitle.textContent = this._data.name;
        this.cardImage.src = this._data.img_link;
        
        this.setEventListener() 
        return this.element;
    }

    getData() {
        return this._data;
    }

    setData(newData) {
        this._dataCat = newData;
    }

    getId() {
        return this._data.id
    }
    deleteView() {
        this.element.remove();
        this.element = null;
    }

    setEventListener() {
        this.cardImage.addEventListener('click', () => this._handleCatImage(this._dataCat))
        this.cardTitle.addEventListener('click', () => this._handleCatTitle(this))
    }
}

