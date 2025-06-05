import { Link } from '@tanstack/react-router';

const Footer = () => (
  <div className="flex flex-col justify-center items-center w-full p-6">
    <Link to={'/about'} className="py-4 text-blue-500 underline">
      About
    </Link>
  </div>
);

export default Footer;
