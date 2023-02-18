---
title: A reference guide of basics of Regular Expressions (Regex) in JavaScript
description: This is a guide on how to use Regular Expressions in JavaScript for those who need a refresher
pubDate: 2019-07-16
categories: ["JavaScript"]
heroImage: /assets/facepalm.jpg
group: "Software Development"
---

Welcome back, _future Jon_. Congratulations, you have successfully forgotten how to regex again. As a reminder to yourself, you have attempted to learn regex many times over the years, and at times you have gotten pretty good at it. Unfortunately, however, it has probably been a while since you last wrote a regex, and you have completely forgotten how to do ANYTHING and EVERYTHING, even the absolute fundamentals. Fear not, I have you covered. Once you read the following guide it will all start flooding back.

A while back you created a CodeSandbox with some really helpful examples of various techniques. In case you have forgotten the URL, it is; [Interactive Regexes](https://codesandbox.io/s/interactive-regex-nud6y).

Please remember the following;

- You are not a regex expert. Not now, not ever, and you will never will be. Period.
- There are probably a million better ways of writing every regex on this page.
- Remember the age-old golden rule; _If you use a regex to fix a problem, you now have two problems_. Are you sure it is a regex you need?
- (P.s. all this totally made sense when you wrote it)

## How to use a regex in JavaScript

There are a couple of ways;

1. **RegExp constructor function**. You can use the `RegExp` constructor function. More information on that is available on [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp).

2. **Regex is a first class citizen in JavaScript**, so you can use it natively, for example; `const expression = /jazz/gi;` (performs a global, case insensitive search for the word _jazz_).

3. **String.match**. That's right, `string` itself has built in support for matching on a regex.

Some simple examples;

```javascript
const expression = "https?://(?:www.)?(?:[a-z]+).co(?:m|.uk)"
const exampleText =
  "For more information, visit https://www.developerhandbook.com, or http://jpreecedev.com, alternatively visit https://www.amazon.co.uk for some reason."

const regexp = new RegExp(expression, "gi")
let res
while ((res = regexp.exec(exampleText))) {
  console.log(res) // ["https://www.developerhandbook.com"] ["http://jpreecedev.com"] ["https://www.amazon.co.uk"]
}

const nativeExpression = /https?:\/\/(?:www.)?(?:[a-z]+)\.co(?:m|\.uk)/gi
while ((res = nativeExpression.exec(exampleText))) {
  console.log(res) // ["https://www.developerhandbook.com"] ["http://jpreecedev.com"] ["https://www.amazon.co.uk"]
}

const replacableExpression = /foo/gi
const replacableText = "This is foo and foo and then some more foo"
console.log(replacableText.replace(replacableExpression, "bar")) // This is bar and bar and then some more bar

console.log(exampleText.match(regexp)) //["https://www.developerhandbook.com", "http://jpreecedev.com", "https://www.amazon.co.uk"]
```

In my humble opinion, the last example of using `string.match` is the cleanest syntatically and will result in having to write less code. The trade-off is that `string.match` returns less information about each match, which you may or may not care about.

There is a CodeSandbox, [very basic regex examples](https://codesandbox.io/s/very-basic-regex-examples-d7hvl), for reference.

## The fundamentals of regular expressions in JavaScript

Typically, in the real world, you will use regexes for the following reasons;

- Validate user input, like; email addresses, phone numbers etc.
- Replace old values in strings with new values.
- Insert characters. I.e. format the following number, `100000000`, as `10,000,000`.
- That is about it. Every other use case is probably wrong.

## JavaScript Regex Metacharacters

Metacharacters are special reserved characters. When you use a metacharacter in a regex, like a period (".") for example, it will have _some meaning_ to the regex engine. If this is not what you intended, make sure to escape the metacharacter using a forward slash ("\\"), which will tell the engine that you meant to use the literal character as part of the match.

Some examples of metacharacters;

<table class="table table-striped table-bordered mb-4"> <thead> <tr> <th>Metacharacter</th> <th>Meaning</th> </tr></thead> <tbody> <tr> <td>()</td><td>Capture group</td></tr><tr> <td>|</td><td>Logical OR, usually used within a capture group</td></tr><tr> <td>(?&lt;Name&gt;)</td><td>Named capture group</td></tr><tr> <td>.</td><td>Matches any character, including a space</td></tr><tr> <td>*</td><td> Star. Matches the preceding item, items, or nothing (doesn't fail) </td></tr><tr> <td>?</td><td>Optional. Optionally matches the preceding item (one)</td></tr><tr> <td>?:</td><td> Don't count capture group. Capture group is not included in `matches` </td></tr><tr> <td>+</td><td>Matches one or more items (fails if no match)</td></tr><tr> <td>{min, max}</td><td> Allows for a minimum or maximum number of items. Max is optional for specific number. </td></tr><tr> <td>\</td><td> Escape character for escaping metacharacters. \$ makes $ a literal character rather than a metacharacter. </td></tr><tr> <td>\s*</td><td> Matches any number of literal whitespace characters. Space, tab, new line, carriage return </td></tr><tr> <td>\S*</td><td>Matches anything that is not whitespace</td></tr><tr> <td>\d</td><td>Matches a single digit</td></tr><tr> <td>(?=)</td><td>Positive Lookahead</td></tr><tr> <td>(?&lt;=)</td><td>Positive Lookbehind</td></tr></tbody> </table>

There are more metacharacters, but the above are probably all you need to know for 95% of scenarios.

## Further examples of JavaScript regexes

To hopefully get the regex memories flooding back, here is a walkthrough of some simpler regexes followed by some with more complexity. I explain some of the decisions made and the thought processes involved at the time of writing.

### Loosely match a British mobile phone number

Criteria;

- The number must start with `0` or `+44`.
- The second part of the number must be `7`.
- The `7` must be proceeded with `9` numbers from `0-9`.

Resulting expression; `(?:0|\+44)7\d{9}`

Explanation;

- Define a capture group using parenthesis `( )` so we can use the logical OR operator `|` to allow either `0` or `+44`. A forward slash is required before the `+`, because we mean the literal character `+` and not the regex metacharacter. Also include `?:` because we do not want this capture group to be included in the matches when we execute the regex later.
- Match the literal number `7`
- Use `\d` metacharacter as a shortcut for `[0-9]` range.
- Only match when exactly `9` of the preceding expression (`\d`) are found. `{9}` I guess is an abbreviation for `{9,9}`, meaning a minimum of `9` and a maximum of `9` in length.

### Find a URL(s)

Criteria;

- HTTP is required, SSL is optional.
- Two forward slashes are required.
- `www.` is optional.
- Domain name can only contain characters A-Z, and there must be at least one character.
- Domain must end with `.co.uk` or `.com`

Resulting expression; `https?:\/\/(?:www\.)?(?:[a-z]+)\.co(?:m|\.uk)`

Explanation;

- Literally match `http`.
- `s` (SSL) is marked as optional using `?`, which marks the preceding character as optional.
- Literally match `//`. Note the forward slashes are escaped using a backwards slash `\\` to clearly denote that these are not metacharacters.
- Exactly match `www.` (again, use a backward slash `\\` to escape the period `.`). Wrap the statement in parenthesis `( )` so that we can use the optional metacharacter `?` to mark the whole group as optional. We have also used `?:` to exclude the capture group from the resulting matches.
- Next, allow lowercase alphabet characters within the range of `a-z`. The `+` denotes that at least 1 (or more) is required. Again, we have used `?:` to exclude the capture group from the resulting matches.
- Exactly match `.co` (again, the period (`.`) is escaped).
- Finally, exactly match `m` or `.uk` to allow for the domain to be either `.co.uk` or `.com`. Again note the use of `?:` to exclude the capture group from the resulting matches.

### Insert thousand separators

Criteria;

- All numbers must be formatted to make them more readable. Insert the thousand separator starting 3 digits from the right, every 3 digits, all the way to the left.

Resulting expression; `(?<=\d)(?=(?:\d\d\d)+\b)`

Explanation;

- Use a positive lookbehind (`?<=`) for the previous digit (`\d`).
- Use a positive lookahead (`?=`) to find the proceeding expression.
- Match exactly 3 digits (`0-9`) as denoted by `\d\d\d`. The `+` denotes that there must be at least 1 match. Exclude the group from the result.
- Keep on matching until we hit a word-break, (`\b`)

The result is best visualised with a screenshot from [Regex101.com](https://regex101.com/r/mDqNhE/1/).

![Matching Numbers](/assets/matching-numbers.png)

Note how the site highlights the position of each match, as an empty character. Replacing the empty character with one or more characters (i.e. a comma `,`) using `string.replace` is how you do an insert.

## Summary

You're welcome.
