# CAITS example

The small app that `caits init --example` writes: a home page, a menu, and a page where the user adds, edits and removes messages. It shows how to write each layer and each kind of test of a [CAITS](https://github.com/IngeniozIT/caits) project.

```sh
npx caits init my-app --example
```

The [documentation of CAITS](https://caits.dev/docs/example) describes the app layer by layer.

## What `init` takes from this repository

- The files of `src/` and `test/`: `init` writes them in the project, in place of the first page.
- The `dependencies` and the `devDependencies` of `package.json`: `init` adds them to the project, with those of CAITS.

The other files stay here. This repository is not a project: it has no tools of its own. To check the example, run `npm run test:template` in CAITS: it makes a project with the example, and runs all its checks. It reads the example in the folder `../caits-example`, next to CAITS: clone this repository there.

## The versions

`init --example` gets the example from this repository, at the tag of its own version: CAITS `0.5.0` writes the files of the tag `v0.5.0` of this repository. When you tag a version of CAITS, tag the same version here.

## License

[0BSD](LICENSE): use, copy, change and share this code for any purpose, without asking, and without keeping this notice.
