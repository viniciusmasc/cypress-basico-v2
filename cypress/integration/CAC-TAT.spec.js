/// <reference types="Cypress" />


describe('Central de atendimento ao cliente TAT', () => {
    beforeEach(() => {
        cy.visit('./src/index.html');
    });
    it('verifica titulo da aplicação', () => {
        cy.title().should('eq', 'Central de Atendimento ao Cliente TAT')
    });

    it('preenche os campos obrigatórios e envia o formulário', () => {
        const longText = 'Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test, Test'
        cy.get('#firstName').type('Vinicius');
        cy.get('#lastName').type('Mascarenhas');
        cy.get('#email').type('testeemail@uorak.com');
        cy.get('#open-text-area').type(longText, { delay: 0 });
        cy.contains('.button', 'Enviar').click()
        cy.get('.success').should('be.visible').contains('Mensagem enviada com sucesso.')
    });

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
        cy.get('#firstName').type('Vinicius');
        cy.get('#lastName').type('Mascarenhas');
        cy.get('#email').type('testeemail');
        cy.get('#open-text-area').type('teste caixa de texto');
        cy.contains('.button', 'Enviar').click()
        cy.get('.error').should('be.visible').contains('Valide os campos obrigatórios!')
    });

    it('valida se campo telefone não aceita texto', () => {
        cy.get('#phone').type('Vinicius')
            .should('be.empty');

    });

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.get('#firstName').type('Vinicius');
        cy.get('#lastName').type('Mascarenhas');
        cy.get('#email').type('testeemail@email.com');
        cy.get('#open-text-area').type('teste caixa de texto');
        cy.get('#phone-checkbox').check()
        cy.contains('.button', 'Enviar').click()
        cy.get('.error').should('be.visible').contains('Valide os campos obrigatórios!')

    });

    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
        cy.get('#firstName').type('Vinicius').should('have.value', 'Vinicius').clear().should('be.empty');
        cy.get('#lastName').type('Mascarenhas').should('have.value', 'Mascarenhas').clear().should('be.empty');
        cy.get('#email').type('testeemail@email.com').should('have.value', 'testeemail@email.com').clear().should('be.empty');
        cy.get('#phone').type('1123124123').should('have.value', '1123124123').clear().should('be.empty');
        cy.get('#open-text-area').type('teste caixa de texto').should('have.value', 'teste caixa de texto').clear().should('be.empty');

    });

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
        cy.contains('.button', 'Enviar').click()
        cy.get('.error').should('be.visible').contains('Valide os campos obrigatórios!')
    });

    it('envia o formulário com sucesso usando um comando customizado', () => {
        cy.fillMandatoryFieldsAndSubmit();
    });

    it('seleciona um produto (YouTube) por seu texto', () => {
        cy.get('#product').select('YouTube').should('have.value', 'youtube')
    });

    it('seleciona um produto (Mentoria) por seu valor (value)', () => {
        cy.get('#product').select('mentoria').should('have.value', 'mentoria')
    });

    it('seleciona um produto (Blog) por seu índice', () => {
        cy.get('#product').select(1).should('have.value', 'blog')
    });

    it('marca o tipo de atendimento "Feedback"', () => {
        cy.get('#support-type [value="feedback"]').check()
            .should('be.checked')
    });

    it('marca cada tipo de atendimento', () => {
        cy.get('input[type=radio]')
            .should('have.length', 3)
            .each(($radio) => {
                cy.wrap($radio).click()
                cy.wrap($radio).should('be.checked')
            })
    });

    it('marca ambos checkboxes, depois desmarca o último', () => {
        cy.get('input[type=checkbox]').check().should('be.checked')
            .last().uncheck().should('not.be.checked')
    });

    it('seleciona um arquivo da pasta fixtures', () => {
        cy.get('#file-upload')
            .should('not.have.value')
            .selectFile('cypress/fixtures/documento.jpg')
            .should(($input) => {
                expect($input[0].files[0].name).eq('documento.jpg')
            });
    });

    it('seleciona um arquivo simulando um drag-and-drop', () => {
        cy.get('#file-upload')
            .should('not.have.value')
            .selectFile('cypress/fixtures/documento.jpg', { action: 'drag-drop' })
            .should(($input) => {
                expect($input[0].files[0].name).eq('documento.jpg')
            });
    });

    it('seleciona um arquivo simulando um drag-and-drop', () => {
        cy.fixture('documento.jpg').as('document')
        cy.get('#file-upload')
            .selectFile('@document')
            .should('not.have.value')
            .should(($input) => {
                expect($input[0].files[0].name).eq('documento.jpg')
            });
    });

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    });

    it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
        cy.get('[href="privacy.html"]')
            .invoke('removeAttr', 'target')
    });


});