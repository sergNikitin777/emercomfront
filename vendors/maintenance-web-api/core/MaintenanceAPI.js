import { Message } from 'RequestUtils';
import ContractService from '../services/ContractService';
import Contract from '../services/ContractService';

class MaintenanceAPI
{
    constructor(params)
    {
        params || (params = {});
    }

    get contract()
    { 
        return {
            add()
            {
                return new ContractService().add(arguments);
            },

            update()
            {
                return new ContractService().update();
            },

            delete()
            {
                return new ContractService().delete();
            },

            /**
             * Получение договора по идентификатору.
             *
             * @param {Document|String} document - Документ или его идентификатор.
             * @return {Promise|Contract} contract - Договор.
             */
            get()
            {
                return new ContractService().get();
            },

            list()
            {
                return new ContractService().list();
            }
        };
    };

    get user()
    {
        return {
            add() {}
        };
    }
}

export {
    MaintenanceAPI, Message
};