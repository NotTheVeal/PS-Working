import React from 'react';
import figma from '@figma/code-connect';
import { Drawer } from '@partssource/react-kit';

figma.connect(Drawer, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: {
    title: figma.string('Title'),
    open: figma.boolean('Open'),
    children: figma.children('*'),
  },
  example: ({ title, open, children }) => (
    <Drawer title={title} open={open} onClose={() => {}}>{children}</Drawer>
  ),
});
