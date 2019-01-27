import * as React from 'react';
import { Menu } from './Menu';
import { createRenderer } from 'react-test-renderer/shallow';

const renderer = createRenderer();
renderer.render(<Menu />);
