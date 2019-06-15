
class ContractInfo {
    constructor(web3, order, address, name, costs = [], data = {}) {
        this.web3 = web3;
        this.order = order;
        this.address = address;
        this.name = name;
        this.costs = costs;
        this.data = data;
    }
}

module.exports = ContractInfo;