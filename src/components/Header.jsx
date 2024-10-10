"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "@/components/UI/Button.jsx";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "@/app/store/modal";

const Header = () => {
  const dispatch = useDispatch();
  const cartQuantity = useSelector((state) => state.cart.totalQuantity);

  const handleLoginClick = () => {
    dispatch(modalActions.openLoginModal());
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
      <nav style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div onClick={handleLoginClick} style={{ cursor: "pointer" }}>
          <Image src="/assets/login.png" alt="Login" width={24} height={24} />
        </div>
        <Button
          textButton
          onClick={() => dispatch(modalActions.openCartModal())}
        >
          Cart({cartQuantity})
        </Button>
      </nav>
    </header>
  );
};

export default Header;
