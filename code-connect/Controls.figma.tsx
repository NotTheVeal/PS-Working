import React from 'react';
import figma from '@figma/code-connect';
import { Pagination, DatePicker } from '@partssource/react-kit';

figma.connect(Pagination, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4445:12144', {
  props: {
    total: figma.string('Total'),
    page: figma.string('Page'),
  },
  example: ({ total }) => (
    <Pagination total={Number(total)} page={1} onPageChange={() => {}} />
  ),
});

figma.connect(DatePicker, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=396:281', {
  props: {
    label: figma.string('Label'),
    disabled: figma.boolean('Disabled'),
  },
  example: ({ label, disabled }) => (
    <DatePicker label={label} disabled={disabled} onChange={() => {}} />
  ),
});
