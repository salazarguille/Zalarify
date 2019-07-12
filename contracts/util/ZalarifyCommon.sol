pragma solidity 0.5.3;

contract ZalarifyCommon {

    /** Enums */
    enum EmployeeType {
        Employee,
        Freelancer
    }
    
    struct Company {
        bytes32 id;
        bytes32 name;
        bytes32 description;
        bytes32 website;
        address creator;
        uint createdAt;
    }

    struct Receipt {
        uint createdAt;
        string path;
        string ipfsHash;
    }

    struct Employee {
        address employee;
        bytes32 name;
        bytes32 role;
        bytes32 email;
        address preferedTokenPayment;
        EmployeeType employeeType;
        uint salaryAmount;
        bool enabled;
        bool exist;
    }

    struct Payment {
        address to;
        address sourceToken;
        address targetToken;
        uint targetAmount;
        uint sourceAmount;
        uint minRate;
        uint maxRate;
        bytes32 provider;
    }


}