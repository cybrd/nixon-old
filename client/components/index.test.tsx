import * as React from 'react';
import { Menu } from './Menu';
import { createRenderer } from 'react-test-renderer/shallow';

const renderer = createRenderer();
renderer.render(<Menu />);

describe('Simple expression tests', () => {
  test('Check literal value', () => {
    expect(5).toBe(5);
  });
});
