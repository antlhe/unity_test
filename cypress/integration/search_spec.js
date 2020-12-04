// -------------------------------------
// TEST CONSTANTS
// -------------------------------------
const ONE_CHAR_RETURNING_PRODUCTS = 'c'
const WORD_RETURNING_PRODUCTS = 'card'
const WORD_NOT_RETURNING_PRODUCTS = 'hhhh'
const SPECIFIC_PRODUCT_NAME = '$100 Physical Gift Card'
const SEARCH_TERM_WILDCARD = '%%%'

// -------------------------------------
// REQUIREMENTS DATA
// -------------------------------------
const SEARCH_TERM_MIN_LENGTH = 'Search term minimum length'
const NO_RESULTS_FOR = 'No results for'
const REQUIRED_CATEGORIES = ["All", "Computers", "Computers >> Desktops", "Computers >> Notebooks", "Computers >> Software", "Electronics", "Electronics >> Camera & photo", "Electronics >> Cell phones", "Electronics >> Others", "Apparel", "Apparel >> Shoes", "Apparel >> Clothing", "Apparel >> Accessories", "Digital downloads", "Books", "Jewelry", "Gift Cards"]
const REQUIRED_MANUFACTURERS = ["All", "Apple", "Lenovo", "Nokia"]
const REQUIRED_PRODUCTS_SORT_BY_OPTIONS = ["Position", "Name: A to Z", "Name: Z to A", "Price: Low to High", "Price: High to Low", "Created on"]
const REQUIRED_PRODUCTS_PAGE_SIZE_OPTIONS = ["10", "20", "50", "100"]


// -------------------------------------
// HELPER FUNCTIONS and IDs
// -------------------------------------

// TOP SEARCH BAR

function typeTopSearch(text) {
    cy.get('#small-searchterms').type(text)
}

function searchTopSearch(text) {
    typeTopSearch(text)
    cy.get('.search-box-button').click()
}

function getTopSearchAutocompleteItem() {
    return cy.get('#ui-id-1 > li:nth-child(1)')
}


// MIDDLE SEARCH BAR

function typeMiddleSearch(text) {
    cy.get('#q').type(text)
}

function searchMiddleSearch(text) {
    typeMiddleSearch(text)
    cy.get('.search-button').click()
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
    return cy.get('div.no-result')
}

function getProductGrid() {
    return cy.get('div.product-grid')
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


function clickOnPaginationPageNum(pageNum) {
    cy.get('div.pager > ul > li:nth-child(' + pageNum + ')').click()
}

function clickOnNextPaginationPage() {
    cy.get('li.next-page').click()
}

function clickOnLastPaginationPage() {
    cy.get('li.last-page').click()
}

function clickOnPreviousPaginationPage() {
    cy.get('li.previous-page').click()
}

function clickOnFirstPaginationPage() {
    cy.get('li.first-page').click()
}

function clickOnFirstProductImage() {
    cy.get('div.item-grid').children().children().first('div.picture').click()
}

function clickOnFirstProductTitle() {
    cy.get('div.item-grid').children().children().first('div.details').click()
}

function firstProductAddToShoppingCart() {
    cy.get('.product-box-add-to-cart-button').click()
}

function getShoppingCart() {
    return cy.get('.cart-qty')
}

function firstProductAddToWishList() {
    cy.get('.add-to-wishlist-button').click()
}

function getWishList() {
    return cy.get('.wishlist-qty')
}

function firstProductAddToCompareList() {
    cy.get('.add-to-compare-list-button').click()
    cy.contains('The product has been added to your product comparison')
}

// PRODUCT PAGE

function getProductPageProductName() {
    return cy.get('div.product-name > h1')
}


// -------------------------------------
// TESTS
// -------------------------------------

describe('nopCommerce', () => {

    context('GIVEN the nopCommerce Search page is accessed (https://demo.nopcommerce.com/search?q=)', () => {
        beforeEach(() => {
            cy.visit('https://demo.nopcommerce.com/search?q=')
        })

        context('area - Top Search Bar', () => {

            context('fonctionality - Search', () => {

                it('WHEN searching with 1 relevant character: ' + ONE_CHAR_RETURNING_PRODUCTS + ' THEN search results include some products', () => {
                    searchTopSearch(ONE_CHAR_RETURNING_PRODUCTS)
                    getProductGrid().should('exist')
                    cy.contains(SEARCH_TERM_MIN_LENGTH).should('not.exist')
                })

                it('WHEN searching with a relevant word: ' + WORD_RETURNING_PRODUCTS + ' THEN search results include some products', () => {
                    //this test can be skipped when the above test case will be fixed
                    searchTopSearch(WORD_RETURNING_PRODUCTS)
                    getProductGrid().should('exist')
                })

                it('WHEN searching with an irrelevant word: ' + WORD_NOT_RETURNING_PRODUCTS + ' THEN search results return 0 products', () => {
                    searchTopSearch(WORD_NOT_RETURNING_PRODUCTS)
                    getProductGrid().should('not.exist')
                })

                it('WHEN search results return 0 products THEN `No results for <search_criteria>` is displayed', () => {
                    searchTopSearch(WORD_NOT_RETURNING_PRODUCTS)
                    getNoResult().should('have.text', NO_RESULTS_FOR + " " + WORD_NOT_RETURNING_PRODUCTS)
                })

                it('WHEN searching with the Top Search Bar THEN the Middle Search Bar input text should be filled with the search term', () => {
                    searchTopSearch(WORD_RETURNING_PRODUCTS)
                    cy.get('#q').should('have.value', WORD_RETURNING_PRODUCTS)
                })
            })

            context('fonctionality - Autocomplete', () => {

                it('WHEN typing 1 relevant character: ' + ONE_CHAR_RETURNING_PRODUCTS + ' THEN autocomplete shows a list of products', () => {
                    typeTopSearch(ONE_CHAR_RETURNING_PRODUCTS)
                    getTopSearchAutocompleteItem().should('exist')
                })

                it('WHEN typing a relevant word: ' + WORD_RETURNING_PRODUCTS + ' THEN autocomplete shows a list of products', () => {
                    //this test can be skipped when the above test case will be fixed
                    typeTopSearch(WORD_RETURNING_PRODUCTS)
                    getTopSearchAutocompleteItem().should('exist')
                })

                it('WHEN typing an irrelevant word: ' + WORD_NOT_RETURNING_PRODUCTS + ' THEN autocomplete does not show a list of products', () => {
                    typeTopSearch(WORD_NOT_RETURNING_PRODUCTS)
                    getTopSearchAutocompleteItem().should('not.exist')
                })

                it('WHEN clicking an item in the autocomplete list of products THEN the user is taken to that product\'s page', () => {
                    typeTopSearch(SPECIFIC_PRODUCT_NAME)
                    getTopSearchAutocompleteItem().click()
                    getProductPageProductName().contains(SPECIFIC_PRODUCT_NAME)
                })

            })

        })

        context('area - Middle Search Bar', () => {

            context('functionality - Search', () => {

                it('WHEN searching with 0 character THEN a `search term minimum length` warning message is displayed', () => {
                    cy.get('input.button-1.search-button').click()
                    cy.contains(SEARCH_TERM_MIN_LENGTH).should('exist')
                })


                it('WHEN searching with 1 relevant character: ' + ONE_CHAR_RETURNING_PRODUCTS + ' THEN search results include some products', () => {
                    // Although this test cases (and the one below which we'll be able to skip upon fixing this failing test) are similar in effect to when searching with the Top Bar seach
                    // I believe they are still valid as the url created through the search is different, e.g.:
                    // with the Top Bar seach: https://demo.nopcommerce.com/search?q=c
                    // with the Middle Bar seach: https://demo.nopcommerce.com/search?q=c&cid=0&mid=0&pf=&pt=&adv=false&isc=false&sid=false
                    searchMiddleSearch(ONE_CHAR_RETURNING_PRODUCTS)
                    getProductGrid().should('exist')
                    cy.contains(SEARCH_TERM_MIN_LENGTH).should('not.exist')
                })

                it('WHEN searching with a relevant word: ' + WORD_RETURNING_PRODUCTS + ' THEN search results include some products', () => {
                    //this test can be skipped when the above test case will be fixed
                    searchMiddleSearch(WORD_RETURNING_PRODUCTS)
                    getProductGrid().should('exist')
                })

            })

            context('GIVEN the Advanced Search checkbox is checked', () => {

                beforeEach(() => {
                    enableAdvancedSearch()
                })

                it('THEN the Category, Manufacturer and Price Range search features are displayed', () => {
                    cy.get('#adv').should('be.checked')
                    cy.get('#advanced-search-block').should('be.visible')
                })

                context('functionality - Category', () => {

                    it('THEN all the categories stated in the requirements (wireframe sketch) are present as options', () => {
                        getCategoryOptions().then(options => {
                            const actual = [...options].map(o => o.text)
                            expect(actual.sort().toString()).to.eq(REQUIRED_CATEGORIES.sort().toString())
                        })
                    })

                    it('THEN all the categories are sorted alphabetically', () => {
                        getCategoryOptions().then(options => {
                            const actual = [...options].map(o => o.text)
                            const actualSorted = [...actual].sort()
                            expect(actual.toString()).to.eq(actualSorted.toString())
                        })
                    })

                    it('WHEN selecting the `All` option THEN search returns products from all categories', () => {
                        searchMiddleSearch('apple')
                        getProductGrid().contains('Apple iCam')
                        getProductGrid().contains('Apple MacBook Pro 13-inch')
                    })

                    it('WHEN selecting a sub-category THEN search only returns products from that sub-category', () => {
                        getCategorySelector().select('Computers >> Notebooks')
                        searchMiddleSearch('apple')
                        getProductGrid().contains('Apple iCam').should('not.exist')
                        getProductGrid().contains('Apple MacBook Pro 13-inch')
                    })

                    it('WHEN selecting a top category AND the `Automatically search sub categories` checkbox is NOT checked THEN search does NOT return products from this category\'s sub-categories', () => {
                        getCategorySelector().select('Computers')
                        searchMiddleSearch('apple')
                        getProductGrid().should('not.exist')
                    })

                    it('WHEN selecting a top category AND the `Automatically search sub categories` checkbox is checked THEN search returns products from this category\'s sub-categories', () => {
                        getCategorySelector().select('Computers')
                        enableAutoSearchSubCategories()
                        searchMiddleSearch('apple')
                        getProductGrid().contains('Apple MacBook Pro 13-inch')
                    })

                })

                context('functionality - Manufacturer', () => {

                    it('THEN all the manufacturers stated in the requirements (wireframe sketch) are present as options', () => {
                        cy.get('#mid').children('option').then(options => {
                            const actual = [...options].map(o => o.text)
                            expect(actual.sort().toString()).to.eq(REQUIRED_MANUFACTURERS.sort().toString())
                        })
                    })

                    it('WHEN selecting the `All` option THEN search returns products from all manufacturers', () => {
                        searchMiddleSearch('inch')
                        getProductGrid().contains('HP Envy 6-1180ca 15.6-Inch Sleekbook')
                        getProductGrid().contains('Apple MacBook Pro 13-inch')
                    })

                    it('WHEN selecting a manufacturer THEN search returns only products from that manufacturer', () => {
                        cy.get('#mid').select('HP')
                        searchMiddleSearch('inch')
                        getProductGrid().contains('HP Envy 6-1180ca 15.6-Inch Sleekbook')
                        getProductGrid().contains('Apple MacBook Pro 13-inch').should('not.exist')
                    })

                })

                context('functionality - Price Range', () => {

                    it('WHEN the price range values are valid THEN search only returns products within the Price Range', () => {
                        enterPriceRangeFrom('40')
                        enterPriceRangeTo('1500')
                        searchMiddleSearch('inch')
                        getProductGrid().contains('HP Envy 6-1180ca 15.6-Inch Sleekbook')
                        getProductGrid().contains('Apple MacBook Pro 13-inch').should('not.exist')
                        getProductGrid().contains('Universal 7-8 Inch Tablet Cover').should('not.exist')
                    })

                    it('WHEN the price range values are invalid (non-numerical) THEN search dismisses those values (and acts as if no price range values were entered)', () => {
                        enterPriceRangeFrom('a')
                        enterPriceRangeTo('b')
                        searchMiddleSearch('inch')
                        getProductGrid().should('exist')
                    })

                    it('WHEN the price range values are LOGICALLY invalid (price from higher than price to) THEN search returns no products', () => {
                        enterPriceRangeFrom('10')
                        enterPriceRangeTo('0')
                        searchMiddleSearch('inch')
                        getProductGrid().should('not.exist')
                    })

                    it('WHEN only one price range value is entered (and is valid) THEN the price range filtering still functions and search only returns products accordingly', () => {
                        enterPriceRangeFrom('40')
                        searchMiddleSearch('inch')
                        getProductGrid().contains('HP Envy 6-1180ca 15.6-Inch Sleekbook')
                        getProductGrid().contains('Apple MacBook Pro 13-inch')
                        getProductGrid().contains('Universal 7-8 Inch Tablet Cover').should('not.exist')
                    })

                })

                context('functionality - Search In Product Descriptions', () => {

                    it('WHEN the Search In Product Descriptions checkbox is checked THEN search return products that have the search term either in their title or description', () => {
                        enableSearchInProductDescription()
                        searchMiddleSearch('inch')
                        getProductGrid().contains('HTC One Mini Blue')
                    })

                    it('WHEN the Search In Product Descriptions checkbox is NOT checked THEN search return products that have the search term in their title', () => {
                        searchMiddleSearch('inch')
                        getProductGrid().contains('HTC One Mini Blue').should('not.exist')
                    })

                })

            })
        })

        context('area - Product Selectors and Pagination', () => {

            context('GIVEN `%%%` (without the quotes) was searched for in the Middle Search Bar', () => {

                beforeEach(() => {
                    searchMiddleSearch(SEARCH_TERM_WILDCARD)
                })

                context('functionality - Products Sort By', () => {

                    it('THEN all the Products Sort By options stated in the requirements (wireframe sketch) are present', () => {
                        getProductOrderByOptions().then(options => {
                            const actual = [...options].map(o => o.text)
                            expect(actual.toString()).to.eq(REQUIRED_PRODUCTS_SORT_BY_OPTIONS.toString())
                        })
                    })

                    it('WHEN selecting `Name: A to Z` Products Sort By option THEN the products are sorted alphabetically', () => {
                        getProductOrderBySelector().select('Name: A to Z');
                        getProductTitlesInGrid().then(productTitles => {
                            // .toUpperCase() because javascript sort logic is different to the site's with regard to handling lower cases, whilst the later is still valid
                            const productTitlesArray = [...productTitles].map(o => o.text.toUpperCase())
                            const productTitlesArraySorted = [...productTitlesArray].sort()
                            expect(productTitlesArray.toString()).to.eq(productTitlesArraySorted.toString())
                        })
                    })

                    it('WHEN selecting `Name: Z to A` Products Sort By option THEN the products are sorted in reverse alphabetical order', () => {
                        getProductOrderBySelector().select('Name: Z to A');
                        getProductTitlesInGrid().then(productTitles => {
                            const productTitlesArray = [...productTitles].map(o => o.text.toUpperCase())
                            const productTitlesArraySorted = [...productTitlesArray].sort().reverse()
                            expect(productTitlesArray.toString()).to.eq(productTitlesArraySorted.toString())
                        })
                    })

                    it('WHEN selecting `Price: Low to High` Products Sort By option THEN the products are sorted accordingly', () => {
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
                            expect(productPricesArray.toString()).to.eq(productPricesArraySorted.toString())
                        })
                    })

                    it('WHEN selecting `Price: High to Low` Products Sort By option THEN the products are sorted accordingly', () => {
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
                            expect(productPricesArray.toString()).to.eq(productPricesArraySorted.toString())
                        })
                    })
                })


                context('functionality - Products Page Size', () => {

                    it('THEN all the Products Page Size options stated in the requirements (wireframe sketch) are present', () => {
                        getProductPageSizeOptions().then(options => {
                            const actual = [...options].map(o => o.text)
                            expect(actual.toString()).to.eq(REQUIRED_PRODUCTS_PAGE_SIZE_OPTIONS.toString())
                        })
                    })

                    // test will need to be updated upon fixing failing test above
                    it('WHEN selecting a Products Page Size option (e.g. 3) THEN only (e.g. 3) products per page are displayed', () => {
                        getProductPageSizeSelector().select('3')
                        cy.get('div.item-grid').children().should('have.length', 3)
                    })
                })

                context('functionality - Pagination', () => {

                    // tests will need to be updated once the correct Products Page Size options are implemented
                    context('GIVEN the Products Page Size option 3 is selected', () => {

                        beforeEach(() => {
                            getProductPageSizeSelector().select('3')
                        })

                        it('WHEN the 3rd pagination page is clicked THEN the user is taken to the correct (3rd) pagination page', () => {
                            const pageNum = 3
                            clickOnPaginationPageNum(pageNum)
                            cy.url().should('include', 'pagenumber=' + pageNum)
                        })

                        it('WHEN clicking on the pagination `next page` (i.e. `>`) THEN the user is taken to the correct (2nd) pagination page', () => {
                            clickOnNextPaginationPage()
                            cy.url().should('include', 'pagenumber=2')
                        })

                        it('WHEN clicking the pagination `last page` (i.e. `>>`) THEN the user is taken to the correct pagination page', () => {
                            clickOnLastPaginationPage()
                            cy.url().should('include', 'pagenumber=15')
                        })

                        it('WHEN clicking the pagination `previous page` (i.e. `<`) THEN the user is taken to the correct pagination page', () => {
                            clickOnLastPaginationPage()
                            clickOnPreviousPaginationPage()
                            cy.url().should('include', 'pagenumber=14')
                        })

                        it('WHEN clicking the pagination `first page` (i.e. `<<`) THEN the user is taken to the correct pagination page', () => {
                            clickOnLastPaginationPage()
                            clickOnFirstPaginationPage()
                            cy.url().should('not.include', 'pagenumber')
                        })

                    })
                })
            })

            context('area - Product Results Grid', () => {

                context('GIVEN `$100 Physical Gift Card` (without the quotes) was searched for in the Middle Search Bar', () => {

                    beforeEach(() => {
                        searchMiddleSearch(SPECIFIC_PRODUCT_NAME)
                    })

                    it('WHEN clicking on a product image THEN the user is taken to the product page', () => {
                        clickOnFirstProductImage()
                        getProductPageProductName().contains(SPECIFIC_PRODUCT_NAME)
                    })

                    it('WHEN clicking on a product title THEN the user is taken to the product page', () => {
                        clickOnFirstProductTitle()
                        getProductPageProductName().contains(SPECIFIC_PRODUCT_NAME)
                    })

                    it('WHEN the `Add to Cart` button is clicked THEN the product is added to the Cart', () => {
                        firstProductAddToShoppingCart()
                        getShoppingCart().contains('(1)')
                    })

                    it('WHEN the `Add to wish` icon is clicked THEN the product is added to the Wish List', () => {
                        firstProductAddToWishList()
                        getWishList().contains('(1)')
                    })

                    it.skip('WHEN the `Add to wish` icon is clicked TWICE THEN the product is added to the Wish List ONLY ONCE', () => {
                        // SKIPPED: arguably this is testing the Wish List logic and not the Search functionality and its content
                        firstProductAddToWishList()
                        firstProductAddToWishList()
                        getWishList().contains('(1)')
                    })

                    it('WHEN the `Add to compare list` icon is clicked THEN the product is added to the Compare List', () => {
                        firstProductAddToCompareList()
                        cy.visit('https://demo.nopcommerce.com/compareproducts')
                        cy.contains(SPECIFIC_PRODUCT_NAME)
                        cy.get('.product-name').children().should('have.length', 2)
                    })

                    it.skip('WHEN the `Add to compare list` icon is clicked TWICE THEN the product is added to the Compare List ONLY ONCE', () => {
                        // SKIPPED: arguably this is testing the Compare List logic and not the Search functionality and its content
                        firstProductAddToCompareList()
                        firstProductAddToCompareList()
                        cy.visit('https://demo.nopcommerce.com/compareproducts')
                        cy.contains(SPECIFIC_PRODUCT_NAME)
                        cy.get('.product-name').children().should('have.length', 2)
                    })
                })
            })
        })
    })
})