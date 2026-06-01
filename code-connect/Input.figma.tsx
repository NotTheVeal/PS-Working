import React from 'react';
import figma from '@figma/code-connect';
import { Input, Dropdown } from '@partssource/react-kit';

figma.connect(Input, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: {
    label: figma.string('Label'),
    placeholder: figma.string('Placeholder'),
    size: figma.enum('Size', { SM: 'sm', LG: 'lg' }),
    disabled: figma.boolean('Disabled'),
  },
  example: ({ label, placeholder, size, disabled }) => (
    <Input label={label} placeholder={placeholder} size={size} disabled={disabled} />
  ),
});

figma.connect(Dropdown, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: {
    label: figma.string('Label'),
    placeholder: figma.string('Placeholder'),
    disabled: figma.boolean('Disabled'),
  },
  example: ({ label, placeholder, disabled }) => (
    <Dropdown label={label} placeholder={placeholder} disabled={disabled} />
  ),
});
