//зхаменить всё валидаторы, проверающие на пустоту, на один, вызываемый через bind + один параметр

export const appellValidator = (value, row) => (value === '') ? 'Заполните, пожалуйста, поле "Название"' : true;

export const dateStartValidator = (value, row) => (value === '') ? 'Заполните, пожалуйста, поле "Начало"' : true;

export const dateEndValidator = (value, row) => (value === '') ? 'Заполните, пожалуйста, поле "Завершение"' : true;

export const customerValidator = (value, row) => (value === '') ? 'Заполните, пожалуйста, поле "Заказчик"' : true;


