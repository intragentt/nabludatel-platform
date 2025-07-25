import React from "react";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

export default function HeroSection({ title, subtitle, imageUrl }: HeroSectionProps) {
  return (
    <section className="text-center py-8 px-4 bg-brand-secondary">
      {imageUrl && (
        <img src={imageUrl} alt={title} className="mx-auto mb-4 max-h-60 object-cover" />
      )}
      <h1 className="text-3xl font-bold mb-2 text-text-primary">{title}</h1>
      {subtitle && <p className="text-lg text-text-secondary">{subtitle}</p>}
    </section>
  );
}
