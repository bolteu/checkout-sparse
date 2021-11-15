import * as core from "@actions/core"
import * as exec from "@actions/exec"

async function run() {
    try {
        let files = core.getInput("files", { required: true })
        let ref = core.getInput("ref", { required: true })
        let token = core.getInput("github-token") || process.env.GITHUB_TOKEN
        let repository = `https://${process.env.GITHUB_ACTOR}:${token}@github.com/${process.env.GITHUB_REPOSITORY}.git`

        await exec.exec(`git clone --filter=blob:none --no-checkout --depth 1 --sparse ${repository} . --branch ${ref}`)
        await exec.exec(`git sparse-checkout init --cone`)
        await exec.exec(`git sparse-checkout add ${files}`)
        await exec.exec(`git checkout`)
    } catch (error) {
        core.setFailed(error)
    }
}

run()
