import React from 'react';
import { render } from '@testing-library/react';
import Home from '../app/page'; 

test('should render correctly', () => {
  const { getByText } = render(<Home />);
  const titleElement = getByText("Stellar Wallet");

  expect(titleElement).toBeInTheDocument();
});