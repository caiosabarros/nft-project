// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../node_modules/@openzeppelin/contracts/interfaces/IERC2981.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/AccessControl.sol";


contract BaseContract is ERC1155, AccessControl, IERC2981 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    //OPERATOR = 0x523a704056dcd17bcf83bed8b68c59416dac1119be77755efe3bde0a64e46e0c
    bytes32 public constant OPERATOR = keccak256("OPERATOR");
    string public name;
    address private royaltiesRecipient;
    uint8 royaltiesPercentage;

    modifier tokenOwnerOnly(uint256 tokenId) {
        require(this.balanceOf(msg.sender, tokenId) != 0, "You don't have any token");
        _;
    }

    constructor(
        string memory _contractURI, 
        string memory _name, 
        address _client, 
        uint8 _royaltiesPercentage,
        address _royaltiesRecipient
    ) ERC1155(_contractURI){
        name = _name;
        _setupRole(OPERATOR, _client); //Client Wallet
        royaltiesRecipient = _royaltiesRecipient; //Can be PaymentSplitter contract
        _setupRole(OPERATOR, msg.sender); //GoBlockchain
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        royaltiesPercentage = _royaltiesPercentage;
    }
    
    function setURI(string memory newuri) external onlyRole(OPERATOR) {
        _setURI(newuri);
    }

    function burn(address from, uint256 id, uint256 amount) external tokenOwnerOnly(id) {
        _burn(from, id, amount);
    }
    
    function burnBatch(address from, uint256[] memory ids, uint256[] memory amounts) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _burnBatch(from, ids, amounts);
    }

    function mint(address to, uint256 amount, bytes memory data) external onlyRole(OPERATOR) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(to, tokenId, amount, data);
    }

    function mintBatch(address to,uint256[] memory ids, uint256[] memory amounts, bytes memory data) external onlyRole(OPERATOR) {    
        _mintBatch(to, ids, amounts, data);
    }

    /** @dev EIP2981 royalties implementation. */

    // Maintain flexibility to modify royalties recipient (could also add basis points).
    function _setRoyalties(address _newRecipient) internal {
        require(_newRecipient != address(0), "Royalties: new recipient is the zero address");
        royaltiesRecipient = _newRecipient;
    }

    function setRoyalties(address _newRecipient) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setRoyalties(_newRecipient);
    }

    // EIP2981 standard royalties return.
    function royaltyInfo(uint256, uint256 _salePrice) external view override
        returns (address receiver, uint256 royaltyAmount)
    {
        //1 corresponds to 1%
        return (royaltiesRecipient, (_salePrice * royaltiesPercentage * 100) / 10000);
    }

    // EIP2981 standard Interface return. Adds to ERC1155 and ERC165 Interface returns.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155, IERC165, AccessControl)
        returns (bool)
    {
        //IERC165
        return (
            interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId));
    }

    function currentTokenId() external view returns(uint256){
        return _tokenIdCounter.current();
    }
}
