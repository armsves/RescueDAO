# RescueDAO - Complete Navigation Map

```
🏠 RescueDAO Platform
│
├─ 🏠 Home (/)
│  ├─ Hero Section
│  ├─ NFT Features Grid
│  ├─ ❤️ Donation System Section (NEW!)
│  ├─ How It Works
│  ├─ Use Cases
│  └─ Tech Stack
│
├─ 🎨 NFT Mint (/nft-mint)
│  ├─ Public Metadata Upload (Pinata)
│  ├─ Private Medical Records (Pinata Private)
│  ├─ FHE Encryption
│  └─ Mint NFT Function
│
├─ 🖼️ Gallery (/gallery)
│  ├─ All Minted NFTs Grid
│  ├─ Public Data Display
│  └─ Private Medical Data (owners only)
│
├─ ❤️ Donate (/donate) ✨ NEW!
│  ├─ Public Donation Portal
│  ├─ One-Time Donations
│  ├─ Recurring Donations
│  ├─ Shelter Selection
│  └─ Transparency Info
│
├─ 👑 Admin (/admin) ✨ NEW!
│  ├─ Register New Shelters
│  ├─ View All Shelters
│  ├─ Shelter Management
│  └─ Role Configuration
│
├─ 🤝 Donor (/donor) ✨ NEW!
│  ├─ Donation History
│  ├─ Make Donations
│  ├─ Track Total Donated
│  └─ View Supported Shelters
│
└─ 🐾 Shelter (/shelter) ✨ NEW!
   ├─ Add Animals
   ├─ Manage Pet Listings
   ├─ View Donations Received
   ├─ Current Balance
   └─ Withdraw Funds

⚙️ RoleConfig (Floating Button - All Donation Pages)
   ├─ Set Admin Address
   ├─ Add Protectora
   ├─ Add Donor
   ├─ View Configuration
   └─ Clear All Data
```

## 🎯 Page Access Control

| Page | Access Level | Requirements |
|------|-------------|--------------|
| Home | Public | None |
| NFT Mint | Public | Wallet connected |
| Gallery | Public | None (ownership check for private data) |
| **Donate** | **Public** | **None (wallet for transactions)** |
| **Admin** | **Role-Based** | **Admin address in RoleConfig** |
| **Donor** | **Wallet-Based** | **Wallet connected** |
| **Shelter** | **Role-Based** | **Protectora address in RoleConfig** |

## 🔄 User Journeys

### Journey 1: Public Donor
```
1. Connect Wallet
2. Visit /donate
3. Select shelter
4. Choose amount
5. Confirm donation
6. View in /donor dashboard
```

### Journey 2: Shelter Manager
```
1. Connect Wallet
2. Use RoleConfig to add as protectora
3. Visit /shelter
4. Add animals
5. Track donations
6. Withdraw funds
```

### Journey 3: Admin
```
1. Connect Wallet
2. Use RoleConfig to set as admin
3. Visit /admin
4. Register new shelters
5. Monitor system
```

### Journey 4: NFT Creator
```
1. Connect Wallet
2. Visit /nft-mint
3. Upload public data (Pinata)
4. Upload medical files (Pinata Private)
5. Encrypt owner with FHE
6. Mint NFT
7. View in /gallery
```

## 🎨 Header Navigation

The header now shows:
- 🏠 Home
- 🎨 NFT Mint
- 🖼️ Gallery
- ❤️ Donate ✨ NEW!
- 👑 Admin ✨ NEW!
- 🤝 Donor ✨ NEW!
- 🐾 Shelter ✨ NEW!
- 💳 Connect Wallet (RainbowKit)

Active page is highlighted with yellow background.

## 📱 Mobile Navigation

Burger menu includes all links with emoji icons for easy identification.

## 🎮 Quick Links from Homepage

Three primary CTAs in hero section:
1. 🎨 **Mint Pet NFT** → `/nft-mint`
2. 🖼️ **View Gallery** → `/gallery`
3. ❤️ **Support Shelters** → `/donate` ✨ NEW!

Additional CTA in Donation section:
- ❤️ **Go to Donation Portal** → `/donate`
