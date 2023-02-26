import { Card } from "./card.js";
import { api } from "./api.js";
import { Popup } from "./popup.js";
import { PopupImage } from "./popupImage.js";
import { CatInfo } from "./catInfo.js";


const cardsContainer = document.querySelector('.cards');
const btnOpenPopupForm = document.querySelector('#add');
const formCatAdd = document.querySelector('#popup-form-cat');
const popupAddCat = new Popup('popup-add-cats');
popupAddCat.setEventListener();
const btnOpenLogin = document.querySelector('#login');
const formlogin = document.querySelector('#popup-form-login');
const login = new Popup('popup-login');
login.setEventListener()

const popupCatInfo = new Popup('popup-cat-info')
popupCatInfo.setEventListener()

const popupImage = new PopupImage('popup-image')
popupImage.setEventListener()

const catsInfoInstence = new CatInfo(
    '#cats-info-template',
    handleEditCatInfo,
    handleDeleteCat,
    handleLike)
const catsInfoElement = catsInfoInstence.getElement()

function serializeForm(elements) {
    const formData = {};

    elements.forEach(input => {
        if (input.type === 'submit') return;
        if (input.type !== 'checkbox') {
            formData[input.name] = input.value;
        };
        if (input.type === 'checkbox') {
            formData[input.name] = input.checked;
        };

    })

    return formData;
}

function createCat(dataCat) {
    const cardInstance = new Card(dataCat, '#card-template', handleCatTitle, handleCatImage, handleLike); //создать карточку из данных
    const newCardElement = cardInstance.getElement();
    cardsContainer.append(newCardElement);

}
function handleFormAddCat(e) {
    e.preventDefault();
    const elementsFormCat = [...formCatAdd.elements];
    const dataFromForm = serializeForm(elementsFormCat)
    api.addNewCat(dataFromForm);
    createCat(dataFromForm)
    updateLocalStorage(dataFromForm, { type: 'ADD_CAT' })
    popupAddCat.close();
}

function handleFormLogin(e) {
    e.preventDefault();
    const loginDate = [...formlogin.elements];
    const serializeLogin = serializeForm(loginDate)
    Cookies.set('email', `${serializeLogin.email}`)
    btnOpenPopupForm.classList.remove('visibility-hidden');
    btnOpenLogin.classList.add('visibility-hidden');
    login.close();
}



function handleCatTitle(cardInstance) {
    catsInfoInstence.setData(cardInstance);
    popupCatInfo.setContent(catsInfoElement);
    popupCatInfo.open();
}

function handleDeleteCat(cardInstance) {
    api.deleteCatById(cardInstance.getId()).then(() => {
        cardInstance.deleteView()
        updateLocalStorage(cardInstance.getData(), { type: 'DELETE_CAT' })
        popupCatInfo.close();
    })

}

function handleCatImage(dataCat) {
    popupImage.open(dataCat);
}

function handleEditCatInfo(data, cardInstance) {
    const { age, description, name, id } = data;
    api.updateCatById(id, { age, description, name })
        .then(() => {
            cardInstance.setData(data)
            cardInstance.updateView();
            popupCatInfo.close();
        })
    updateLocalStorage(data, { type: 'EDIT_CAT' })

}

function handleLike(data, cardInstance) {
    const { id, favourite } = data;
    api.updateCatById(id, { favourite })
        .then(() => {
            if (cardInstance) {
                cardInstance.setData(data);
                cardInstance.updateView();
            }
            updateLocalStorage(data, { type: 'EDIT_CAT' })
            console.log('Like changed');
        })
}

btnOpenPopupForm.addEventListener('click', () => popupAddCat.open())
formCatAdd.addEventListener('submit', handleFormAddCat)
btnOpenLogin.addEventListener('click', () => login.open())
formlogin.addEventListener('submit', handleFormLogin)


const isLogin = Cookies.get('email');
if (!isLogin) {
    login.open();
    btnOpenPopupForm.classList.add('visibility-hidden');
}

const getCats = function (api) {
    api.getAllCats().then(res => res.json()).then((data) =>
        data.data.forEach((catData) => {
            createCat(catData)
            localStorage.setItem('cats', JSON.stringify(data.data));
        })
    )
}

updateLocalStorage(getCats(api), { type: 'ALL_CATS' })

function setDataRefresh(minutes, key) {
    const setTime = new Date(new Date().getTime() + minutes * 60000);
    localStorage.setItem(key, setTime);
}

function checkLocalStorage() {
    const localData = JSON.parse(localStorage.getItem('cats'));
    const getTimeExpires = localStorage.getItem('catsRefrash');

    if (localData && localData.length && (new Date() < Date(getTimeExpires))) {
        localData.forEach(catData => {
            createCat(catData)
        })
    } else {
        api.getAllCats().then(res => res.json()).then((data) =>
            data.data.forEach((catData) => {
                createCat(catData);
            }))
        updateLocalStorage(data, { type: 'ALL_CATS' });
        console.log(data);
    }
}

function updateLocalStorage(data, action) {
    const oldStorage = JSON.parse(localStorage.getItem('cats'));
    switch (action.type) {
        case 'ADD_CAT':
            oldStorage.push(data);
            localStorage.setItem('cats', JSON.stringify(data));
            return;
        case 'ALL_CATS':
            localStorage.setItem('cats', JSON.stringify(data));
            setDataRefresh(5, 'catsRefresh')
            console.log(data);
            return;
        case 'DELETE_CAT':
            const newStorage = oldStorage.filter(cat => cat.id !== data.id);
            localStorage.setItem('cats', JSON.stringify(newStorage));
            return;
        case 'EDIT_CAT':
            const updateStorage = oldStorage.map(cat => cat.id === data.id ? data : cat);
            localStorage.setItem('cats', JSON.stringify(updateStorage));
            return;
        default:
            break;
    }

}
checkLocalStorage()




