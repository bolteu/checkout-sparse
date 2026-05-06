# checkout-sparse action

> [!WARNING]
> This action is deprecated.
>
> Please migrate to the official `actions/checkout` action, which supports sparse checkout natively.
>
> ```yml
> - uses: actions/checkout@v6
>   with:
>     ref: dev
>     sparse-checkout: |
>       dir-A/
>       dir-B/
>       file-A
>       file-B
>     sparse-checkout-cone-mode: true
> ```

This action is a compatibility wrapper for `actions/checkout` sparse checkout support.

It keeps the existing `checkout-sparse` inputs for migration purposes while delegating checkout behavior to the official `actions/checkout` action.

## Inputs

## `ref`

**Required** The git ref. Could be either branch name or git tag. Default `"dev"`.

Examples of supported `ref`s:

- `dev`
- `refs/heads/dev`

- `v1.2.3`
- `refs/tags/v1.2.3`

## `files`

**Required** The list of files/directories to checkout separated by `space`. Default `""`.

## `github-token`

The GitHub personal access token. Default is `secrets.GITHUB_TOKEN`.

## Example usage

```yml
uses: bolteu/checkout-sparse@main
with:
  ref: dev
  files: dir-A/ dir-B/ file-A file-B
  github-token: $GITHUB_TOKEN
```
