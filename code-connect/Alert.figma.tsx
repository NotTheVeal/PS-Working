import React from 'react';
import figma from '@figma/code-connect';
import { Alert, Toast } from '@partssource/react-kit';

figma.connect(Alert, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: {
    title: figma.string('Title'),
    message: figma.string('Message'),
  },
  example: ({ title, message }) => (
    <Alert title={title} message={message} />
  ),
});

figma.connect(Toast, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: {
    message: figma.string('Message'),
  },
  example: ({ message }) => (
    <Toast message={message} />
  ),
});
