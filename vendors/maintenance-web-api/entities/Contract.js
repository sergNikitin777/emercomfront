//import ContractStatus from './enums/ContractStatus';

export default class Contract
{
    constructor(params)
    {
        params || (params = {});

        this.#id = params.id || null;
        this.#number = params.number || null;
        this.#name = params.name || null;
        //this.#status = ContractStatus.define(params.status);
		this.#status = params.status || null;
        this.#dateStart = params.creationDate || null;
        this.#dateEnd = params.closeDate || null;
		this.#customer = params.customer || null;
    }

    #id;
    #number;
    #name;
    #status;
    #dateStart;
    #dateEnd;
	#customer;
	
    get id()
    {
        return this.#id;
    }	

    get number()
    {
        return this.#number;
    }

    get name()
    {
        return this.#name;
    }

    get status()
    {
        return this.#status;
    }

    get dateStart()
    {
        return this.#dateStart;
    }

    get dateEnd()
    {
        return this.#dateEnd;
    }
	
    get customer()
    {
        return this.#customer;
    }	
}