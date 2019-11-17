const {
  expect
} = require('chai')
const {
  describe,
  it
} = require('mocha')
const employee = require('./employee')
const products = require('./products')
const pricing = require('../pricing')

describe('formatPrice', () => {
  it('returns price as an integer formatted to two decimal places', () => {
    const price = pricing.formatPrice(21.7897)

    expect(price).to.equal(21.78)
  })
})

describe('getEmployerContribution', () => {
  it('returns reduced product price based upon employer contribution for percentage mode', () => {
    const dollarsOff = pricing.getEmployerContribution(products.voluntaryLife.employerContribution, 39.37)

    expect(dollarsOff).to.equal(3.937)
  })

  it('returns employer contribution based upon employer contribution for dollars mode', () => {
    const dollarsOff = pricing.getEmployerContribution(products.commuter.employerContribution, 39.37)

    expect(dollarsOff).to.equal(75)
  })
})

describe('calculateVolLifePricePerRole', () => {
  it('returns volLife price for a single employee', () => {
    const selectedOptions = {
      familyMembersToCover: ['ee'],
      coverageLevel: [{
        role: 'ee',
        coverage: 125000
      }],
    }
    const price = pricing.calculateVolLifePricePerRole(selectedOptions.coverageLevel[0].role, selectedOptions.coverageLevel, products.voluntaryLife.costs)

    expect(price).to.equal(43.75)
  })

  it('returns volLife plan price for a employee with a spouse', () => {
    const selectedOptions = {
      familyMembersToCover: ['sp'],
      coverageLevel: [{
        role: 'sp',
        coverage: 85000
      }],
    }

    const price = pricing.calculateVolLifePricePerRole(selectedOptions.coverageLevel[0].role, selectedOptions.coverageLevel, products.voluntaryLife.costs)

    expect(price).to.equal(10.2)
  })
})

describe('calculateVolLifePrice', () => {
  it('returns price for volLife plan for single employee', () => {
    const selectedOptions = {
      familyMembersToCover: ['ee'],
      coverageLevel: [{
        role: 'ee',
        coverage: 125000
      }],
    }

    const price = pricing.calculateVolLifePrice(products.voluntaryLife, selectedOptions)

    expect(price).to.equal(43.75)
  })

  it('returns price for volLife plan for an employee with a spouse', () => {
    const selectedOptions = {
      familyMembersToCover: ['sp'],
      coverageLevel: [{
        role: 'sp',
        coverage: 125000
      }],
    }

    const price = pricing.calculateVolLifePrice(products.voluntaryLife, selectedOptions)

    expect(price).to.equal(15)
  })
})

describe('calculateLTDPrice', () => {
  it('returns price for long term disability plan for single employee', () => {
    const selectedOptions = {
      familyMembersToCover: ['ee'],
      coverageLevel: [{
        role: 'ee',
        coverage: 125000
      }],
    }

    const price = pricing.calculateLTDPrice(products.longTermDisability, employee, selectedOptions)

    expect(price).to.equal(32.04)
  })
})

describe('calculateProductPrice', () => {
  it('returns the price for a voluntary life product for a single employee', () => {
    const selectedOptions = {
      familyMembersToCover: ['ee'],
      coverageLevel: [{
        role: 'ee',
        coverage: 125000
      }],
    }
    const price = pricing.calculateProductPrice(products.voluntaryLife, employee, selectedOptions)

    expect(price).to.equal(39.37)
  })

  it('returns the price for a voluntary life product for an employee with a spouse', () => {
    const selectedOptions = {
      familyMembersToCover: ['ee', 'sp'],
      coverageLevel: [{
          role: 'ee',
          coverage: 200000
        },
        {
          role: 'sp',
          coverage: 75000
        }
      ]
    }
    const price = pricing.calculateProductPrice(products.voluntaryLife, employee, selectedOptions)

    expect(price).to.equal(71.09)
  })

  it('returns the price for a disability product for an employee', () => {
    const selectedOptions = {
      familyMembersToCover: ['ee']
    }
    const price = pricing.calculateProductPrice(products.longTermDisability, employee, selectedOptions)

    expect(price).to.equal(22.04)
  })

  it('throws an error on unknown product type', () => {
    const unknownProduct = {
      type: 'vision'
    }

    expect(() => pricing.calculateProductPrice(unknownProduct, {}, {})).to.throw('Unknown product type: vision')
  })
})