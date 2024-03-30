class Instance {
    constructor(session, title = 'Untitled') {
        this.session = session;
        this.currentTitle = title;
    }

    set title(title) {
        this.currentTitle = title;
        this.titlebar.textContent = title;
        this.session.title = title;
    }

    get windowEvents() {
        return {};
    }

    // Piece of crap can't use ui or interface as a param
    buildUI() {
        this.ui = ui.div({
            class: `app`,
        });
    }
}

export default Instance;