import { builder, Builder } from '@builder.io/react';
import Hero from '@/components/builder/blocks/Hero';
import AboutSection from '@/components/builder/blocks/AboutSection';
import ContactSection from '@/components/builder/blocks/ContactSection';
import Footer from '@/components/builder/blocks/Footer';
import ImageBlock from '@/components/builder/blocks/ImageBlock';
import Navbar from '@/components/builder/blocks/Navbar';
import ProjectsGrid from '@/components/builder/blocks/ProjectsGrid';
import Button from '@/components/builder/blocks/Button';
import RichText from '@/components/builder/blocks/RichText';

builder.init(import.meta.env.VITE_BUILDER_PUBLIC_KEY!);

Builder.registerComponent(Hero, { name: 'Hero', inputs: [{ name: 'title', type: 'string' }, { name: 'subtitle', type: 'string' }]});
Builder.registerComponent(AboutSection, { name: 'AboutSection' });
Builder.registerComponent(ContactSection, { name: 'ContactSection' });
Builder.registerComponent(ProjectsGrid, { name: 'ProjectsGrid', inputs: [{ name: 'title', type: 'string'}]});
Builder.registerComponent(Footer, { name: 'Footer' });
Builder.registerComponent(Button, { name: 'Button', inputs: [{ name: 'label', type: 'string' }, { name: 'href', type: 'url'}]});
Builder.registerComponent(ImageBlock, { name: 'ImageBlock', inputs: [{ name: 'src', type: 'file'}, { name: 'alt', type: 'string'}]});
Builder.registerComponent(RichText, { name: 'RichText', inputs: [{ name: 'text', type: 'richText'}]});

export { builder };
