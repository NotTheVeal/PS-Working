import React from 'react';
import figma from '@figma/code-connect';
import { EventCard, StatusCard, AlertCard } from '@partssource/react-kit';
import { AiDataCard, ProductCard, AnalyticsCard, ListCard } from '@partssource/react-kit';

figma.connect(EventCard, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: { title: figma.string('Title') },
  example: ({ title }) => <EventCard title={title} />,
});

figma.connect(StatusCard, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: { title: figma.string('Title') },
  example: ({ title }) => <StatusCard title={title} />,
});

figma.connect(AlertCard, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: { title: figma.string('Title') },
  example: ({ title }) => <AlertCard title={title} />,
});

figma.connect(ProductCard, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: { title: figma.string('Title') },
  example: ({ title }) => <ProductCard title={title} />,
});

figma.connect(AiDataCard, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: { title: figma.string('Title') },
  example: ({ title }) => <AiDataCard title={title} />,
});

figma.connect(AnalyticsCard, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: { title: figma.string('Title') },
  example: ({ title }) => <AnalyticsCard title={title} />,
});

figma.connect(ListCard, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: {
    variant: figma.enum('Variant', { List: 'list' }),
  },
  example: ({ variant }) => <ListCard variant={variant} />,
});
