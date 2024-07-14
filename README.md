# Build

## Usage

To install the package, run the following command in your terminal:

```bash
npm install --dev github:anvil-solutions/build
```

To use the package in your project, you can follow the example below:

```javascript
import { build } from 'build';

const ROOT_DIRECTORY = 'public';

await build({
  directories: [ROOT_DIRECTORY],
  ignoreList: [
    '.d.ts',
    '.git',
    '.test.js'
  ],
  outDirectory: 'out',
  rootDirectory: ROOT_DIRECTORY
});
```

## Development

Run `npm install` in the project's root directory to install all required
dependencies. Additionally, make sure you have npm (Node Package Manager) and
Node.js installed on your system before running this command.

## Linting

To maintain code quality and adhere to coding standards, you can use linting
tools in your project's root directory. Follow the instructions below for each
language.

```bash
npm run lint
```

### JavaScript Linting

Run the following commands in your project's root directory to utilize ESLint
and TypeScript:

```bash
npm run eslint
npm run tsc
```

## Testing

To ensure your code is functioning correctly and to catch any potential issues
early, you can use the following command to run tests using Vitest:

```bash
npm run test
```
