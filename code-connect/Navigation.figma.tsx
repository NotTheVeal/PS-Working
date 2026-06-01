import React from 'react';
import figma from '@figma/code-connect';
import { TopNav, LeftNav } from '@partssource/react-kit';

figma.connect(TopNav, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: { logoSrc: figma.string('LogoSrc') },
  example: ({ logoSrc }) => <TopNav logoSrc={logoSrc} items={[]} />,
});

figma.connect(LeftNav, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: {},
  example: () => <LeftNav items={[]} />,
});
