export class Popup {
    constructor(className) {
        this._className = className;
        this.popup = document.querySelector(`.${className}`)
        this._handleEscUp = this._handleEscUp.bind(this) // закрытие нажатием кнопки Esc (Escape)
    }// закрепили контекст, чтобы можно было использовать в стр16 и далее

    _handleEscUp(evt) {
        if (evt.key === 'Escape') {// при событии нажатие кнопки Esc.. закрытие 
            this.close()
        }
    }

    open() {
        this.popup.classList.add('popup_active');// окрытие окна формы добавления котика, через активацию видимости
        document.addEventListener('keyup', this._handleEscUp) // вызов обработчика события, может понадобиться
    }

    close() {
        this.popup.classList.remove('popup_active');// скрытие/
        document.removeEventListener('keyup', this._handleEscUp)//  удаление обработчика события, больше не нужен
    }

    setContent(contentNode) {
        const containerContent = this.popup.querySelector('.popup__content');
        containerContent.innerHTML = '';
        containerContent.append(contentNode);

    }
    setEventListener() {// скрытие/закрытие по клику
        this.popup.addEventListener('click', (evt) => {
            if (evt.target.classList.contains(this._className) || evt.target.closest('.popup__close')) {
                this.close() // условие закрытия с учетом ближайшего элемента нажатия
            }
        })
    }
}
