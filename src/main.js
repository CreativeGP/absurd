const user_conf = {
    add_horizontal_panel: 'p',
    delete_panel: 'P'
};

class Editor {
    
    constructor() {
        //        this.keydown = document.
        this.panels = [];
        this.wno = 0;
        this.hno = 0;

        this.fired = false;
        $(window).keydown((e) => {

            for (let p of this.panels)
                p.on_key(e);
            
            if (this.fired) return;
            if (e.key != 'Shift') this.fired = true;

            switch (e.key) {
            case user_conf.add_horizontal_panel:
                this.add_horizontal();
                break;
            case user_conf.add_vertical_panel:
                this.add_vertical();
                break;
            case user_conf.delete_panel:
                this.wno--;
                this.panels[this.panels.length-1].remove();
                this.panels.pop();
                this.panels_update();
                break;
            }
        });

        $(window).keyup((e) => {
            this.fired = false;
        });
    }

    add_horizontal() {
        this.panels.push(new Panel(this.panels.length));
        this.wno++;
        this.panels_update();
    }

    panels_update() {
        for (let panel of this.panels) {
            panel.draw(this);
        }
    }
};

let editor = new Editor();

$(function() {
    // editor.add_horizontal();
    // editor.panels[0].draw();
});
