import React from 'react';
import figma from '@figma/code-connect';
import { ButtonInline } from '@partssource/react-kit';

figma.connect(ButtonInline, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: {
    kind: figma.enum('Kind', {
      Link: 'link',
      'Link Blue': 'link-blue',
      Tall: 'tall',
      Dir: 'dir',
    }),
    children: figma.string('Label'),
  },
  example: ({ kind, children }) => (
    <ButtonInline kind={kind}>{children}</ButtonInline>
  ),
});
