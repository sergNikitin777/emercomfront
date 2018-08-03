import Contract from '../entities/Contract';
import Requests from '../entities/Requests';
import handle from '../utils/handleMessage';

export default class ContractService
{
    constructor()
    {
        this.#requests = new Requests(); // TODO: Наполнить контекст создания сервиса, например, может отличаться APP_URL.
    }

    #requests;

    /**

     */	
    async add(list)
    {
        //throw new Message(Messages.CONTRACT_NOT_FOUND);
        try {
            //const respContracts = await this.#requests.CONTRACT_ADD.execute({id:list.id, name: list.name, status: list.status, creationDate: list.creationDate, closeDate: list.closeDate });
			const respContracts = await this.#requests.CONTRACT_ADD.execute(list);
 
            return new Contract(respContracts);
        } catch (message) { throw handle(message); }	
    }

    /**
     * @param {Contract|String} contract - Договор или его идентификатор.
     * @return {Promise|Boolean} contract - Договор.
     */
    async delete(id)
    {
        try {
            id instanceof Contract && (id = id.id);
            const respContracts = await this.#requests.CONTRACT_LIST.execute({ id: id });
        } catch (message) { throw handle(message); }
    }


    /**
     * Получение списка договоров.
     * @return {Array} contract list - Список договоров.
     */
    async list()
    {
        try {
            const respContracts = await this.#requests.CONTRACT_LIST.execute();
            const contracts = [];

            for (let contract of respContracts) {
                contracts.push(new Contract(contract));
            }

            return contracts;
        } catch (message) { throw handle(message); }
    }
	
}