import React from 'react';
import figma from '@figma/code-connect';
import { Modal, ConfirmDialog } from '@partssource/react-kit';

figma.connect(Modal, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: {
    title: figma.string('Title'),
    open: figma.boolean('Open'),
  },
  example: ({ title, open }) => (
    <Modal title={title} open={open} onClose={() => {}} />
  ),
});

figma.connect(ConfirmDialog, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: {
    title: figma.string('Title'),
    message: figma.string('Message'),
    open: figma.boolean('Open'),
  },
  example: ({ title, message, open }) => (
    <ConfirmDialog title={title} message={message} open={open} onConfirm={() => {}} onCancel={() => {}} />
  ),
});
