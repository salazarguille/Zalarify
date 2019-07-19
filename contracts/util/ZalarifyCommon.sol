pragma solidity 0.5.3;

/**
    @notice This contains all the common enumeration and struct definitions for the Zalarify platform.
    @author Guillermo Salazar.
 */
contract ZalarifyCommon {

    /** Enums */

    /**
        @notice It defines an employee type.
     */
    enum EmployeeType {
        Employee,
        Freelancer
    }
    
    /**
        @notice It defines a company structure.
     */
    struct Company {
        bytes32 id;
        bytes32 name;
        bytes32 description;
        bytes32 website;
        address creator;
        uint createdAt;
        bool paused;
    }

    /**
        @notice It defines a Receipt structure.
     */
    struct Receipt {
        uint createdAt;
        string path;
        string ipfsHash;
    }

    /**
        @notice It defines an Employee structure.
     */
    struct Employee {
        address employee;
        bytes32 name;
        bytes32 role;
        bytes32 email;
        address preferedTokenPayment;
        EmployeeType employeeType;
        uint salaryAmount;
        bool exist;
    }

    /**
        @notice It defines a Payment structure.
     */
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