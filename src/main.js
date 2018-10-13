let user_conf = {
    add_horizontal_panel: 'F1',
    delete_panel: 'F2',
    open_file_buffer: 'F3',
    open_remote_file: 'F4',
    open_file: 'F3',
    write_file: 'F4',
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

	    if (!(e.key.length != 1 && e.key[0] == 'F'))
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
		this.change_focusid(this.panels.length-1);
                break;
	    case user_conf.open_file:
                $('#files').click();
                // NOTE: Here, we must explicitly turn off this.fired
                // because the keyup event won't be called due to the popup. 
                this.fired = false;
	    case user_conf.write_file:
                
            }

            if (e.ctrlKey) {
                switch (e.key) {
                case 'ArrowLeft':
                    this.change_focusid((this.focusid-1) % this.panels.length);
                    break;
                case 'ArrowRight':
                    this.change_focusid((this.focusid+1) % this.panels.length);
                    break;
	        case user_conf.open_file_buffer:
                    this.add_horizontal('*file open*');
                    this.panels[this.panels.length-1].set_color('coral');
		    break;
	        case user_conf.open_file:
		    let path = this.panels[this.panels.length-1].content.toString();

		    let corpize = e=>`https://cgp-corp.herokuapp.com/?url=${encodeURIComponent(e)}`;
		    if (path.match(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/)) {
		        fetch(corpize(path)).then(res => res.text())
			    .then(text => {
			        this.panels[this.panels.length-2].content.append(text);
			        this.panels[this.panels.length-2].caret.update_all_paddings();
			        this.panels[this.panels.length-2].render();
			        this.panels[this.panels.length-2].set_title(path.substring(path.lastIndexOf('/')+1));
			        
			        this.wno--;
			        this.panels[this.panels.length-1].remove();
			        this.panels.pop();
			        this.panels_update();
			        this.change_focusid(this.panels.length-1);
			    });
		    }
                }
            }
        });

        $(window).keyup((e) => {
            this.fired = false;
        });
    }

    
    file_opened (evt)
    {
        let files = evt.target.files;

        for (var i = 0, f; f = files[i]; i++) {
            var reader = new FileReader();

            reader.onload = ((file, self) => {
                return (e => {
                    let text = e.target.result;
                    self.add_horizontal(file.name);
                    self.panels[this.focusid].change_content(text);
                    self.panels[this.focusid].file = file;
                });
            })(f, this);

            reader.readAsText(f);
        }
    };


    change_focusid (id)
    {
        $('#caret'+this.focusid).css('visibility', 'hidden');
        this.focusid = id;
        this.panels[this.focusid].caret.update_all_paddings();
        $('#caret'+this.focusid).css('visibility', 'visible');
    }

    add_horizontal(title) {
        this.wno++;
        this.panels.push(new Panel(title, this.panels.length, this));
        this.change_focusid(this.panels.length-1);
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
        document.getElementById('files').addEventListener('change', e => editor.file_opened(e), false);
    } else {
	alert('The File APIs are not fully supported in this browser.');
    }

    let fontDimension = fontSize('A', "'terminal', monospace");
    user_conf.fontWidth = fontDimension[0];
    user_conf.fontHeight = fontDimension[1];
    // editor.add_horizontal();
    // editor.panels[0].draw();
});
