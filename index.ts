import { Octokit } from "@octokit/rest";
const octokit = new Octokit({ auth: process.env.TOKEN });

const INTERVAL = 60 * 1000;
const APPROVE_MESSAGES = [
  `LGTM :rocket:`,
  `:ship: it`,
  `:shipit:`,
  `Wow this code is beautiful. There's no way it has a bug.`,
  `Didn't read the code but I'm sure it's perfect.`,
  `You don't need to add tests! We'll find the bugs in production.`,
  `This is the best goddamn code I've ever seen. Ship it!`,
  `LGTM. But what do I know? I'm just a robot. Beep Boop.`,
  `Love this! You're really good at programming.`,
  `Wow... You really are a 10x engineer!`,
  `Ship it.`,
  `:100:`,
  `:fire:`,
];

async function approveCheck() {
  console.log("Checking PRs for approve label");

  const { data } = await octokit.issues.list({
    filter: "all",
    state: "open",
    labels: "approve",
  });

  for (const issue of data) {
    const { number: pull_number, repository, title } = issue;

    const repo = repository.name;
    const owner = repository.owner.login;

    const { data: pull } = await octokit.pulls.get({
      owner,
      repo,
      pull_number,
    });

    const { data: reviews } = await octokit.pulls.listReviews({
      owner,
      repo,
      pull_number,
    });

    const { data: statuses } = await octokit.repos.listCommitStatusesForRef({
      owner,
      repo,
      ref: pull.head.ref,
    });

    const hasNotPassedCI =
      statuses.length &&
      (statuses[0].state === "failure" || statuses[0].state === "error");
    if (hasNotPassedCI) {
      console.log(
        `https://github.com/replit/${repo}/pull/${pull_number} has not passed CI. Not approving.`
      );

      await octokit.issues.createComment({
        owner,
        repo,
        issue_number: pull_number,
        body: `Make sure CI passes first :rage:. Not approving.`,
      });

      await octokit.issues.removeLabel({
        owner,
        repo,
        issue_number: pull_number,
        name: "approve",
      });
      continue;
    }

    const approved = reviews.some((r) => r.state === "APPROVED");
    const changesRequested = reviews.some(
      (r) => r.state === "CHANGES_REQUESTED"
    );

    if (approved) {
      console.log(
        `https://github.com/replit/${repo}/pull/${pull_number} is already approved. Not approving.`
      );

      await octokit.issues.createComment({
        owner,
        repo,
        issue_number: pull_number,
        body: "Your PR is already approved... ship it!",
      });

      await octokit.issues.removeLabel({
        owner,
        repo,
        issue_number: pull_number,
        name: "approve",
      });
      continue;
    }

    if (changesRequested) {
      console.log(
        `https://github.com/replit/${repo}/pull/${pull_number} requires changes. Not approving.`
      );

      await octokit.issues.createComment({
        owner,
        repo,
        issue_number: pull_number,
        body: "Nice try... respond to feedback first.",
      });

      await octokit.issues.removeLabel({
        owner,
        repo,
        issue_number: pull_number,
        name: "approve",
      });
      continue;
    }

    // SHIP IT
    console.log(
      `Approving https://github.com/replit/${repo}/pull/${pull_number} - ${title}`
    );

    const message =
      APPROVE_MESSAGES[Math.floor(Math.random() * APPROVE_MESSAGES.length)];
    await octokit.pulls.createReview({
      owner,
      repo,
      pull_number,
      body: message,
      event: "APPROVE",
    });

    await octokit.issues.removeLabel({
      owner,
      repo,
      issue_number: pull_number,
      name: "approve",
    });
  }

  console.log("Finished checking PRs to approve! ", new Date());
}

approveCheck();
setInterval(approveCheck, INTERVAL);
