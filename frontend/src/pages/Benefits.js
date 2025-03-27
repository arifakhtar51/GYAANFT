import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import axios from 'axios';

function Benefits() {
  const { account, library } = useWeb3React();
  const [nfts, setNfts] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (account) {
      fetchNFTs();
      fetchBenefits();
    }
  }, [account]);

  const fetchNFTs = async () => {
    try {
      const response = await axios.get(`/api/donations/${account}`);
      setNfts(response.data);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      setError('Failed to load your NFTs');
    }
  };

  const fetchBenefits = async () => {
    try {
      const response = await axios.get('/api/benefits');
      setBenefits(response.data);
    } catch (error) {
      console.error('Error fetching benefits:', error);
      setError('Failed to load available benefits');
    } finally {
      setLoading(false);
    }
  };

  const redeemBenefit = async (tokenId, benefitType) => {
    try {
      setLoading(true);
      setError('');

      const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
      const contractABI = JSON.parse(process.env.REACT_APP_CONTRACT_ABI);
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        library.getSigner()
      );

      const tx = await contract.useBenefit(tokenId, benefitType);
      await tx.wait();

      await axios.post('/api/benefits/use', {
        tokenId,
        benefitType,
        transactionHash: tx.hash
      });

      await fetchNFTs();
      alert('Benefit redeemed successfully!');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to redeem benefit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-red-600 font-semibold tracking-wide uppercase">Your Benefits</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Unlock the power of your NFTs
          </p>
        </div>

        {error && (
          <div className="mt-8 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {!account ? (
          <div className="mt-8 text-center">
            <p className="text-gray-500">Please connect your wallet to view benefits</p>
          </div>
        ) : nfts.length === 0 ? (
          <div className="mt-8 text-center">
            <p className="text-gray-500">You don't have any donation NFTs yet</p>
            <a
              href="/donate"
              className="mt-4 inline-block text-red-600 hover:text-red-700"
            >
              Donate blood to get started
            </a>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {nfts.map((nft) => (
              <div key={nft.tokenId} className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Blood Donation NFT #{nft.tokenId}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {nft.bloodType}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Donation Date:</span>
                    <span>{new Date(nft.donationDate * 1000).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Benefits Used:</span>
                    <span>{nft.benefitsUsed}/3</span>
                  </div>

                  {!nft.isUsed && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Available Benefits:</h4>
                      <div className="space-y-2">
                        {benefits.map((benefit) => (
                          <button
                            key={benefit.id}
                            onClick={() => redeemBenefit(nft.tokenId, benefit.name)}
                            disabled={loading}
                            className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md text-sm text-gray-700 transition-colors duration-200"
                          >
                            <div className="flex justify-between items-center">
                              <span>{benefit.name}</span>
                              <span className="text-red-600">{benefit.discountPercentage}% discount</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Benefits; 