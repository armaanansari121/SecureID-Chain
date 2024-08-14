contract GeoLocationTracker is AccessControl, Pausable, ReentrancyGuard {
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    
    struct GeoLocation {
        int256 latitude;
        int256 longitude;
        uint256 timestamp;
    }

    mapping(bytes32 => mapping(bytes32 => GeoLocation)) private checkpointLocations;

    event LocationUpdated(bytes32 indexed employeeHash, bytes32 indexed checkpointId, int256 latitude, int256 longitude);

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function updateLocation(
        bytes32 _employeeHash,
        bytes32 _checkpointId,
        int256 _latitude,
        int256 _longitude
    ) public onlyRole(ORACLE_ROLE) whenNotPaused nonReentrant {
        checkpointLocations[_employeeHash][_checkpointId] = GeoLocation(_latitude, _longitude, block.timestamp);
        emit LocationUpdated(_employeeHash, _checkpointId, _latitude, _longitude);
    }

    function getLastLocation(bytes32 _employeeHash, bytes32 _checkpointId) 
        public view returns (int256 latitude, int256 longitude, uint256 timestamp) {
        GeoLocation memory location = checkpointLocations[_employeeHash][_checkpointId];
        return (location.latitude, location.longitude, location.timestamp);
    }
}