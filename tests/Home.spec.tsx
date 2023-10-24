import React from 'react';
import { render } from '@testing-library/react';
import Home from '../app/page'; // Asegúrate de que la ruta al archivo sea correcta

test('should render correctly', () => {
  const { getByText } = render(<Home />);
  const titleElement = getByText("Hello");

  // Realiza una aserción usando expect
  expect(titleElement).toBeInTheDocument();
});