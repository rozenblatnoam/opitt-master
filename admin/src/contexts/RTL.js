import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset } from '@mui/styles';

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [rtlPlugin],
});

// Configure JSS
const jss = create({
  plugins: [...jssPreset().plugins, rtl()],
});

function PS(props) {
  return <StylesProvider jss={jss}>{props.children}</StylesProvider>;
}

function RTL(props) {
    return <CacheProvider value={cacheRtl}><PS>{props.children}</PS></CacheProvider>;
  }

export default RTL