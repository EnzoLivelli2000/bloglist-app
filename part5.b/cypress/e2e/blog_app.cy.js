describe('Blog app', function() {
  beforeEach(function() {
    // Vacía la base de datos
    cy.request('POST', 'http://localhost:3001/api/testing/reset') // Ajusta la ruta si es diferente

    // Crea un usuario para las pruebas
    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'password123'
    }
    cy.request('POST', 'http://localhost:3001/api/users', user) // Ajusta la ruta si es diferente

    // Visita la aplicación
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('Log In')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.visit('http://localhost:5173')
      cy.contains('Log In').click()
      cy.get('input[name="username"]').type('testuser')
      cy.get('input[name="password"]').type('password123')
      cy.contains('login').click()

      // Verifica que el usuario se haya autenticado correctamente
      cy.contains('Logged Out')
    })

    it('fails with wrong credentials', function() {
      cy.visit('http://localhost:5173')
      cy.contains('Log In').click()
      cy.get('input[name="username"]').type('testuser')
      cy.get('input[name="password"]').type('wrongpassword')
      cy.contains('login').click()

      // Verifica que se muestra un mensaje de error
      cy.contains('wrong credentials')
      cy.get('html').should('not.contain', 'Logged Out') // Asegura que el usuario no se haya autenticado
    })
  })
})
