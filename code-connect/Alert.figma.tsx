import React from 'react';
import figma from '@figma/code-connect';
import { Alert, Toast } from '@partssource/react-kit';

figma.connect(Alert, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=456:210', {
  props: {
    severity: figma.enum('Severity', {
      Success: 'success',
      Info: 'info',
      Warning: 'warning',
      Fail: 'fail',
    }),
    children: figma.string('Message'),
  },
  example: ({ severity, children }) => (
    <Alert severity={severity}>{children}</Alert>
  ),
});

figma.connect(Toast, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4395:45950', {
  props: {
    severity: figma.enum('Severity', {
      Success: 'success',
      Info: 'info',
      Fail: 'fail',
    }),
    children: figma.string('Message'),
  },
  example: ({ severity, children }) => (
    <Toast severity={severity}>{children}</Toast>
  ),
});
