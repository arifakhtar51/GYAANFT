import { ethers } from 'ethers';
import BloodDonationNFT from '../../contracts/BloodDonationNFT.json';

export const getContract = async (signer) => {
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const contract = new ethers.Contract(
    contractAddress,
    BloodDonationNFT.abi,
    signer
  );
  return contract;
};

export const formatAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const getNetworkName = (chainId) => {
  switch (chainId) {
    case 1:
      return 'Ethereum Mainnet';
    case 3:
      return 'Ropsten Testnet';
    case 4:
      return 'Rinkeby Testnet';
    case 5:
      return 'Goerli Testnet';
    case 42:
      return 'Kovan Testnet';
    default:
      return 'Unknown Network';
  }
}; 