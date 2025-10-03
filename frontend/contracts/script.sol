// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EduChainAutomate
 * @dev Manages automated scholarships on the blockchain.
 */
contract EduChainAutomate is Ownable {
    struct Scholarship {
        uint256 id;
        address donor;
        uint256 totalAmount;
        uint256 amountPerSemester;
        address student;
        bool isClaimed;
        string eligibilityCriteria;
    }

    mapping(uint256 => Scholarship) public scholarships;
    uint256 public scholarshipCount;

    event FundsDisbursed(uint256 indexed scholarshipId, address indexed student, uint256 amount);
    
    // ADD THIS CONSTRUCTOR
    // It calls the constructor of the Ownable contract and sets the deployer as the initial owner.
    constructor() Ownable(msg.sender) {}

    function createScholarship(uint256 _amountPerSemester, string memory _eligibilityCriteria) public payable {
        require(msg.value > 0, "You must send ETH to fund the scholarship.");
        require(_amountPerSemester > 0, "Amount per semester must be greater than zero.");
        
        scholarshipCount++;
        
        scholarships[scholarshipCount] = Scholarship({
            id: scholarshipCount,
            donor: msg.sender,
            totalAmount: msg.value,
            amountPerSemester: _amountPerSemester,
            student: address(0),
            isClaimed: false,
            eligibilityCriteria: _eligibilityCriteria
        });
    }

    function applyForScholarship(uint256 _scholarshipId) public {
        Scholarship storage selectedScholarship = scholarships[_scholarshipId];
        
        require(selectedScholarship.id != 0, "Scholarship does not exist.");
        require(!selectedScholarship.isClaimed, "Scholarship has already been claimed.");
        
        selectedScholarship.student = msg.sender;
        selectedScholarship.isClaimed = true;
    }

    function disburseFunds(uint256 _scholarshipId) public onlyOwner {
        Scholarship storage selectedScholarship = scholarships[_scholarshipId];

        require(selectedScholarship.isClaimed, "No student is assigned to this scholarship.");
        require(selectedScholarship.totalAmount >= selectedScholarship.amountPerSemester, "Insufficient funds remaining.");

        uint256 amountToDisburse = selectedScholarship.amountPerSemester;
        selectedScholarship.totalAmount -= amountToDisburse;
        
        (bool success, ) = selectedScholarship.student.call{value: amountToDisburse}("");
        require(success, "Failed to send funds.");

        emit FundsDisbursed(_scholarshipId, selectedScholarship.student, amountToDisburse);
    }
}