import React from 'react';
import figma from '@figma/code-connect';
import { Checkbox, Radio, Toggle } from '@partssource/react-kit';

figma.connect(Checkbox, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: {
    label: figma.string('Label'),
    checked: figma.boolean('Checked'),
    disabled: figma.boolean('Disabled'),
  },
  example: ({ label, checked, disabled }) => (
    <Checkbox label={label} checked={checked} disabled={disabled} onChange={() => {}} />
  ),
});

figma.connect(Radio, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: {
    label: figma.string('Label'),
    checked: figma.boolean('Checked'),
    disabled: figma.boolean('Disabled'),
  },
  example: ({ label, checked, disabled }) => (
    <Radio label={label} checked={checked} disabled={disabled} onChange={() => {}} />
  ),
});

figma.connect(Toggle, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: {
    label: figma.string('Label'),
    checked: figma.boolean('Checked'),
    disabled: figma.boolean('Disabled'),
  },
  example: ({ label, checked, disabled }) => (
    <Toggle label={label} checked={checked} disabled={disabled} onChange={() => {}} />
  ),
});
