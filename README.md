# Blood Donation NFT Platform

A Web3-based platform that rewards blood donors with NFTs that can be used to access blood when needed and redeem various benefits, including educational discounts.

## Features

- Blood donation tracking with NFT minting
- NFT-based benefits system
- Educational course discounts
- Blood access when needed
- Web3 wallet integration
- Secure authentication
- Real-time transaction tracking

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Web3.js
- Ethers.js
- Axios

### Backend
- Node.js
- Express.js
- PostgreSQL
- Redis
- JWT Authentication

### Blockchain
- Solidity
- OpenZeppelin Contracts
- Ethereum

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- Redis
- MetaMask or other Web3 wallet
- Truffle or Hardhat for smart contract deployment

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/blood-donation-nft.git
cd blood-donation-nft
```

2. Install dependencies:
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
# Backend
PORT=5000
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=blood_donation_nft
DB_PASSWORD=your_db_password
DB_PORT=5432
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret

# Frontend
REACT_APP_API_URL=http://localhost:5000
REACT_APP_CONTRACT_ADDRESS=your_contract_address
REACT_APP_CONTRACT_ABI=your_contract_abi
```

4. Set up the database:
```bash
psql -U your_db_user -d blood_donation_nft -f backend/schema.sql
```

5. Deploy smart contracts:
```bash
cd contracts
truffle migrate --network development
```

## Running the Application

1. Start the backend server:
```bash
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Smart Contract Features

- NFT minting for blood donations
- Benefit tracking and usage
- Blood type verification
- Transfer restrictions
- Usage limits

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Donations
- POST `/api/donations/record` - Record a new blood donation
- GET `/api/donations/:userId` - Get user's donation history

### Benefits
- GET `/api/benefits` - Get available benefits
- POST `/api/benefits/use` - Use a benefit with NFT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenZeppelin for smart contract templates
- The Ethereum community for Web3 tools
- Blood donation organizations worldwide 