import React from 'react';
import figma from '@figma/code-connect';
import { FolderTabs, SegmentedTabs, PillTabs } from '@partssource/react-kit';

figma.connect(FolderTabs, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4783:5623', {
  props: { tabs: figma.children('*') },
  example: () => <FolderTabs tabs={[]} />,
});

figma.connect(SegmentedTabs, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4783:5623', {
  props: { tabs: figma.children('*') },
  example: () => <SegmentedTabs tabs={[]} />,
});

figma.connect(PillTabs, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4783:5623', {
  props: { tabs: figma.children('*') },
  example: () => <PillTabs tabs={[]} />,
});
