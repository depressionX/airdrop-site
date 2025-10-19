import React, { useState, useEffect } from 'react';
// Import các công cụ Firebase chúng ta vừa tạo
import { auth, db, googleProvider } from './firebase'; 
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Import CSS để làm đẹp (chúng ta sẽ tạo file này sau)
import './App.css'; 

function App() {
  const [user, setUser] = useState(null); // Biến lưu thông tin người dùng
  const [wallet, setWallet] = useState(null); // Biến lưu địa chỉ ví

  // Hàm xử lý đăng nhập
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const loggedInUser = result.user;
      
      // Sau khi đăng nhập, lưu thông tin người dùng vào Firestore
      const userRef = doc(db, "users", loggedInUser.uid);
      await setDoc(userRef, {
        uid: loggedInUser.uid,
        email: loggedInUser.email,
        displayName: loggedInUser.displayName,
      }, { merge: true }); // merge: true để không ghi đè nếu đã tồn tại

    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
    }
  };

  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  // Hàm này sẽ chạy mỗi khi trạng thái đăng nhập thay đổi
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Người dùng đã đăng nhập
        setUser(currentUser);
        
        // Truy vấn Firestore để lấy ví đã gán
        const walletRef = doc(db, "allocations", currentUser.uid);
        const walletSnap = await getDoc(walletRef);

        if (walletSnap.exists()) {
          // Nếu tìm thấy ví
          setWallet(walletSnap.data().walletAddress);
        } else {
          // Nếu không tìm thấy ví
          setWallet("Chưa được gán ví");
        }
      } else {
        // Người dùng đã đăng xuất
        setUser(null);
        setWallet(null);
      }
    });

    // Dọn dẹp khi component bị gỡ
    return () => unsubscribe();
  }, []); // [] nghĩa là chỉ chạy 1 lần khi tải trang

  return (
    <div className="container">
      <header>
        <h1>My Airdrop Claim</h1>
        {/* Nếu đã đăng nhập thì hiện nút Đăng xuất, ngược lại hiện nút Đăng nhập */}
        {user ? (
          <button onClick={handleLogout} className="connect-button">
            Đăng xuất ({user.displayName})
          </button>
        ) : (
          <button onClick={handleGoogleLogin} className="connect-button">
            Đăng nhập bằng Google
          </button>
        )}
      </header>

      <main>
        <div className="claim-box">
          {/* Kiểm tra trạng thái người dùng để hiển thị nội dung */}
          {!user ? (
            // TRẠNG THÁI CHƯA ĐĂNG NHẬP
            <>
              <h2>Chào mừng bạn đến với dự án<nav></nav><nav></nav></h2>
              <p>Sử dụng tài khoản Google để kiểm tra phân bổ airdrop của bạn.</p>
              <button onClick={handleGoogleLogin} className="connect-button large">
                Đăng nhập Google
              </button>
            </>
          ) : (
            // TRẠNG THÁI ĐÃ ĐĂNG NHẬP
            <>
              <h2>Chào mừng, {user.displayName}!</h2>
              <p>Địa chỉ ví được phân bổ cho bạn là:</p>
              <div className="wallet-address">
                {/* Hiển thị ví hoặc thông báo chờ */}
                {wallet ? wallet : "Đang tải thông tin ví..."}
              </div>
            </>
          )}
        </div>
      </main>

      <footer>
        <p>© 2025 PLUME AIRDROP</p>
      </footer>
    </div>
  );
}

export default App;