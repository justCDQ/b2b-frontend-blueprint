import { existsSync, readFileSync, rmSync } from "node:fs";
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
  assertGeneratedFiles(targetRoot, target.args.includes("--with-demo"));
  run("pnpm", ["build"], targetRoot);
}

const dryRunTarget = join(tmpdir(), "blueprint-scaffold-dry-run");
rmSync(dryRunTarget, { force: true, recursive: true });
run(process.execPath, [
  "scripts/create-blueprint.mjs",
  dryRunTarget,
  "--template",
  "vanilla",
  "--without-demo",
  "--dry-run"
]);

if (existsSync(dryRunTarget)) {
  throw new Error("Dry run should not create the target directory.");
}

run(process.execPath, [
  "scripts/create-blueprint.mjs",
  join(tmpdir(), "blueprint-scaffold-with-demo"),
  "--dry-run"
]);

runExpectFailure(process.execPath, [
  "scripts/create-blueprint.mjs",
  join(tmpdir(), "blueprint-invalid-demo-flags"),
  "--with-demo",
  "--without-demo",
  "--force"
]);

runExpectFailure(process.execPath, [
  "scripts/create-blueprint.mjs",
  join(tmpdir(), "blueprint-invalid-template"),
  "--template",
  "react",
  "--force"
]);

runExpectFailure(process.execPath, [
  "scripts/create-blueprint.mjs",
  "--target",
  "--template",
  "vanilla"
]);

runExpectFailure(process.execPath, [
  "scripts/create-blueprint.mjs",
  join(tmpdir(), "blueprint-scaffold-with-demo"),
  "--template",
  "--force"
]);

runExpectFailure(process.execPath, [
  "scripts/create-blueprint.mjs",
  join(tmpdir(), "blueprint-scaffold-with-demo")
]);

console.log("Scaffold smoke tests passed.");

function assertGeneratedFiles(targetRoot, withDemo) {
  const config = readFileSync(join(targetRoot, "blueprint.config.js"), "utf8");
  const readme = readFileSync(join(targetRoot, "README.md"), "utf8");
  const main = readFileSync(join(targetRoot, "apps/web/src/main.js"), "utf8");

  if (!config.includes(`template: "vanilla"`)) {
    throw new Error("Generated config is missing template metadata.");
  }

  if (!config.includes(`defaultLocale: "zh"`) || !config.includes(`defaultTheme: "system"`)) {
    throw new Error("Generated config is missing runtime defaults.");
  }

  if (!config.includes("enabledModules")) {
    throw new Error("Generated config is missing module metadata.");
  }

  if (!main.includes("blueprint.config.js")) {
    throw new Error("Generated app does not read blueprint.config.js.");
  }

  if (withDemo && !readme.includes("Included Demo Modules")) {
    throw new Error("Generated with-demo README is missing demo module section.");
  }

  if (!withDemo && !readme.includes("generated without demo modules")) {
    throw new Error("Generated without-demo README is missing app shell guidance.");
  }
}

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

function runExpectFailure(command, args, cwd = process.cwd()) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: "pipe"
  });

  if (result.status === 0) {
    process.stderr.write(`Expected command to fail: ${command} ${args.join(" ")}\n`);
    process.exit(1);
  }
}
