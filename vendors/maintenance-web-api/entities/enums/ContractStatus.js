export default class ContractStatus
{
    static get ACTIVE() { return 'ACTIVE'; }
    static get CLOSED() { return 'CLOSED'; }
    //static get UNKNOWN() { return 'UNKNOWN'; }
	static get UNKNOWN() { return 0; }

    static define(type)
    {
        if (typeof type === 'string') {
            type = type.toUpperCase();
        }

        return this[type] || this.UNKNOWN;
    }
}