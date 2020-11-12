import { handler } from '../../../src/handlers/test'

test('test handler should log hello world', () => {
  const consoleSpy = jest.spyOn(console, 'log')
  handler()
  expect(consoleSpy).toBeCalledWith('hello world')
})
