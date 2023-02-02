import { Card } from "./card.js";
import { api } from "./api.js";
import { Popup } from "./popup.js";
import { PopupImage } from "./popupImage.js";
import { CatInfo } from "./catInfo.js";


const cardsContainer = document.querySelector('.cards');// найдем контейнер
const btnOpenPopupForm = document.querySelector('#add'); // получение кнопки добавления
const formCatAdd = document.querySelector('#popup-form-cat'); // нашли/взяли форму добавления по id
const popupAddCat = new Popup('popup-add-cats'); // создание экземпляра класса Popup
popupAddCat.setEventListener();// сразу вешаем обработчик события по клику (закрытие в будущем)

const btnOpenLogin = document.querySelector('#login'); 
const formlogin = document.querySelector('#popup-form-login'); 
const login = new Popup('popup-login');
login.setEventListener()

const popupCatInfo = new Popup('popup-cat-info')
popupCatInfo.setEventListener()

const popupImage = new PopupImage('popup-image')
popupImage.setEventListener()

const catsInfoInstence = new CatInfo('#cats-info-template', handleDeleteCat)
const catsInfoElement = catsInfoInstence.getElement()

function serializeForm(elements) {// функция извлечения информации из формы
    const formData = {};

    elements.forEach(input => {
        if (input.type === 'submit') return;// кнопка не содержит данных, не нужна для обработки
        if (input.type !== 'checkbox') {
            formData[input.name] = input.value;// ключ: значение
        };
        if (input.type === 'checkbox') {
            formData[input.name] = input.checked;
        };

    })

    return formData;
}

function createCat(dataCat) {
    const cardInstance = new Card(dataCat, '#card-template', handleCatImage, handleCatTitle); //создать карточку из данных
    const newCardElement = cardInstance.getElement(); //собрать данные из формы
    cardsContainer.append(newCardElement);   //добавить карточку на страницу

}
function handleFormAddCat(e) { //функция добавления из формы
    e.preventDefault(); //отмена отправки формы (событие по умолчанию для submit)
    const elementsFormCat = [...formCatAdd.elements]; //html коллекцию преобразуем в массив(оборачиваем в массив и через сприд Spread разложить)
    const dataFromForm = serializeForm(elementsFormCat)//(объект)данные полученные, через функцию извлечения информации из формы
    console.log(dataFromForm);
    api.addNewCat(dataFromForm);// добавление кота на сервер
    createCat(dataFromForm)
    updateLocalStorege(data, { type: 'ADD_CAT' })
    popupAddCat.close();
}

function handleFormLogin(e) {
    e.preventDefault(); 
    const loginDate = [...formlogin.elements]; 
    const serializeLogin = serializeForm(loginDate)
    console.log(serializeLogin);
    Cookies.set('email', `${serializeLogin.email}`)
    console.log('email', `${serializeLogin.email}`);
    btnOpenPopupForm.classList.remove('visibility-hidden');
    btnOpenLogin.classList.add('visibility-hidden');
    login.close();
}

function handleCatImage(dataCat) {
    popupImage.open(dataCat);
}

function handleCatTitle(cardInstance) {
    catsInfoInstence.setData(cardInstance);
    popupCatInfo.setContent(catsInfoElement);
    popupCatInfo.open();
}

function handleDeleteCat(cardInstance) {
    api.deleteCatById(cardInstance.getId()).then(() => {
        cardInstance.deleteView()
        // updateLocalStorege(cardInstance.getId(),{type: 'DELETE_CAT'})
        popupCatInfo.open();    
    })
  
}


btnOpenPopupForm.addEventListener('click', () => popupAddCat.open())// повешали слушатель события, по клику колбек popupAddCat.open открывает форму добавления котика
formCatAdd.addEventListener('submit', handleFormAddCat)// 
btnOpenLogin.addEventListener('click', () => login.open())// повешали слушатель события, по клику колбек .open открывает форму авторизации
formlogin.addEventListener('submit', handleFormLogin)


const isLogin = Cookies.get('email');
if (!isLogin) {
    login.open(); 
    btnOpenPopupForm.classList.add('visibility-hidden');
}

const getCats = function (api) {// добавление котов с сервера
    api.getAllCats().then(res => res.json()).then((data) =>
        data.data.forEach((catData) => {
            createCat(catData)
        })
    )
}

// getCats(api);


function setDataRefresh(minutes, key) { //установка интервала обновления
    const setTime = new Date(new Date().getTime() + minutes * 60000);
    localStorage.setItem(key, setTime);
}

function checkLocalStorage() {
    const localData = JSON.parse(localStorage.getItem("cats"));
    console.log(localData);
    const getTimeExpires = localStorage.getItem('catsRefrash');
    console.log(getTimeExpires);

    if (localData && localData.lenght && (new Date() < Date(getTimeExpires))) {
        localData.forEach(catData => {
            createCat(catData)
        })
    } else {
        api.getAllCats().then(res => res.json()).then((data) =>
            data.data.forEach((catData) => {
                createCat(catData);
                console.log(api.getAllCats().then(res => res.json()));
            }))
        updateLocalStorege(Data, {type: 'ALL_CATS' })
    }
}

function updateLocalStorege(data, action) {
    const oldStorage = JSON.parse(localStorage.getItem('cats'))
    switch (action.type) {
        case 'ADD_CAT':
            oldStorage.push(data);
            localStorage.setItem('cats', JSON.stringify(data));
            return;
        case 'ALL_CATS':
            localStorage.setItem('cats', JSON.stringify(data));
            setDataRefresh(5, 'catsRefresh')
            return;
        case 'DELETE_CAT':
            const newStorege = oldStorage.filter(cat => cat.id !== data);
            localStorage.setItem('cats', JSON.stringify(data));
            return;
        case 'EDIT_CAT':
            const updateStorege = oldStorage.map(cat => cat.id === data.id ? data : cat);
            localStorage.setItem('cats', JSON.stringify(data));
            return;    
        default:
            break;
    }
    
}
checkLocalStorage()




