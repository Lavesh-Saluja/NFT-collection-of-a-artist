// import Head from 'next/head'
// import Image from 'next/image'
// import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import {ethers} from "ethers";
import React, { useEffect, useRef, useState,createContext} from "react";
import Web3Modal from "web3modal";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants";
import Signer from "components/LoginPage";
import LoginPage from 'components/LoginPage';
const WalletCheck=createContext();
export default function Home() {
  const [presaleStarted, setPresaleStarted] = useState(false);
    // presaleEnded keeps track of whether the presale ended
    const [presaleEnded, setPresaleEnded] = useState(false);
    // loading is set to true when we are waiting for a transaction to get mined
    const [loading, setLoading] = useState(false);
    // checks if the currently connected MetaMask wallet is the owner of the contract
    const [isOwner, setIsOwner] = useState(false);
    // tokenIdsMinted keeps track of the number of tokenIds that have been minted
    const [tokenIdsMinted, setTokenIdsMinted] = useState("0");
  const [walletConnected,setWalletConnected]=useState(false);
  const [walletAddress,setWalletAddress] =useState();
  const [signer,setSigner] = useState();
  const [provider,setProvider] = useState();
  console.log(walletAddress)

async function startPresale() {
  try{
    const contract=new ethers.Contract(NFT_CONTRACT_ADDRESS,abi,signer);
    const tx=await contract.startPresale();
    setLoading(true);
    await tx.wait();
    setLoading(false);
    await checkIfPresaleStarted();
  }
    catch(err){
      console.log('------------------------------------');
      console.log(err);
      console.log('------------------------------------');
    }
}
async function checkPresaleStarted() {
  try{
    const contract=new ethers.Contract(NFT_CONTRACT_ADDRESS,abi,provider);
    const _presaleStarted=await contract.presaleStarted();
    if(!_presaleStarted){
      await getOwner();
    }
    setPresaleStarted(_presaleStarted);
    return _presaleStarted;
  }
    catch(err){
      console.log('------------------------------------');
      console.log(err);
      return false;
      console.log('------------------------------------');
    }
}

const checkPresaleEnded=async()=>{
  try{
    const contract=new ethers.Contract(NFT_CONTRACT_ADDRESS,abi,provider);
    const _presaleEnded=await contract.presaleEnded();
    const hasEnded=_presaleEnded.lt(Math.floor(Date.now()/1000));
    if(hasEnded){
      setPresaleEnded(true);
    }
    else{
      setPresaleEnded(false);
    }
    return hasEnded;
  }catch(err){
    console.error(err);
    return false;
  }
}
const getOwner=async()=>{
  try{
    const contract=new ethers.Contract(NFT_CONTRACT_ADDRESS,abi,provider);
    const _owner=await contract.owner();
    if(walletAddress.toLowerCase()===_owner.toLowerCase()){
      setIsOwner(true);
    }
  }catch(err){
    console.error(err);
  }
}
const getTokenIdsMinted=async()=>{
  try{
    const contract=new ethers.Contract(NFT_CONTRACT_ADDRESS,abi,provider);
    const _tokenIds=await contract.tokenIds();
    setTokenIdsMinted(_tokenIds.toString());

  }catch(err){
    console.error(err);
  }
}





async function presaleMint(){
  try{
    const contract=new ethers.Contract(NFT_CONTRACT_ADDRESS,abi,signer);
    const tx=await contract.presaleMint({
      value: ethers.utils.parseEther("0.001")
    });
    setLoading(true);
    await tx.wait();
    setLoading(false);
    window.alert("You have Successfully minted a NFT");
  }catch(err){
    console.error(err);
  }
  
}
async function mint(){
  try{
    const contract=new ethers.Contract(NFT_CONTRACT_ADDRESS,abi,signer);
    const tx=await contract.mint({
      value: ethers.utils.parseEther("0.001")
    });
    setLoading(true);
    await tx.wait();
    setLoading(false);
    window.alert("You have Successfully minted a NFT");
  }catch(err){
    console.error(err);
  }
}








  useEffect( ()=>{
    const _presaleStarted= checkPresaleStarted();
    if(_presaleStarted){
      checkPresaleEnded();
    }
    getTokenIdsMinted();

    const presaleEndedInterval=setInterval(async ()=>{
      const _presaleStarted=await checkPresaleStarted();
    if(_presaleStarted){
      const _presaleEnded=await checkPresaleEnded();
      if(_presaleEnded){
        clearInterval(presaleEndedInterval)
      }
    }
    },5000);

    setInterval(async function(){
      await getTokenIdsMinted();
    },5000)
  },[walletConnected]);





const renderButtton=()=>{
  if (loading) {
    return <button className={styles.button}>Loading...</button>;
  }
  if (isOwner && !presaleStarted) {
    return (
      <button className={styles.button} onClick={startPresale}>
        Start Presale!
      </button>
    );
  }
  if (!presaleStarted) {
    return (
      <div>
        <div className={styles.description}>Presale hasnt started!</div>
      </div>
    );
  }

if (presaleStarted && !presaleEnded) {
  return (
    <div>
      <div className={styles.description}>
        Presale has started!!! If your address is whitelisted, Mint a Crypto
        Dev 🥳
      </div>
      <button className={styles.button} onClick={presaleMint}>
        Presale Mint 🚀
      </button>
    </div>
  );
}
if (presaleStarted && presaleEnded) {
  return (
    <button className={styles.button} onClick={mint}>
      Public Mint 🚀
    </button>
  );
}

};


  return (
    <>
     <WalletCheck.Provider value={{walletConnected,setWalletConnected,walletAddress,setWalletAddress,signer,setSigner,provider,setProvider}} >
      <LoginPage />
      
        <title>NFT_Collections</title>
      
      <div className={styles.main}>
    <div>
      <h1 className={styles.title}>Welcome</h1>
      <div className={styles.description}>
        Its a NFT Collectino of lavesh Saluja
      </div>
      <div className={styles.description}>
            {tokenIdsMinted}/20 have been minted
          </div>
          {renderButtton()}
    </div>
      </div>
      </WalletCheck.Provider>
    </>
  )
}
export {WalletCheck}