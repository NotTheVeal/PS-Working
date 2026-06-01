import React from 'react';
import figma from '@figma/code-connect';
import { Avatar, AvatarGroup, Tooltip, TooltipRich, Skeleton, Spinner, EmptyState, ErrorPage } from '@partssource/react-kit';

figma.connect(Avatar, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4467:47', {
  props: {
    size: figma.enum('Size', { SM: 'sm', MD: 'md', LG: 'lg' }),
    src: figma.string('Src'),
    name: figma.string('Name'),
  },
  example: ({ size, src, name }) => <Avatar size={size} src={src} name={name} />,
});

figma.connect(AvatarGroup, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: { size: figma.enum('Size', { SM: 'sm', MD: 'md', LG: 'lg' }) },
  example: ({ size }) => <AvatarGroup size={size} avatars={[]} />,
});

figma.connect(Tooltip, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4388:31119', {
  props: { content: figma.string('Content') },
  example: ({ content }) => <Tooltip content={content}><span /></Tooltip>,
});

figma.connect(TooltipRich, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4388:31119', {
  props: { title: figma.string('Title'), content: figma.string('Content') },
  example: ({ title, content }) => <TooltipRich title={title} content={content}><span /></TooltipRich>,
});

figma.connect(Skeleton, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4395:46415', {
  props: { width: figma.string('Width'), height: figma.string('Height') },
  example: ({ width, height }) => <Skeleton width={width} height={height} />,
});

figma.connect(Spinner, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4390:43840', {
  props: {},
  example: () => <Spinner />,
});

figma.connect(EmptyState, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4471:47', {
  props: { title: figma.string('Title'), message: figma.string('Message') },
  example: ({ title, message }) => <EmptyState title={title} message={message} />,
});

figma.connect(ErrorPage, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: { title: figma.string('Title'), message: figma.string('Message') },
  example: ({ title, message }) => <ErrorPage title={title} message={message} />,
});
