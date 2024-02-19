/// <reference types="Cypress" />
describe('Central de atendimento ao cliente TAT', () => {
    const THREE_SECONDS_IN_MS = 3000;
    beforeEach(() => {
        cy.visit('./src/index.html');
    });
    it('verifica titulo da aplicação', () => {
        cy.title().should('eq', 'Central de Atendimento ao Cliente TAT')
    });

    it('preenche os campos obrigatórios e envia o formulário', () => {
        const longText = Cypress._.repeat('Test', 100)
        cy.clock()
        cy.get('#firstName').type('Vinicius');
        cy.get('#lastName').type('Mascarenhas');
        cy.get('#email').type('testeemail@uorak.com');
        cy.get('#open-text-area').type(longText, { delay: 0 });
        cy.contains('.button', 'Enviar').click()
        cy.get('.success').should('be.visible').contains('Mensagem enviada com sucesso.')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.success').should('not.be.visible')

    });

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
        cy.clock()
        cy.get('#firstName').type('Vinicius');
        cy.get('#lastName').type('Mascarenhas');
        cy.get('#email').type('testeemail');
        cy.get('#open-text-area').type('teste caixa de texto');
        cy.contains('.button', 'Enviar').click()
        cy.get('.error').should('be.visible').contains('Valide os campos obrigatórios!')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')
    });

    it('valida se campo telefone não aceita texto', () => {
        cy.get('#phone').type('Vinicius')
            .should('be.empty');

    });

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.clock()
        cy.get('#firstName').type('Vinicius');
        cy.get('#lastName').type('Mascarenhas');
        cy.get('#email').type('testeemail@email.com');
        cy.get('#open-text-area').type('teste caixa de texto');
        cy.get('#phone-checkbox').check()
        cy.contains('.button', 'Enviar').click()
        cy.get('.error').should('be.visible').contains('Valide os campos obrigatórios!')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')
    });

    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
        cy.get('#firstName').type('Vinicius').should('have.value', 'Vinicius').clear().should('be.empty');
        cy.get('#lastName').type('Mascarenhas').should('have.value', 'Mascarenhas').clear().should('be.empty');
        cy.get('#email').type('testeemail@email.com').should('have.value', 'testeemail@email.com').clear().should('be.empty');
        cy.get('#phone').type('1123124123').should('have.value', '1123124123').clear().should('be.empty');
        cy.get('#open-text-area').type('teste caixa de texto').should('have.value', 'teste caixa de texto').clear().should('be.empty');

    });

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
        cy.clock()
        cy.contains('.button', 'Enviar').click()
        cy.get('.error').should('be.visible').contains('Valide os campos obrigatórios!')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')
    });

    it('envia o formulário com sucesso usando um comando customizado', () => {
        cy.clock()
        cy.fillMandatoryFieldsAndSubmit();
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.success').should('not.be.visible')
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

    Cypress._.times(3, () => {
        it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
            cy.get('#privacy a').should('have.attr', 'target', '_blank')
        });
    });

    it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
        cy.get('[href="privacy.html"]')
            .invoke('removeAttr', 'target')
    });


    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
        cy.get('.success')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Mensagem enviada com sucesso.')
            .invoke('hide')
            .should('not.be.visible')
        cy.get('.error')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Valide os campos obrigatórios!')
            .invoke('hide')
            .should('not.be.visible')
    })

    it('preenche a area de texto usando o comando invoke', () => {
        const longText = Cypress._.repeat('Test', 100)
        cy.get('#open-text-area')
            .invoke('val', longText)
            .should('have.value', longText)
    });
    it('faz uma requisição HTTP', () => {
        cy.request({
            method: 'GET',
            url: 'https://cac-tat.s3.eu-central-1.amazonaws.com/index.html'
        }).should((response) => {
            const { status, statusText, body } = response
            expect(status).to.equal(200);
            expect(statusText).to.equal('OK')
            expect(body).to.include('CAC TAT')
        })
    });

    it.only('find the cat - v1', () => {
        cy.request({
            method: 'GET',
            url: 'https://cac-tat.s3.eu-central-1.amazonaws.com/index.html'
        }).should((response) => {
            const { status, statusText, body } = response
            expect(status).to.equal(200);
            expect(statusText).to.equal('OK')
            expect(body).to.include('🐈')
        })

    });

    it.only('find the cat - v2', () => {
        cy.get('#cat')
            .invoke('show')
            .should('be.visible')
    });

});