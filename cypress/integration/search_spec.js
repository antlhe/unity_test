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

function getCategorySelector() {
    return cy.get('#cid')
}

function getCategoryOptions() {
    return getCategorySelector().children('option')
}

function enableAdvancedSearch() {
    cy.get('#adv').check()
}

function enableAutoSearchSubCategories() {
    cy.get('#isc').check()
}

function enableSearchInProductDescription() {
    cy.get('#sid').check()
}

function enterPriceRangeFrom(text) {
    cy.get('#pf').type(text)
}

function enterPriceRangeTo(text) {
    cy.get('#pt').type(text)
}


// SEARCH RESULTS

function getNoResult() {
    return cy.get(NO_RESULT_ID)
}

function getProductGrid() {
    return cy.get(PRODUCT_GRID_ID)
}

function getProductOrderBySelector() {
    return cy.get('#products-orderby')
}

function getProductOrderByOptions() {
    return getProductOrderBySelector().children('option')
}

function getProductPageSizeSelector() {
    return cy.get('#products-pagesize')
}

function getProductPageSizeOptions() {
    return getProductPageSizeSelector().children('option')
}

function getProductTitlesInGrid() {
    return cy.get('div.item-grid').children().children().children('div.details').children('h2.product-title').children()
} 

function getProductPricesInGrid() {
    return cy.get('div.item-grid').children().children().children('div.details').children('div.add-info').children('div.prices').children('span.price.actual-price')

} 




// PRODUCT PAGE

function getProductPageProductName() {
    return cy.get('div.product-name > h1')
}

//todo unskip

describe('nopCommerce', () => {

    context('Search Feature', () => {
        beforeEach(() => {
            cy.visit('https://demo.nopcommerce.com/search?q=')
        })

        context('Top Search', () => {

            context('Search', () => {

                it('should return some products WHEN searching with 1 relevant character: ' + ONE_CHAR_RETURNING_PRODUCTS, () => {
                    searchTopSearch(ONE_CHAR_RETURNING_PRODUCTS)
                    getProductGrid().should('exist')
                    cy.contains(SEARCH_TERM_MIN_LENGTH).should('not.exist')
                })

                it('should return some products WHEN searching with a relevant word: ' + WORD_RETURNING_PRODUCTS, () => {
                    searchTopSearch(WORD_RETURNING_PRODUCTS)
                    getProductGrid().should('exist')
                })

                it('should NOT return products AND should display `No results for <search_criteria>` WHEN searching with an irrelevant word: ' + WORD_NOT_RETURNING_PRODUCTS, () => {
                    searchTopSearch(WORD_NOT_RETURNING_PRODUCTS)
                    getProductGrid().should('not.exist')
                    getNoResult().should('have.text', NO_RESULTS_FOR + " " + WORD_NOT_RETURNING_PRODUCTS)
                })

                it('should fill in Middle Search Bar input text value after having search in Top Search Bar', () => {
                    searchTopSearch(WORD_RETURNING_PRODUCTS)
                    cy.get('#q').should('have.value', WORD_RETURNING_PRODUCTS)
                })
            })

            context('Autocomplete', () => {

                it('should display a list of products (autocomplete) WHEN inputting 1 relevant character: ' + ONE_CHAR_RETURNING_PRODUCTS, () => {
                    typeTopSearch(ONE_CHAR_RETURNING_PRODUCTS)
                    getTopSearchAutocompleteItem().should('exist')
                })

                it('should display a list of products (autocomplete) WHEN inputting a relevant word: ' + WORD_RETURNING_PRODUCTS, () => {
                    typeTopSearch(WORD_RETURNING_PRODUCTS)
                    getTopSearchAutocompleteItem().should('exist')
                })

                it('should NOT display a list of products (autocomplete) WHEN inputting an irrelevant word: ' + WORD_NOT_RETURNING_PRODUCTS, () => {
                    typeTopSearch(WORD_NOT_RETURNING_PRODUCTS)
                    getTopSearchAutocompleteItem().should('not.exist')
                })

                it('should open the product page WHEN clicking an item in the autocomplete list of product(s)', () => {
                    typeTopSearch(SPECIFIC_PRODUCT_NAME)
                    getTopSearchAutocompleteItem().click()
                    getProductPageProductName().contains(SPECIFIC_PRODUCT_NAME)
                })

            })

        })

        context('Middle Search', () => {

            context('Search', () => {

                // debateable: behaviour could be to not search at all (as per Top Search Bar behaviour), or to display all products
                it('should display a `minimum length ...` warning message WHEN searching with 0 character', () => {
                    cy.get(MIDDLE_SEARCH_BUTTON_ID).click()
                    cy.contains(SEARCH_TERM_MIN_LENGTH).should('exist')
                })

                it('should return some products WHEN searching with 1 relevant character: ' + ONE_CHAR_RETURNING_PRODUCTS, () => {
                    searchMiddleSearch(ONE_CHAR_RETURNING_PRODUCTS)
                    getProductGrid().should('exist')
                    cy.contains(SEARCH_TERM_MIN_LENGTH).should('not.exist')
                })

                it('should return some products WHEN searching with a relevant word: ' + WORD_RETURNING_PRODUCTS, () => {
                    searchMiddleSearch(WORD_RETURNING_PRODUCTS)
                    getProductGrid().should('exist')
                })

                it('should NOT return products AND should display `No results for <search_criteria>` WHEN searching with an irrelevant word: ' + WORD_NOT_RETURNING_PRODUCTS, () => {
                    searchMiddleSearch(WORD_NOT_RETURNING_PRODUCTS)
                    getProductGrid().should('not.exist')
                    getNoResult().should('have.text', NO_RESULTS_FOR + " " + WORD_NOT_RETURNING_PRODUCTS)
                })
            })

            context('Advanced Search', () => {

                beforeEach(() => {
                    enableAdvancedSearch()
                })

                it('should display the Category, Manufacturer and Price Range search features WHEN checking Advanced Search checkbox', () => {
                    cy.get('#adv').should('be.checked')
                    cy.get('#advanced-search-block').should('be.visible')
                })

                context('Category', () => {

                    it('should have all the categories stated in the requirements (wireframe sketch)', () => {
                        getCategoryOptions().then(options => {
                            const actual = [...options].map(o => o.text)
                            //toString() for better error reporting
                            expect(actual.sort().toString()).to.eq(REQUIRED_CATEGORIES.sort().toString())
                        })
                    })

                    it('should have categories sorted alphabetically', () => {
                        getCategoryOptions().then(options => {
                            const actual = [...options].map(o => o.text)
                            const actualSorted = [...actual].sort()
                            //toString() for better error reporting
                            expect(actual.toString()).to.eq(actualSorted.toString())
                        })
                    })

                    it('should return products from all categories WHEN selecting the `All` option', () => {
                        searchMiddleSearch('apple')
                        getProductGrid().contains('Apple iCam')
                        getProductGrid().contains('Apple MacBook Pro 13-inch')
                    })

                    it('should only return products from a specific sub-category WHEN selecting that sub-category option', () => {
                        getCategorySelector().select('Computers >> Notebooks')
                        searchMiddleSearch('apple')
                        getProductGrid().contains('Apple iCam').should('not.exist')
                        getProductGrid().contains('Apple MacBook Pro 13-inch')
                    })

                    it('should NOT return products from a sub-category WHEN selecting the associated top category if the `Automatically search sub categories` checkbox is NOT checked', () => {
                        getCategorySelector().select('Computers')
                        searchMiddleSearch('apple')
                        getProductGrid().contains('Apple MacBook Pro 13-inch').should('not.exist')
                    })

                    it('should return products from a sub-category WHEN selecting the associated top category if the `Automatically search sub categories` checkbox is checked', () => {
                        getCategorySelector().select('Computers')
                        enableAutoSearchSubCategories()
                        searchMiddleSearch('apple')
                        getProductGrid().contains('Apple MacBook Pro 13-inch')
                    })

                })

                context('Manufacturer', () => {

                    // Missing information: not defined what "Our brand is"
                    it('should have all the manufacturers stated in the requirements (wireframe sketch)', () => {
                        cy.get('#mid').children('option').then(options => {
                            const actual = [...options].map(o => o.text)
                            //toString() for better error reporting
                            expect(actual.sort().toString()).to.eq(REQUIRED_MANUFACTURERS.sort().toString())
                        })
                    })

                    it('should return products from all manufacturers WHEN selecting the `All` option', () => {
                        searchMiddleSearch('inch')
                        getProductGrid().contains('HP Envy 6-1180ca 15.6-Inch Sleekbook')
                        getProductGrid().contains('Apple MacBook Pro 13-inch')
                    })

                    it('should only return products from a specific manufacturer WHEN selecting that manufacturer option', () => {
                        cy.get('#mid').select('HP')
                        searchMiddleSearch('inch')
                        getProductGrid().contains('HP Envy 6-1180ca 15.6-Inch Sleekbook')
                        getProductGrid().contains('Apple MacBook Pro 13-inch').should('not.exist')
                    })

                })

                context('Price Range', () => {

                    it('should return no products (or display a warning message) if the Price Range values are invalid (non-numerical)', () => {
                        enterPriceRangeFrom('a')
                        enterPriceRangeTo('b')
                        searchMiddleSearch('inch')
                        getProductGrid().should('not.exist')
                    })

                    it('should return no products (or display a warning message) if the Price Range values are logically invalid (price from higher than price to)', () => {
                        enterPriceRangeFrom('10')
                        enterPriceRangeTo('0')
                        searchMiddleSearch('inch')
                        getProductGrid().should('not.exist')
                    })

                    it('should only return products within the Price Range', () => {
                        enterPriceRangeFrom('40')
                        enterPriceRangeTo('1500')
                        searchMiddleSearch('inch')
                        getProductGrid().contains('HP Envy 6-1180ca 15.6-Inch Sleekbook')
                        getProductGrid().contains('Apple MacBook Pro 13-inch').should('not.exist')
                        getProductGrid().contains('Universal 7-8 Inch Tablet Cover').should('not.exist')
                    })

                    it('should only return products within the Price Range even if a price range value is missing', () => {
                        enterPriceRangeFrom('40')
                        searchMiddleSearch('inch')
                        getProductGrid().contains('HP Envy 6-1180ca 15.6-Inch Sleekbook')
                        getProductGrid().contains('Apple MacBook Pro 13-inch')
                        getProductGrid().contains('Universal 7-8 Inch Tablet Cover').should('not.exist')
                    })

                })

                context('Search In Product Descriptions option', () => {

                    it('should return products that have the search term in their description (but not in their title) if the Search In Product Descriptions checkbox is checked', () => {
                        enableSearchInProductDescription()
                        searchMiddleSearch('inch')
                        getProductGrid().contains('HTC One Mini Blue')
                    })

                    it('should not return products that have the search term in their description if the Search In Product Descriptions checkbox is NOT checked', () => {
                        searchMiddleSearch('inch')
                        getProductGrid().contains('HTC One Mini Blue').should('not.exist')
                    })

                })

            })
        })

        context('Search Results', () => {

            context('Product Selectors', () => {

                beforeEach(() => {
                    searchMiddleSearch(SEARCH_TERM_WILDCARD)
                })

                context('Products Sort By', () => {

                    //Sort by Position: not clear what this means
                    //Sort by Created on: I don't have access to this information 

                    it('should have all the Products Sort By options in the correct order and as stated in the requirements (wireframe sketch)', () => {
                        getProductOrderByOptions().then(options => {
                            const actual = [...options].map(o => o.text)
                            expect(actual).to.deep.eq(REQUIRED_PRODUCTS_SORT_BY_OPTIONS)
                        })
                    })

                    it('should sort the products alphabetically WHEN selecting `Name: A to Z` Products Sort By option', () => {
                        getProductOrderBySelector().select('Name: A to Z');
                        getProductTitlesInGrid().then(productTitles => {
                            const productTitlesArray = [...productTitles].map(o => o.text)
                            const productTitlesArraySorted = [...productTitlesArray].sort()
                            //toString() for better error reporting
                            expect(productTitlesArray.toString()).to.eq(productTitlesArraySorted.toString())
                        })
                    })

                    it.only('should sort the products in reverse alphabetical order WHEN selecting `Name: A to Z` Products Sort By option', () => {
                        getProductOrderBySelector().select('Name: Z to A');
                        getProductTitlesInGrid().then(productTitles => {
                            const productTitlesArray = [...productTitles].map(o => o.text)
                            const productTitlesArraySorted = [...productTitlesArray].sort().reverse()
                            //toString() for better error reporting
                            expect(productTitlesArray.toString()).to.eq(productTitlesArraySorted.toString())
                        })
                    })

                    it('should sort the products appropriately WHEN selecting `Price: Low to High` Products Sort By option', () => {
                        getProductOrderBySelector().select('Price: Low to High');
                        getProductPricesInGrid().then(productPrices => {
                            const productPricesStrArray = [...productPrices].map(o => o.textContent)
                            const productPricesArray = []
                            for (const productPriceString of productPricesStrArray) {
                                var price;
                                if (productPriceString === "") {
                                    price = 0
                                } else {
                                    price = parseFloat(productPriceString.substring(productPriceString.indexOf('$') + 1).replace(',', ''))
                                }
                                productPricesArray.push(price)
                            }

                            const productPricesArraySorted = [...productPricesArray].sort(function (a, b) {
                                return a - b;
                            })
                            //toString() for better error reporting
                            expect(productPricesArray.toString()).to.eq(productPricesArraySorted.toString())

                        })
                    })

                    it('should sort the products appropriately WHEN selecting `Price: High to Low` Products Sort By option', () => {
                        getProductOrderBySelector().select('Price: High to Low');
                        getProductPricesInGrid().then(productPrices => {
                            const productPricesStrArray = [...productPrices].map(o => o.textContent)
                            const productPricesArray = []
                            for (const productPriceString of productPricesStrArray) {
                                var price;
                                if (productPriceString === "") {
                                    price = 0
                                } else {
                                    price = parseFloat(productPriceString.substring(productPriceString.indexOf('$') + 1).replace(',', ''))
                                }
                                productPricesArray.push(price)
                            }

                            const productPricesArraySorted = [...productPricesArray].sort(function (a, b) {
                                return a - b;
                            }).reverse()
                            //toString() for better error reporting
                            expect(productPricesArray.toString()).to.eq(productPricesArraySorted.toString())

                        })
                    })
                })


                context('Products Page Size', () => {

                    it('should have all the `show x results per page` options in the correct order and as stated in the requirements (wireframe sketch)', () => {
                        getProductPageSizeOptions().then(options => {
                            const actual = [...options].map(o => o.text)
                            expect(actual).to.deep.eq(REQUIRED_PRODUCTS_PAGE_SIZE_OPTIONS)
                        })
                    })

                    // test will need to be updated upon fixing failing test above
                    it('should limit the number of products per page WHEN selecting a `show x results per page` option', () => {
                        getProductPageSizeSelector().select('3')
                        cy.get('div.item-grid').children().should('have.length', 3)
                    })

                    context('Pagination', () => {

                        beforeEach(() => {
                            getProductPageSizeSelector().select('3')
                        })

                        it('should navigate to the correct page WHEN selecting a numbered pagination page (e.g. `3`)', () => {
                            cy.get('div.pager > ul > li:nth-child(3)').click();
                            cy.url().should('include', 'pagenumber=3')
                        })

                        it('should navigate to the correct page WHEN selecting the pagination `next page` (i.e. `>`)', () => {
                            cy.get('li.next-page').click();
                            cy.url().should('include', 'pagenumber=2')
                        })

                        it('should navigate to the correct page WHEN selecting the pagination `last page` (i.e. `>>`)', () => {
                            cy.get('li.last-page').click();
                            cy.url().should('include', 'pagenumber=15')
                        })

                        it('should navigate to the correct page WHEN selecting the pagination `previous page` (i.e. `<`)', () => {
                            cy.get('li.last-page').click();
                            cy.get('li.previous-page').click();
                            cy.url().should('include', 'pagenumber=14')
                        })

                        it('should navigate to the correct page WHEN selecting the pagination `first page` (i.e. `<<`)', () => {
                            cy.get('li.last-page').click();
                            cy.get('li.first-page').click();
                            cy.url().should('not.include', 'pagenumber')
                        })

                    })
                })
            })

            context('Product Item', () => {

                beforeEach(() => {
                    // searchMiddleSearch(SPECIFIC_PRODUCT_NAME)

                    cy.visit('https://demo.nopcommerce.com/search?q=%24100+Physical+Gift+Card&cid=0&mid=0&pf=&pt=&adv=false&isc=false&sid=false')
                })

                it('should navigate to the product page WHEN clicking on a product image', () => {
                    cy.get('div.item-grid').children().children().first('div.picture').click()
                    getProductPageProductName().contains(SPECIFIC_PRODUCT_NAME)
                })

                it('should navigate to the product page WHEN clicking on a product image', () => {
                    cy.get('div.item-grid').children().children().first('div.details').click()
                    getProductPageProductName().contains(SPECIFIC_PRODUCT_NAME)
                })

                it('should add the product to the Cart WHEN the `Add to Cart` button is clicked', () => {

                    // STEP: `Add to Cart` button is clicked
                    cy.get('.product-box-add-to-cart-button').click()

                    // STEP: Assert Shopping Cart contains 1 item
                    cy.get('.cart-qty').contains('(1)')
                })

                it('should add the product to the Wish List WHEN the `Add to wish` icon is clicked', () => {
                    cy.get('.add-to-wishlist-button').click()
                    cy.get('.wishlist-qty').contains('(1)')
                })

                // Arguably this is testing the Wish List logic and not the Search Feature and its content
                it.skip('should only add the product to the Wish List ONCE WHEN the `Add to wish` icon is clicked TWICE', () => {
                    cy.get('.add-to-wishlist-button').click()
                    cy.get('.add-to-wishlist-button').click()
                    cy.get('.wishlist-qty').contains('(1)')
                })

                it('should add the product to the Compare List WHEN the `Add to compare list` icon is clicked', () => {
                    cy.get('.add-to-compare-list-button').click()
                    cy.contains('The product has been added to your product comparison')
                    cy.visit('https://demo.nopcommerce.com/compareproducts')
                    cy.contains(SPECIFIC_PRODUCT_NAME)
                    cy.get('.product-name').children().should('have.length', 2)
                })

                // Arguably this is testing the Wish List logic and not the Search Feature and its content
                it.skip('should only add the product to the Compare List WHEN the `Add to compare list` icon is clicked TWICE', () => {
                    cy.get('.add-to-compare-list-button').click()
                    cy.contains('The product has been added to your product comparison')
                    cy.get('.add-to-compare-list-button').click()
                    cy.contains('The product has been added to your product comparison')
                    cy.visit('https://demo.nopcommerce.com/compareproducts')
                    cy.contains(SPECIFIC_PRODUCT_NAME)
                    cy.get('.product-name').children().should('have.length', 2)
                })
            })
        })
    })
})