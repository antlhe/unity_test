const SEARCH_TERM_MIN_LENGTH = 'Search term minimum length'
const NO_RESULTS_FOR = 'No results for'
const ONE_CHAR_RETURNING_PRODUCTS = 'c'
const WORD_RETURNING_PRODUCTS = 'card'
const WORD_NOT_RETURNING_PRODUCTS = 'hhhh'

const TOP_SEARCH_TEXT_INPUT_ID = '#small-searchterms';
const TOP_SEARCH_BUTTON_ID = 'input.button-1.search-box-button';
const TOP_SEARCH_AUTOCOMPLETE_ID = '#ui-id-1';
const PRODUCT_GRID_ID = 'div.product-grid';

function typeTopSearch(text) {
    cy.get(TOP_SEARCH_TEXT_INPUT_ID).type(text)
}

function searchTopSearch(text) {
    typeTopSearch(text)
    cy.get(TOP_SEARCH_BUTTON_ID).click()
}

function getTopSearchAutocomplete() {
    return cy.get(TOP_SEARCH_AUTOCOMPLETE_ID)
}

function getProductGrid() {
    return cy.get(PRODUCT_GRID_ID)
}

//todo unskip

describe('Search feature - nopCommerce', () => {

    beforeEach(function () {
        cy.visit('https://demo.nopcommerce.com/search?q=any')
    })

    context('Top search bar', () => {

        it('should return some products when searching with one character (included in some products titles): ' + ONE_CHAR_RETURNING_PRODUCTS, function () {
            searchTopSearch(ONE_CHAR_RETURNING_PRODUCTS)
            getProductGrid().should('exist')
            cy.contains(SEARCH_TERM_MIN_LENGTH).should('not.exist')
        })

        it('should return some products when searching with a products related word: ' + WORD_RETURNING_PRODUCTS, function () {
            searchTopSearch(WORD_RETURNING_PRODUCTS)
            getProductGrid().should('exist')
        })

        it('should not return products when searching with products unrelated word: ' + WORD_NOT_RETURNING_PRODUCTS, function () {
            searchTopSearch(WORD_NOT_RETURNING_PRODUCTS)
            getProductGrid().should('not.exist')
        })

        it('should display `No results for <search_criteria>` when no products are returned from search', function () {
            searchTopSearch(WORD_NOT_RETURNING_PRODUCTS)
            cy.contains(NO_RESULTS_FOR + " " + WORD_NOT_RETURNING_PRODUCTS).should('exist')
        })


        it('should display a list of products (autocomplete) under the text input when inputting a products related word: ' + WORD_RETURNING_PRODUCTS, function () {
            typeTopSearch(WORD_RETURNING_PRODUCTS)
            getTopSearchAutocomplete().should('exist')
        })



    })

    // context('GIVEN: I visit nopCommerce Search Feature page', () => {

    //     before(() => {
    //         cy.visit('https://demo.nopcommerce.com/search?q=card')
    //     })

    //     context('WHEN: I type one charcater in the top search bar and press Search', () => {

    //         before(() => {
    //             cy.get('#small-searchterms')
    //                 .type('card')

    //             // #small-search-box-form > input.button-1.search-box-button
    //         })

    //         it('THEN: I visit the Kitchen Sink', () => {

    //             // cy.get('.action-email')
    //             //     .type('fake@email.com')
    //             //     .should('have.value', 'fake@email.com')
    //         })

    //         // it('WHEN: I click on `type`', () => {
    //         //     cy.contains('type').click()
    //         // })

    //         // it('THEN: url includes /commands/actions', () => {
    //         //     cy.url().should('include', '/commands/actions')
    //         // })
    //     })
    // })
})