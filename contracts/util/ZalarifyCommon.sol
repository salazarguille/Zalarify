pragma solidity 0.5.9;

contract ZalarifyCommon {

    struct CompanyDefinition {
        bytes32 name;
        address zalarifyCompanyAddress;
        mapping(address => bool) owners;
        bool enabled;
        bool exist;
    }
    
    struct Receipt {
        uint createdAt;
        bytes32 hash;
    }

    struct Employee {
        bytes32 name;
        bytes32 email;
        address preferedTokenPayment;
        uint salaryAmount;
        bool isEmployee;
        bool exist;
    }

    struct Payment {
        address tokenAddress;
        uint amount;
    }

    struct CompanyPayment {
        bytes32 companyId;
        uint totalAmount;
        Payment[] payments;
    }

}