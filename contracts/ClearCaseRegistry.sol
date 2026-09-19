// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

/**
 * @title ClearCaseRegistry
 * @dev Immutable on-chain registry for Project ClearCase dispute resolution settlements.
 * Deployed on Polygon Amoy Testnet (Chain ID: 80002).
 */
contract ClearCaseRegistry {
    // Emitted whenever a dual-consented dispute settlement hash is permanently anchored
    event SettlementAnchored(
        string indexed settlementHash,
        uint256 timestamp,
        address indexed registrar
    );

    // Maps settlement SHA-256 hash -> block timestamp
    mapping(string => uint256) private _settlements;

    // Contract owner / deployer
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "ClearCaseRegistry: caller is not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Immutably anchors a settlement hash on Polygon Amoy testnet.
     * @param settlementHash Hex-encoded SHA-256 hash of the dispute case aggregate.
     * @return success Boolean indicating successful registration.
     */
    function recordSettlement(string calldata settlementHash) external returns (bool) {
        require(bytes(settlementHash).length > 0, "ClearCaseRegistry: settlement hash cannot be empty");
        require(_settlements[settlementHash] == 0, "ClearCaseRegistry: settlement already anchored on-chain");

        _settlements[settlementHash] = block.timestamp;

        emit SettlementAnchored(settlementHash, block.timestamp, msg.sender);
        return true;
    }

    /**
     * @notice Verifies if a settlement hash is registered on-chain and returns the anchoring timestamp.
     * @param settlementHash Hex-encoded SHA-256 hash to verify.
     * @return timestamp Unix epoch timestamp when anchored (0 if not found).
     */
    function verifySettlement(string calldata settlementHash) external view returns (uint256) {
        return _settlements[settlementHash];
    }
}
