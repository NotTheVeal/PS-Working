import React from 'react';
import figma from '@figma/code-connect';
import { TopNav, LeftNav } from '@partssource/react-kit';

figma.connect(TopNav, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4113:5974', {
  props: { logoSrc: figma.string('LogoSrc') },
  example: ({ logoSrc }) => <TopNav logoSrc={logoSrc} items={[]} />,
});

figma.connect(LeftNav, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4108:5516', {
  props: {},
  example: () => <LeftNav items={[]} />,
});
