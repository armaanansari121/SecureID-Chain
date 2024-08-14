// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract PrivacyEnhancedIDManagement is AccessControl, Pausable, ReentrancyGuard {
    using ECDSA for bytes32;

    bytes32 public constant HR_ROLE = keccak256("HR_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    struct EmployeePrivateData {
        string encryptedName;
        string encryptedRole;
        bool active;
        uint256 lastUpdated;
        string[] encryptedCertifications;
    }

    mapping(bytes32 => EmployeePrivateData) private employeePrivateData;
    mapping(address => bytes32) public employeeHashes;

    event EmployeeAdded(bytes32 indexed employeeHash);
    event EmployeeUpdated(bytes32 indexed employeeHash);
    event CertificationAdded(bytes32 indexed employeeHash);

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function addEmployee(
        bytes32 _employeeHash,
        string memory _encryptedName,
        string memory _encryptedRole,
        address _employeeAddress
    ) public onlyRole(HR_ROLE) whenNotPaused nonReentrant {
        require(employeePrivateData[_employeeHash].lastUpdated == 0, "Employee already exists");

        employeePrivateData[_employeeHash] = EmployeePrivateData(
            _encryptedName,
            _encryptedRole,
            true,
            block.timestamp,
            new string[](0)
        );

        employeeHashes[_employeeAddress] = _employeeHash;

        emit EmployeeAdded(_employeeHash);
    }

    function updateEmployee(
        bytes32 _employeeHash,
        string memory _newEncryptedRole,
        bool _active
    ) public onlyRole(MANAGER_ROLE) whenNotPaused nonReentrant {
        require(employeePrivateData[_employeeHash].lastUpdated != 0, "Employee does not exist");

        EmployeePrivateData storage employee = employeePrivateData[_employeeHash];
        employee.encryptedRole = _newEncryptedRole;
        employee.active = _active;
        employee.lastUpdated = block.timestamp;

        emit EmployeeUpdated(_employeeHash);
    }

    function addCertification(bytes32 _employeeHash, string memory _encryptedCertification) 
        public onlyRole(HR_ROLE) whenNotPaused {
        require(employeePrivateData[_employeeHash].lastUpdated != 0, "Employee does not exist");
        employeePrivateData[_employeeHash].encryptedCertifications.push(_encryptedCertification);
        emit CertificationAdded(_employeeHash);
    }

    function verifyEmployee(bytes32 _employeeHash, bytes memory _signature) public view returns (bool) {
        address signer = _employeeHash.toEthSignedMessageHash().recover(_signature);
        return employeeHashes[signer] == _employeeHash;
    }
}