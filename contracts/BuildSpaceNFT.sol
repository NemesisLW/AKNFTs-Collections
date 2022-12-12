// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import { Base64 } from "./libraries/Base64.sol";

contract BuildSpaceNFT is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    string[] firstWords = [INSERT_AS_MANY_STRINGS_YOU_WANT];
    string[] secondWords = [INSERT_AS_MANY_STRINGS_YOU_WANT];
    string[] thirdWords = [INSERT_AS_MANY_STRINGS_YOU_WANT];
 
    event NewNFTMinted(address _sender, uint256 _tokenId);


    constructor() ERC721 ("AKForeverNFT", "AK"){

    }

    modifier _mintLimit() {

        require(_tokenIds.current() < 4500);
        _;
    }

    function pickFirstWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("MyGirl", Strings.toString(tokenId))));
        rand = rand % firstWords.length;
        return firstWords[rand];
    }

    function pickSecondWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("Daddy'sprincess", Strings.toString(tokenId))));
        rand = rand % secondWords.length;
        return thirdWords[rand];
    }

    function pickThirdWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("AmarMeye", Strings.toString(tokenId))));
        rand = rand % thirdWords.length;
        return thirdWords[rand];
    }

    function random(string memory _input) internal pure returns(uint256) {
        return uint256(keccak256(abi.encodePacked(_input)));
    }


    function _makeAKNFT() internal _mintLimit {
        
        uint256 newItemId = _tokenIds.current();

        string memory first = pickFirstWord(newItemId);
        string memory second = pickSecondWord(newItemId);
        string memory third = pickThirdWord(newItemId);
        string memory combinedWord = string(abi.encodePacked(first, second, third));


        string memory finalSvg = string(abi.encodePacked(baseSvg, first, second, third, "</text></svg>"));
        
        string memory json = Base64.encode(
                bytes(
                    string(
                        abi.encodePacked(
                            '{"name": "',
                            combinedWord,
                            '", "description": "A highly acclaimed collection of Best Couples Ever.", "image": "data:image/svg+xml;base64,',
                            Base64.encode(bytes(finalSvg)),
                            '"}'
                        )
                    )
                )
            );

        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
        
        // console.log("\n--------------------");
        // console.log(finalTokenUri);
        // console.log("--------------------\n");

        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, finalTokenUri);
        // tokenURI(newItemId);

        _tokenIds.increment();
        // console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
        
        emit NewNFTMinted(msg.sender, newItemId);

    }

    function makeAKNFT() public {
        _makeAKNFT();
    }

    function getTotalNFTsMintedSoFar() public view returns(uint256) {

        uint256 totalNftsminted = _tokenIds.current() + 1;

        console.log("I was waved at %d times!",  totalNftsminted);
        return totalNftsminted;
        
    }

    // function tokenURI(uint256 _tokenId) public view override returns(string memory) {

    //     require(_exists(_tokenId));
    //     console.log("An NFT w/ ID %s has been minted to %s", _tokenId, msg.sender);
    //     return string(
    //         abi.encodePacked("data:application/json;base64,",
    //         "ewogICAgIm5hbWUiOiAiTXlRdWVlbksiLAogICAgImRlc2NyaXB0aW9uIjogIkFuIE5GVCBmcm9tIHRoZSBoaWdobHkgYWNjbGFpbWVkIEsgY29sbGVjdGlvbiIsCiAgICAiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUhCeVpYTmxjblpsUVhOd1pXTjBVbUYwYVc4OUluaE5hVzVaVFdsdUlHMWxaWFFpSUhacFpYZENiM2c5SWpBZ01DQXpOVEFnTXpVd0lqNDhjbVZqZENCM2FXUjBhRDBpTVRBd0pTSWdhR1ZwWjJoMFBTSXhNREFsSWk4K1BIUmxlSFFnZUQwaU5UQWxJaUI1UFNJMU1DVWlJR1J2YldsdVlXNTBMV0poYzJWc2FXNWxQU0p0YVdSa2JHVWlJSFJsZUhRdFlXNWphRzl5UFNKdGFXUmtiR1VpSUhOMGVXeGxQU0ptYVd4c09pTm1abVk3Wm05dWRDMW1ZVzFwYkhrNmMyVnlhV1k3Wm05dWRDMXphWHBsT2pFMGNIZ2lQazE1VVhWbFpXNUxQQzkwWlhoMFBqd3ZjM1puUGc9PSIKfQ==")
    //     );

    }
