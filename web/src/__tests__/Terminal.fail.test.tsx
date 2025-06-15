jest.mock('bootstrap/dist/css/bootstrap.min.css', () => ({}), {virtual: true});
jest.mock('pdfjs-dist', () => ({
  getDocument: () => ({ promise: Promise.reject(new Error('fail')) }),
  GlobalWorkerOptions: { workerSrc: '' }
}));
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import Terminal from '../Terminal';

test('handles career load failure', async () => {
  render(<Terminal />);
  const input = screen.getByLabelText('command line');
  await act(async () => {
    fireEvent.change(input, { target: { value: 'career' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  });
  await waitFor(() => expect(screen.getByText(/Failed to load career data/)).toBeInTheDocument());
});
