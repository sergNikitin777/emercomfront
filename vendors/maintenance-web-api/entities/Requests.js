import { Message, Request, RequestType, RespFormat } from 'RequestUtils';

export default class Requests
{
    #APP_URL = 'http://10.59.1.50:8081/';


    get CONTRACT_ADD()
    {
        return new Request(this.#APP_URL + 'emercom/admin/contract/add', RequestType.POST);
    }

    get CONTRACT_UPDATE()
    {
        return new Request(this.#APP_URL + 'emercom/admin/contracts/add', RequestType.GET);
    }

    get CONTRACT_DELETE()
    {
        return new Request(this.#APP_URL + 'emercom/admin/contracts/delete/{id}', RequestType.GET);
    }

    get CONTRACT_GET()
    {
        return new Request(this.#APP_URL + 'emercom/admin/contract/', RequestType.GET);
    }

    get CONTRACT_LIST()
    {
        return new Request(this.#APP_URL + 'emercom/admin/contracts/', RequestType.GET);
    }
}