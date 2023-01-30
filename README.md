# dot-tree-syntax

Install:
```
npm install dot-tree-syntax
```

## Usage

Mini html:
```ts
import { CreateTarget, createTreeBuilder } from 'dot-tree-syntax';

type Primitive = string | number| boolean;

// html child nodes
type HTML = { child: DIV | A | Primitive };

// properties for tag "div"
type DIV = CreateTarget<
    'div', // type for name
    { class: string; style: string }, // record for props
    HTML // available children, in this case: DIV | A | Primitive
>;

// properties for tag "a"
type A = CreateTarget<'a', { class: string; href: string }, HTML>;

// html root object, entry point
const h = {
  div: createTreeBuilder<DIV, { useTemplateStrings: true }>('div'), // use template strings
  a: createTreeBuilder<A, { useTemplateStrings: true }>('a'),
};

// build tree
export const myAwesomeDiv = h.div(
  // template string for property
  h.div.style`text-align: center`('some text'),

  // template string for property and children
  h.a.href`https://ya.ru`(h.div`ya.ru`),

  // empty tag
  h.div,

  // fynction syntax for property
  h.div.class('bottom'),

  // tagged template for children
  h.div`2 + 2 = ${2 + 2}`, // -> ['2 + 2 =', 4, '']
);

// myAwesomeDiv -> this tree
const tree = {
  name: 'div',
  props: {},
  children: [
    {
      name: 'div',
      props: {style: ['text-align: center']},
      children: ['some text'],
    },
    {
      name: 'a',
      props: {href: ['https://ya.ru']},
      children: [
        {name: 'div',props: {},children: ['ya.ru']},
      ],
    },
    {name: 'div'props: {},children: []},
    {
      name: 'div',
      props: {class: 'bottom'},
      children: [],
    },
    {
      name: 'div',
      props: {},
      children: ['2 + 2 = ', 4, ''],
    },
  ],
};
```

## Api

target type
```ts
type CommonTarget = {
  name: any; // string, symbols or function links
  props: Record<string, any>; // only string for keys
  children: any[]; // array
};
```