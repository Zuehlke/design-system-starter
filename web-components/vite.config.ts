import { defineConfig } from 'vitest/config';
import { globbySync } from 'globby';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import svg from 'vite-plugin-svgo';
import cem from 'vite-plugin-cem';
import { customElementJetBrainsPlugin } from 'custom-element-jet-brains-integration';

function getComponentFiles(): string[] {
  return globbySync('./src/components/**/*.component.ts');
}

function getComponents(): Record<string, string> {
  return getComponentFiles().reduce((obj, path) => {
    const outputName = path.replace('./', '').replace('.ts', '');
    return { ...obj, [outputName]: resolve(__dirname, path) };
  }, {});
}

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    lib: {
      entry: {
        'index': './src/index.ts',
        ...getComponents(),
      },
      fileName: '[name]',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        /^@floating-ui/,
        /^@neodrag/,
        /^highcharts/,
        /^lit/,
        /^@tanstack/,
        /^csv/,
      ],
    },
  },
  plugins: [
    svg({
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false,
            },
          },
        },
        {
          name: 'removeDimensions',
        },
      ],
    }),
    cem({
      files: [...getComponentFiles()],
      lit: true,
      packageJson: true,
      plugins: [
        customElementJetBrainsPlugin({
          outdir: 'dist',
        }) as any,
      ],
    }),
    dts({
      copyDtsFiles: true,
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './test.setup.ts',
    outputFile: './test-results/TEST-vitest.xml',
    coverage: {
      provider: 'v8',
      reporter: 'cobertura',
    },
    server: {
      deps: {
        inline: [
          /**
           * In the icon component we use `unsafeSVG` after dynamically importing svg files. Lit fails trying to
           * dynamically find this directive when it is not bundled.
           */
          'lit',
        ],
      },
    },
  },
});
