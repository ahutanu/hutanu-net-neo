import '@testing-library/jest-dom';

global.fetch = jest.fn((url: string) => {
  if (url.endsWith('content.json')) {
    return Promise.resolve({ json: () => Promise.resolve({ about: 'a', contact: 'c' }) }) as any;
  }
  if (url.endsWith('fs.json')) {
    return Promise.resolve({ json: () => Promise.resolve({ 'about.txt': 'a', 'contact.txt': 'c', docs: {} }) }) as any;
  }
  return Promise.resolve({ json: () => Promise.resolve({}) }) as any;
}) as jest.Mock;
