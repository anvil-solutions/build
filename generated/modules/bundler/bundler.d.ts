export class Bundler {
    constructor(options: FullBuildOptions);
    getEntryPoints(files: string[]): Promise<string[]>;
    bundle(entryPoints: string[]): Promise<void>;
    #private;
}
import type { FullBuildOptions } from '../shared/types';
//# sourceMappingURL=bundler.d.ts.map