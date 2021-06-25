import { Path } from "./object-path-7";

export type Resolve<Source, PathLike extends Path<Source>> = PathLike extends keyof Source ? Source[PathLike] : Resolve0<Source, PathLike>;

type Resolve0<Source, PathLike extends Path<Source>> = Resolve1<Source, PathLike> | (
  PathLike extends `${infer Key0}/${infer Key1}`
  ? Key0 extends keyof Source
    ? Key1 extends keyof Source[Key0]
      ? Source[Key0][Key1] : never
    : never
  : never
);

type Resolve1<Source, PathLike extends Path<Source>> = Resolve2<Source, PathLike> | (
  PathLike extends `${infer Key0}/${infer Key1}/${infer Key2}`
  ? Key0 extends keyof Source
    ? Key1 extends keyof Source[Key0]
      ? Key2 extends keyof Source[Key0][Key1]
        ? Source[Key0][Key1][Key2] : never
      : never
    : never
  : never
);

type Resolve2<Source, PathLike extends Path<Source>> = Resolve3<Source, PathLike> | (
  PathLike extends `${infer Key0}/${infer Key1}/${infer Key2}/${infer Key3}`
  ? Key0 extends keyof Source
    ? Key1 extends keyof Source[Key0]
      ? Key2 extends keyof Source[Key0][Key1]
        ? Key3 extends keyof Source[Key0][Key1][Key2]
          ? Source[Key0][Key1][Key2][Key3] : never
        : never
      : never
    : never
  : never
);

type Resolve3<Source, PathLike extends Path<Source>> = Resolve4<Source, PathLike> | (
  PathLike extends `${infer Key0}/${infer Key1}/${infer Key2}/${infer Key3}/${infer Key4}`
  ? Key0 extends keyof Source
    ? Key1 extends keyof Source[Key0]
      ? Key2 extends keyof Source[Key0][Key1]
        ? Key3 extends keyof Source[Key0][Key1][Key2]
          ? Key4 extends keyof Source[Key0][Key1][Key2][Key3]
            ? Source[Key0][Key1][Key2][Key3][Key4] : never
          : never
        : never
      : never
    : never
  : never
);

type Resolve4<Source, PathLike extends Path<Source>> = Resolve5<Source, PathLike> | (
  PathLike extends `${infer Key0}/${infer Key1}/${infer Key2}/${infer Key3}/${infer Key4}/${infer Key5}`
  ? Key0 extends keyof Source
    ? Key1 extends keyof Source[Key0]
      ? Key2 extends keyof Source[Key0][Key1]
        ? Key3 extends keyof Source[Key0][Key1][Key2]
          ? Key4 extends keyof Source[Key0][Key1][Key2][Key3]
            ? Key5 extends keyof Source[Key0][Key1][Key2][Key3][Key4]
              ? Source[Key0][Key1][Key2][Key3][Key4][Key5] : never
            : never
          : never
        : never
      : never
    : never
  : never
);

type Resolve5<Source, PathLike extends Path<Source>> = PathLike extends `${infer Key0}/${infer Key1}/${infer Key2}/${infer Key3}/${infer Key4}/${infer Key5}/${infer Key6}`
  ? Key0 extends keyof Source
    ? Key1 extends keyof Source[Key0]
      ? Key2 extends keyof Source[Key0][Key1]
        ? Key3 extends keyof Source[Key0][Key1][Key2]
          ? Key4 extends keyof Source[Key0][Key1][Key2][Key3]
            ? Key5 extends keyof Source[Key0][Key1][Key2][Key3][Key4]
              ? Key6 extends keyof Source[Key0][Key1][Key2][Key3][Key4][Key5]
                ? Source[Key0][Key1][Key2][Key3][Key4][Key5][Key6] : never
              : never
            : never
          : never
        : never
      : never
    : never
  : never
;
