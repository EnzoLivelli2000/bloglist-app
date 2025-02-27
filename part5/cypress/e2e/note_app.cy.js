describe('Note app', () => {

  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Enzo Ferrari',
      username: 'Liv2000',
      password: 'prueba123'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:5173')
  })

  it('front page can be opened', () => {
    cy.visit('http://localhost:5173/')
    cy.contains('Notes')
    cy.contains('This note is not saved to server')
  })

  it('login form can be opened', function () {
    cy.visit('http://localhost:5173/')
    cy.contains('Log In').click()
    cy.get('#username').type('Liv2000')
    cy.get('#password').type('prueba123')
    cy.get('#login-button').click()

    cy.contains('Enzo Ferrari logged in')
  })

  it('a new note can be created', function () {

    cy.visit('http://localhost:5173/')
    cy.contains('Log In').click()
    cy.get('#username').type('Liv2000')
    cy.get('#password').type('prueba123')
    cy.get('#login-button').click()

    cy.contains('Enzo Ferrari logged in')

    cy.contains('new note').click()
    cy.get('input').type('a note created by cypress')
    cy.contains('save').click()
    cy.visit('http://localhost:5173/')
    cy.contains('a note created by cypress')
  })

  it('it can be made not important', function () {

    cy.visit('http://localhost:5173/')
    cy.contains('Log In').click()
    cy.get('#username').type('Liv2000')
    cy.get('#password').type('prueba123')
    cy.get('#login-button').click()

    cy.contains('Enzo Ferrari logged in')

    cy.contains('new note').click()
    cy.get('input').type('another note cypress')
    cy.contains('save').click()

    cy.visit('http://localhost:5173/')

    cy.contains('another note cypress')
      .contains('make not important')
      .click()

    cy.contains('show all')
      .click()

    cy.contains('another note cypress')
      .contains('make important')
  })

  it.only('login fails with wrong password', function() {
    cy.contains('Log In').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.get('.error').contains('wrong credentials')

    cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
  })

})