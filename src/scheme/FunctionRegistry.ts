
import { FileTransformRule, FileTransformFn, FileMergeFn } from './Scheme.types';

export type RegisteredFunction =
    | ((input: string, currentValue?: string, context?: any) => string)
    | ((source: string, target: string, context?: any) => { source: string; target: string });

const functionMap = new Map<string, RegisteredFunction>();

export function registerFunction(id: string, fn: RegisteredFunction) {
    functionMap.set(id, fn);
}

export function getFunctionById(id: string): RegisteredFunction | undefined {
    return functionMap.get(id);
}

export function resolveTransformRuleFunctions(rules: FileTransformRule[]): FileTransformRule[] {
    return rules.map((rule) => {
        const resolved = { ...rule };

        if (typeof resolved.transformToTarget === 'string') {
            const fn = getFunctionById(resolved.transformToTarget);
            if (fn) resolved.transformToTarget = fn as FileTransformFn;
        }

        if (typeof resolved.transformToSource === 'string') {
            const fn = getFunctionById(resolved.transformToSource);
            if (fn) resolved.transformToSource = fn as FileTransformFn;
        }

        if (typeof resolved.merge === 'string') {
            const fn = getFunctionById(resolved.merge);
            if (fn) resolved.merge = fn as FileMergeFn;
        }
        return resolved;
    });
}
