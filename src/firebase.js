// Import các thư viện cần thiết từ Firebase
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Thay thế bằng thông tin của BẠN từ Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDSxrd4pwZcO-z0-PiKxkja_BcALUV31pY",
  authDomain: "plume-airdrop-project.firebaseapp.com",
  projectId: "plume-airdrop-project",
  storageBucket: "plume-airdrop-project.firebasestorage.app",
  messagingSenderId: "821304748037",
  appId: "1:821304748037:web:97fc586f66108a37e4146c",
  measurementId: "G-0XBXGRS7TM"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo các dịch vụ chúng ta sẽ dùng
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Xuất các dịchVụ ra để các file khác có thể dùng
export { auth, db, googleProvider };