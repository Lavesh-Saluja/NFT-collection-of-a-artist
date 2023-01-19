import React,{useState,useEffect,useRef,useContext} from 'react'
import Web3Modal from "web3modal"
import {ethers} from "ethers" 
import {WalletCheck} from '/pages/index'
const LoginPage = () => {
    const WalletHandler =useContext(WalletCheck);
    console.log(WalletHandler,"LoginPage");

    const web3ModalRef = useRef();
    const getProviderOrSigner = async (needSigner = false) => {
        // Connect to Metamask
        // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
        const provider = await web3ModalRef.current.connect();
        const web3Provider = new ethers.providers.Web3Provider(provider);
    
        // If user is not connected to the Goerli network, let them know and throw an error
        const { chainId } = await web3Provider.getNetwork();
        if (chainId !== 5) {
          window.alert("Change the network to Goerli");
          throw new Error("Change network to Goerli");
        }
          const signer = web3Provider.getSigner();
          WalletHandler.setSigner(signer);
          WalletHandler.setProvider(web3Provider);
          console.log('------------------------------------');
          console.log(WalletHandler.provider);
          console.log('------------------------------------');
          WalletHandler.setWalletAddress(await signer.getAddress());
          console.log(WalletHandler.walletAddress)
          return signer;

      };
      const connectWallet = async () => {
        web3ModalRef.current = new Web3Modal({
            network: "goerli",
            providerOptions: {},
            disableInjectedProvider: false,
          });
        try {
          // Get the provider from web3Modal, which in our case is MetaMask
          // When used for the first time, it prompts the user to connect their wallet
          await getProviderOrSigner();
          WalletHandler.setWalletConnected(true);
          console.log(WalletHandler.walletConnected);
        } catch (err) {
          console.error(err);
        }
      };
  return (
    <div className="bg-blue-900 w-[100vw] h-[100vh] text-white">
     <div className="flex justify-center ">
        
         
       {
        WalletHandler.walletConnected?<h1>{WalletHandler.walletAddress.slice(30)}</h1>:<button onClick={connectWallet}>Connect Wallet</button>
       }
        

    </div>

    <div className="flex justify-center">ds</div>
    </div>
   
  )
}

export default LoginPage
