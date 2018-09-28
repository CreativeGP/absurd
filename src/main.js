let user_conf = {
    add_horizontal_panel: 'F1',
    delete_panel: 'F2',
    open_file_buffer: 'F3',
    open_file: 'F4',
};

class Editor {
    
    constructor() {
        //        this.keydown = document.
        this.panels = [];
        this.wno = 0;
        this.hno = 0;
        this.focusid = 0;

        this.fired = false;
        $(window).keydown((e) => {
            e.preventDefault();
            if (e.key === 'Tab') {
                e.preventDefault();
                $(window).focus();
            }

            for (let p of this.panels)
                p.on_key(e);
            
            if (this.fired) return;
            if (e.key != 'Shift' && e.key != 'Alt' && e.key != 'Control') this.fired = true;

            switch (e.key) {
            case user_conf.add_horizontal_panel:
                this.add_horizontal('*scratch*');
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
	    case user_conf.open_file_buffer:
                this.add_horizontal('*file open*');
                this.panels[this.panels.length-1].set_color('crimson');
		break;
	    case user_conf.open_file:
		break;
            }

            if (e.ctrlKey) {
                switch (e.key) {
                case 'ArrowLeft':
                    this.change_focusid((this.focusid-1) % this.panels.length);
                    break;
                case 'ArrowRight':
                    this.change_focusid((this.focusid+1) % this.panels.length);
                    break;
                }
            }
        });

        $(window).keyup((e) => {
            this.fired = false;
        });
    }

    change_focusid (id)
    {
        $('#caret'+this.focusid).css('visibility', 'hidden');
        this.focusid = id;
        this.panels[this.focusid].caret.update_all_paddings();
        $('#caret'+this.focusid).css('visibility', 'visible');
    }

    add_horizontal(title) {
        this.panels.push(new Panel(title, this.panels.length, this));
        this.change_focusid(this.panels.length-1);
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
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
	// Great success! All the File APIs are supported.
    } else {
	alert('The File APIs are not fully supported in this browser.');
    }

    let fontDimension = fontSize('A', "'terminal', monospace");
    user_conf.fontWidth = fontDimension[0];
    user_conf.fontHeight = fontDimension[1];
    // editor.add_horizontal();
    // editor.panels[0].draw();
});
