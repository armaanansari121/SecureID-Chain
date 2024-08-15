// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../node_modules/@openzeppelin/contracts/access/AccessControl.sol";
import "../node_modules/@openzeppelin/contracts/security/Pausable.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract GeoLocationTracker is AccessControl, Pausable, ReentrancyGuard {
    
    struct GeoLocation {
        string latitude;
        string longitude;
        uint256 timestamp;
    }

    mapping(uint =>mapping(address=> GeoLocation)) private checkpointLocations;

    event LocationUpdated(address indexed employeeAddress, uint indexed checkpointId, string latitude, string longitude);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function updateLocation(
        address _employeeAddress,
        uint _checkpointId,
        string memory _latitude,
        string memory _longitude
    ) public whenNotPaused nonReentrant {
        checkpointLocations[_checkpointId][_employeeAddress] = GeoLocation(_latitude, _longitude, block.timestamp);
        emit LocationUpdated(_employeeAddress, _checkpointId, _latitude, _longitude);
    }

    function getLastLocation( address _employeeAddress,uint _checkpointId) 
        public view returns (string memory latitude, string memory longitude, uint timestamp) {
        GeoLocation memory location = checkpointLocations[_checkpointId][_employeeAddress];
        return (location.latitude, location.longitude, location.timestamp);
    }
}