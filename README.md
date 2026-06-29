# 🌟 FairDeal Marketing🌟


## 👥 Team Name
**Debug Demons**

## 👤 Team Members
| Name | Email | LinkedIn |
| ---- | ----- | -------- |
| N Somendra | 22501a05c2@pvpsit.ac.in | [LinkedIn](https://www.linkedin.com/in/somendra-n/) |
| K Manmohan | 22501a0578@pvpsit.ac.in | [LinkedIn](https://www.linkedin.com/in/manmohan-kancherla/) |
| M Sai Harshith | 22501a05a1@pvpsit.ac.in | [LinkedIn](https://www.linkedin.com/in/sai-harshith-madarapu-97468126b/) |

---

## 📖 Project Description
**FairDeal** is a **decentralized marketplace** enabling middlemen to sell products **without upfront investment**. Powered by **blockchain smart contracts**, it ensures:

- Transparent and fair commission splitting  
- Easy product listing for manufacturers  
- Automated revenue distribution:  
  - **Manufacturer:** 70-80% of sale price  
  - **Middleman:** 20-25% of sale price  

A win-win ecosystem for grassroots entrepreneurs! 🚀

---

## 🔗 Smart Contract Overview
**Move Language** | **Aptos Blockchain**

Key Features:  
- ✅ Add products with pricing & commission splits  
- ✅ Buy products with automatic revenue split  
- ✅ Emit events for transparency (NewProduct & Purchase)  

```move
module fairsell::FairSell {
    struct Product { 
        id: u64, 
        middleman: address, 
        manufacturer: address, 
        price: u64, 
        mfg_bps: u64, 
        mm_bps: u64, 
        active: bool, 
        meta: string::String 
    }

    struct Registry { 
        products: vector<Product>, 
        next_id: u64, 
        add_events: event::EventHandle<NewProductEvent>, 
        buy_events: event::EventHandle<PurchaseEvent> 
    }

    public entry fun add_product(...) { /* Adds product & emits event */ }
    public entry fun buy(...) { /* Handles purchase & revenue split */ }
}
````

> Full smart contract is in `contracts/` folder.

---

## 🛠 Tech Stack

| Layer           | Technology                            |
| --------------- | ------------------------------------- |
| **Frontend**    | React (`client/`)                     |
| **Backend API** | Node.js, Express, MongoDB (`server/`) |
| **Blockchain**  | Move Smart Contracts (`contracts/`)   |

---

## 📁 Project Structure

```
fairdeal-blockchain/
├── client/           # React frontend
├── server/           # Node.js + Express backend
├── contracts/        # Move smart contracts
├── README.md         # This file
```

---

## 💻 Getting Started

### 1️⃣ Backend

```bash
cd server
npm install
node server.js
```

Runs at: `http://localhost:5000`

### 2️⃣ Frontend

```bash
cd client
npm install
npm start
```

Runs at: `http://localhost:3000`

### 3️⃣ Compile & Deploy Smart Contracts

* Use **Aptos CLI** or **Sui CLI**
* Official Docs:

  * [Aptos](https://aptos.dev/)
  * [Sui](https://docs.sui.io/)

---

## ⚙ How It Works

1. Manufacturer adds products via backend
2. Middlemen browse & sell products on frontend
3. Smart contract triggers automatic revenue split
4. Backend updates product status
5. Blockchain ensures transparency & trust

---

## 🔐 Wallet & Security

* Frontend integrates crypto wallets (Aptos/Sui)
* Secure key management & transaction approvals
* SDKs: `aptos-wallet-adapter` or `sui-wallet-kit`

---

## 📈 Roadmap

* Full blockchain integration in frontend & backend
* User authentication & profiles
* Inventory management for middlemen
* Multi-payment options (crypto + fiat)
* Cloud deployment for production

---

## 💖 Why FairDeal?

FairDeal **breaks financial barriers** and empowers grassroots entrepreneurs. Blockchain ensures a **fair, transparent, and trustless marketplace** for all stakeholders. 🌱

---

## 🖼 Screenshots

<img width="871" height="776" alt="image" src="https://github.com/user-attachments/assets/6148e2e6-ba56-4088-a250-7ce6ec1ce16a" />
<img width="858" height="627" alt="image" src="https://github.com/user-attachments/assets/f26cb375-33e1-4a0e-88fd-c35ebc37cc1d" />
<img width="1362" height="342" alt="image" src="https://github.com/user-attachments/assets/bdf0f324-bdb8-4d85-9209-894ce3fdad1f" />
<img width="1347" height="297" alt="image" src="https://github.com/user-attachments/assets/478571e1-1fcd-4f32-bed1-0620d7168e1d" />

---


```
