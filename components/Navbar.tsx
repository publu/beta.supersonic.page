import Account from "./Account";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <div className="w-full border-b border-gray-300 h-20">
      <div className="flex flex-row items-center justify-between h-full max-w-5xl mx-auto">
        <Link 
          className="font-bold text-lg flex flex-row"
          to="/"
        >
          <img 
                className="h-8"
                src="/images/logo.png"
          />
          <h1 className="ml-1">SuperSonic</h1>
        </Link>
        <div>
          <Account />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
