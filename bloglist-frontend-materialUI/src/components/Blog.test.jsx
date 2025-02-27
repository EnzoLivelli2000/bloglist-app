import { describe, it, expect } from 'vitest'; // Importar desde Vitest
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // Necesario para simular eventos de usuario
import '@testing-library/jest-dom'; // Extensiones de Jest para aserciones DOM
import Blog from './Blog'; // Importa el componente que deseas probar

describe('Blog component', () => {
    const blog = {
        title: 'React Testing Library',
        author: 'John Doe',
        url: 'https://react-testing.com',
        likes: 100,
        user: {
            username: 'johndoe',
        },
    };

    /* it('renders title and author but not url or likes by default', () => {
        render(<Blog blog={blog} handleLike={() => { }} handleRemoveBlog={() => { }} />);

        // Verifica que se muestren el título y el autor
        expect(screen.getByText('React Testing Library')).toBeInTheDocument();
        expect(screen.getByText('Author: John Doe')).toBeInTheDocument();

        // Verifica que NO se muestren la URL ni los likes por defecto
        expect(screen.queryByText('Url: https://react-testing.com')).not.toBeInTheDocument();
        expect(screen.queryByText('Likes: 100')).not.toBeInTheDocument();
    }); */

    it('shows url and likes when the view button is clicked', async () => {
        render(<Blog blog={blog} handleLike={() => { }} handleRemoveBlog={() => { }} />);

        // Simula un clic en el botón "View" usando `userEvent`
        const button = screen.getByText('View');
        await userEvent.click(button);

        // Ahora los detalles deberían estar visibles
        expect(screen.getByText('Url: https://react-testing.com')).toBeInTheDocument();
        expect(screen.getByText('Likes: 100')).toBeInTheDocument();
    });

    it('calls the event handler twice when the like button is clicked twice', async () => {
        // Mock de la función handleLike
        const mockHandleLike = vi.fn();

        // Renderiza el componente Blog con la función mock
        render(<Blog blog={blog} handleLike={mockHandleLike} handleRemoveBlog={() => { }} />);

        // Simula un clic en el botón "View" para mostrar los detalles
        const viewButton = screen.getByText('View');
        await userEvent.click(viewButton);

        // Simula dos clics en el botón "like"
        const likeButton = screen.getByText('❤');
        await userEvent.click(likeButton);
        await userEvent.click(likeButton);

        // Verifica que la función mock haya sido llamada dos veces
        expect(mockHandleLike).toHaveBeenCalledTimes(2);
    });
});
