class i18n {
    constructor(scopes = {}, language = 'en') {
        this.scopes = scopes;
        this.language = language;
    }

    import(key, scopes) {
        for (const language in scopes) {
            if (!this.scopes.hasOwnProperty(language)) {
                this.scopes[language] = {};
            }

            if (key) {
                this.scopes[language][key] = scopes[language];
            } else {
                this.scopes[language] = {
                    ...this.scopes[language],
                    ...scopes[language]
                };
            }
        }
    }

    text(scope) {
        let value = this.scopes[this.language];
        const path = scope.split('.');

        for (const key of path) {
            if (!value.hasOwnProperty(key)) {
                return `Missing scope: ${this.language}.${scope}`;
            }
            value = value[key];
        }

        return value;
    }
}

export default i18n;