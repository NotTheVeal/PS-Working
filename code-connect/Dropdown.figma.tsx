import React from 'react';
import figma from '@figma/code-connect';
import { Dropdown } from '@partssource/react-kit';

figma.connect(Dropdown, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=396:1548', {
  props: {
    label: figma.string('Label'),
    size: figma.enum('Size', { MD: 'md', LG: 'lg' }),
  },
  example: ({ label, size }) => (
    <Dropdown label={label} size={size} options={[]} />
  ),
});
