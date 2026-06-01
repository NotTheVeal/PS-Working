import React from 'react';
import figma from '@figma/code-connect';
import { Alert } from '@partssource/react-kit';

figma.connect(Alert, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
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
