declare module '*.json' {
  const foo: {
    name: string;
    version: string;
    author: string;
    license: string;
    description: string;
  };
  export = foo;
}

declare module '*.avsc' {
  import { Schema } from 'avsc';
  const foo: Schema;
  export = foo;
}