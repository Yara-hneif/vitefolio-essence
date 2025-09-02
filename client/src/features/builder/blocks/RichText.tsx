import React from "react";

type Props = {
  html?: string;
};

export default function RichText({ html = "<p>Add your content here...</p>" }: Props) {
  return (
    <div className="w-full py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div 
          className="prose prose-lg max-w-none text-foreground"
          dangerouslySetInnerHTML={{ __html: html }} 
        />
      </div>
    </div>
  );
}