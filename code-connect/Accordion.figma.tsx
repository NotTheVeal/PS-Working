import React from 'react';
import figma from '@figma/code-connect';
import { Accordion } from '@partssource/react-kit';

figma.connect(Accordion, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: {
    title: figma.string('Title'),
    subtitle: figma.string('Subtitle'),
    variant: figma.enum('Variant', {
      Default: 'default',
      Row: 'row',
      Filled: 'filled',
    }),
    defaultOpen: figma.boolean('Open'),
  },
  example: ({ title, subtitle, variant, defaultOpen }) => (
    <Accordion title={title} subtitle={subtitle} variant={variant} defaultOpen={defaultOpen}>
      {/* accordion content */}
    </Accordion>
  ),
});
