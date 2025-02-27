import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import BlogForm from './BlogForm'; // Importa el componente BlogForm

describe('BlogForm component', () => {
  it('calls the event handler with the right details when a new blog is created', async () => {
    // Mock de la función createBlog
    const mockCreateBlog = vi.fn();

    // Renderiza el formulario de blog con la función mock
    render(<BlogForm createBlog={mockCreateBlog} />);

    // Encuentra los inputs y escribe en ellos
    const titleInput = screen.getByPlaceholderText(/title/i);
    const authorInput = screen.getByPlaceholderText(/author/i);
    const urlInput = screen.getByPlaceholderText(/url/i);
    const likesInput = screen.getByPlaceholderText(/likes/i);

    // Simula que el usuario escribe en los campos de entrada
    await userEvent.type(titleInput, 'Testing React Forms');
    await userEvent.type(authorInput, 'John Doe');
    await userEvent.type(urlInput, 'https://react-testing.com');
    await userEvent.type(likesInput, '5');

    // Simula el envío del formulario
    const saveButton = screen.getByText('Save');
    await userEvent.click(saveButton);

    // Verifica que la función mock haya sido llamada una vez con los detalles correctos
    expect(mockCreateBlog).toHaveBeenCalledTimes(1);
    expect(mockCreateBlog).toHaveBeenCalledWith({
      title: 'Testing React Forms',
      author: 'John Doe',
      url: 'https://react-testing.com',
      likes: '5', // El valor se espera como string, ya que viene de un input
    });
  });
});
