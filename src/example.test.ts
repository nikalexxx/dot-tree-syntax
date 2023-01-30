import { CreateTarget } from './model';
import { createTreeBuilder } from './builder';

type Primitive = string | number | bigint | boolean | null | undefined;
type HTML = { child: DIV | A | Primitive };
type DIV = CreateTarget<'div', { class: string; style: string }, HTML>;
type A = CreateTarget<'a', { class: string; href: string }, HTML>;

const h = {
  div: createTreeBuilder<DIV, { useTemplateStrings: true }>('div'),
  a: createTreeBuilder<A, { useTemplateStrings: true }>('a'),
};

export const dotTree = h.div(
  h.div.style`text-align: center`('some text'),
  h.a.href`https://ya.ru`(h.div`ya.ru`),
  h.div, // empty
  h.div.class('bottom'),
  h.div`2 + 2 = ${2 + 2}`,
);

const tree = {
  name: 'div',
  props: {},
  children: [
    {
      name: 'div',
      props: {
        'style': ['text-align: center'],
      },
      children: ['some text'],
    },
    {
      name: 'a',
      props: {
        'href': ['https://ya.ru'],
      },
      children: [
        {
          name: 'div',
          props: {},
          children: ['ya.ru'],
        },
      ],
    },
    {
      name: 'div',
      props: {},
      children: [],
    },
    {
      name: 'div',
      props: {
        'class': 'bottom',
      },
      children: [],
    },
    {
      name: 'div',
      props: {},
      children: ['2 + 2 = ', 4, ''],
    },
  ],
};

test('dot tree', () => {
  expect(dotTree).toEqual(tree);
});
