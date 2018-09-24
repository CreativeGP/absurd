class Caret {
    constructor (panel)
    {
        this.position = [0, 0];
        this._panel = panel;
        this.draw();
    }

    on_key (e)
    {
        // TODO: ここinsert()とpositionの移動,同期させても良い気がする.
        switch (e.key) {
        case 'Shift':
        case 'Alt':
        case 'Control':
            break;
        case 'Backspace':
            let idx = this.pos2idx();
            if (this._panel.content[idx-1] == "\n") {
                this.position[1]--;
                let tmp = this.pos2idx(0, this.position[1], true);
                this.position[0] = this._panel.content.indexOf("\n", tmp) - tmp;
                this._panel.content = this._panel.content.slice(0, idx-1) + this._panel.content.slice(idx);
            } else {
                this._panel.content = this._panel.content.slice(0, idx-1) + this._panel.content.slice(idx);
                this.position[0]--;
            }
            break;
        case 'ArrowLeft':
            this.position[0]--;
            break;
        case 'Enter':
            this.insert("\n");
            this.position[1]++;
            this.position[0] = 0;
            break;
        case 'Tab':
            this.insert("    ");
            this.position[0] += 4;
            break;
        case 'ArrowRight':
            this.position[0]++;
            break;
        case 'ArrowUp':
            this.position[1]--;
            break;
        case 'ArrowDown':
            this.position[1]++;
            break;
        default:
            this.insert(e.key);
            this.position[0]++;
            break;
        }
        this.render();
    }

    insert (str)
    {
        let idx = this.pos2idx();
        if (idx === -1) return;
        
        this._panel.content = this._panel.content.splice(idx, 0, str);
    }

    pos2idx (x = this.position[0], y = this.position[1], return_error = true)
    {
        let idx = 0;
        for (let i = 0; i < y; i++) {
            idx = this._panel.content.indexOf("\n", idx) + 1;
        }

        if (idx == 0 && y != 0) return (return_error) ? -1 : 0;

        idx += x;
        
        return idx;
    }

    char (x = this.position[0], y = this.position[1])
    {
        let idx = this.pos2idx(x, y, true);
        if (idx == -1) return " ";
        
        return this._panel.content[idx];
    }

    render ()
    {
        $('#caret').val(this.char(this.position[0], this.position[1]));
        $('#caret').css('left', this.position[0]*user_conf.fontWidth+'px');
        $('#caret').css('top', (this.position[1]+1)*user_conf.fontHeight+'px');
    }

    draw ()
    {
        $('#view').html('<input id="caret" type="text"></input>'+$('#view').html());
        $('#caret').css('position', 'fixed');
        $('#caret').css('z-index', '999');
        $('#caret').css('color', 'black');
        $('#caret').css('background-color', 'white');
        $('#caret').css('width', user_conf.fontWidth+'px');
        $('#caret').css('height', user_conf.fontHeight+'px');
        $('#caret').focus();

        this.render();
    }
}
