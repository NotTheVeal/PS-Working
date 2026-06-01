import React from 'react';
import figma from '@figma/code-connect';
import { Radio } from '@partssource/react-kit';

figma.connect(Radio, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4393:45080', {
  props: {
    label: figma.string('Label'),
    checked: figma.boolean('Selected'),
    disabled: figma.boolean('Disabled'),
  },
  example: ({ label, checked, disabled }) => (
    <Radio label={label} defaultChecked={checked} disabled={disabled} />
  ),
});
