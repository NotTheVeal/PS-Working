import React from 'react';
import figma from '@figma/code-connect';
import { Banner, ImageBlock, TextBlock, CardGrid } from '@partssource/react-kit';

figma.connect(Banner, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: {
    title: figma.string('Title'),
    subtitle: figma.string('Subtitle'),
  },
  example: ({ title, subtitle }) => <Banner title={title} subtitle={subtitle} />,
});

figma.connect(ImageBlock, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: { src: figma.string('Src'), alt: figma.string('Alt') },
  example: ({ src, alt }) => <ImageBlock src={src} alt={alt} />,
});

figma.connect(TextBlock, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: { content: figma.string('Content') },
  example: ({ content }) => <TextBlock content={content} />,
});

figma.connect(CardGrid, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: { children: figma.children('*') },
  example: ({ children }) => <CardGrid>{children}</CardGrid>,
});
