function camelCase(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/-(\w)/g, (m, n) => n.toUpperCase());
}

const req = require.context('../components', true, /^\.\/[^_][\w-]+\/demo\/[\w-]+\.tsx?$/);

let demoComponents = {};
req.keys().forEach(mod => {
  let v = req(mod);
  if (v && v.default) {
    v = v.default;
  }
  const match = mod.match(/^\.\/([^_][\w-]+)\/demo\/([^_][\w-]+)\.tsx?$/);
  if (match && match[1] && match[2]) {
    demoComponents[camelCase(match[1]) + camelCase(match[2])] = v;
  }
});
export default demoComponents;
