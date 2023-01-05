/// <reference  types="cypress" />

import {
    format, prepareLocalStorage
} from '../support/utils'


context('Site de finanças', () => {

    beforeEach(() => {
        cy.visit('https://devfinance-agilizei.netlify.app/', {
            onBeforeLoad(win) {
                prepareLocalStorage(win)
            }
        })



        cy.get('#data-table tbody tr').should('have.length', 2)
    })

    it('Cadastrar entradas', () => {

        cy.get('#transaction .button').click();
        cy.get('#description').type('Presente');
        cy.get('[name=amount]').type(12)
        cy.get('[type=date').type('2021-03-21')
        cy.get('button').contains('Salvar').click()

        cy.get('#data-table tbody tr').should('have.length', 3)
    });

    it('Cadastrar saídas', () => {

        cy.get('#transaction .button').click();
        cy.get('#description').type('Presente');
        cy.get('[name=amount]').type(-12)
        cy.get('[type=date').type('2021-03-21')
        cy.get('button').contains('Salvar').click()

        cy.get('#data-table tbody tr').should('have.length', 3)
    });

    it('Remover entradas e saidas', () => {
        cy.get('td.description')
            .contains("Mesada")
            .parent()
            .find('img[onclick*=remove]')
            .click()

        cy.get('td.description')
            .contains("Suco Kapo")
            .siblings()
            .children('img[onclick*=remove]')
            .click()

        cy.get('#data-table tbody tr').should('have.length', 0)
    });

    it('Validando saldo com diversas transações', () => {
        let incomes = 0
        let expenses = 0

        cy.get('#data-table tbody tr')
            .each(($el, index, $list) => {

                cy.get($el).find('td.income, td.expense').invoke('text').then(text => {
                    if (text.includes('-')) {
                        expenses = expenses + format(text)
                    } else {
                        incomes = incomes + format(text)
                    }

                    cy.log('entradas', incomes)
                    cy.log('saidas', expenses)
                })
            })

        cy.get('#totalDisplay').invoke('text').then(text => {
            let formattedTotalDisplay = format(text)
            let expectedTotal = incomes + expenses

            expect(formattedTotalDisplay).to.equal(expectedTotal)
        })
    })



});