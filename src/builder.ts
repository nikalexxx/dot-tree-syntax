import { CommonTarget, GetTarget, RawChild, TreeBuilder, TreeOptions } from './model';
import { isTemplateString, strToArray } from './utils';

const builderSymbol = Symbol('builder');

export function isBuildFunction(f: unknown): f is GetTarget<CommonTarget> {
  return typeof f === 'function' && builderSymbol in f;
}

export function prepareChildren<Target extends CommonTarget>(children: RawChild<Target>[]): Target['children'] {
  type C = Target['children'][number];
  const result: Target[] = [];
  if (isTemplateString(children)) {
    return prepareChildren(strToArray(...children) as Target['children']);
  }
  for (const child of children) {
    if (isBuildFunction(child)) {
      result.push(child() as C);
    } else {
      result.push(child as C);
    }
  }

  return result;
}

export function createTarget<Target extends CommonTarget>(
  name: Target['name'],
  props: Partial<Target['props']>,
  children: RawChild<Target>[],
): Target {
  return {
    name,
    props,
    children: prepareChildren(children),
  } as Target;
}

function createTreeBuilderImpl<Target extends CommonTarget, Options extends TreeOptions>(
  targetName: Target['name'],
  props: Partial<Target['props']> = {},
): TreeBuilder<Target, Options> {
  const build = (...children: RawChild<Target>[]) => createTarget(targetName, props, children);

  // @ts-ignore
  build[builderSymbol] = true;

  return new Proxy(build, {
    get(_, name) {
      return (value: any) => createTreeBuilderImpl(targetName, { ...props, [name]: value });
    },
  }) as TreeBuilder<Target, Options, Target['props']>;
}

export const createTreeBuilder = <Target extends CommonTarget, Options extends TreeOptions>(name: Target['name']) =>
  createTreeBuilderImpl<Target, Options>(name);
