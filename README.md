# CAITS example

The small app that `caits init --example` writes: a home page, a menu, and a page where the user adds, edits and removes messages. It shows how to write each layer and each kind of test of a [CAITS](https://github.com/IngeniozIT/caits) project.

```sh
npx github:IngeniozIT/caits#v0.4.0 init my-app --example
```

The [documentation of CAITS](https://caits.dev/docs/example) tells the app layer by layer.

## What `init` takes from this repository

- The files of `src/` and `test/`: `init` writes them in the project, in place of the first page.
- The `dependencies` and the `devDependencies` of `package.json`: `init` adds them to the project, with those of CAITS.

The other files stay here. This repository is not a project: it has no tools of its own. To check the example, make a project with it (`npm run test:template` in CAITS).

## The versions

Each version of CAITS writes the example of the same tag here: CAITS `v0.4.0` writes the example of `v0.4.0`. When you tag a version of CAITS, tag the same version here.

## License

[0BSD](LICENSE): use, copy, change and share this code for any purpose, without asking, and without keeping this notice.
