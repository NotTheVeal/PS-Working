import React from 'react';
import figma from '@figma/code-connect';
import { Checkbox } from '@partssource/react-kit';

figma.connect(Checkbox, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=3266:3224', {
  props: {
    label: figma.string('Label'),
    checked: figma.boolean('Checked'),
    disabled: figma.boolean('Disabled'),
  },
  example: ({ label, checked, disabled }) => (
    <Checkbox label={label} defaultChecked={checked} disabled={disabled} />
  ),
});
