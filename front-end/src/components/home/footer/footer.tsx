import { Facebook, Instagram, X } from "react-feather";
import { companyLogo } from "../../../assets";
import { Icon, InfoText } from "../../../units";

export const Footer = () => {
  return (
    <main
      id="contact"
      className="flex flex-col md:flex-row bg-bg-brand mt-8 p-6 md:p-8 justify-between items-center gap-6 md:gap-4"
    >
      {/* Logo */}
      <img 
        src={companyLogo} 
        alt="logo" 
        className="w-12 md:w-16 lg:w-20"
      />
      
      {/* Copyright Text */}
      <InfoText 
        title="Sajilo Aawas  &copy; 2025. All Rights Reserved" 
        className="text-center text-sm md:text-base"
      />
      
      {/* Social Media Section */}
      <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4">
        <InfoText 
          title="Follow us on" 
          className="text-sm md:text-base"
        />
        <div className="flex gap-3 md:gap-4">
          <Icon name={X} className="w-5 h-5 md:w-6 md:h-6" />
          <Icon name={Facebook} className="w-5 h-5 md:w-6 md:h-6" />
          <Icon name={Instagram} className="w-5 h-5 md:w-6 md:h-6" />
        </div>
      </div>
    </main>
  );
};