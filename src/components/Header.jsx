import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return (
    <header className="flex justify-between items-center p-12">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Image
            className="w-16 h-16 object-contain rounded-lg border-2 border-spacing-1 border-red-200 "
            src="/assets/logo.jpg"
            alt="food order"
            width={100}
            height={100}
          />
        </Link>
        <h1>Food Order</h1>
      </div>
      <nav>
        <button>Cart</button>
      </nav>
    </header>
  );
};

export default Header;
