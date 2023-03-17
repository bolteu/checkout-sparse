import * as core from "@actions/core";
import * as github from "@actions/github";
import { Git } from "./git";

function isSHA(input?: string) {
  if (!input) {
    return false;
  }

  // Git SHA-1s are 40-character hexadecimal strings
  if (input.length !== 40) {
    return false;
  }

  if (!/^[0-9a-fA-F]+$/.test(input)) {
    return false;
  }

  return true;
}

async function parseRef(git: Git, ref: string): Promise<string> {
  // sha
  if (isSHA(ref)) {
    throw new Error(
      `A git SHA ${ref} is not supported. Please provide a branch or a tag.`
    );
  }

  // refs/heads/
  if (ref.startsWith("refs/heads/")) {
    const branch = ref.substring("refs/heads/".length);
    return branch;
  }

  // refs/tags/
  else if (ref.startsWith("refs/tags/")) {
    const tag = ref.substring("refs/tags/".length);
    return tag;
  }

  // refs/pull
  else if (ref.startsWith("refs/pull/")) {
    throw new Error(
      `A reference to a pull request ${ref} is not supported. Please provide a branch or a tag.`
    );
  }

  // Unqualified ref, check for a matching branch or tag
  else {
    if (await git.branchExists(ref)) {
      return ref;
    } else if (await git.tagExists(ref)) {
      return `refs/tags/${ref}`;
    } else {
      throw new Error(
        `A branch or tag with the name '${ref}' could not be found.`
      );
    }
  }
}

async function run() {
  try {
    let files = core.getInput("files", { required: true });
    let ref = core.getInput("ref", { required: true });
    let token = core.getInput("github-token") || process.env.GITHUB_TOKEN;
    let repository = `https://${process.env.GITHUB_ACTOR}:${token}@github.com/${process.env.GITHUB_REPOSITORY}.git`;
    let octokit = github.getOctokit(token);

    let git = new Git(repository, octokit);

    const branch_or_tag = await parseRef(git, ref);

    await git.checkoutSparse(branch_or_tag, files);
  } catch (error) {
    core.setFailed(error);
    console.error(error);
  }
}

run();
