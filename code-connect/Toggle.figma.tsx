import React from 'react';
import figma from '@figma/code-connect';
import { Toggle } from '@partssource/react-kit';

figma.connect(Toggle, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4393:45573', {
  props: {
    label: figma.string('Label'),
    checked: figma.boolean('On'),
    disabled: figma.boolean('Disabled'),
  },
  example: ({ label, checked, disabled }) => (
    <Toggle label={label} defaultChecked={checked} disabled={disabled} />
  ),
});
