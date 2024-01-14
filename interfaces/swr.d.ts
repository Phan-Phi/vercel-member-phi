import { Cache, Key } from "swr";

declare module "swr" {
  interface Cache {
    keys(): string[];
  }
}
