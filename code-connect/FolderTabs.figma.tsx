import React from 'react';
import figma from '@figma/code-connect';
import { FolderTabs } from '@partssource/react-kit';

figma.connect(FolderTabs, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
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
