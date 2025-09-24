/**
 * Bundle Analysis Script
 *
 * Script to analyze bundle size and performance
 *
 * @author Fahed
 */

import { build } from 'vite'
import { analyze } from 'rollup-plugin-visualizer'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function analyzeBundle() {
  console.log('🔍 Analyzing bundle...')

  try {
    await build({
      configFile: path.resolve(__dirname, '../vite.config.ts'),
      plugins: [
        analyze({
          filename: 'dist/bundle-analysis.html',
          open: true,
          gzipSize: true,
          brotliSize: true,
        }),
      ],
    })

    console.log('✅ Bundle analysis complete!')
    console.log('📊 Check dist/bundle-analysis.html for detailed report')
  } catch (error) {
    console.error('❌ Bundle analysis failed:', error)
  }
}

analyzeBundle()
