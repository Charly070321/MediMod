# MediMod: Decentralized AI Medical Summarizer

MediMod is a decentralized health data assistant that uses AI to summarize patient medical records and securely stores them on IPFS. It allows doctors to retrieve summaries using a CID, view them in a clean interface, and interact with an AI chatbot to ask follow-up questions — all while prioritizing privacy and decentralization.

---

## 🌟 Features

* 🔍 Paste or upload raw patient data
* 🧠 AI-generated medical summary (via Ollama with `meditron` model)
* 📦 Upload summary to IPFS (via NFT.Storage or Web3.Storage)
* 🌐 Display summary with its IPFS CID + QR Code
* 💬 Chat with AI about the patient record

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite), Tailwind CSS
* **Backend:** Node.js, Express
* **AI Model:** Ollama (running `meditron` locally)
* **Storage:** IPFS via `nft.storage` or `web3.storage`

---

## 📁 Folder Structure

```
medimod/
├── backend/
│   ├── routes/
│   │   ├── summary.js
│   │   └── chat.js
│   ├── services/
│   │   ├── ai.js
│   │   └── ipfs.js
│   └── server.js
└── frontend/
    └── [Vite + Tailwind project setup]
```

---

## 🔧 Backend API Endpoints

### `POST /api/generate-summary`

* **Input:** JSON `{ patientText: string }`
* **Output:** `{ summary: string, ipfsCID: string }`

### `POST /api/chat`

* **Input:** JSON `{ summary: string, question: string }`
* **Output:** `{ answer: string }`

---

## 🔮 Coming Soon (Bonus)

* Voice summary using ElevenLabs
* Video generation using Tavus
* Patient summary timeline

---

## 📦 How to Run Locally

### Backend

```bash
cd backend
npm install
node server.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## ✨ Author

Built with ❤️ by Sadiq Haruna
