// TEST CONSTANTS

const SEARCH_TERM_MIN_LENGTH = 'Search term minimum length'
const NO_RESULTS_FOR = 'No results for'
const ONE_CHAR_RETURNING_PRODUCTS = 'c'
const WORD_RETURNING_PRODUCTS = 'card'
const WORD_NOT_RETURNING_PRODUCTS = 'hhhh'
const SPECIFIC_PRODUCT_NAME = '$100 Physical Gift Card'
const SEARCH_TERM_WILDCARD = '%%%'


// IDs

const TOP_SEARCH_TEXT_INPUT_ID = '#small-searchterms';
const TOP_SEARCH_BUTTON_ID = 'input.button-1.search-box-button';
const TOP_SEARCH_AUTOCOMPLETE_ID = '#ui-id-1 > li:nth-child(1)';

const PRODUCT_GRID_ID = 'div.product-grid';
const NO_RESULT_ID = 'div.no-result';

const MIDDLE_SEARCH_TEXT_INPUT_ID = '#q';
const MIDDLE_SEARCH_BUTTON_ID = 'input.button-1.search-button';

// REQUIREMENTS DATA

const REQUIRED_CATEGORIES = ["All", "Computers", "Computers >> Desktops", "Computers >> Notebooks", "Computers >> Software", "Electronics", "Electronics >> Camera & photo", "Electronics >> Cell phones", "Electronics >> Others", "Apparel", "Apparel >> Shoes", "Apparel >> Clothing", "Apparel >> Accessories", "Digital downloads", "Books", "Jewelry", "Gift Cards"]
const REQUIRED_MANUFACTURERS = ["All", "Apple", "Lenovo", "Nokia"]
const REQUIRED_PRODUCTS_SORT_BY_OPTIONS = ["Position", "Name: A to Z", "Name: Z to A", "Price: Low to High", "Price: High to Low", "Created on"]
const REQUIRED_PRODUCTS_PAGE_SIZE_OPTIONS = ["10", "20", "50", "100"]


// HELPER FUNCTIONS

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

            // debateable: behaviour could be to not search at all (as per Top Search Bar behaviour), or to display all products
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

                it('should have all the categories stated in the requirements (wireframe sketch)', function () {
                    cy.get('#cid').children('option').then(options => {
                        const actual = [...options].map(o => o.text)
                        expect(actual.sort()).to.deep.eq(REQUIRED_CATEGORIES.sort())
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

            context('Manufacturer', () => {

                beforeEach(() => {
                    cy.get('#adv').check()
                })

                // Missing information: not defined what "Our brand is"
                it('should have all the manufacturers stated in the requirements (wireframe sketch)', function () {
                    cy.get('#mid').children('option').then(options => {
                        const actual = [...options].map(o => o.text)
                        expect(actual.sort()).to.deep.eq(REQUIRED_MANUFACTURERS.sort())
                    })
                })

                it('should return products from all manufacturers when selecting the `All` option', function () {
                    searchMiddleSearch('inch')
                    cy.get('div.product-grid').contains('HP Envy 6-1180ca 15.6-Inch Sleekbook')
                    cy.get('div.product-grid').contains('Apple MacBook Pro 13-inch')
                })

                it('should only return products from a specific manufacturer when selecting that manufacturer option', function () {
                    cy.get('#mid').select('HP')
                    searchMiddleSearch('inch')
                    cy.get('div.product-grid').contains('HP Envy 6-1180ca 15.6-Inch Sleekbook')
                    cy.get('div.product-grid').contains('Apple MacBook Pro 13-inch').should('not.exist')
                })

            })

            context('Price Range', () => {

                beforeEach(() => {
                    cy.get('#adv').check()
                })

                it('should return no products (or display a warning message) if the Price Range values are invalid (non-numerical)', function () {
                    cy.get('#pf').type('a')
                    cy.get('#pt').type('b')
                    searchMiddleSearch('inch')
                    getProductGrid().should('not.exist')
                })

                it('should return no products (or display a warning message) if the Price Range values are logically invalid (price from higher than price to)', function () {
                    cy.get('#pf').type('10')
                    cy.get('#pt').type('0')
                    searchMiddleSearch('inch')
                    getProductGrid().should('not.exist')
                })

                it('should only return products within the Price Range', function () {
                    cy.get('#pf').type('40')
                    cy.get('#pt').type('1500')
                    searchMiddleSearch('inch')
                    cy.get('div.product-grid').contains('HP Envy 6-1180ca 15.6-Inch Sleekbook')
                    cy.get('div.product-grid').contains('Apple MacBook Pro 13-inch').should('not.exist')
                    cy.get('div.product-grid').contains('Universal 7-8 Inch Tablet Cover').should('not.exist')
                })

                it('should only return products within the Price Range even if a price range value is missing', function () {
                    cy.get('#pf').type('40')
                    searchMiddleSearch('inch')
                    cy.get('div.product-grid').contains('HP Envy 6-1180ca 15.6-Inch Sleekbook')
                    cy.get('div.product-grid').contains('Apple MacBook Pro 13-inch')
                    cy.get('div.product-grid').contains('Universal 7-8 Inch Tablet Cover').should('not.exist')
                })

            })

            context('Search In Product Descriptions option', () => {

                beforeEach(() => {
                    cy.get('#adv').check()
                })

                it('should return products that have the search term in their description (but not in their title) if the Search In Product Descriptions checkbox is checked', function () {
                    cy.get('#sid').check()
                    searchMiddleSearch('inch')
                    cy.get('div.product-grid').contains('HTC One Mini Blue')
                })

                it('should not return products that have the search term in their description if the Search In Product Descriptions checkbox is NOT checked', function () {
                    searchMiddleSearch('inch')
                    cy.get('div.product-grid').contains('HTC One Mini Blue').should('not.exist')
                })

            })

        })

        context('Product Selectors', () => {

            beforeEach(() => {
                searchMiddleSearch(SEARCH_TERM_WILDCARD)
            })

            context('Products Sort By', () => {

                it('should have all the Products Sort By options in the correct order and as stated in the requirements (wireframe sketch)', function () {
                    cy.get('#products-orderby').children('option').then(options => {
                        const actual = [...options].map(o => o.text)
                        expect(actual.to.deep.eq(REQUIRED_PRODUCTS_SORT_BY_OPTIONS))
                    })
                })
            })


            context('Products Page Size', () => {

                it('should have all the `show x results per page` in the correct order and as stated in the requirements (wireframe sketch)', function () {
                    cy.get('#products-pagesize').children('option').then(options => {
                        const actual = [...options].map(o => o.text)
                        expect(actual).to.deep.eq(REQUIRED_PRODUCTS_PAGE_SIZE_OPTIONS)
                    })
                })

                // test will need to be updated upon fixing failing test above
                it('should limit the number of products per page when selecting a `show x results per page` option', function () {
                    cy.get('#products-pagesize').select('3')
                    cy.get('div.item-grid').children().should('have.length', 3)
                })

                context('Pagination', () => {

                    beforeEach(() => {
                        cy.get('#products-pagesize').select('3')
                    })

                    it('should navigate to the correct page when selecting a numbered pagination page (e.g. `3`)', function () {
                        cy.get('div.pager > ul > li:nth-child(3)').click();
                        cy.url().should('include', 'pagenumber=3')
                    })

                    it('should navigate to the correct page when selecting the pagination `next page` (i.e. `>`)', function () {
                        cy.get('li.next-page').click();
                        cy.url().should('include', 'pagenumber=2')
                    })

                    it('should navigate to the correct page when selecting the pagination `last page` (i.e. `>`)', function () {
                        cy.get('li.last-page').click();
                        cy.url().should('include', 'pagenumber=15')
                    })

                    it('should navigate to the correct page when selecting the pagination `previous page` (i.e. `>`)', function () {
                        cy.get('li.last-page').click();
                        cy.get('li.previous-page').click();
                        cy.url().should('include', 'pagenumber=14')
                    })

                    it.only('should navigate to the correct page when selecting the pagination `first page` (i.e. `>`)', function () {
                        cy.get('li.last-page').click();
                        cy.get('li.first-page').click();
                        cy.url().should('not.include', 'pagenumber')
                    })

                })
            })
        })
    })
})