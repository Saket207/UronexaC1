// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract UronexaLedger {
    struct Record {
        uint256 riskScore;
        string ipfsHash;
        uint256 timestamp;
    }

    // Mapping from patient address to their array of medical records
    mapping(address => Record[]) public patientRecords;

    event RecordMinted(address indexed patient, uint256 riskScore, string ipfsHash, uint256 timestamp);

    /**
     * @dev Mints/appends a new health record to the patient's history.
     */
    function mintRecord(uint256 _riskScore, string memory _ipfsHash) public {
        Record memory newRecord = Record({
            riskScore: _riskScore,
            ipfsHash: _ipfsHash,
            timestamp: block.timestamp
        });

        patientRecords[msg.sender].push(newRecord);

        emit RecordMinted(msg.sender, _riskScore, _ipfsHash, block.timestamp);
    }

    /**
     * @dev Retrieves the full history for a given patient address.
     */
    function getHistory(address _patient) public view returns (Record[] memory) {
        return patientRecords[_patient];
    }
}
