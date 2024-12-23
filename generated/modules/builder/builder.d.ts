export class Builder {
    constructor(options: FullBuildOptions);
    emptyOutDirectory(): Promise<void>;
    getDirectoriesAndFiles(): Promise<[string[], string[]]>;
    createDirectoryStructure(directories: string[]): Promise<void>;
    copyFiles(files: string[]): Promise<void>;
    #private;
}
import type { FullBuildOptions } from '../shared/types';
//# sourceMappingURL=builder.d.ts.map