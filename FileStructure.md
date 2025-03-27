blood-donation-nft/
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
├── .env
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   ├── favicon.ico
│   │   ├── logo192.png
│   │   └── logo512.png
│   └── src/
│       ├── App.js
│       ├── index.js
│       ├── index.css
│       ├── components/
│       │   ├── Navbar.js
│       │   ├── Footer.js
│       │   ├── LoadingSpinner.js
│       │   └── ErrorAlert.js
│       ├── pages/
│       │   ├── Home.js
│       │   ├── Donate.js
│       │   ├── Benefits.js
│       │   ├── Profile.js
│       │   ├── Login.js
│       │   └── Register.js
│       └── utils/
│           ├── web3.js
│           ├── api.js
│           └── helpers.js
├── backend/
│   └── ... (backend files)
└── contracts/
    └── ... (smart contract files)