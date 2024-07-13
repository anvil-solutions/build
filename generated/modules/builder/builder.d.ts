export class Builder {
    constructor(options: FullBuildOptions);
    emptyOutDirectory(): Promise<void>;
    getFoldersAndFiles(): Promise<[string[], string[]]>;
    createFolderStructure(folders: string[]): Promise<void>;
    copyFiles(files: string[]): Promise<void>;
    #private;
}
import type { FullBuildOptions } from '../shared/types';
//# sourceMappingURL=builder.d.ts.map