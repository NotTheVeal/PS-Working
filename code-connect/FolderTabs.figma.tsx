import React from 'react';
import figma from '@figma/code-connect';
import { FolderTabs } from '@partssource/react-kit';

figma.connect(FolderTabs, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4099:6022', {
  props: {},
  example: () => (
    <FolderTabs
      items={[
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
      ]}
      defaultActiveId="tab1"
    />
  ),
});
