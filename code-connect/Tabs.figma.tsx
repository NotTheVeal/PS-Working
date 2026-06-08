import React from 'react';
import figma from '@figma/code-connect';
import { FolderTabs, SegmentedTabs, PillTabs } from '@partssource/react-kit';

figma.connect(FolderTabs, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4099:6022', {
  props: {
    activeId: figma.string('ActiveId'),
  },
  example: ({ activeId }) => (
    <FolderTabs
      items={[
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
      ]}
      defaultActiveId={activeId ?? 'tab1'}
    />
  ),
});

figma.connect(SegmentedTabs, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4099:6022', {
  props: {
    activeId: figma.string('ActiveId'),
  },
  example: ({ activeId }) => (
    <SegmentedTabs
      items={[
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
      ]}
      defaultActiveId={activeId ?? 'tab1'}
    />
  ),
});

figma.connect(PillTabs, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4099:6022', {
  props: {
    activeId: figma.string('ActiveId'),
  },
  example: ({ activeId }) => (
    <PillTabs
      items={[
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
      ]}
      defaultActiveId={activeId ?? 'tab1'}
    />
  ),
});
