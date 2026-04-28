// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title EnergyTrade - P2P Energy Trading Contract for CampusChain
/// @author Ogangbo Ochoche Joseph - FUT Minna
contract EnergyTrade is ReentrancyGuard {

    IERC20 public energyToken;

    struct EnergyListing {
        uint256 id;
        address seller;
        string buildingName;
        uint256 energyAmount;   // in Wh
        uint256 pricePerWh;     // in CET tokens
        bool isActive;
    }

    uint256 public listingCount;
    mapping(uint256 => EnergyListing) public listings;

    // Events for immutable audit trail
    event SurplusListed(
        uint256 indexed listingId,
        address indexed seller,
        string buildingName,
        uint256 energyAmount,
        uint256 pricePerWh
    );

    event TradeExecuted(
        uint256 indexed listingId,
        address indexed buyer,
        address indexed seller,
        uint256 energyAmount,
        uint256 totalCost
    );

    event ListingCancelled(uint256 indexed listingId, address indexed seller);

    constructor(address _energyTokenAddress) {
        energyToken = IERC20(_energyTokenAddress);
    }

    /// @notice Seller lists surplus energy for sale
    function listSurplus(
        string memory _buildingName,
        uint256 _energyAmount,
        uint256 _pricePerWh
    ) external {
        require(_energyAmount > 0, "Energy amount must be greater than zero");
        require(_pricePerWh > 0, "Price must be greater than zero");

        listingCount++;
        listings[listingCount] = EnergyListing({
            id: listingCount,
            seller: msg.sender,
            buildingName: _buildingName,
            energyAmount: _energyAmount,
            pricePerWh: _pricePerWh,
            isActive: true
        });

        emit SurplusListed(listingCount, msg.sender, _buildingName, _energyAmount, _pricePerWh);
    }

    /// @notice Buyer purchases energy from an active listing
    function buyEnergy(uint256 _listingId) external nonReentrant {
        EnergyListing storage listing = listings[_listingId];

        require(listing.isActive, "Listing is not active");
        require(listing.seller != msg.sender, "Seller cannot buy own listing");

        uint256 totalCost = listing.energyAmount * listing.pricePerWh;

        require(
            energyToken.transferFrom(msg.sender, listing.seller, totalCost),
            "Token transfer failed"
        );

        listing.isActive = false;

        emit TradeExecuted(
            _listingId,
            msg.sender,
            listing.seller,
            listing.energyAmount,
            totalCost
        );
    }

    /// @notice Seller cancels their own listing
    function cancelListing(uint256 _listingId) external {
        EnergyListing storage listing = listings[_listingId];
        require(listing.seller == msg.sender, "Only seller can cancel");
        require(listing.isActive, "Listing already inactive");

        listing.isActive = false;
        emit ListingCancelled(_listingId, msg.sender);
    }

    /// @notice Returns all active listings
    function getActiveListing(uint256 _listingId) external view returns (EnergyListing memory) {
        return listings[_listingId];
    }
}