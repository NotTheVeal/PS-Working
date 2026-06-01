import React from 'react';
import figma from '@figma/code-connect';
import { Pagination } from '@partssource/react-kit';

figma.connect(Pagination, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4445:12144', {
  props: {
    compact: figma.boolean('Compact'),
  },
  example: ({ compact }) => (
    <Pagination
      page={1}
      totalPages={10}
      onPageChange={() => {}}
      compact={compact}
    />
  ),
});
