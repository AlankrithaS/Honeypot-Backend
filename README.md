
# 🛡️ Honeypot Backend  

## 📌 Overview  
The **Honeypot Backend** is responsible for capturing, storing, and analyzing unauthorized SSH and HTTP attack attempts. It leverages **Firebase Firestore** as a NoSQL database and **Socket.IO** for real-time monitoring of attacks.  

## 🚀 Tech Stack  
- **Backend Framework:** Node.js with Express.js  
- **Database:** Firebase Firestore  
- **Real-time Updates:** Socket.IO  
- **Authentication:** Firebase Admin SDK  
- **Environment Management:** dotenv  

## 🛠️ Installation & Setup  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/AlankrithaS/Honeypot-Backend.git
cd Honeypot-Backend
```

### 2️⃣ Install Dependencies  
```bash
npm install
```

### 3️⃣ Setup Firebase Credentials  
- Obtain Firebase Admin SDK JSON file from your Firebase project.  
- Place it in the root directory as **firebase-admin-sdk.json**  
- Alternatively, define the path in **.env**:  
  ```
  FIREBASE_CREDENTIALS_PATH=./firebase-admin-sdk.json
  PORT=5000
  ```

### 4️⃣ Run the Server  
```bash
npm start
```
> The backend runs on `http://localhost:5000/` by default.  

---

## 🔑 Features  
✅ Stores attack logs in Firebase Firestore  
✅ Real-time updates using Socket.IO  
✅ Provides API endpoints for logs & trends  
✅ Auto-generates test logs for debugging  
✅ Secure environment management via dotenv  

---

## 📂 Project Structure  
```
📂 Honeypot-Backend
 ┣ 📂 controllers   # Request handlers
 ┣ 📂 models        # Database schema (if applicable)
 ┣ 📂 routes        # API endpoints
 ┣ 📂 middleware    # Security/auth layers
 ┣ 📜 server.js     # Main backend file
 ┣ 📜 firebase-admin-sdk.json  # Firebase credentials (not committed)
 ┣ 📜 .env          # Environment variables
 ┣ 📜 package.json  # Dependencies
 ┣ 📜 README.md     # Project info
```

---

## 🔌 API Endpoints  

| Method | Endpoint           | Description                  |
|--------|-------------------|------------------------------|
| GET    | `/api/attacks`    | Retrieve honeypot logs      |
| POST   | `/api/attacks`    | Log an attack event         |
| GET    | `/api/trends`     | Fetch summarized attack data |

### 🔄 Real-time Updates (Socket.IO Events)  
- **`newAttackLog`**: Sent whenever a new attack is recorded.  
- Clients can listen for real-time updates like this:  
  ```javascript
  const socket = io("http://localhost:5000");
  socket.on("newAttackLog", (log) => {
    console.log("New Attack:", log);
  });
  ```

---

## 🏗️ Database Schema (Firestore)  
Each attack log is stored as a **document** in the `attack_logs` collection:  
```json
{
  "type": "Brute Force",
  "sourceIP": "192.168.1.10",
  "timestamp": 1711309874000
}
```
