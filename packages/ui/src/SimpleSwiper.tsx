import React from "react";

interface SimpleSwiperProps {
  slides: string[];
}

export default function SimpleSwiper({ slides }: SimpleSwiperProps) {
  return (
    <div className="relative overflow-hidden" data-simple-swiper>
      <div className="flex transition-transform duration-500" data-track>
        {slides.map((text, i) => (
          <div
            key={i}
            className="min-w-full bg-gray-200 flex items-center justify-center py-10"
          >
            <p className="text-xl font-bold text-text-primary">{text}</p>
          </div>
        ))}
      </div>
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 px-2 py-1"
        data-prev
      >
        ‹
      </button>
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 px-2 py-1"
        data-next
      >
        ›
      </button>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){var c=document.currentScript.parentElement;var t=c.querySelector('[data-track]');var s=t.children;var i=0;function u(){t.style.transform='translateX('+(i*-100)+'%')};c.querySelector('[data-next]').addEventListener('click',function(){i=(i+1)%s.length;u()});c.querySelector('[data-prev]').addEventListener('click',function(){i=(i-1+s.length)%s.length;u()});})();`,
        }}
      />
    </div>
  );
}
