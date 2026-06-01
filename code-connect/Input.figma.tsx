import React from 'react';
import figma from '@figma/code-connect';
import { Input } from '@partssource/react-kit';

figma.connect(Input, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: {
    label: figma.string('Label'),
    size: figma.enum('Size', { MD: 'md', LG: 'lg' }),
    state: figma.enum('State', {
      Default: 'default',
      Hover: 'hover',
      Focus: 'focus',
      'With Value': 'withValue',
      Disabled: 'disabled',
      Error: 'error',
    }),
    error: figma.string('Error Text'),
    helperText: figma.string('Helper Text'),
  },
  example: ({ label, size, state, error, helperText }) => (
    <Input label={label} size={size} state={state} error={error} helperText={helperText} />
  ),
});
