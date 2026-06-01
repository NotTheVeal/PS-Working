import React from 'react';
import figma from '@figma/code-connect';
import { EmptyState } from '@partssource/react-kit';

figma.connect(EmptyState, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: {
    title: figma.string('Title'),
    body: figma.string('Body'),
    tone: figma.enum('Tone', {
      Info: 'info',
      Neutral: 'neutral',
      Success: 'success',
      Warning: 'warning',
      Error: 'error',
    }),
    inline: figma.boolean('Inline'),
  },
  example: ({ title, body, tone, inline }) => (
    <EmptyState title={title} body={body} tone={tone} inline={inline} />
  ),
});
