import React from 'react';
import figma from '@figma/code-connect';
import { Modal } from '@partssource/react-kit';

figma.connect(Modal, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4099:2881', {
  props: {
    title: figma.string('Title'),
    open: figma.boolean('Open'),
  },
  example: ({ title, open }) => (
    <Modal open={open} title={title} onClose={() => {}}>
      {/* modal body */}
    </Modal>
  ),
});
