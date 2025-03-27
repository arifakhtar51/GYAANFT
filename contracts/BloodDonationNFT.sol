// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BloodDonationNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct DonationRecord {
        uint256 donationDate;
        string bloodType;
        bool isUsed;
        uint256 benefitsUsed;
    }

    mapping(uint256 => DonationRecord) public donationRecords;
    mapping(address => uint256[]) public donorTokens;
    
    // Benefits configuration
    uint256 public constant MAX_BENEFITS = 3;
    uint256 public constant BLOOD_REQUIREMENT = 1;
    uint256 public constant DISCOUNT_PERCENTAGE = 20; // 20% discount

    event DonationRecorded(address indexed donor, uint256 tokenId, string bloodType);
    event BenefitUsed(address indexed user, uint256 tokenId, string benefitType);

    constructor() ERC721("Blood Donation NFT", "BDNFT") {}

    function mintDonationNFT(address donor, string memory bloodType) 
        public 
        onlyOwner 
        returns (uint256) 
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        
        _mint(donor, newItemId);
        
        donationRecords[newItemId] = DonationRecord({
            donationDate: block.timestamp,
            bloodType: bloodType,
            isUsed: false,
            benefitsUsed: 0
        });
        
        donorTokens[donor].push(newItemId);
        
        emit DonationRecorded(donor, newItemId, bloodType);
        
        return newItemId;
    }

    function useBenefit(uint256 tokenId, string memory benefitType) 
        public 
        returns (bool) 
    {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the token owner");
        require(!donationRecords[tokenId].isUsed, "Token already used");
        require(donationRecords[tokenId].benefitsUsed < MAX_BENEFITS, "Maximum benefits reached");

        donationRecords[tokenId].benefitsUsed++;
        if (donationRecords[tokenId].benefitsUsed >= MAX_BENEFITS) {
            donationRecords[tokenId].isUsed = true;
        }

        emit BenefitUsed(msg.sender, tokenId, benefitType);
        return true;
    }

    function getDonationRecord(uint256 tokenId) 
        public 
        view 
        returns (DonationRecord memory) 
    {
        require(_exists(tokenId), "Token does not exist");
        return donationRecords[tokenId];
    }

    function getDonorTokens(address donor) 
        public 
        view 
        returns (uint256[] memory) 
    {
        return donorTokens[donor];
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        
        // Remove token from donor's list if being transferred
        if (from != address(0)) {
            uint256[] storage tokens = donorTokens[from];
            for (uint256 i = 0; i < tokens.length; i++) {
                if (tokens[i] == tokenId) {
                    tokens[i] = tokens[tokens.length - 1];
                    tokens.pop();
                    break;
                }
            }
        }
        
        // Add token to new owner's list
        if (to != address(0)) {
            donorTokens[to].push(tokenId);
        }
    }
} 