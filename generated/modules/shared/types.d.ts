export interface FileInfo {
    content: string;
    path: string;
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
    bundler: BundlerOptions;
    cleaner: CleanerOptions;
    commonEsbuildOptions: import('esbuild').BuildOptions;
    ignoreList: string[];
    keepList: string[];
    thirdPartyModules: string[];
    version: string;
}
export interface ExternalBuildOptions {
    directories: string[];
    outDirectory: string;
    rootDirectory: string;
}
export type BuildOptions = Partial<InternalBuildOptions> & ExternalBuildOptions;
export type FullBuildOptions = Required<BuildOptions>;
//# sourceMappingURL=types.d.ts.map