interface FileInfo {
  content: string;
  path: string;
}

interface BuilderOptions {
  minifiableExtensions: string[];
}

interface BundlerOptions {
  entryDocumentExtensions: string[];
  external: string[];
}

interface CleanerOptions {
  deletableExtensions: string[];
  searchableExtensions: string[];
}

interface InternalBuildOptions {
  builder: BuilderOptions;
  bundler: BundlerOptions;
  cleaner: CleanerOptions;
  commonEsbuildOptions: import('esbuild').BuildOptions;
  thirdPartyModules: string[];
}

interface ExternalBuildOptions {
  directories: string[];
  ignoreList: string[];
  outDirectory: string;
  rootDirectory: string;
}

type BuildOptions = Partial<InternalBuildOptions> & ExternalBuildOptions;

type FullBuildOptions = Required<BuildOptions>;
