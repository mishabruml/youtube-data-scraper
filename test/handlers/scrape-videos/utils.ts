import {
  normaliseString,
  stringContainsSearchTerms,
  isLastPage
} from '../../../src/handlers/scrape-videos/utils'

describe('isLastPage', () => {
  test('returns true when nextPageToken is undefined', () => {
    expect(isLastPage(undefined)).toBe(true)
  })
  test('returns false when nextPageToken is defined', () => {
    expect(isLastPage('ABCDE')).toBe(false)
  })
})

describe('normaliseString', () => {
  for (const { input, expected } of [
    {
      input: '',
      expected: ''
    },
    {
      input: ' ',
      expected: ''
    },
    {
      input: 'foo bar buzz',
      expected: 'foobarbuzz'
    },
    {
      input: 'foo  bar buzz',
      expected: 'foobarbuzz'
    },
    {
      input: '   foo  bar buzz  ',
      expected: 'foobarbuzz'
    }
  ]) {
    test('should return a string with the spaces removed', () => {
      expect(normaliseString(input)).toBe(expected)
    })
  }

  for (const { input, expected } of [
    {
      input: 'A',
      expected: 'a'
    },
    {
      input: 'AA',
      expected: 'aa'
    },
    {
      input: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-',
      expected: 'abcdefghijklmnopqrstuvwxyz0123456789-'
    }
  ]) {
    test('should return a string with any uppercase characters lowercased', () => {
      expect(normaliseString(input)).toBe(expected)
    })
  }

  for (const { input, expected } of [
    {
      input: 'A A',
      expected: 'aa'
    },
    {
      input: ' A B ',
      expected: 'ab'
    },
    {
      input: '    A BCDEFGH   IJKL MN OPQRSTUVWX YZ0123 4567 89-   ',
      expected: 'abcdefghijklmnopqrstuvwxyz0123456789-'
    }
  ]) {
    test('should return a normalised string with any uppercase characters lowercased and whitespace removed', () => {
      expect(normaliseString(input)).toBe(expected)
    })
  }
})

describe('stringContainsSearchTerms', () => {
  for (const { input, searchTerms } of [
    {
      input: 'a',
      searchTerms: ['a']
    },
    {
      input: 'a',
      searchTerms: ['A']
    },
    {
      input: 'A',
      searchTerms: ['a']
    },
    {
      input: 'A',
      searchTerms: ['A']
    },
    {
      input: 'a',
      searchTerms: ['a', 'b']
    },
    {
      input: 'ab',
      searchTerms: ['a', 'b'] // difficult to avoid this case
    },
    {
      input: 'a b c d',
      searchTerms: ['a', 'a', 'a']
    },
    {
      input: 'video about matt stephens that is interesting',
      searchTerms: ['matt stephens']
    },
    {
      input: 'video about matt Stephens that is interesting',
      searchTerms: ['Matt Stephens']
    },
    {
      input: 'video about Matt Stephens that is interesting',
      searchTerms: ['matt stephens']
    },
    {
      input: 'video about Matt   Stephens that is interesting',
      searchTerms: ['Matt Stephens']
    },
    {
      input: 'Realistic Episode Title Featuring Dubai Stage and more!',
      searchTerms: ['pro',
        'matt stephens',
        '5',
        'Mitchelton-Scott',
        'Dubai stage'
      ]
    },
    {
      input: 'Realistic Episode Title ep.45',
      searchTerms: ['pro',
        'matt stephens',
        '5',
        'Mitchelton-Scott',
        'Dubai stage'
      ]
    },
    {
      input: 'professional', // difficult to avoid this, single word contains a search term as a substring
      searchTerms: [
        'pro',
        'matt stephens',
        '5',
        'Mitchelton-Scott',
        'Dubai stage'
      ]
    }
  ]) {
    test(`returns true when input "${input}" contains one or more search terms: [${searchTerms}]`, () => {
      expect(stringContainsSearchTerms(input, searchTerms)).toBe(true)
    })
  }

  for (const { input, searchTerms } of [
    {
      input: 'a',
      searchTerms: ['b']
    },
    {
      input: 'a',
      searchTerms: ['B']
    },
    {
      input: 'A',
      searchTerms: ['b']
    },
    {
      input: 'A',
      searchTerms: ['B']
    },
    {
      input: 'a',
      searchTerms: ['b', 'c']
    },
    {
      input: 'ab',
      searchTerms: ['c', 'c']
    },
    {
      input: 'ab',
      searchTerms: ['ba', 'c']
    },
    {
      input: 'a b c d',
      searchTerms: ['e', 'e', 'e']
    },
    {
      input: 'video about matt stephens that is interesting',
      searchTerms: ['satt mtephens']
    },
    {
      input: 'video about matt Stephens that is interesting',
      searchTerms: ['Satt mtephens']
    },
    {
      input: 'video about Matt Stephens that is interesting',
      searchTerms: ['satt     mtephens ']
    },
    {
      input: 'video about Matt   Stephens that is interesting',
      searchTerms: ['satt mtephens']
    },
    {
      input: 'Realistic Episode Title Featuring nothing like any of the search terms and more!',
      searchTerms: [
        'pro',
        'matt stephens',
        '5',
        'Mitchelton-Scott',
        'Dubai stage'
      ]
    },
    {
      input: 'Realistic Episode Title ep.46',
      searchTerms: [
        'pro',
        'matt stephens',
        '5',
        'Mitchelton-Scott',
        'Dubai stage'
      ]
    }
  ]) {
    test(`returns false when input "${input}" doesn't contain any of the search terms: [${searchTerms}]`, () => {
      expect(stringContainsSearchTerms(input, searchTerms)).toBe(false)
    })
  }
})
