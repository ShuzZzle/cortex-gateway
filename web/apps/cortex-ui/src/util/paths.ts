import { Resolve, Path } from "../generated";

export interface PatchAccessors<T> {
  get: () => T;
  set?: (value: T) => void;
}

export function isPatchAccessors<T>(value: unknown): value is PatchAccessors<T> {
  return typeof value === "object" && !!value && "get" in value;
}

export function value<T>(value: T): PatchAccessors<T> {
  return { get: () => value };
}

export function patch<T>(source: PatchAccessors<T> | T, ...values: (Partial<T> | ((val: T) => Partial<T>))[]): T {
  if (!isPatchAccessors<T>(source)) source = value<T>(source);
  const { get, set } = source;
  const val = values.reduce((value: T, patch: Partial<T> | ((val: T) => Partial<T>)): T => {
    if (typeof patch === "function") patch = patch(value);
    return { ...value, ...patch };
  }, get());
  if (set) set(val);
  return val;
}

export function getProperty<T, Key extends Path<T>>(source: T, key: Key, defaultValue?: Resolve<T, Key>): Resolve<T, Key> {
  const resolved = key.split("/").reduce((node, key) => typeof node === "object" && node && key in node ? node[key as keyof typeof node] : undefined, source as unknown);
  return resolved === undefined ? defaultValue as never : resolved as never;
}

export function mutateProperty<T, Key extends Path<T>, Value extends Resolve<T, Key>>(source: T, key: Key, value: Value): T {
  const segments = key.split("/");
  const last = segments.pop() as string;
  let node: Record<string, unknown> = source as never;
  for (const segment of segments) node = (node[segment] ??= {}) as never;
  node[last] = value;
  return source;
}

export function replaceProperty<T, Key extends Path<T>, Value extends Resolve<T, Key>>(source: T, key: Key, value: Value): T {
  if (Array.isArray(source)) return replaceArrayProperty(source, key as never, value as never);
  const [first, ...rest] = key.split("/");
  return { ...source, [first]: rest.length > 0 ? replaceProperty((source as never)[first], rest.join("/"), value as never) as never : value };
}

function replaceArrayProperty<T extends unknown[], Key extends Path<T>, Value extends Resolve<T, Key>>(source: T, key: Key, value: Value): T {
  if (!Array.isArray(source)) return replaceProperty(source, key, value as never);
  const [index, ...rest] = key.split("/");
  const copy = [...source];
  copy[parseInt(index, 10)] = rest.length > 0 ? replaceProperty((source as never)[index], rest.join("/"), value as never) as never : value;
  return copy as T;
}

export function createPropertyAccessors<T, Key extends Path<T>>(source: PatchAccessors<T> | T, key: Key): PatchAccessors<Resolve<T, Key>> {
  const access = isPatchAccessors<T>(source) ? source : value<T>(source);
  return {
    get: () => getProperty(access.get(), key),
    set: access.set ? (val) => access.set?.(replaceProperty(access.get(), key, val)) : undefined,
  }
}
