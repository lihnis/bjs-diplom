//Выход из личного кабинета

const logoutButton = new LogoutButton();
logoutButton.action = () => {
    ApiConnector.logout(callback => {
        if (callback.success) {
            location.reload();
        }
    })
};

//Получение информации о пользователе

ApiConnector.current(data => {
    if (data.success) {
        ProfileWidget.showProfile(data.data);
    }
});

//Получение текущих курсов валюты

const ratesBoard = new RatesBoard();
function getCurs() {
    ApiConnector.getStocks(callback => {
        if (callback.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(callback.data);
        }
    })
}

getCurs();
setInterval(getCurs, 60000);

//Операции с деньгами

const moneyManager = new MoneyManager();

// Пополнение баланса
moneyManager.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManger.setMessage(response.success, 'Пополнение баланса успешно');
        }
        else {
            moneyManger.setMessage(response.success, `Произошла ошибка при пополнении баланcа ${serverResponse.error}`);
        }
    });
}

// Конвертирование валюты
moneyManager.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, 'Валюта успешно конвертирована');
        }
        else {
            moneyManager.setMessage(response.success, response.error);
        }
    });
}

// Перевод средств
moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, 'Успешная транзакция!');
        }
        else {
            moneyManager.setMessage(response.success, response.error);
        }
    });
}

// Работа с избранным

const favoritesWidget = new FavoritesWidget();

const getFavorites = () => {
    ApiConnector.getFavorites(response => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
        }
    });
}

getFavorites();

favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success) {
            getFavorites();
            favoritesWidget.setMessage(response.success, 'Пользователь добавлен в избранное!');

        }
        else {
            favoritesWidget.setMessage(response.success, response.error);
        }
    });
}

favoritesWidget.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if (response.success) {
            getFavorites();
            favoritesWidget.setMessage(response.success, 'Пользователь  успешно удален!');
        }
        else {
            favoritesWidget.setMessage(response.success, response.error);
        }
    });
}