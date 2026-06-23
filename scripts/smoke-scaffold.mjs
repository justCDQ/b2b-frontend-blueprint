import { rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const targets = [
  {
    name: "blueprint-scaffold-with-demo",
    args: ["--template", "vanilla", "--with-demo"]
  },
  {
    name: "blueprint-scaffold-without-demo",
    args: ["--template", "vanilla", "--without-demo"]
  }
];

for (const target of targets) {
  const targetRoot = join(tmpdir(), target.name);
  rmSync(targetRoot, { force: true, recursive: true });

  run(process.execPath, ["scripts/create-blueprint.mjs", targetRoot, "--force", ...target.args]);
  run("pnpm", ["build"], targetRoot);
}

console.log("Scaffold smoke tests passed.");

function run(command, args, cwd = process.cwd()) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: "pipe"
  });

  if (result.status !== 0) {
    process.stdout.write(result.stdout);
    process.stderr.write(result.stderr);
    process.exit(result.status || 1);
  }
}
