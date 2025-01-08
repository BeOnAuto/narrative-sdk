import { Asset, Category, Construct, Scheme, Script } from "./Scheme.types";

interface SchemeBuilderStart {
    addCategory(name: string): SchemeBuilderCategory;
}

interface SchemeBuilderCategory {
    addAsset(asset: Asset): SchemeBuilderCategory;
    addConstruct(construct: Construct): SchemeBuilderCategory;
    addScript(script: Script): SchemeBuilderCategory;
    addCategory(name: string): SchemeBuilderCategory;
    build(): Scheme;
}

export class SchemeBuilder implements SchemeBuilderStart, SchemeBuilderCategory {
    private readonly scheme: Scheme;
    private currentCategory?: Category;

    private constructor(name: string) {
        this.scheme = { name, categories: [] };
    }

    /**
     * Factory method to create a new SchemeBuilder.
     * Ensures the builder starts in the correct stage.
     */
    static create(name: string): SchemeBuilderStart {
        return new SchemeBuilder(name);
    }

    /**
     * Adds a category to the scheme
     * @param name - The name of the category to add.
     */
    addCategory(name: string): SchemeBuilderCategory {
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
     * @param asset - The asset to add.
     */
    addAsset(asset: Asset): SchemeBuilderCategory {
        this.ensureCategoryExists();
        this.currentCategory!.assets.push(asset);
        return this;
    }

    /**
     * Adds a construct to the current category.
     * @param construct - The construct to add.
     */
    addConstruct(construct: Construct): SchemeBuilderCategory {
        this.ensureCategoryExists();
        this.currentCategory!.constructs.push(construct);
        return this;
    }

    /**
     * Adds a script to the current category.
     * @param script - The script to add.
     */
    addScript(script: Script): SchemeBuilderCategory {
        this.ensureCategoryExists();
        this.currentCategory!.scripts.push(script);
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
     * Ensures a category exists before adding elements to it.
     */
    private ensureCategoryExists(): void {
        if (!this.currentCategory) {
            throw new Error("Cannot add elements without a category. Call addCategory() first.");
        }
    }

    /**
     * Finalizes any pending category and builds the scheme.
     */
    build(): Scheme {
        if (this.currentCategory) {
            this.finalizeCategory();
        }
        return this.scheme;
    }
}