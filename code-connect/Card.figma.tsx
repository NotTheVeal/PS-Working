import React from 'react';
import figma from '@figma/code-connect';
import { EventCard, StatusCard, AlertCard } from '@partssource/react-kit';
import { AiDataCard, ProductCard, AnalyticsCard, ListCard } from '@partssource/react-kit';

figma.connect(EventCard, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=3334:8877', {
  props: { title: figma.string('Title') },
  example: ({ title }) => <EventCard title={title} />,
});

figma.connect(StatusCard, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4094:4219', {
  props: { title: figma.string('Title') },
  example: ({ title }) => <StatusCard title={title} />,
});

// TODO: no dedicated AlertCard component frame in Figma — uses inline examples only; file-root fallback
figma.connect(AlertCard, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: { title: figma.string('Title') },
  example: ({ title }) => <AlertCard title={title} />,
});

figma.connect(ProductCard, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4094:4455', {
  props: { title: figma.string('Title') },
  example: ({ title }) => <ProductCard title={title} />,
});

figma.connect(AiDataCard, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=3947:38424', {
  props: { title: figma.string('Title') },
  example: ({ title }) => <AiDataCard title={title} />,
});

figma.connect(AnalyticsCard, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4100:12161', {
  props: { title: figma.string('Title') },
  example: ({ title }) => <AnalyticsCard title={title} />,
});

figma.connect(ListCard, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4100:12056', {
  props: {
    variant: figma.enum('Variant', { List: 'list' }),
  },
  example: ({ variant }) => <ListCard variant={variant} />,
});
