jest.mock('bootstrap/dist/css/bootstrap.min.css', () => ({}), {virtual: true});
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import Terminal from '../Terminal';

test('shows help command', async () => {
  render(<Terminal />);
  const input = screen.getByLabelText('command line');
  await act(async () => {
    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  });
  expect(screen.getByText(/Commands:/)).toBeInTheDocument();
});

it('shows unknown command', async () => {
  render(<Terminal />);
  const input = screen.getByLabelText('command line');
  await act(async () => {
    fireEvent.change(input, { target: { value: 'foo' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  });
  expect(screen.getByText(/Unknown command/)).toBeInTheDocument();
});

it('autocompletes help with tab', async () => {
  render(<Terminal />);
  const input = screen.getByLabelText('command line');
  await act(async () => {
    fireEvent.change(input, { target: { value: 'he' } });
    fireEvent.keyDown(input, { key: 'Tab', code: 'Tab' });
  });
  expect(input).toHaveValue('help');
});
it('clears history', async () => {
  render(<Terminal />);
  const input = screen.getByLabelText('command line');
  await act(async () => {
    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    fireEvent.change(input, { target: { value: 'clear' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  });
  expect(screen.queryByText(/Commands:/)).not.toBeInTheDocument();
});
it('shows career', async () => {
  const { container } = render(<Terminal />);
  await act(async () => {});
  const input = screen.getByLabelText('command line');
  await act(async () => {
    fireEvent.change(input, { target: { value: 'career' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  });
  await waitFor(() => expect(container.textContent).toMatch(/\.\.\./));
});

it('shows about and contact', async () => {
  const { container } = render(<Terminal />);
  await act(async () => {});
  const input = screen.getByLabelText('command line');
  await act(async () => {
    fireEvent.change(input, { target: { value: 'about' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  });
  await waitFor(() => expect(container.textContent).toContain('a'));
  await act(async () => {
    fireEvent.change(input, { target: { value: 'contact' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  });
  await waitFor(() => expect(container.textContent).toContain('c'));
});

it('navigates history with arrows', async () => {
  render(<Terminal />);
  const input = screen.getByLabelText('command line');
  await act(async () => {
    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  });
  await act(async () => {
    fireEvent.change(input, { target: { value: 'about' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  });
  await act(async () => {
    fireEvent.keyDown(input, { key: 'ArrowUp', code: 'ArrowUp' });
  });
  expect(input).toHaveValue('about');
  await act(async () => {
    fireEvent.keyDown(input, { key: 'ArrowUp', code: 'ArrowUp' });
  });
  expect(input).toHaveValue('help');
  await act(async () => {
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' });
  });
  expect(input).toHaveValue('about');
  await act(async () => {
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' });
  });
  expect(input).toHaveValue('');
});

it('toggles theme', async () => {
  render(<Terminal />);
  const input = screen.getByLabelText('command line');
  await act(async () => {
    fireEvent.change(input, { target: { value: 'dark' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  });
  expect(document.body.classList.contains('light-mode')).toBe(true);
});

it('file system commands work', async () => {
  render(<Terminal />);
  const input = screen.getByLabelText('command line');
  await act(async () => {});
  await act(async () => {
    fireEvent.change(input, { target: { value: 'ls' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  });
  await waitFor(() => expect(screen.getByText(/about.txt/)).toBeInTheDocument());
  await act(async () => {
    fireEvent.change(input, { target: { value: 'cat about.txt' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  });
  await waitFor(() => expect(screen.getAllByText(/a/).length).toBeGreaterThan(0));
  await act(async () => {
    fireEvent.change(input, { target: { value: 'touch new.txt' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  });
  await act(async () => {
    fireEvent.change(input, { target: { value: 'ls' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  });
  expect(screen.getByText(/new.txt/)).toBeInTheDocument();
  await act(async () => {
    fireEvent.change(input, { target: { value: 'cd docs' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    fireEvent.change(input, { target: { value: 'pwd' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  });
  await waitFor(() => expect(screen.getByText(/\/docs/)).toBeInTheDocument());
});

it('misc commands', async () => {
  render(<Terminal />);
  const input = screen.getByLabelText('command line');
  await act(async () => {});
  await act(async () => {
    fireEvent.change(input, { target: { value: 'whoami' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  });
  await waitFor(() => expect(screen.getByText(/guest/)).toBeInTheDocument());
  await act(async () => {
    fireEvent.change(input, { target: { value: 'date' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  });
  await waitFor(() => expect(screen.getByText(/\d{4}/)).toBeInTheDocument());
  await act(async () => {
    fireEvent.change(input, { target: { value: 'sudo ls' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  });
  await waitFor(() => expect(screen.getByText(/Unable to sudo/)).toBeInTheDocument());
  await act(async () => {
    fireEvent.change(input, { target: { value: 'mail --from=a --subject=b --body=c' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  });
  await waitFor(() => expect(screen.getByText(/Mail sent/)).toBeInTheDocument());
});

it('focuses input when container clicked', async () => {
  render(<Terminal />);
  const container = screen.getByRole('textbox').parentElement?.parentElement;
  await act(async () => {
    container?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  const input = screen.getByLabelText('command line');
  expect(document.activeElement).toBe(input);
});
