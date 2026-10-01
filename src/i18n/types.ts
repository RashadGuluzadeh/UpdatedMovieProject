import type en from "./en";

/** Plural forms by Intl.PluralRules category; `other` is always required. */
export interface PluralForms {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}

// The English dictionary defines the structure every language must follow:
// each string stays a string, each plural object may use any plural forms.
type Shape<T> = T extends string
  ? string
  : T extends { other: string }
    ? PluralForms
    : { [K in keyof T]: Shape<T[K]> };

export type Translation = Shape<typeof en>;

// Every dotted path to a string or plural entry, e.g. "nav.movies".
type Paths<T> = {
  [K in keyof T & string]: T[K] extends string | { other: string } ? K : `${K}.${Paths<T[K]>}`;
}[keyof T & string];

export type TranslationKey = Paths<typeof en>;

export type TranslateVars = Record<string, string | number>;
