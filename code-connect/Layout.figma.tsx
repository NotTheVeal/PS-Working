import React from 'react';
import figma from '@figma/code-connect';
import { Breadcrumb, BreadcrumbBack, Accordion, AccordionCount, Stepper } from '@partssource/react-kit';

figma.connect(Accordion, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4390:39583', {
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

figma.connect(AccordionCount, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4390:39583', {
  props: {
    tone: figma.enum('Variant', { Default: 'info', Filled: 'critical' }),
    children: figma.string('Count'),
  },
  example: ({ tone, children }) => (
    <AccordionCount tone={tone}>{children}</AccordionCount>
  ),
});

figma.connect(Breadcrumb, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4386:28732', {
  props: { items: figma.children('*') },
  example: () => <Breadcrumb items={[]} />,
});

figma.connect(BreadcrumbBack, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4386:28732', {
  props: { label: figma.string('Label') },
  example: ({ label }) => <BreadcrumbBack label={label} onClick={() => {}} />,
});

figma.connect(Stepper, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=4723:4108', {
  props: { steps: figma.children('*') },
  example: () => <Stepper steps={[]} currentStep={0} />,
});
