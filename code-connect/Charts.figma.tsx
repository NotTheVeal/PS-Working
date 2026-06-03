import React from 'react';
import figma from '@figma/code-connect';
import { PSVerticalBarChart, PSHorizontalBarChart, PSStackedBarChart, PSGroupedBarChart } from '../pages/components/Charts';
import { PSLineChart, PSMultiLineChart, PSAreaChart, PSStackedAreaChart } from '../pages/components/LineCharts';
import { PSPieChart, PSDonutChart, PSGaugeChart, PSWaffleChart } from '../pages/components/PieCharts';

const FILE = 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q';

figma.connect(PSVerticalBarChart, `${FILE}?node-id=4749:87`, {
  props: { title: figma.string('Title') },
  example: ({ title }) => (
    <PSVerticalBarChart title={title} data={[]} bars={[{ dataKey: 'value', label: 'Value' }]} />
  ),
});

figma.connect(PSHorizontalBarChart, `${FILE}?node-id=4749:157`, {
  props: { title: figma.string('Title') },
  example: ({ title }) => (
    <PSHorizontalBarChart title={title} data={[]} bars={[{ dataKey: 'value', label: 'Value' }]} />
  ),
});

figma.connect(PSStackedBarChart, `${FILE}?node-id=4749:298`, {
  props: { title: figma.string('Title') },
  example: ({ title }) => (
    <PSStackedBarChart title={title} data={[]} bars={[{ dataKey: 'value', label: 'Value' }]} />
  ),
});

figma.connect(PSGroupedBarChart, `${FILE}?node-id=4749:221`, {
  props: { title: figma.string('Title') },
  example: ({ title }) => (
    <PSGroupedBarChart title={title} data={[]} bars={[{ dataKey: 'value', label: 'Value' }]} />
  ),
});

figma.connect(PSLineChart, `${FILE}?node-id=4749:382`, {
  props: { title: figma.string('Title') },
  example: ({ title }) => (
    <PSLineChart title={title} data={[]} lines={[{ dataKey: 'value', label: 'Value' }]} />
  ),
});

figma.connect(PSMultiLineChart, `${FILE}?node-id=4749:463`, {
  props: { title: figma.string('Title') },
  example: ({ title }) => (
    <PSMultiLineChart title={title} data={[]} lines={[{ dataKey: 'value', label: 'Value' }]} />
  ),
});

figma.connect(PSAreaChart, `${FILE}?node-id=4749:545`, {
  props: { title: figma.string('Title') },
  example: ({ title }) => (
    <PSAreaChart title={title} data={[]} areas={[{ dataKey: 'value', label: 'Value' }]} />
  ),
});

figma.connect(PSStackedAreaChart, `${FILE}?node-id=4749:609`, {
  props: { title: figma.string('Title') },
  example: ({ title }) => (
    <PSStackedAreaChart title={title} data={[]} areas={[{ dataKey: 'value', label: 'Value' }]} />
  ),
});

figma.connect(PSDonutChart, `${FILE}?node-id=4748:339`, {
  props: { title: figma.string('Title'), centerLabel: figma.string('CenterLabel') },
  example: ({ title, centerLabel }) => (
    <PSDonutChart title={title} data={[]} centerLabel={centerLabel} />
  ),
});

figma.connect(PSPieChart, `${FILE}?node-id=4748:312`, {
  props: { title: figma.string('Title') },
  example: ({ title }) => <PSPieChart title={title} data={[]} />,
});

figma.connect(PSGaugeChart, `${FILE}?node-id=4748:552`, {
  props: { title: figma.string('Title') },
  example: ({ title }) => <PSGaugeChart title={title} value={75} max={100} label="%" />,
});

figma.connect(PSWaffleChart, `${FILE}?node-id=4748:430`, {
  props: { title: figma.string('Title') },
  example: ({ title }) => <PSWaffleChart title={title} value={72} max={100} label="Completion" />,
});
