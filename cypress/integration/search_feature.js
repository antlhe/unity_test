// TEST CONSTANTS

const SEARCH_TERM_MIN_LENGTH = 'Search term minimum length'
const NO_RESULTS_FOR = 'No results for'
const ONE_CHAR_RETURNING_PRODUCTS = 'c'
const WORD_RETURNING_PRODUCTS = 'card'
const WORD_NOT_RETURNING_PRODUCTS = 'hhhh'
const SPECIFIC_PRODUCT_NAME = '$100 Physical Gift Card'


// IDs

const TOP_SEARCH_TEXT_INPUT_ID = '#small-searchterms';
const TOP_SEARCH_BUTTON_ID = 'input.button-1.search-box-button';
const TOP_SEARCH_AUTOCOMPLETE_ID = '#ui-id-1 > li:nth-child(1)';

const PRODUCT_GRID_ID = 'div.product-grid';
const NO_RESULT_ID = 'div.no-result';

const MIDDLE_SEARCH_TEXT_INPUT_ID = '#q';
const MIDDLE_SEARCH_BUTTON_ID = 'input.button-1.search-button';

// REQUIREMENTS DATA

const CATEGORIES = ["All", "Computers", "Computers >> Desktops", "Computers >> Notebooks", "Computers >> Software", "Electronics", "Electronics >> Camera & photo", "Electronics >> Cell phones", "Electronics >> Others", "Apparel", "Apparel >> Shoes", "Apparel >> Clothing", "Apparel >> Accessories", "Digital downloads", "Books", "Jewelry", "Gift Cards"]



// TOP SEARCH BAR

function typeTopSearch(text) {
    cy.get(TOP_SEARCH_TEXT_INPUT_ID).type(text)
}

function searchTopSearch(text) {
    typeTopSearch(text)
    cy.get(TOP_SEARCH_BUTTON_ID).click()
}

function getTopSearchAutocompleteItem() {
    return cy.get(TOP_SEARCH_AUTOCOMPLETE_ID)
}


// MIDDLE SEARCH BAR

function typeMiddleSearch(text) {
    cy.get(MIDDLE_SEARCH_TEXT_INPUT_ID).type(text)
}

function searchMiddleSearch(text) {
    typeMiddleSearch(text)
    cy.get(MIDDLE_SEARCH_BUTTON_ID).click()
}

// SEARCH RESULTS

function getNoResult() {
    return cy.get(NO_RESULT_ID)
}

function getProductGrid() {
    return cy.get(PRODUCT_GRID_ID)
}



// PRODUCT PAGE

function getProductPageProductName() {
    return cy.get('div.product-name > h1')
}

//todo unskip

describe('Search feature - nopCommerce', () => {

    beforeEach(function () {
        cy.visit('https://demo.nopcommerce.com/search?q=')
    })

    context('Top Search Bar', () => {

        context('Search', () => {

            it('should return some products when searching with 1 relevant character: ' + ONE_CHAR_RETURNING_PRODUCTS, function () {
                searchTopSearch(ONE_CHAR_RETURNING_PRODUCTS)
                getProductGrid().should('exist')
                cy.contains(SEARCH_TERM_MIN_LENGTH).should('not.exist')
            })

            it('should return some products when searching with a relevant word: ' + WORD_RETURNING_PRODUCTS, function () {
                searchTopSearch(WORD_RETURNING_PRODUCTS)
                getProductGrid().should('exist')
            })

            it('should NOT return products AND should display `No results for <search_criteria>` when searching with an irrelevant word: ' + WORD_NOT_RETURNING_PRODUCTS, function () {
                searchTopSearch(WORD_NOT_RETURNING_PRODUCTS)
                getProductGrid().should('not.exist')
                getNoResult().should('have.text', NO_RESULTS_FOR + " " + WORD_NOT_RETURNING_PRODUCTS)
            })

            it('should fill in Middle Search Bar input text value after having search in Top Search Bar', function () {
                searchTopSearch(WORD_RETURNING_PRODUCTS)
                cy.get('#q').should('have.value', WORD_RETURNING_PRODUCTS)
            })
        })

        context('Autocomplete', () => {

            it('should display a list of products (autocomplete) when inputting 1 relevant character: ' + ONE_CHAR_RETURNING_PRODUCTS, function () {
                typeTopSearch(ONE_CHAR_RETURNING_PRODUCTS)
                getTopSearchAutocompleteItem().should('exist')
            })

            it('should display a list of products (autocomplete) when inputting a relevant word: ' + WORD_RETURNING_PRODUCTS, function () {
                typeTopSearch(WORD_RETURNING_PRODUCTS)
                getTopSearchAutocompleteItem().should('exist')
            })

            it('should NOT display a list of products (autocomplete) when inputting an irrelevant word: ' + WORD_NOT_RETURNING_PRODUCTS, function () {
                typeTopSearch(WORD_NOT_RETURNING_PRODUCTS)
                getTopSearchAutocompleteItem().should('not.exist')
            })

            it('should open the product page when clicking an item in the autocomplete list of product(s)', function () {
                typeTopSearch(SPECIFIC_PRODUCT_NAME)
                getTopSearchAutocompleteItem().click()
                getProductPageProductName().contains(SPECIFIC_PRODUCT_NAME)
            })

        })

    })

    context('Middle Search Bar', () => {

        context('Search', () => {

            // debateable: behaviour could be to not search at all, or to display all products
            it('should display a `minimum length ...` warning message when searching with 0 character', function () {
                cy.get(MIDDLE_SEARCH_BUTTON_ID).click()
                cy.contains(SEARCH_TERM_MIN_LENGTH).should('exist')
            })

            it('should return some products when searching with 1 relevant character: ' + ONE_CHAR_RETURNING_PRODUCTS, function () {
                searchMiddleSearch(ONE_CHAR_RETURNING_PRODUCTS)
                getProductGrid().should('exist')
                cy.contains(SEARCH_TERM_MIN_LENGTH).should('not.exist')
            })

            it('should return some products when searching with a relevant word: ' + WORD_RETURNING_PRODUCTS, function () {
                searchMiddleSearch(WORD_RETURNING_PRODUCTS)
                getProductGrid().should('exist')
            })

            it('should NOT return products AND should display `No results for <search_criteria>` when searching with an irrelevant word: ' + WORD_NOT_RETURNING_PRODUCTS, function () {
                searchMiddleSearch(WORD_NOT_RETURNING_PRODUCTS)
                getProductGrid().should('not.exist')
                getNoResult().should('have.text', NO_RESULTS_FOR + " " + WORD_NOT_RETURNING_PRODUCTS)
            })
        })

        context('Advanced Search', () => {

            it('should display the Category, Manufacturer and Price Range search features when checking Advanced Search checkbox', function () {
                cy.get('#adv').check()
                cy.get('#adv').should('be.checked')
                cy.get('#advanced-search-block').should('be.visible')
            })

            context('Category', () => {

                beforeEach(() => {
                    cy.get('#adv').check()
                })

                it.only('should have all the categories stated in the wireframe sketch', function () {
                    cy.get('#cid').children('option').then(options => {
                        const actual = [...options].map(o => o.text)
                        // expect(actual.toString()).to.eq(actual.sort().toString())
                        console.log(actual)
                    })
                })

                it('should have categories sorted alphabetically', function () {
                    cy.get('#cid').children('option').then(options => {
                        const actual = [...options].map(o => o.text)
                        expect(actual.toString()).to.eq(actual.sort().toString())
                    })
                })

                it('should return products from all categories when selecting the `All` option', function () {
                    searchMiddleSearch('apple')
                    cy.get('div.product-grid').contains('Apple iCam')
                    cy.get('div.product-grid').contains('Apple MacBook Pro 13-inch')
                })

                it('should only return products from a specific sub-category when selecting that sub-category option', function () {
                    cy.get('#cid').select('Computers >> Notebooks')
                    searchMiddleSearch('apple')
                    cy.get('div.product-grid').contains('Apple iCam').should('not.exist')
                    cy.get('div.product-grid').contains('Apple MacBook Pro 13-inch')
                })

                it('should NOT return products from a sub-category when selecting the associated top category if the `Automatically search sub categories` checkbox is NOT checked', function () {
                    cy.get('#cid').select('Computers')
                    searchMiddleSearch('apple')
                    cy.get('div.product-grid').contains('Apple MacBook Pro 13-inch').should('not.exist')
                })

                it('should return products from a sub-category when selecting the associated top category if the `Automatically search sub categories` checkbox is checked', function () {
                    cy.get('#cid').select('Computers')
                    cy.get('#isc').check()
                    searchMiddleSearch('apple')
                    cy.get('div.product-grid').contains('Apple MacBook Pro 13-inch')
                })

            })

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