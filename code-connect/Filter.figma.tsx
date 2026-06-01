import React from 'react';
import figma from '@figma/code-connect';
import { FilterChip, FilterShell } from '@partssource/react-kit';

figma.connect(FilterChip, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: {
    label: figma.string('Label'),
    active: figma.boolean('Active'),
  },
  example: ({ label, active }) => (
    <FilterChip label={label} active={active} onClick={() => {}} />
  ),
});

figma.connect(FilterShell, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: { children: figma.children('*') },
  example: ({ children }) => <FilterShell>{children}</FilterShell>,
});
