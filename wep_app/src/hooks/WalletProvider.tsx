import React, {FC, useContext, createContext, useState} from 'react';

//What do I want to pass as a value from this context?
// walletaddress, walletprovider(metamask | infura), contract, walletIsConnected, function connectWallet, function disconnectWallet, library web3
let obj = {
    text: "Testing",
    message: "Console" 
}

interface Props {
    children: React.ReactNode
}

let WalletContext = createContext(obj);
// I want to know if the useEffect of a context is displayed on its children? Y/N

//If I don't export, It doesnt recognize on the WalletProvider on App.js
//If I don't put the children, it will load the div and then the children:
//The children is then used to receive a placement on the page
export const WalletProvider : React.FC<Props> = ({children}) => {

    const name = 'Caio'

    return(
        //The value expects the same interface as used in the createContext so that the children 
        //can access it.
        <WalletContext.Provider value={obj}>
            {children}
            <div>
                <span>{name}</span>
            </div>
        </WalletContext.Provider>


    );
}

export const useWallets = () => {
    return useContext(WalletContext)
}