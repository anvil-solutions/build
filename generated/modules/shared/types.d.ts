export interface FileInfo {
    content: string;
    path: string;
}
export interface BuilderOptions {
    minifiableExtensions: string[];
}
export interface BundlerOptions {
    entryDocumentExtensions: string[];
    external: string[];
}
export interface CleanerOptions {
    deletableExtensions: string[];
    searchableExtensions: string[];
}
export interface InternalBuildOptions {
    builder: BuilderOptions;
    bundler: BundlerOptions;
    cleaner: CleanerOptions;
    commonEsbuildOptions: import('esbuild').BuildOptions;
    thirdPartyModules: string[];
}
export interface ExternalBuildOptions {
    directories: string[];
    ignoreList: string[];
    outDirectory: string;
    rootDirectory: string;
}
export type BuildOptions = Partial<InternalBuildOptions> & ExternalBuildOptions;
export type FullBuildOptions = Required<BuildOptions>;
//# sourceMappingURL=types.d.ts.map