import React from 'react';
import figma from '@figma/code-connect';
import { Drawer } from '@partssource/react-kit';

figma.connect(Drawer, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4445:2825', {
  props: {
    title: figma.string('Title'),
    subtitle: figma.string('Subtitle'),
    open: figma.boolean('Open'),
  },
  example: ({ title, subtitle, open }) => (
    <Drawer open={open} title={title} subtitle={subtitle} onClose={() => {}}>
      {/* drawer body */}
    </Drawer>
  ),
});
