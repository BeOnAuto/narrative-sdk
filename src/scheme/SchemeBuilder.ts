import {Asset, Category, Construct, Scheme, Script} from "./Scheme.types";

export class SchemeBuilder {
    private scheme: Scheme;

    private currentCategory?: Category;

    constructor(name: string) {
        this.scheme = { name, categories: [] };
    }

    /**
     * Adds a category to the scheme. Finalizes any previous category.
     */
    addCategory(name: string): this {
        if (this.currentCategory) {
            this.finalizeCategory();
        }

        this.currentCategory = {
            name,
            assets: [],
            constructs: [],
            scripts: [],
        };
        return this;
    }

    /**
     * Adds an asset to the current category.
     */
    addAsset(asset: Asset): this {
        if (!this.currentCategory) {
            throw new Error("Cannot add an asset without a category. Call addCategory() first.");
        }
        this.currentCategory.assets.push(asset);
        return this;
    }

    /**
     * Adds a construct to the current category.
     */
    addConstruct(construct: Construct): this {
        if (!this.currentCategory) {
            throw new Error("Cannot add a construct without a category. Call addCategory() first.");
        }
        this.currentCategory.constructs.push(construct);
        return this;
    }

    /**
     * Adds a script to the current category.
     */
    addScript(script: Script): this {
        if (!this.currentCategory) {
            throw new Error("Cannot add a script without a category. Call addCategory() first.");
        }
        this.currentCategory.scripts.push(script);
        return this;
    }

    /**
     * Finalizes and adds the current category to the scheme.
     */
    private finalizeCategory(): void {
        if (this.currentCategory) {
            this.scheme.categories.push(this.currentCategory);
            this.currentCategory = undefined;
        }
    }

    /**
     * Builds the scheme, finalizing any pending category.
     */
    build(): Scheme {
        if (this.currentCategory) {
            this.finalizeCategory();
        }
        return this.scheme;
    }
}