// // SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "../node_modules/@openzeppelin/contracts/access/AccessControl.sol";
import "../node_modules/@openzeppelin/contracts/security/Pausable.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./IDManagement.sol";
import "./GeoLocation.sol";

contract CheckpointManagement is AccessControl, Pausable, ReentrancyGuard {
    IDManagement public idManagement;
    GeoLocationTracker public geoLocationTracker;
    uint256 private checkpointId=0;

    struct Checkpoint {
        string name;
        string location;
        bool active;
        string[] allowedRoles;
        uint256 timestamp;
    }

    mapping(uint => Checkpoint) public checkpoints;
    uint[] public checkpointList;

    event CheckpointAdded(uint indexed id, string name, string location, uint256 timestamp);
    event CheckpointUpdated(uint indexed id, bool active, uint256 timestamp);
    event AccessAttempt(address indexed employeeAddress, uint indexed checkpointId, bool success);

    constructor(address _idManagementAddress, address _geoLocationTrackerAddress) {
        idManagement = IDManagement(_idManagementAddress);
        // roleManager = RoleManager(_roleManagerAddress);
        geoLocationTracker = GeoLocationTracker(_geoLocationTrackerAddress);
        // _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    modifier onlyManager() {
        require(idManagement.hasRole(idManagement.MANAGER_ROLE(), msg.sender), "Caller is not a manager");
        _;
    }

    function addCheckpoint(string memory _name, string memory _location, string[] memory _allowedRoles) public onlyManager whenNotPaused nonReentrant {
        uint checkpoint = checkpointId;
        require(!checkpoints[checkpoint].active, "Checkpoint already exists");
        uint256 currentTimestamp = block.timestamp;
        checkpoints[checkpoint] = Checkpoint(_name, _location, true, _allowedRoles, currentTimestamp);
        checkpointList.push(checkpoint);
        emit CheckpointAdded(checkpoint, _name, _location, currentTimestamp);
        checkpointId++;
    }

    function updateCheckpoint(uint _checkpointId, bool _active) public onlyManager whenNotPaused nonReentrant {
        require(checkpoints[_checkpointId].active != _active, "Checkpoint status unchanged");
        checkpoints[_checkpointId].active = _active;
        uint256 currentTimestamp = block.timestamp;
        checkpoints[_checkpointId].timestamp = currentTimestamp;
        emit CheckpointUpdated(_checkpointId, _active, currentTimestamp);
    }

    function attemptAccess(address _employeeAddress, uint _checkpointId) public whenNotPaused nonReentrant {
        require(checkpoints[_checkpointId].active, "Checkpoint is not active");
        IDManagement.EmployeePrivateData memory currEmployee = idManagement.getEmployee(_employeeAddress);
        require(currEmployee.active, "Employee is not active");

        bool accessGranted = false;
        for (uint i = 0; i < checkpoints[_checkpointId].allowedRoles.length; i++) {
            if (keccak256(abi.encodePacked(currEmployee.role)) == keccak256(abi.encodePacked(checkpoints[_checkpointId].allowedRoles[i]))) {
                accessGranted = true;
                break;
            }
        }
        
        if (accessGranted) {
            (string memory latitude, string memory longitude, uint256 timestamp) = geoLocationTracker.getLastLocation(_employeeAddress, _checkpointId);
            require(timestamp > 0, "No location data available for this employee at this checkpoint");
            
            // Add the location to the employee's history in IDManagement
            idManagement.addLocation(_employeeAddress, _checkpointId, latitude, longitude, timestamp);
        }
        
        emit AccessAttempt(_employeeAddress, _checkpointId, accessGranted);
    }

    // Function to get checkpoint details for a specific checkpoint
    function getCheckpointDetails(uint _checkpointId)
        public
        view
        returns (
            string memory name,
            string memory location,
            bool active,
            string[] memory allowedRoles,
            uint256 timestamp
        )
    {
        require(checkpoints[_checkpointId].timestamp != 0, "Checkpoint does not exist");
        Checkpoint storage checkpoint = checkpoints[_checkpointId];

        return (checkpoint.name, checkpoint.location, checkpoint.active, checkpoint.allowedRoles, checkpoint.timestamp);
    }

    // Function to get details of all checkpoints in a structured way
    function getAllCheckpoints()
        public
        view
        returns (
            uint[] memory checkpointIds,
            string[] memory names,
            string[] memory locations,
            bool[] memory actives,
            uint256[] memory timestamps
        )
    {
        uint256 length = checkpointList.length;
        checkpointIds = new uint[](length);
        names = new string[](length);
        locations = new string[](length);
        actives = new bool[](length);
        timestamps = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            uint checkpointNo = checkpointList[i];
            Checkpoint storage checkpoint = checkpoints[checkpointNo];
            checkpointIds[i] = checkpointNo;
            names[i] = checkpoint.name;
            locations[i] = checkpoint.location;
            actives[i] = checkpoint.active;
            timestamps[i] = checkpoint.timestamp;
        }
    }

    function getCheckpoints() public view returns (uint[] memory) {
        return checkpointList;
    }

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}