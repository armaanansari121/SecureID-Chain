pragma solidity ^0.8.13;

contract RoleManager is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant HR_ROLE = keccak256("HR_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant DRIVER_ROLE = keccak256("DRIVER_ROLE");
    bytes32 public constant WAREHOUSE_ROLE = keccak256("WAREHOUSE_ROLE");

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
    }

    function addRole(bytes32 role, address account) public onlyRole(ADMIN_ROLE) {
        grantRole(role, account);
    }

    function removeRole(bytes32 role, address account) public onlyRole(ADMIN_ROLE) {
        revokeRole(role, account);
    }
}
