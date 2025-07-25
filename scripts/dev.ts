import { spawn } from "child_process";

const processes = new Set<ReturnType<typeof spawn>>();

function run(label: string, path: string) {
  const proc = spawn("pnpm", ["run", "dev"], {
    cwd: path,
    stdio: "inherit",
    shell: true,
    env: process.env,
  });
  processes.add(proc);
  proc.on("close", () => processes.delete(proc));
}

run("backend", "backend");
run("kyanchir", "apps/kyanchir");

process.on("SIGINT", () => {
  console.log("\n🛑 Платформа NABLUДATEL остановлена вручную.");
  processes.forEach((p) => p.kill("SIGINT"));
  process.exit(0);
});
