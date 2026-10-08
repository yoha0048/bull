// @ts-check
import { defineConfig } from 'astro/config';

// 独自ドメインが決まったら site に設定する（例: 'https://【ドメイン名】'）。
// 設定すると canonical URL などが出力されるようになる。
// 併せて src/data/site.ts の url と public/CNAME も設定すること（docs/operations.md 参照）。
export default defineConfig({
  // site: 'https://【ドメイン名】',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
