import * as exec from "@actions/exec";
import * as github from "@actions/github";

export class Git {
  repository: string;
  octokit: ReturnType<typeof github.getOctokit>;

  constructor(
    repository: string,
    octokit: ReturnType<typeof github.getOctokit>
  ) {
    this.repository = repository;
    this.octokit = octokit;
  }

  async branchExists(pattern: string): Promise<boolean> {
    try {
      const response = await this.octokit.rest.git.listMatchingRefs({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        ref: `heads/${pattern}`,
      });

      console.log(
        `Found ${JSON.stringify(
          response.data,
          null,
          2
        )} refs matching pattern ${pattern}...`
      );

      return !!response.data.length;
    } catch (error) {
      return false;
    }
  }

  async tagExists(pattern: string): Promise<boolean> {
    try {
      const response = await this.octokit.rest.git.listMatchingRefs({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        ref: `tags/${pattern}`,
      });

      return !!response.data.length;
    } catch (error) {
      return false;
    }
  }

  async checkoutSparse(ref: string, files: string): Promise<void> {
    await exec.exec(
      `git clone --filter=blob:none --no-checkout --depth 1 --sparse ${this.repository} . --branch ${ref}`
    );
    await exec.exec(`git sparse-checkout init --cone`);
    await exec.exec(`git sparse-checkout add ${files}`);
    await exec.exec(`git checkout`);
  }
}
