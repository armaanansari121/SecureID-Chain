contract CheckpointManagement is AccessControl, Pausable, ReentrancyGuard {
    IDManagement public idManagement;
    RoleManager public roleManager;

    struct Checkpoint {
        string name;
        string location;
        bool active;
        bytes32[] allowedRoles;
        uint256 timestamp; // Added timestamp field
    }

    mapping(bytes32 => Checkpoint) public checkpoints;
    bytes32[] public checkpointList;

    event CheckpointAdded(bytes32 indexed id, string name, string location, uint256 timestamp);
    event CheckpointUpdated(bytes32 indexed id, bool active, uint256 timestamp);
    event AccessAttempt(uint256 indexed employeeId, bytes32 indexed checkpointId, bool success);

    constructor(address _idManagementAddress, address _roleManagerAddress) {
        idManagement = IDManagement(_idManagementAddress);
        roleManager = RoleManager(_roleManagerAddress);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    modifier onlyManager() {
        require(roleManager.hasRole(roleManager.MANAGER_ROLE(), msg.sender), "Caller is not a manager");
        _;
    }

    function addCheckpoint(string memory _name, string memory _location, bytes32[] memory _allowedRoles) public onlyManager whenNotPaused nonReentrant {
        bytes32 checkpointId = keccak256(abi.encodePacked(_name, _location));
        require(checkpoints[checkpointId].active == false, "Checkpoint already exists");
        uint256 currentTimestamp = block.timestamp; // Get current timestamp
        checkpoints[checkpointId] = Checkpoint(_name, _location, true, _allowedRoles, currentTimestamp);
        checkpointList.push(checkpointId);
        emit CheckpointAdded(checkpointId, _name, _location, currentTimestamp);
    }

    function updateCheckpoint(bytes32 _checkpointId, bool _active) public onlyManager whenNotPaused nonReentrant {
        require(checkpoints[_checkpointId].active != _active, "Checkpoint status unchanged");
        checkpoints[_checkpointId].active = _active;
        uint256 currentTimestamp = block.timestamp; // Get current timestamp
        checkpoints[_checkpointId].timestamp = currentTimestamp; // Update timestamp
        emit CheckpointUpdated(_checkpointId, _active, currentTimestamp);
    }

    function attemptAccess(uint256 _employeeId, bytes32 _checkpointId) public whenNotPaused nonReentrant {
        require(checkpoints[_checkpointId].active, "Checkpoint is not active");
        IDManagement.Employee memory employee = idManagement.getEmployee(_employeeId);
        require(employee.active, "Employee is not active");
        bool accessGranted = false;
        for (uint i = 0; i < checkpoints[_checkpointId].allowedRoles.length; i++) {
            if (employee.role == checkpoints[_checkpointId].allowedRoles[i]) {
                accessGranted = true;
                break;
            }
        }
        emit AccessAttempt(_employeeId, _checkpointId, accessGranted);
    }

    function getCheckpoints() public view returns (bytes32[] memory) {
        return checkpointList;
    }

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}