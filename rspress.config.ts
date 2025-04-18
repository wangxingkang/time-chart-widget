import * as path from 'node:path';
import { pluginPreview } from '@rspress/plugin-preview';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  base: '/time-chart-widget/',
  root: path.join(__dirname, 'docs'),
  title: 'TimeChartWidget',
  icon: '/logo.png',
  logo: '/logo.png',
  logoText: 'Time Chart Widget',
  markdown: {
    checkDeadLinks: true,
  },
  route: {
    cleanUrls: true,
  },
  plugins: [
    pluginPreview({}),
  ],
  themeConfig: {
    enableContentAnimation: true,
    enableAppearanceAnimation: false,
    lastUpdated: true,
    hideNavbar: 'auto',
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/wangxingkang/time-chart-widget',
      },
    ],
  },
  builderConfig: {
    resolve: {
      alias: {
        'time-chart-widget': './src',
      },
    },
  },
});
