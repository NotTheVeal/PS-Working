import React from 'react';
import figma from '@figma/code-connect';
import { StatusBadge } from '@partssource/react-kit';

figma.connect(StatusBadge, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: {
    tone: figma.enum('Tone', {
      Neutral: 'neutral',
      Info: 'info',
      Success: 'success',
      Warning: 'warning',
      Critical: 'critical',
      Items: 'items',
    }),
    children: figma.string('Label'),
  },
  example: ({ tone, children }) => (
    <StatusBadge tone={tone}>{children}</StatusBadge>
  ),
});
