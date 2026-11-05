# Contributing to The Mustang Method

Welcome! This project uses a review-before-publish workflow. Contributors should edit content files, not the site's HTML, CSS, or JavaScript unless they are specifically assigned development work.

## Add a senior interview

1. Interview a graduating student and explain where their answers may appear.
2. Obtain explicit permission to publish their name, major, graduation year, and quotations. If they prefer not to be named, use an approved anonymous label.
3. Open `content/interviews.json`.
4. Add a new object using the fields below. Give it a unique ID.
5. Keep `published` set to `false` and `permissionConfirmed` set to `false` until an editor has reviewed the submission and verified permission.
6. Create a pull request describing the interview and submit it for editorial review.

Example:
```json
{
  "id": "unique-interview-id",
  "name": "Name approved for publication",
  "major": "Student's major",
  "college": "Student's college",
  "graduationYear": "2027",
  "advice": "A concise summary of the student's advice.",
  "favoriteStrategy": "Weekly planning",
  "quote": "An exact quote approved by the student.",
  "published": false,
  "permissionConfirmed": false
}
```

An editor should verify the quote, spelling, accuracy, and permission before setting both flags to `true`. Never publish private contact information or sensitive personal details.

## Add or update other content

- Strategies: `content/strategies.json`
- College advice: `content/colleges.json`
- The Good Life activities: `content/good-life.json`

Use clear, concise language. Avoid presenting general suggestions as official university policy. Check that JSON syntax is valid (double quotes, commas between entries, no trailing comma).

## Review and publication

- Contributors create a branch and submit a pull request.
- An editor reviews content and requests changes if needed.
- A designated site administrator merges approved pull requests into `main`.
- GitHub Pages publishes the updated site from `main`.

Do not merge your own submission unless you have been given publishing authority.
