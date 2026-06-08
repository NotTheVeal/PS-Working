import React from 'react';
import figma from '@figma/code-connect';
import { Modal, ConfirmDialog } from '@partssource/react-kit';

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

// TODO: no dedicated Figma node for ConfirmDialog — approximated with Modal node
figma.connect(ConfirmDialog, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4099:2881', {
  props: {
    title: figma.string('Title'),
    destructive: figma.boolean('Destructive'),
  },
  example: ({ title, destructive }) => (
    <ConfirmDialog
      open
      title={title}
      message="Are you sure you want to continue?"
      confirmLabel={destructive ? 'Delete' : 'Confirm'}
      cancelLabel="Cancel"
      destructive={destructive}
      onConfirm={() => {}}
      onCancel={() => {}}
    />
  ),
});
