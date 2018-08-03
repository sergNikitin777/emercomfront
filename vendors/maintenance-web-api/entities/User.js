export default class User
{
    constructor(params)
    {
        params || (params = {});

        #id = params.id;
    }

    #id = null;

    get id()
    {
        return this.#id;
    }
}