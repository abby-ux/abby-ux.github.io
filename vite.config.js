import { defineConfig } from 'vite';

export default defineConfig({
  base: './', 
  resolve: {
    alias: {
      'three': 'three'
    }
  }
});