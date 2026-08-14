/**
 * Token-meter whale plugin, node half.
 *
 * Pure UI plugin: the empty `apply` exists so the plugin appears in the host
 * Loader as an enabled entry; the browser half ships via `exports["./client"]`
 * and is discovered through the package.json `dsh.client` declaration.
 */
export function apply() {}
