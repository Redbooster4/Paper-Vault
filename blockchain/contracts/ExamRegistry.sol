//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/AccessControl.sol";

contract ExamRegistry is AccessControl{
    bytes32 public constant EXAM_BOARD_ROLE=keccak256("EXAM_BOARD_ROLE");
    struct Paper{
        string ipfsHash;
        uint256 releaseTimestamp;
        address uploadedBy;
        bool exists;
    }
    mapping(bytes32 => Paper) public papers;
    mapping(bytes32 => mapping(address => bool)) public authorized;

    event PaperRegistered(bytes32 indexed examId, string ipfsHash, uint256 releaseTimestamp);
    event AccessGranted(bytes32 indexed examId, address indexed institution);
    event PaperAccessed(bytes32 indexed examId, address indexed requester, uint256 timestamp);

    constructor(){
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(EXAM_BOARD_ROLE, msg.sender);
    }

    function registerPaper(
        bytes32 examId, 
        string calldata ipfsHash, 
        uint256 releaseTimestamp
    ) external onlyRole(EXAM_BOARD_ROLE)
    {
        require(!papers[examId].exists, "Already registered");
        papers[examId] = Paper(ipfsHash, releaseTimestamp, msg.sender, true);
        emit PaperRegistered(examId, ipfsHash, releaseTimestamp);
    }

    function grantAccess(bytes32 examId, address institution) external onlyRole(EXAM_BOARD_ROLE)
    {
        authorized[examId][institution]=true;
        emit AccessGranted(examId, institution);
    }

    function checkAccess(bytes32 examId, address requester) external view returns (bool){
        Paper memory p=papers[examId];
        bool result = p.exists && authorized[examId][requester] && block.timestamp >= p.releaseTimestamp;
        return result;
    }

    function logAccess(bytes32 examId, address requester) external onlyRole(EXAM_BOARD_ROLE) {
        emit PaperAccessed(examId, requester, block.timestamp);
    }

    function getPaper(bytes32 examId) external view returns (string memory, uint256, address) {
        Paper memory p=papers[examId];
        require(p.exists, "Not found");
        return (p.ipfsHash, p.releaseTimestamp, p.uploadedBy);
    }
}
