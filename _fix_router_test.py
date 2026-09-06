import io

path = "/tmp/gbrw/tests/router-settings.test.mjs"
with io.open(path, "r", encoding="utf-8") as f:
    src = f.read()

old = (
    'assert.deepEqual(router.ROUTER_PROVIDERS.map(({ id }) => id), ["cursor", "claude-code", "codex", "openrouter"]);\n'
)
new = (
    'assert.deepEqual(router.ROUTER_PROVIDERS.map(({ id }) => id), ["cursor", "claude-code", "codex", "openrouter", "cli-proxy"]);\n'
)
assert old in src, "router-settings anchor not found"
src = src.replace(old, new, 1)
with io.open(path, "w", encoding="utf-8") as f:
    f.write(src)
print("OK: router-settings.test.mjs updated")