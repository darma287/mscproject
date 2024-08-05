import React from 'react';
import { HiMiniAtSymbol } from "react-icons/hi2";
import { BiLogoInstagramAlt } from "react-icons/bi";
import { BiLogoTwitter } from "react-icons/bi";
import { BiEnvelope } from "react-icons/bi"; 
import Image from 'next/image';
import { useRouter } from 'next/router';

function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-background border-t border-forGrey py-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col items-center md:items-start gap-4 mb-4 md:mb-0">
          <div className="flex gap-4">
            <a href="https://www.instagram.com/darma__p/" target="_blank" rel="noopener noreferrer">
              <BiLogoInstagramAlt className="text-forGrey w-6 h-6 cursor-pointer" />
            </a>
            <a href="https://x.com/darma_uiux" target="_blank" rel="noopener noreferrer">
              <BiLogoTwitter className="text-forGrey w-6 h-6 cursor-pointer" />
            </a>
            <a href="mailto:darmaparamarta@gmail.com">
              <BiEnvelope className="text-forGrey w-6 h-6 cursor-pointer" />
            </a>
          </div>
          <div className="text-forGrey opacity-45 text-sm">
            Created by Darma Paramarta
            <br />
            for University of Glasgow MSc Program
          </div>
        </div>

        <div className=" items-center">
          <Image src="/logo-color.svg" alt="Logo" width={150} height={40} onClick={() => router.push('/')} className="cursor-pointer" />
          <div className="text-forGrey mb-4 md:mb-0">
          © 2024 GameMate
        </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
