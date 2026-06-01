import React from 'react';
import figma from '@figma/code-connect';
import { Breadcrumb, BreadcrumbBack, Accordion, AccordionCount, Stepper } from '@partssource/react-kit';

figma.connect(Accordion, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: {
    variant: figma.enum('Variant', {
      Default: 'default',
      Row: 'row',
      Filled: 'filled',
    }),
    title: figma.string('Title'),
    children: figma.children('*'),
  },
  example: ({ variant, title, children }) => (
    <Accordion variant={variant} title={title}>{children}</Accordion>
  ),
});

figma.connect(AccordionCount, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: {
    title: figma.string('Title'),
    count: figma.string('Count'),
    children: figma.children('*'),
  },
  example: ({ title, count, children }) => (
    <AccordionCount title={title} count={count}>{children}</AccordionCount>
  ),
});

figma.connect(Breadcrumb, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: { items: figma.children('*') },
  example: () => <Breadcrumb items={[]} />,
});

figma.connect(BreadcrumbBack, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: { label: figma.string('Label') },
  example: ({ label }) => <BreadcrumbBack label={label} onClick={() => {}} />,
});

figma.connect(Stepper, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: { steps: figma.children('*') },
  example: () => <Stepper steps={[]} currentStep={0} />,
});
