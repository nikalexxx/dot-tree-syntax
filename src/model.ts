export type CommonProps = Record<string, any>;

export type CommonTarget = {
  name: any;
  props: CommonProps;
  children: any[];
};

export type CommonChildDescription = {
  child: any;
};

export type CreateTarget<
  Name,
  Props extends CommonProps,
  AdditionalChild extends CommonChildDescription = { child: never },
> = {
  name: Name;
  props: Props;
  children: Array<AdditionalChild['child']>;
};

type TemplateTuple<T, C> = T extends never ? never : [T, ...C[]];

export type TreeOptions = {
  useTemplateStrings?: true;
};

type TemplateArg<Options extends TreeOptions> = 'useTemplateStrings' extends keyof Options
  ? TemplateStringsArray
  : never;

/**
 * function `RawChild[]` -> `Target`
 */
export type GetTarget<Target extends CommonTarget, Options extends TreeOptions = {}> = (
  ...children: RawChild<Target, Options>[] | TemplateTuple<TemplateArg<Options>, RawChild<Target, Options>>
) => Target;

/**
 * available child
 */
export type RawChild<Target extends CommonTarget, Options extends TreeOptions = {}> =
  | Target['children'][number] extends infer C
  ? C extends CommonTarget
    ? C | GetTarget<C, Options>
    : C
  : never | 'useTemplateStrings' extends keyof Options
  ? string
  : never;

/**
 * tree syntax
 */
export type TreeBuilder<
  Target extends CommonTarget,
  Options extends TreeOptions = {},
  Props = Target['props'],
> = GetTarget<Target, Options> & {
  [Prop in keyof Props]-?: (
    value: Props[Prop] | TemplateArg<Options>,
  ) => TreeBuilder<Target, Options, Omit<Props, Prop>>;
};
