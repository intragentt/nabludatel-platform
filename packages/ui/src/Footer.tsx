import React from "react";

interface FooterProps {
  copyright: string;
}

export default function Footer({ copyright }: FooterProps) {
  return (
    <footer className="py-4 text-center border-t border-gray-200 text-sm text-text-secondary">
      {copyright}
    </footer>
  );
}
