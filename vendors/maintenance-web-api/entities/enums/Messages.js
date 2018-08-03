const Messages = {

    SUCCESS: {
        code: 'SUCCESS',
        template: 'Операция выполнена.'
    },

    ACCESS_DENIED: {
        code: 'ACCESS_DENIED',
        template: 'Доступ запрещен.'
    },

    URL_NOT_FOUND: {
        code: 'URL_NOT_FOUND',
        template: 'Адрес не найден.'
    },

    INTERNAL_ERROR: {
        code: 'INTERNAL_ERROR',
        template: 'Внутренняя ошибка.'
    },

    CONTRACT_NOT_FOUND: {
        code: 'CONTRACT_NOT_FOUND',
        template: 'Договор с идентификатором {id} не найден.'
    },

    CONTRACT_ADD_ERROR: {
        code: 'CONTRACT_ADD_ERROR',
        template: 'При сохранении договора произошла ошибка.'
    }
};

export default Messages;