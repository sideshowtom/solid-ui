import { AccessGroups } from '../../../src/acl/access-groups'
import { IndexedFormula, graph } from 'rdflib'
import { instantiateAccessGroups } from '../helpers/instantiateAccessGroups'

jest.mock('rdflib')
jest.mock('solid-auth-client')

describe('AccessGroups', () => {
  it('exists', () => {
    expect(AccessGroups).toBeInstanceOf(Function)
  })
  it('runs', () => {
    expect(instantiateAccessGroups()).toBeTruthy()
  })
})

describe('AccessGroups#store', () => {
  it.skip('has a getter', () => {
    expect(instantiateAccessGroups().store).toBeInstanceOf(IndexedFormula)
  })
  it.skip('has a setter', () => {
    const groups = instantiateAccessGroups()
    const newStore = graph()
    ;(newStore as any).foo = 'bar'
    expect((groups.store as any).foo).toEqual('bar')
  })
})

describe('AccessGroups#render', () => {
  it('exists', () => {
    expect(instantiateAccessGroups().render).toBeInstanceOf(Function)
  })
  it.skip('runs', () => {
    expect(instantiateAccessGroups().render()).toBeInstanceOf(HTMLDivElement)
  })
})

describe('AccessGroups#addNewURI', () => {
  it('exists', () => {
    expect(instantiateAccessGroups().addNewURI).toBeInstanceOf(Function)
  })
  it.skip('runs', async () => {
    expect(await instantiateAccessGroups().addNewURI('')).toEqual(undefined)
  })
})