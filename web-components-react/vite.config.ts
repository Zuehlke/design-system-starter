import vitePluginCreateLitReactWrapper from '@glytch/vite-plugin-generate-lit-react-wrapper';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    lib: {
      entry: './index.ts',
      fileName: '[name]',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        /^lit/,
        'react',
        /^@dreyfus\/web-components/,
      ],
    },
  },
  plugins: [
    vitePluginCreateLitReactWrapper({
      globToLitComponents: '../web-components/src/components/**/*.component.ts',
      prefix: 'dss-',
      getComponentPath: (name: string) => `@design-system-starter/web-components/dist/src/components/${name.replace('.component', '')}/${name}.js`,
      watchLitDist: '../web-components/dist/src',
      samePackageOutput: false,
    }),
  ],
});
