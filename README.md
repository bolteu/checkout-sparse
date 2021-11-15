# checkout-sparse action

This action is a wrapper for `git sparse-checkout` command

## Inputs

## `ref`

**Required** The git ref. Could be either SHA, branch name or git tag. Default `"dev"`.

## `files`

**Required** The list of files/directories to checkout separated by `space`. Default `""`.

## `github-token`

The GitHub personal access token. Default is `secrets.GITHUB_TOKEN`.

## Example usage

```yml
uses: bolteu/checkout-sparse@main
with:
  ref: "dev"
  files: "dir-A/ dir-B/ file-A file-B"
  github-token: $GITHUB_TOKEN
```
