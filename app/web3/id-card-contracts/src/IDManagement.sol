// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../node_modules/@openzeppelin/contracts/security/Pausable.sol";
import "../node_modules/@openzeppelin/contracts/access/AccessControl.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../node_modules/@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

contract IDManagement is AccessControl, Pausable, ReentrancyGuard {
    using ECDSA for bytes32;

    bytes32 public constant HR_ROLE = keccak256("HR_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant CHECKPOINT_ROLE = keccak256("CHECKPOINT_ROLE");

    struct LocationRecord {
        string latitude;
        string longitude;
        uint256 timestamp;
        uint checkpointId;
    }

    struct EmployeePrivateData {
        string name;
        string role;
        bool active;
        uint256 lastUpdated;
        string[] certifications;
        string ipfsHash;
        LocationRecord[] locationHistory;
    }

    mapping(address => EmployeePrivateData) private employeePrivateData;
    // mapping(address => bytes32) public employeeHashes;
    uint256 public employeeCount;

    event EmployeeAdded(address indexed employeeAddress ,string indexed name, string indexed role, bool active, uint256 lastUpdated, string Certification);
    event EmployeeUpdated(address indexed employeeAddress,string indexed name, string indexed role, bool active, uint256 lastUpdated, string Certification);
    event CertificationAdded(string indexed CertificateHash, address indexed employeeAddress);
    event LocationAdded(address indexed employeeAddress, uint indexed checkpointId, string latitude, string longitude, uint256 timestamp);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CHECKPOINT_ROLE, msg.sender);
        employeeCount = 0;
    }

function addRole(string memory role, address account) public onlyRole(ADMIN_ROLE) {
        bytes32 RoleName=keccak256(abi.encodePacked(role));
        grantRole(RoleName, account);
    }

    function removeRole(string memory role, address account) public onlyRole(ADMIN_ROLE) {
         bytes32 RoleName=keccak256(abi.encodePacked(role));
        revokeRole(RoleName, account);
    }

function addEmployee(
    string memory _name,
    string memory _role,
    address _employeeAddress,
    string memory _imageIpfs
) public onlyRole(HR_ROLE) whenNotPaused nonReentrant {
    // bytes32 employeeHash = keccak256(abi.encodePacked(_employeeAddress));

    require(employeePrivateData[_employeeAddress].lastUpdated == 0, "Employee already exists");

    EmployeePrivateData storage newEmployee = employeePrivateData[_employeeAddress];
    newEmployee.name = _name;
    newEmployee.role = _role;
    newEmployee.active = true;
    newEmployee.lastUpdated = block.timestamp;
    newEmployee.ipfsHash = _imageIpfs;
    // Initialize empty arrays
    // newEmployee.certifications and newEmployee.locationHistory 
    // are automatically initialized as empty arrays

    // employeeHashes[_employeeAddress] = employeeHash;
    employeeCount++;

    emit EmployeeAdded(_employeeAddress,_name,_role,true,newEmployee.lastUpdated,newEmployee.ipfsHash);
}
    
    // /**
    //  * @dev This function updates an employee's role and status in the system.
    //  * @param _employeeHash The hash of the employee to be updated.
    //  * @param _newRole The new role for the employee.
    //  * @param _active A boolean indicating if the employee is active or not.
    //  */
    function updateEmployee(
        address _employeeAddress,
        string memory _newRole,
        bool _active
    ) public onlyRole(MANAGER_ROLE) whenNotPaused nonReentrant {
        require(employeePrivateData[_employeeAddress].lastUpdated != 0, "Employee does not exist");

        EmployeePrivateData storage employee = employeePrivateData[_employeeAddress];
        employee.role = _newRole;
        employee.active = _active;
        employee.lastUpdated = block.timestamp;

        emit EmployeeUpdated(_employeeAddress,employee.name,_newRole,_active,employee.lastUpdated,employee.ipfsHash);
    }

    function addCertification(address _employeeAddress, string memory _certification) 
        public onlyRole(HR_ROLE) whenNotPaused {
        require(employeePrivateData[_employeeAddress].lastUpdated != 0, "Employee does not exist");
        employeePrivateData[_employeeAddress].certifications.push(_certification);
        emit CertificationAdded(_certification,_employeeAddress);
    }

    function addLocation(
        address _employeeAddress,
        uint _checkpointId,
        string memory _latitude,
        string memory _longitude,
        uint256 _timestamp
    ) public onlyRole(CHECKPOINT_ROLE) whenNotPaused nonReentrant {
        require(employeePrivateData[_employeeAddress].lastUpdated != 0, "Employee does not exist");

        LocationRecord memory newLocation = LocationRecord({
            latitude: _latitude,
            longitude: _longitude,
            timestamp: _timestamp,
            checkpointId: _checkpointId
        });

        employeePrivateData[_employeeAddress].locationHistory.push(newLocation);
        emit LocationAdded(_employeeAddress, _checkpointId, _latitude, _longitude, _timestamp);
    }

    function getLocationHistory(address _employeeAddress)
        public
        view
        onlyRole(MANAGER_ROLE)
        returns (
            string[] memory latitudes,
            string[] memory longitudes,
            uint256[] memory timestamps,
            uint[] memory checkpointIds
        )
    {
        require(employeePrivateData[_employeeAddress].lastUpdated != 0, "Employee does not exist");

        uint256 length = employeePrivateData[_employeeAddress].locationHistory.length;
        latitudes = new string[](length);
        longitudes = new string[](length);
        timestamps = new uint256[](length);
        checkpointIds = new uint[](length);

        for (uint256 i = 0; i < length; i++) {
            LocationRecord storage location = employeePrivateData[_employeeAddress].locationHistory[i];
            latitudes[i] = location.latitude;
            longitudes[i] = location.longitude;
            timestamps[i] = location.timestamp;
            checkpointIds[i] = location.checkpointId;
        }
    }

    function verifyEmployee(address _employeeAddress, bytes memory _signature) public view returns (bool) {
        EmployeePrivateData storage employee = employeePrivateData[_employeeAddress];
        bytes32 messageHash = keccak256(abi.encodePacked(_employeeAddress,employee.role));
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
        
        address signer = msg.sender;
        
        bool isValidSignature = SignatureChecker.isValidSignatureNow(signer, ethSignedMessageHash, _signature);
        
        return isValidSignature;
    }

    function getEmployee(address _employeeAddress)
        external
        onlyRole(MANAGER_ROLE)
        onlyRole(HR_ROLE)
        view
        returns (EmployeePrivateData memory)
    {
        // EmployeePrivateData memory newEmployee = EmployeePrivateData[_employeeAddress];
        require(employeePrivateData[_employeeAddress].lastUpdated != 0, "Employee does not exist");
        return employeePrivateData[_employeeAddress];
    }
}