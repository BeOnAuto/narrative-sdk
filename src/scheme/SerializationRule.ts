import {EntityBase} from "../types";

export type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

export type SerializedModelFile = {
    fileName: string;
    content?: JSONValue | string;
    fileType: string;
    entityType?: string;
    entityId?: string
    inboundTransitions?: string[];
    outboundTransitions?: string[];
}

export type SerializationRule<T extends EntityBase = EntityBase> = {
    match: (entity: T) => boolean;
    serialize: (entity: T) => SerializedModelFile[];
};