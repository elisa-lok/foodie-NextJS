"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "@/components/UI/Button.jsx";
import Cart from "@/components/Cart";
import Checkout from "@/components/Checkout";
import LoginModal from "@/components/LoginModal";
import RegisterModal from "@/components/RegisterModal";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "@/app/store/modal";
import { useRouter } from "next/navigation";
import { checkUserLogin } from "@/utils/auth";

const Header = () => {
  const dispatch = useDispatch();
  const cartQuantity = useSelector((state) => state.cart.totalQuantity);
  const router = useRouter();

  const handleClickAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, user is not logged in.");
        dispatch(modalActions.openLoginModal());
        return;
      }

      const response = await checkUserLogin(token);

      if (response.data.status === 200) {
        console.log("User is logged in:", response.data.user);
        router.push("/account");
      } else {
        console.log("User is not logged in:", response.data.message);
        dispatch(modalActions.openLoginModal());
      }
    } catch (error) {
      console.log(error);
      dispatch(modalActions.openLoginModal());
    }
  };

  return (
    <header id="main-header">
      <div id="title">
        <Link href="/">
          <Image
            className="w-16 h-16 object-contain rounded-lg border-2 border-spacing-1 border-red-200 "
            src="/assets/logo.jpg"
            alt="food order"
            width={100}
            height={100}
          />
        </Link>
        <h1>Level One Pizza</h1>
      </div>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {/* <div onClick={handleLoginClick} style={{ cursor: "pointer" }}>
          <Image src="/assets/login.png" alt="Login" width={24} height={24} />
        </div> */}
        <Button textButton onClick={handleClickAccount}>
          Account
        </Button>
        <Button
          textButton
          onClick={() => dispatch(modalActions.openCartModal())}
        >
          Cart({cartQuantity})
        </Button>
      </nav>
      <Cart />
      <Checkout />
      <LoginModal />
      <RegisterModal />
    </header>
  );
};

export default Header;
