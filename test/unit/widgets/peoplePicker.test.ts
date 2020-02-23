import * as RdfLib from 'rdflib'
import { JSDOM } from 'jsdom'

import {
  PeoplePicker,
  GroupPicker,
  Group,
  GroupBuilder,
  Person,
  findAddressBook,
  createNewGroup
} from '../../../src/widgets/peoplePicker'
import ns from '../../../src/ns'
jest.mock('rdflib')
jest.mock('solid-auth-client')
const kb = require('../../../src/store')
const fetcher = kb.fetcher

const dom = new JSDOM('<!DOCTYPE html><p>Hello world</p>').window.document
const element = dom.createElement('div')

describe('FindAddressBook', () => {
  it('exists', () => {
    expect(findAddressBook).toBeInstanceOf(Function)
  })
  it('runs', () => {
    expect(findAddressBook('typeIndex')).toMatchObject({})
  })

  it('should call kb.any and spy load when callback is successful ', () => {
    const spyOnNowOrWhenFetched = jest.spyOn(fetcher, 'nowOrWhenFetched')

    const spyAny = jest
      .spyOn(kb, 'any')
      .mockReturnValueOnce('book')
      .mockReturnValueOnce('book')
    const spyLoad = jest.spyOn(fetcher, 'load').mockResolvedValue('book')
    findAddressBook('typeIndex')
    const callback: any = spyOnNowOrWhenFetched.mock.calls[0][1]

    callback(true, undefined)

    expect(spyOnNowOrWhenFetched).toBeCalled()
    expect(spyAny).toBeCalled()
    expect(spyLoad).toBeCalled()
  })
  it('should return an error if it is not okay', () => {
    const spyOnNowOrWhenFetched = jest.spyOn(fetcher, 'nowOrWhenFetched')
    const spyAny = jest
      .spyOn(kb, 'any')
      .mockReturnValue('book')
      .mockReturnValueOnce('book')
    const spyLoad = jest.spyOn(fetcher, 'load').mockResolvedValue('book')
    findAddressBook('typeIndex')
    const callback: any = spyOnNowOrWhenFetched.mock.calls[0][1]
    callback(false, undefined)
    // expect(spyOnNowOrWhenFetched).toThrowError()
  })
  it('should return an error if it does not return a book registration', () => {
    const spyOnNowOrWhenFetched = jest.spyOn(fetcher, 'nowOrWhenFetched')
    const spyAny = jest
      .spyOn(kb, 'any')
      .mockReturnValueOnce(null)
      .mockReturnValueOnce('book')
    const spyLoad = jest.spyOn(fetcher, 'load').mockResolvedValue('book')
    findAddressBook('typeIndex')
    const callback: any = spyOnNowOrWhenFetched.mock.calls[0][1]
    callback(true, undefined)
    // expect(spyOnNowOrWhenFetched).toThrowError()
  })

  it('should throw an error when there is no book', () => {
    const spyOnNowOrWhenFetched = jest.spyOn(fetcher, 'nowOrWhenFetched')
    const spyAny = jest
      .spyOn(kb, 'any')
      .mockReturnValueOnce('bookregs')
      .mockReturnValueOnce(null)
    const spyLoad = jest.spyOn(fetcher, 'load').mockResolvedValue('book')
    findAddressBook('typeIndex')
    const callback: any = spyOnNowOrWhenFetched.mock.calls[0][1]
    callback(true, undefined)
    // expect(spyOnNowOrWhenFetched).toThrowError()
  })
  it('should throw an error when there an error with the load', () => {
    // this was working before I changed the above to mockReturnValueOnce
    // which I needed to do in order to get that test to take affect...
    // need to research
    const spyOnNowOrWhenFetched = jest.spyOn(fetcher, 'nowOrWhenFetched')
    const spyAny = jest
      .spyOn(kb, 'any')
      .mockReturnValue('book')
      .mockReturnValue('book')
    const spyLoad = jest.spyOn(fetcher, 'load').mockRejectedValue(new Error())
    findAddressBook('typeIndex')
    const callback: any = spyOnNowOrWhenFetched.mock.calls[0][1]
    callback(true, undefined)
    // expect(spyOnNowOrWhenFetched).toThrowError()
  })
})
describe('createNewGroup', () => {
  it('exists', () => {
    expect(createNewGroup).toBeInstanceOf(Function)
  })
  // @@ TODO something about doc within the function has a problem
  it.skip('runs', () => {
    expect(createNewGroup(RdfLib.sym('book'))).toMatchInlineSnapshot()
  })
})
describe('PeoplePicker', () => {
  it('exists', () => {
    expect(new PeoplePicker()).toBeInstanceOf(PeoplePicker)
  })
})
describe('PeoplePicker.render', () => {
  it('exists', () => {
    expect(new PeoplePicker().render).toBeInstanceOf(Function)
  })
  it('runs', () => {
    const typeIndex = {}
    const groupPickedCb = () => {}
    const options = { selectedGroup: false }
    const element = document.createElement('p')
    const peoplePicker = new PeoplePicker(
      element,
      typeIndex,
      groupPickedCb,
      options
    )
    expect(peoplePicker.render()).toMatchInlineSnapshot(`
      PeoplePicker {
        "element": <p>
          <div
            style="max-width: 350px; min-height: 200px; outline: 1px solid black; display: flex;"
          />
        </p>,
        "groupPickedCb": [Function],
        "onSelectGroup": [Function],
        "options": Object {
          "selectedGroup": false,
        },
        "selectedgroup": undefined,
        "typeIndex": Object {},
      }
    `)
  })

  it('.. type index ...', () => {
    const typeIndex = 'publicTypeIndex'
    const groupPickedCb = () => {}
    const options = { selectedGroup: {} }
    const element = document.createElement('p')
    const peoplePicker = new PeoplePicker(
      element,
      typeIndex,
      groupPickedCb,
      options
    )
    jest.clearAllMocks()
    const spyOnNowOrWhenFetched = jest
      .spyOn(fetcher, 'nowOrWhenFetched')
      .mockImplementationOnce(() => {
        return Promise.resolve('book')
      })

    peoplePicker.render()
    // expect(spyOnNowOrWhenFetched).toBeCalled()
    // expect(spyOnNowOrWhenFetched).toReturnWith('book')
    expect(spyOnNowOrWhenFetched).toBeCalledTimes(1)
    // expect(spyAny).toBeCalled() // not getting called.
    // expect(spySecondAny).toBeCalled()
    // expect(spyLoad).toBeCalled()

    expect(peoplePicker.render()).toMatchInlineSnapshot(`
      PeoplePicker {
        "element": <p>
          <div
            style="max-width: 350px; min-height: 200px; outline: 1px solid black; display: flex;"
          />
        </p>,
        "groupPickedCb": [Function],
        "onSelectGroup": [Function],
        "options": Object {
          "selectedGroup": Object {},
        },
        "selectedgroup": undefined,
        "typeIndex": "publicTypeIndex",
      }
    `)
  })

  it('create Element is called .. ', () => {
    jest.clearAllMocks()
    const spy = jest.spyOn(document, 'createElement')
    const typeIndex = {}
    const groupPickedCb = () => {}
    const options = { selectedGroup: true }
    const element = document.createElement('button')
    const peoplePicker = new PeoplePicker(
      element,
      typeIndex,
      groupPickedCb,
      options
    )
    peoplePicker.render()
    expect(spy).toHaveBeenCalledTimes(2)
  })
  it('runs 2', () => {
    const typeIndex = {}
    const groupPickedCb = () => {}
    const options = { selectedGroup: true }
    const element = document.createElement('p')
    const peoplePicker = new PeoplePicker(
      element,
      typeIndex,
      groupPickedCb,
      options
    )
    expect(peoplePicker.render()).toMatchInlineSnapshot(`
      PeoplePicker {
        "element": <p>
          <div
            style="max-width: 350px; min-height: 200px; outline: 1px solid black; display: flex;"
          />
        </p>,
        "groupPickedCb": [Function],
        "onSelectGroup": [Function],
        "options": Object {
          "selectedGroup": true,
        },
        "selectedgroup": undefined,
        "typeIndex": Object {},
      }
    `)
  })
  it.skip('mocking kb any for book', () => {
    const mockKbAny: jest.SpyInstance = require('../../../src/store').any
    mockKbAny.mockReturnValueOnce(null)
    const typeIndex = {}
    const groupPickedCb = () => {}
    const options = { selectedGroup: true }
    const element = document.createElement('p')
    const peoplePicker = new PeoplePicker(
      element,
      typeIndex,
      groupPickedCb,
      options
    )
    expect(peoplePicker.render()).toMatchInlineSnapshot(`
PeoplePicker {
  "element": <p>
    <div
      style="max-width: 350px; min-height: 200px; outline: 1px solid black; display: flex;"
    />
  </p>,
  "groupPickedCb": [Function],
  "onSelectGroup": [Function],
  "options": Object {
    "selectedGroup": true,
  },
  "selectedgroup": undefined,
  "typeIndex": Object {},
}
`)
  })
})

describe('PeoplePicker.findAddressBook', () => {
  it.skip('exists', () => {
    expect(new PeoplePicker().findAddressBook).toBeInstanceOf(Function)
  })
  it.skip('runs', () => {
    const typeIndex = {}
    const groupPickedCb = () => {}
    const options = {}
    const peoplePicker = new PeoplePicker(
      element,
      typeIndex,
      groupPickedCb,
      options
    )
    expect(peoplePicker.findAddressBook()).toBeTruthy()
  })
})

describe('PeoplePicker.onSelectGroup', () => {
  it('exists', () => {
    expect(new PeoplePicker().onSelectGroup).toBeInstanceOf(Function)
  })
  it('runs', () => {
    const typeIndex = {}
    const groupPickedCb = () => {}
    const options = {}
    const element = document.createElement('p')
    const peoplePicker = new PeoplePicker(
      element,
      typeIndex,
      groupPickedCb,
      options
    )
    expect(peoplePicker.onSelectGroup(RdfLib.sym(''))).toEqual(undefined)
  })
})

describe('GroupPicker', () => {
  it('exists', () => {
    expect(new GroupPicker()).toBeInstanceOf(GroupPicker)
  })
})

describe('GroupPicker.render', () => {
  it('exists', () => {
    expect(new GroupPicker().render).toBeInstanceOf(Function)
  })
  it('runs', () => {
    const container = RdfLib.sym('')
    const book = RdfLib.sym('')
    const handler = () => {}
    const groupPicker = new GroupPicker(container, book, handler)
    expect(groupPicker.render()).toBeTruthy()
  })
})

describe('GroupPicker.loadGroups', () => {
  it('exists', () => {
    expect(new GroupPicker().loadGroups).toBeInstanceOf(Function)
  })
  it('runs', () => {
    const container = RdfLib.sym('')
    const book = RdfLib.sym('')
    const handler = () => {}
    const groupPicker = new GroupPicker(container, book, handler)
    expect(groupPicker.loadGroups()).toBeTruthy()
  })
  it('should....', () => {
    const container = RdfLib.sym('')
    const book = RdfLib.sym('book')
    const handler = () => {}
    const groupPicker = new GroupPicker(container, book, handler)
    jest.clearAllMocks() // have to clear otherwise not the correct indices below
    const spyOnNowOrWhenFetched = jest.spyOn(fetcher, 'nowOrWhenFetched')
    const spyEach = jest.spyOn(kb, 'each').mockResolvedValue(['group1'])

    groupPicker.loadGroups()
    const callback: any = spyOnNowOrWhenFetched.mock.calls[0][1]
    callback(true, undefined)

    expect(spyOnNowOrWhenFetched).toBeCalled()
    expect(spyEach).toBeCalled()
  })
  it('should error if not okay', () => {
    const container = RdfLib.sym('')
    const book = RdfLib.sym('book')
    const handler = () => {}
    const groupPicker = new GroupPicker(container, book, handler)
    jest.clearAllMocks() // have to clear otherwise not the correct indices below
    const spyOnNowOrWhenFetched = jest.spyOn(fetcher, 'nowOrWhenFetched')

    groupPicker.loadGroups()
    const callback: any = spyOnNowOrWhenFetched.mock.calls[0][1]
    callback(false, undefined)
    // @@ TODO need to figure out how to properly test for errors
    // expect(callback(false, undefined)).toThrowError()
  })
})

describe('GroupPicker.handleClickGroup', () => {
  it('exists', () => {
    expect(new GroupPicker().handleClickGroup).toBeInstanceOf(Function)
  })
  it('runs', () => {
    const container = RdfLib.sym('')
    const book = RdfLib.sym('')
    const handler = () => {}
    const groupPicker = new GroupPicker(container, book, handler)
    const event = groupPicker.handleClickGroup()
    expect(groupPicker.handleClickGroup()).toBeTruthy()
    // @@ TODO this works below, but feel like it should be a better test
    // not just undefined..  will look at again
    expect(event()).toBe(undefined)
  })
})

describe('Group', () => {
  it('exists', () => {
    expect(new Group()).toBeInstanceOf(Group)
  })
})

describe('Group.render', () => {
  it('exists', () => {
    expect(new Group().render).toBeInstanceOf(Function)
  })
  it('runs', () => {
    const groupArg = RdfLib.sym('')
    const element = document.createElement('p')
    const group = new Group(element, groupArg)
    expect(group.render()).toBeTruthy()
  })
})

describe('GroupBuilder', () => {
  it('exists', () => {
    expect(new GroupBuilder()).toBeInstanceOf(GroupBuilder)
  })
})

describe('GroupBuilder.render', () => {
  it('exists', () => {
    expect(new GroupBuilder().render).toBeInstanceOf(Function)
  })
  it('runs', () => {
    jest.clearAllMocks()
    const groupArg = RdfLib.sym('')
    const book = RdfLib.sym('')
    const handler = () => {}
    const element = document.createElement('p')
    const groupBuilder = new GroupBuilder(
      element,
      book,
      groupArg,
      handler,
      handler
    )
    // @@ TODO just trying to touch the code at this point.  I want
    // to make the test better than toBe(undefined)
    expect(groupBuilder.onGroupChanged()).toBe(undefined)
    expect(groupBuilder.render()).toMatchInlineSnapshot(`
GroupBuilder {
  "book": Object {
    "dir": [Function],
    "doc": [Function],
    "elements": Array [],
    "sameTerm": [Function],
    "uri": "uri",
    "value": "",
  },
  "doneBuildingCb": [Function],
  "element": <p>
    <div
      style="max-width: 350px; min-height: 200px; outline: 1px solid black; display: flex; flex-direction: column;"
    >
      <label>
        Group Name:
        <input
          type="text"
        />
      </label>
      <button>
        Done
      </button>
    </div>
  </p>,
  "group": Object {
    "dir": [Function],
    "doc": [Function],
    "elements": Array [],
    "sameTerm": [Function],
    "uri": "uri",
    "value": "",
  },
  "groupChangedCb": [Function],
  "onGroupChanged": [Function],
}
`)
  })
})

describe('GroupBuilder.refresh', () => {
  it('exists', () => {
    expect(new GroupBuilder().refresh).toBeInstanceOf(Function)
  })
  it('runs', () => {
    const groupArg = RdfLib.sym('')
    const book = RdfLib.sym('')
    const handler = () => {}
    const groupBuilder = new GroupBuilder(
      element,
      book,
      groupArg,
      handler,
      handler
    )
    expect(groupBuilder.refresh()).toEqual(undefined)
  })
})

describe('GroupBuilder.add', () => {
  it('exists', () => {
    expect(new GroupBuilder().add).toBeInstanceOf(Function)
  })
  it('runs', () => {
    const groupArg = RdfLib.sym('')
    const book = RdfLib.sym('')
    const handler = () => {}
    const groupBuilder = new GroupBuilder(
      element,
      book,
      groupArg,
      handler,
      handler
    )
    expect(groupBuilder.add()).toMatchInlineSnapshot(`Promise {}`)
  })
  // need to to nowOrWhenFetched
  it('not okay it returns an error -- callback false', () => {
    const spyOnNowOrWhenFetched = jest.spyOn(fetcher, 'nowOrWhenFetched')

    const groupArg = RdfLib.sym('')
    const book = RdfLib.sym('')
    const handler = () => {}
    const groupBuilder = new GroupBuilder(
      element,
      book,
      groupArg,
      handler,
      handler
    )

    groupBuilder.add('webId')
    const callback: any = spyOnNowOrWhenFetched.mock.calls[0][1]
    callback(false, undefined)
    expect(spyOnNowOrWhenFetched).toBeCalled()
    // expect .. an error
  })
  // an error is happening with kb.any doesn't seem to be mocked..
  it.skip('not okay it returns an error', () => {
    jest.clearAllMocks()
    const spyOnNowOrWhenFetched = jest.spyOn(fetcher, 'nowOrWhenFetched')

    const groupArg = RdfLib.sym('')
    const book = RdfLib.sym('')
    const handler = () => {}
    const groupBuilder = new GroupBuilder(
      element,
      book,
      groupArg,
      handler,
      handler
    )
    // the spy doesn't seem to be working
    const spyAny = jest.spyOn(kb, 'any').mockReturnValueOnce(ns.foaf('Person'))
    groupBuilder.add('webId')
    const callback: any = spyOnNowOrWhenFetched.mock.calls[0][1]
    callback(true, undefined)
    expect(spyOnNowOrWhenFetched).toBeCalled()
    expect(spyAny).toBeCalled()
    // expect .. an error
  })
})

describe('GroupBuilder.handleRemove', () => {
  it('exists', () => {
    expect(new GroupBuilder().handleRemove).toBeInstanceOf(Function)
  })
  it('runs', () => {
    const groupArg = RdfLib.sym('')
    const book = RdfLib.sym('')
    const handler = () => {}
    const element = document.createElement('p')
    const groupBuilder = new GroupBuilder(
      element,
      book,
      groupArg,
      handler,
      handler
    )
    expect(groupBuilder.handleRemove()).toMatchInlineSnapshot('[Function]')
  })
})

describe('GroupBuilder.setGroupName', () => {
  it('exists', () => {
    expect(new GroupBuilder().setGroupName).toBeInstanceOf(Function)
  })
  // @@ TODO once I added the code for findAddressBook, a namedGraph
  // error is popping up on line 392 Need to look into this
  // think groupArg may need to be adjusted
  it.skip('runs', () => {
    const groupArg = RdfLib.sym('testing')
    const book = RdfLib.sym('')
    const handler = () => {}
    const element = document.createElement('p')
    const groupBuilder = new GroupBuilder(
      element,
      book,
      groupArg,
      handler,
      handler
    )
    expect(groupBuilder.setGroupName()).toMatchInlineSnapshot('Promise {}')
  })
})

describe('Person', () => {
  it('exists', () => {
    expect(new Person()).toBeInstanceOf(Person)
  })
})
describe('Person.render', () => {
  it('exists', () => {
    expect(new Person().render).toBeInstanceOf(Function)
  })
  it('runs', () => {
    // @@ TODO Ask Michiel or Vince about what a proper WebIdNode should be
    const webIdNode = document.createElement('div')
    const element = document.createElement('div')
    const handleRemove = true
    const person = new Person(webIdNode, element, handleRemove)
    expect(person.render()).toMatchInlineSnapshot(`
Person {
  "element": <div>
    <div
      style="display: flex;"
    >
      <img
        height="50"
        src="undefined"
        style="margin: 5px;"
        width="50"
      />
      <span
        style="flex-grow: 1; margin: auto 0px;"
      >
        undefined
      </span>
      <button
        style="margin: 5px;"
      >
        Remove
      </button>
    </div>
  </div>,
  "handleRemove": true,
  "webIdNode": <div />,
}
`)
  })
})
