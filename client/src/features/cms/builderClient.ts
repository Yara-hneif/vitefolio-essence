import { builder, Builder } from '@builder.io/react';
import Hero from '@/features/builder/blocks/Hero';
import AboutSection from '@/features/builder/blocks/AboutSection';
import ContactSection from '@/features/builder/blocks/ContactSection';
import Footer from '@/features/builder/blocks/Footer';
import ImageBlock from '@/features/builder/blocks/ImageBlock';
import Navbar from '@/features/builder/blocks/Navbar';
import ProjectsGrid from '@/features/builder/blocks/ProjectsGrid';
import Button from '@/features/builder/blocks/Button';
import RichText from '@/features/builder/blocks/RichText';

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
