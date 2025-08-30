import React from "react";

type Props = {
  url?: string;
  alt?: string;
  rounded?: boolean;
};

export default function ImageBlock({ 
  url = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop", 
  alt = "Image", 
  rounded = true 
}: Props) {
  return (
    <div className="w-full py-8">
      <div className="max-w-4xl mx-auto px-4">
        <img 
          src={url} 
          alt={alt}
          className={`w-full h-auto shadow-lg ${rounded ? 'rounded-xl' : ''}`}
        />
      </div>
    </div>
  );
}