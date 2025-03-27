import React from 'react';
import { useWeb3React } from '@web3-react/core';

function Profile() {
  const { account } = useWeb3React();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-red-600 font-semibold tracking-wide uppercase">Profile</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Your Account Information
          </p>
        </div>

        <div className="mt-10 max-w-xl mx-auto">
          <div className="card">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Wallet Address</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected'}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">Donation History</h3>
                <p className="mt-1 text-sm text-gray-500">
                  View your blood donation history and NFT collection
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">Benefits Status</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Check your available benefits and usage history
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 