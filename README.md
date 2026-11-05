# The Mustang Method — Team Website Starter

A static website starter for a student-run Cal Poly time-management resource.

## What's included
- Responsive green-and-gold website
- Four main content sections: Choosing a Strategy, Suggested Strategies, Colleges, and The Good Life
- Content separated into JSON files for easier team editing
- Senior interviews hidden until both editorial approval flags are set
- Contributor guidance and a review-before-publish workflow

## Preview locally
Because the site loads JSON using `fetch`, run a local web server rather than opening `index.html` directly.

With Python installed:
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000`.

## Publish with GitHub Pages
1. Create a GitHub repository named `mustang-method`.
2. Upload the contents of this folder to the repository root.
3. In repository Settings → Pages, choose deploy from a branch, select `main` and `/ (root)`, then save.
4. Invite team members under repository Settings → Collaborators. Give write access only to people who should contribute.
5. Protect the `main` branch and require pull requests before merging. Assign at least one editor/administrator to review submissions.
6. Share the published GitHub Pages URL with students.

## Important team permissions note
GitHub Pages itself does not provide a content-editing dashboard. Team members edit the JSON files through GitHub and submit pull requests. Only trusted editors should be allowed to merge changes to the publishing branch. For larger teams or nontechnical editors, consider adding a CMS later.

## Before publishing interviews
Get explicit written permission for names and quotations. Verify details with the interviewee. Keep `published` and `permissionConfirmed` false until an editor has approved the submission. The included interview is sample content and is not a real testimonial.
