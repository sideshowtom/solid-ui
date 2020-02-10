
import * as Index from '../../src/index'
  
describe('Index', () => {
  it('exists', () => {
    expect(Object.keys(Index)).toEqual([
      'ns',
      'acl',
      'aclControl',
      'authn',
      'create',
      'icons',
      'log',
      'matrix',
      'media',
      'messageArea',
      'infiniteMessageArea',
      'pad',
      'preferences',
      'store',
      'style',
      'table',
      'tabs',
      'utils',
      'widgets',
      'versionInfo',
      'dom',
      'rdf',
    ])
  })
})
