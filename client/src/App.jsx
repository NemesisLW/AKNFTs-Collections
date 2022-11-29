import React, {useState, useEffect} from 'react';
import { ethers } from "ethers";
import abi from "./utils/BuildSpaceNFT.json";
import { Player } from '@lottiefiles/react-lottie-player';

import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = 'Arghyad18';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = 'https://testnets.opensea.io/collection/akforevernft-v2';
const TOTAL_MINT_COUNT = 4500;

const getEthereumObject = () => window.ethereum;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [totalMinted, setTotalMinted] = useState(0);
  const [mintLink, setMintLink] = useState("");
  const [initiateMinting, setIM] = useState(false);

  const contractAddress ="0xeb9998c14d78AE934fE55675FD7F3b6E9b6F0F48"; 
  const contractABI = abi.abi;
  
  // Render Methods

  const checkIfWalletConnected = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        console.error("Make sure you have metamask!");
        return null;
      }
      console.log("We have the ethereum object", ethereum);
      const accounts = await ethereum.request({method: "eth_accounts"});

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);
      
      const goerliChainId = "0x5"; 
      if (chainId !== goerliChainId) {
      	alert("You are not connected to the Goerli Test Network!");
      }
  
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account: ", account);
        setupEventListener();
        return account;
      } else {
        console.error("No authorized account found");
        return null;
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  };


  const loading = () => (
    <div>
    <p class="mint-count">Your NFT is on the way ....</p>
    <Player
      autoplay
      loop
      src="https://assets10.lottiefiles.com/private_files/lf30_qgah66oi.json"
      style={{ height: '150px', width: '150px' }}> </Player>
      </div>
  );
  
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button" onClick={connectWallet}>
      Connect to Wallet
    </button>
  );

  const connectWallet = async () => {
    
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request(
        {method: "eth_requestAccounts",}
      );
      
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      setupEventListener();
    } catch (error) {
      console.error(err);
    }
  };

  
  const askContractToMintNft = async () => {

    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          contractAddress, 
          contractABI, 
          signer);
  
        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAKNFT();
        setIM(true);
        console.log("Mining...please wait.")
        await nftTxn.wait();
        
        console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);
  
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
}

 
  const setupEventListener = async () => {
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          contractAddress, 
          contractABI, 
          signer);

        connectedContract.on("NewNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
        });
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

                         
  const getTotalMintedNfts = async () => {

    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          contractAddress, 
          contractABI, 
          signer);

        let count = await connectedContract.getTotalNFTsMintedSoFar();
        setTotalMinted(count.toNumber());
        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

    
  useEffect(async () => {
    const account = await checkIfWalletConnected();
    if (account !== null) {
      setCurrentAccount(account);
    }
     getTotalMintedNfts();

    let nftContract;

    const onNewMint = (from, tokenId) => {
      console.log("NewMint", from, tokenId);
      setMintLink(`https://testnets.opensea.io/assets/${contractAddress}/${tokenId.toNumber()}`);
      console.log(mintLink);
    };
    
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      nftContract = new ethers.Contract(
        contractAddress, 
        contractABI, 
        signer);

      nftContract.on("NewNFTMinted", onNewMint);
    }

    return () => {
      if(nftContract) {
        nftContract.off("NewNFTMinted", onNewMint);
      }
    }
  });

  
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Our NFT <a href={OPENSEA_LINK}>Collection</a></p>
          <p className="sub-text">
            Each unique. Each beautiful. All Mine.
          </p>
          <p className="mint-count">
            {totalMinted}/{TOTAL_MINT_COUNT} NFTs minted already. Mint yours now.
          </p>
              <Player
            autoplay
            loop
            src="https://assets8.lottiefiles.com/packages/lf20_wZSMXs0yM6.json"
            style={{ height: '100px', width: '100px' }}>
              </Player>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
          )}

          
          {!initiateMinting ? null : mintLink ? <p className="mint-count">Here is your NFT : <a href={mintLink}>{mintLink}</a> </p> : loading() }

        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;