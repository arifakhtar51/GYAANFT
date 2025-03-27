import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import axios from 'axios';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

function Donate() {
  const { account, library } = useWeb3React();
  const [bloodType, setBloodType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDonate = async () => {
    if (!bloodType) {
      setError('Please select your blood type');
      return;
    }

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

      const tx = await contract.mintDonationNFT(account, bloodType);
      await tx.wait();

      await axios.post('/api/donations/record', {
        userId: account,
        bloodType,
        transactionHash: tx.hash
      });

      setBloodType('');
      alert('Thank you for your donation! Your NFT has been minted.');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to process donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-red-600 font-semibold tracking-wide uppercase">Donate Blood</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Make a difference today
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Donation Form */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Blood Donation Form</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Select Your Blood Type
                  </label>
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select blood type</option>
                    {bloodTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleDonate}
                  disabled={loading || !account}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading || !account
                      ? 'bg-red-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {loading ? 'Processing...' : 'Donate Blood & Get NFT'}
                </button>

                {!account && (
                  <p className="text-sm text-gray-500 text-center">
                    Please connect your wallet to donate
                  </p>
                )}
              </div>
            </div>

            {/* Benefits Section */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Benefits of Blood Donation</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">🎁</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">Unique NFT</h4>
                    <p className="text-sm text-gray-500">
                      Receive a unique NFT as proof of your donation
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">💉</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">Blood Access</h4>
                    <p className="text-sm text-gray-500">
                      Use your NFT to access blood when needed
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">Educational Benefits</h4>
                    <p className="text-sm text-gray-500">
                      Get discounts on educational courses and products
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">Community Impact</h4>
                    <p className="text-sm text-gray-500">
                      Join a community of donors and make a real difference
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Donate; 