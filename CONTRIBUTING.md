# Contributing

## Your first contribution

### Setting up the repository

1. Fork this repository
2. Create a new feature branch

```bash
git checkout -b my-feature-branch
```

### Setting up a development environment

1. Ensure that you have `Node.js` installed on your machine (you can use [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm) to easily manage versions)
2. Install the dependencies with [pnpm](https://pnpm.io/installation) :warning: yarn or npm aren't supported :warning:

- You can check the `packageManager` field of [`package.json`](https://github.com/jsonnext/codemirror-json-schema/blob/main/package.json#L26) to know what version of pnpm to install

```bash
pnpm install
```

3. Run tests to ensure your project is in a good state

```bash
pnpm test
```

### Making your changes

1. Make whatever code changes you need
2. Add or update tests coverage whenever possible

### Verifying

1. Run the tests `pnpm run test`
2. View the changes in the demo site locally `pnpm run dev`
3. Ensure that the project builds properly `pnpm run tsc`

### Opening a pull request

1. Once your branch is ready, and it contains bugfixes, documentation improvements or features, run `pnpm changeset add` to add a [changeset](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md) file
   - There you can compose the markdown entry describing your changes that will be published in CHANGELOG.md
2. Format your code with prettier: `pnpm run prettier:write`
3. Push your changes to your feature branch
4. Open a pull request from your fork to the original repository in the Github UI or [CLI](https://cli.github.com/manual/gh_pr_create)
