export type Path<Source> = (keyof Source & string) | Path0<Source>;

type Path0<Source> = Path1<Source> | {
  [Key0 in keyof Source]: `${Key0 & string}/${keyof Source[Key0] & string}`;
}[keyof Source];

type Path1<Source> = Path2<Source> | {
  [Key0 in keyof Source]: {
    [Key1 in keyof Source[Key0]]: `${Key0 & string}/${Key1 & string}/${keyof Source[Key0][Key1] & string}`;
  }[keyof Source[Key0]];
}[keyof Source];

type Path2<Source> = Path3<Source> | {
  [Key0 in keyof Source]: {
    [Key1 in keyof Source[Key0]]: {
      [Key2 in keyof Source[Key0][Key1]]: `${Key0 & string}/${Key1 & string}/${Key2 & string}/${keyof Source[Key0][Key1][Key2] & string}`;
    }[keyof Source[Key0][Key1]];
  }[keyof Source[Key0]];
}[keyof Source];

type Path3<Source> = Path4<Source> | {
  [Key0 in keyof Source]: {
    [Key1 in keyof Source[Key0]]: {
      [Key2 in keyof Source[Key0][Key1]]: {
        [Key3 in keyof Source[Key0][Key1][Key2]]: `${Key0 & string}/${Key1 & string}/${Key2 & string}/${Key3 & string}/${keyof Source[Key0][Key1][Key2][Key3] & string}`;
      }[keyof Source[Key0][Key1][Key2]];
    }[keyof Source[Key0][Key1]];
  }[keyof Source[Key0]];
}[keyof Source];

type Path4<Source> = Path5<Source> | {
  [Key0 in keyof Source]: {
    [Key1 in keyof Source[Key0]]: {
      [Key2 in keyof Source[Key0][Key1]]: {
        [Key3 in keyof Source[Key0][Key1][Key2]]: {
          [Key4 in keyof Source[Key0][Key1][Key2][Key3]]: `${Key0 & string}/${Key1 & string}/${Key2 & string}/${Key3 & string}/${Key4 & string}/${keyof Source[Key0][Key1][Key2][Key3][Key4] & string}`;
        }[keyof Source[Key0][Key1][Key2][Key3]];
      }[keyof Source[Key0][Key1][Key2]];
    }[keyof Source[Key0][Key1]];
  }[keyof Source[Key0]];
}[keyof Source];

type Path5<Source> = Path6<Source> | {
  [Key0 in keyof Source]: {
    [Key1 in keyof Source[Key0]]: {
      [Key2 in keyof Source[Key0][Key1]]: {
        [Key3 in keyof Source[Key0][Key1][Key2]]: {
          [Key4 in keyof Source[Key0][Key1][Key2][Key3]]: {
            [Key5 in keyof Source[Key0][Key1][Key2][Key3][Key4]]: `${Key0 & string}/${Key1 & string}/${Key2 & string}/${Key3 & string}/${Key4 & string}/${Key5 & string}/${keyof Source[Key0][Key1][Key2][Key3][Key4][Key5] & string}`;
          }[keyof Source[Key0][Key1][Key2][Key3][Key4]];
        }[keyof Source[Key0][Key1][Key2][Key3]];
      }[keyof Source[Key0][Key1][Key2]];
    }[keyof Source[Key0][Key1]];
  }[keyof Source[Key0]];
}[keyof Source];

type Path6<Source> = Path7<Source> | {
  [Key0 in keyof Source]: {
    [Key1 in keyof Source[Key0]]: {
      [Key2 in keyof Source[Key0][Key1]]: {
        [Key3 in keyof Source[Key0][Key1][Key2]]: {
          [Key4 in keyof Source[Key0][Key1][Key2][Key3]]: {
            [Key5 in keyof Source[Key0][Key1][Key2][Key3][Key4]]: {
              [Key6 in keyof Source[Key0][Key1][Key2][Key3][Key4][Key5]]: `${Key0 & string}/${Key1 & string}/${Key2 & string}/${Key3 & string}/${Key4 & string}/${Key5 & string}/${Key6 & string}/${keyof Source[Key0][Key1][Key2][Key3][Key4][Key5][Key6] & string}`;
            }[keyof Source[Key0][Key1][Key2][Key3][Key4][Key5]];
          }[keyof Source[Key0][Key1][Key2][Key3][Key4]];
        }[keyof Source[Key0][Key1][Key2][Key3]];
      }[keyof Source[Key0][Key1][Key2]];
    }[keyof Source[Key0][Key1]];
  }[keyof Source[Key0]];
}[keyof Source];

type Path7<Source> = Path8<Source> | {
  [Key0 in keyof Source]: {
    [Key1 in keyof Source[Key0]]: {
      [Key2 in keyof Source[Key0][Key1]]: {
        [Key3 in keyof Source[Key0][Key1][Key2]]: {
          [Key4 in keyof Source[Key0][Key1][Key2][Key3]]: {
            [Key5 in keyof Source[Key0][Key1][Key2][Key3][Key4]]: {
              [Key6 in keyof Source[Key0][Key1][Key2][Key3][Key4][Key5]]: {
                [Key7 in keyof Source[Key0][Key1][Key2][Key3][Key4][Key5][Key6]]: `${Key0 & string}/${Key1 & string}/${Key2 & string}/${Key3 & string}/${Key4 & string}/${Key5 & string}/${Key6 & string}/${Key7 & string}/${keyof Source[Key0][Key1][Key2][Key3][Key4][Key5][Key6][Key7] & string}`;
              }[keyof Source[Key0][Key1][Key2][Key3][Key4][Key5][Key6]];
            }[keyof Source[Key0][Key1][Key2][Key3][Key4][Key5]];
          }[keyof Source[Key0][Key1][Key2][Key3][Key4]];
        }[keyof Source[Key0][Key1][Key2][Key3]];
      }[keyof Source[Key0][Key1][Key2]];
    }[keyof Source[Key0][Key1]];
  }[keyof Source[Key0]];
}[keyof Source];

type Path8<Source> = Path9<Source> | {
  [Key0 in keyof Source]: {
    [Key1 in keyof Source[Key0]]: {
      [Key2 in keyof Source[Key0][Key1]]: {
        [Key3 in keyof Source[Key0][Key1][Key2]]: {
          [Key4 in keyof Source[Key0][Key1][Key2][Key3]]: {
            [Key5 in keyof Source[Key0][Key1][Key2][Key3][Key4]]: {
              [Key6 in keyof Source[Key0][Key1][Key2][Key3][Key4][Key5]]: {
                [Key7 in keyof Source[Key0][Key1][Key2][Key3][Key4][Key5][Key6]]: {
                  [Key8 in keyof Source[Key0][Key1][Key2][Key3][Key4][Key5][Key6][Key7]]: `${Key0 & string}/${Key1 & string}/${Key2 & string}/${Key3 & string}/${Key4 & string}/${Key5 & string}/${Key6 & string}/${Key7 & string}/${Key8 & string}/${keyof Source[Key0][Key1][Key2][Key3][Key4][Key5][Key6][Key7][Key8] & string}`;
                }[keyof Source[Key0][Key1][Key2][Key3][Key4][Key5][Key6][Key7]];
              }[keyof Source[Key0][Key1][Key2][Key3][Key4][Key5][Key6]];
            }[keyof Source[Key0][Key1][Key2][Key3][Key4][Key5]];
          }[keyof Source[Key0][Key1][Key2][Key3][Key4]];
        }[keyof Source[Key0][Key1][Key2][Key3]];
      }[keyof Source[Key0][Key1][Key2]];
    }[keyof Source[Key0][Key1]];
  }[keyof Source[Key0]];
}[keyof Source];

type Path9<Source> = {
  [Key0 in keyof Source]: {
    [Key1 in keyof Source[Key0]]: {
      [Key2 in keyof Source[Key0][Key1]]: {
        [Key3 in keyof Source[Key0][Key1][Key2]]: {
          [Key4 in keyof Source[Key0][Key1][Key2][Key3]]: {
            [Key5 in keyof Source[Key0][Key1][Key2][Key3][Key4]]: {
              [Key6 in keyof Source[Key0][Key1][Key2][Key3][Key4][Key5]]: {
                [Key7 in keyof Source[Key0][Key1][Key2][Key3][Key4][Key5][Key6]]: {
                  [Key8 in keyof Source[Key0][Key1][Key2][Key3][Key4][Key5][Key6][Key7]]: {
                    [Key9 in keyof Source[Key0][Key1][Key2][Key3][Key4][Key5][Key6][Key7][Key8]]: `${Key0 & string}/${Key1 & string}/${Key2 & string}/${Key3 & string}/${Key4 & string}/${Key5 & string}/${Key6 & string}/${Key7 & string}/${Key8 & string}/${Key9 & string}/${keyof Source[Key0][Key1][Key2][Key3][Key4][Key5][Key6][Key7][Key8][Key9] & string}`;
                  }[keyof Source[Key0][Key1][Key2][Key3][Key4][Key5][Key6][Key7][Key8]];
                }[keyof Source[Key0][Key1][Key2][Key3][Key4][Key5][Key6][Key7]];
              }[keyof Source[Key0][Key1][Key2][Key3][Key4][Key5][Key6]];
            }[keyof Source[Key0][Key1][Key2][Key3][Key4][Key5]];
          }[keyof Source[Key0][Key1][Key2][Key3][Key4]];
        }[keyof Source[Key0][Key1][Key2][Key3]];
      }[keyof Source[Key0][Key1][Key2]];
    }[keyof Source[Key0][Key1]];
  }[keyof Source[Key0]];
}[keyof Source];
