# fiddle.scot

Research on historic and contemporary Scottish fiddling. Built with Jekyll and the
[Hitchens](https://github.com/patdryburgh/hitchens) theme.

## Running locally

```
mise install          # Ruby version from mise.toml
bundle install
bundle exec jekyll serve
```

## Theme overrides

- `_layouts/default.html`: adds GoatCounter analytics
- `_layouts/post.html`: shows the `image:` front matter and the comments section
- `_includes/comments.html`, `assets/js/comments.js`: comments via a Google Form; approved rows (ticked in the sheet) are published as CSV and rendered client-side
- `_includes/post-excerpt.html`: uses `description:` front matter in the table of contents
- `_sass/_variables.scss`, `_sass/_fiddle.scss`: paper colours, laid-paper texture, homepage and contact form
- `_layouts/home.html`: drops the masthead subheading; puts the contents on a `.sheet`
- `pages/index.html`: homepage; the paginated table of contents is `blog/index.html` (jekyll-paginate needs it at that path)

## Pages

Standalone pages live in `pages/`. Each needs a `permalink:` in its front matter (e.g. `permalink: /about/`),
otherwise Jekyll publishes it under `/pages/…`. To add one to the navigation, add it to `_data/menu.yml`.
