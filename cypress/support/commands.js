
Cypress.Commands.add('fillMandatoryFieldsAndSubmit', () => {
    
        cy.get('#firstName').type('Vinicius');
        cy.get('#lastName').type('Mascarenhas');
        cy.get('#email').type('testeemail@uorak.com');
        cy.get('#open-text-area').type('teste caixa de texto', {delay:0});
        cy.contains('.button', 'Enviar').click()
        cy.get('.success').should('be.visible').contains('Mensagem enviada com sucesso.')
  });