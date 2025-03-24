import admin from "firebase-admin";
import fs from "fs";

// ✅ Hardcoded Firebase JSON Path (Modify it)
const serviceAccountPath = "C:/Users/Alankritha/firebase-admin-sdk.json";

// ✅ Check if file exists
if (!fs.existsSync(serviceAccountPath)) {
    console.error("❌ Firebase credentials file not found at:", serviceAccountPath);
    process.exit(1);
}

// ✅ Read and parse credentials
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// ✅ Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://your-firebase-project.firebaseio.com"
});

// ✅ Reference Firestore
const db = admin.firestore();

// ✅ Insert Attack Log
const addAttack = async () => {
    try {
        const attackRef = db.collection("attacks").doc();
        await attackRef.set({
            attackType: "SQL Injection",
            attackerIP: "192.168.1.50",
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            country: "India",
            city: "Mumbai",
            status: "Failed"
        });

        console.log("✅ Attack inserted successfully!");
    } catch (error) {
        console.error("❌ Error inserting attack:", error);
    }
};

// ✅ Run Function
addAttack();
