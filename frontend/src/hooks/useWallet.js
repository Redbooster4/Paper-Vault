import{ useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export default function useWallet(){
  const [account, setAccount]=useState(null);
  const [chainId, setChainId]=useState(null);
  const [isConnecting, setIsConnecting]=useState(false);
  const [error, setError]=useState(null);

  const isConnected=!!account;

  const connectWallet=useCallback(async () =>{
    if (!window.ethereum){
      const msg='MetaMask is not installed';
      setError(msg);
      toast.error(msg);
      return null;
    }
    setIsConnecting(true);
    setError(null);
    try{
      console.log("Requesting accounts from MetaMask...");
      const accounts=await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Accounts received:", accounts);
      
      if (!accounts || accounts.length === 0){
        throw new Error("No accounts found. Please unlock MetaMask.");
      }
      
      const chain=await window.ethereum.request({ method: 'eth_chainId' });
      setAccount(accounts[0]);
      setChainId(chain);
      toast.success('Wallet connected!');
      return accounts[0];
    } catch (err){
      setError(err.message);
      toast.error(err.message || 'Failed to connect wallet');
      return null;
    } finally{
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet=useCallback(() =>{
    setAccount(null);
    setChainId(null);
  }, []);

  useEffect(() =>{
    if (!window.ethereum) return;

    const handleAccountsChanged=(accounts) =>{
      setAccount(accounts[0] || null);
    };
    const handleChainChanged=(chain) =>{
      setChainId(chain);
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    // Check if already connected
    window.ethereum.request({ method: 'eth_accounts' }).then((accounts) =>{
      if (accounts.length > 0){
        setAccount(accounts[0]);
        window.ethereum.request({ method: 'eth_chainId' }).then(setChainId);
      }
    });

    return () =>{
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  return{ account, chainId, isConnected, isConnecting, error, connectWallet, disconnectWallet };
}
