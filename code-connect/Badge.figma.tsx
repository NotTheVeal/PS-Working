import React from 'react';
import figma from '@figma/code-connect';
import { StatusBadge, ListTypeBadge } from '@partssource/react-kit';

figma.connect(StatusBadge, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4390:43755', {
  props: {
    label: figma.string('Label'),
  },
  example: ({ label }) => <StatusBadge label={label} />,
});

figma.connect(ListTypeBadge, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4391:44857', {
  props: {
    label: figma.string('Label'),
  },
  example: ({ label }) => <ListTypeBadge label={label} />,
});
