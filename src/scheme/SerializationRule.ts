import {EntityBase} from "../types";

export type SerializationRule<T extends EntityBase = EntityBase> = {
    match: (entity: T) => boolean;
    serialize: (entity: T) => {
        entityId?: string;
        filename: string;
        content?: string;
        fileType: string;
    }[];
};