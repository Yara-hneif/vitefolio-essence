import { Builder } from "@/lib/builder";
import Navbar from "../../features/builder/blocks/Navbar";
import Hero from "../../features/builder/blocks/Hero";
import ProjectsGrid from "../../features/builder/blocks/ProjectsGrid";
import AboutSection from "../../features/builder/blocks/AboutSection";
import ContactSection from "../../features/builder/blocks/ContactSection";
import RichText from "../../features/builder/blocks/RichText";
import ImageBlock from "../../features/builder/blocks/ImageBlock";
import Footer from "../../features/builder/blocks/Footer";
import Button from "../../features/builder/blocks/Button";

export const registerBuilderComponents = () => {
  Builder.registerComponent(Navbar, {
    name: "Navbar",
    inputs: [{ name: "logoText", type: "string", defaultValue: "Portfolio" }],
  });
  
  Builder.registerComponent(Hero, {
    name: "Hero",
    inputs: [
      { name: "title", type: "string", defaultValue: "Creating Beautiful Digital Experiences" },
      { name: "subtitle", type: "string", defaultValue: "I'm a passionate developer..." },
      { name: "ctaLabel", type: "string", defaultValue: "View My Work" },
      { name: "ctaHref", type: "string", defaultValue: "/projects" },
    ],
  });
  
  Builder.registerComponent(ProjectsGrid, {
    name: "ProjectsGrid",
    inputs: [
      {
        name: "items",
        type: "list",
        subFields: [
          { name: "title", type: "string" },
          { name: "subtitle", type: "string" },
          { name: "href", type: "string" },
          { name: "imageUrl", type: "string" },
        ],
        defaultValue: [],
      },
    ],
  });
  
  Builder.registerComponent(AboutSection, { 
    name: "AboutSection", 
    inputs: [{ name: "html", type: "html" }] 
  });
  
  Builder.registerComponent(ContactSection, { 
    name: "ContactSection", 
    inputs: [{ name: "mailto", type: "string" }] 
  });
  
  Builder.registerComponent(RichText, { 
    name: "RichText", 
    inputs: [{ name: "html", type: "html" }] 
  });
  
  Builder.registerComponent(ImageBlock, {
    name: "ImageBlock",
    inputs: [
      { name: "url", type: "string" },
      { name: "alt", type: "string" },
      { name: "rounded", type: "boolean", defaultValue: true },
    ],
  });
  
  Builder.registerComponent(Button, {
    name: "Button",
    inputs: [
      { name: "label", type: "string", defaultValue: "Get in Touch" },
      { name: "href", type: "string", defaultValue: "/contact" },
      { name: "variant", type: "string", enum: ["primary", "secondary"], defaultValue: "primary" },
    ],
  });
  
  Builder.registerComponent(Footer, { 
    name: "Footer", 
    inputs: [{ name: "copyright", type: "string" }] 
  });
};