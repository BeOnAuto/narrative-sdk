import {EntityBase} from "../types";
import {FileDefinition} from "./Scheme.types";

export type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

export type SerializedModelFile = {
    fileName: string;
    fileType: string;
    content?: JSONValue | string;
    contentFromFile?: FileDefinition;
    entityId?: string;
    entityType?: string;
    inboundTransitions?: string[];
    outboundTransitions?: string[];
};


export type SerializationRule<T extends EntityBase = EntityBase> = {
    match: (entity: T) => boolean;
    serialize: (entity: T) => SerializedModelFile[];
};