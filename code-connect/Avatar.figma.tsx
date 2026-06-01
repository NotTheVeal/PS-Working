import React from 'react';
import figma from '@figma/code-connect';
import { Avatar } from '@partssource/react-kit';

figma.connect(Avatar, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: {
    initials: figma.string('Initials'),
    size: figma.enum('Size', {
      XS: 'xs',
      SM: 'sm',
      MD: 'md',
      LG: 'lg',
      XL: 'xl',
    }),
    tone: figma.enum('Tone', {
      Blue: 'blue',
      Green: 'green',
      Orange: 'orange',
      Purple: 'purple',
      Red: 'red',
      Neutral: 'neutral',
      Brand: 'brand',
      Inverse: 'inverse',
    }),
    status: figma.enum('Status', {
      Online: 'online',
      Busy: 'busy',
      Away: 'away',
      Offline: 'offline',
    }),
  },
  example: ({ initials, size, tone, status }) => (
    <Avatar initials={initials} size={size} tone={tone} status={status} />
  ),
});
