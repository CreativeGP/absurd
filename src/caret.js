class Caret {
    constructor (panel)
    {
        this.position = [0, 0];
        this._panel = panel;
        this.draw();

        $('#view').html('<input id="caret'+this._panel.id+'" type="text"></input>'+$('#view').html());
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
            if (this._panel.content.charAt(idx-1) == "\n") {
                this.position[1]--;
                let tmp = this.pos2idx(0, this.position[1], true);
                this.position[0] = this._panel.content.toString().indexOf("\n", tmp) - tmp;

		this._panel.content.delete(idx-1, 1);
		this._panel.paddings.pop();
		for (let i = this.position[1], len = this._panel.paddings.length; i < len; i++) {
		    this.update_paddings(i);
		}

		
//                this._panel.content = this._panel.content.slice(0, idx-1) + this._panel.content.slice(idx);
            } else {
//                this._panel.content = this._panel.content.slice(0, idx-1) + this._panel.content.slice(idx);
                this.position[0]--;
		this._panel.content.delete(idx-1, 1);
		this.update_paddings(this.position[1]);
            }

            break;
        case 'ArrowLeft':
            this.position[0]--;
            break;
        case 'Enter':
            this.insert("\n");

            this.position[0] = 0;
	    for (let i = this.position[1], len = this._panel.paddings.length; i <= len; i++) {
		this.update_paddings(i);
	    }
	    
            this.position[1]++;
            break;
        case 'Tab':
            this.insert("    ");
            this.update_paddings(this.position[1]);
            this.position[0] += 4;
            break;
        case 'ArrowRight':
            this.position[0]++;
            break;
        case 'ArrowUp': {
            if (this.position[1] == 0) return;
            
            let nowX = (this._panel.paddings[this.position[1]][this.position[0]+1] == null) ?
                this._panel.paddings[this.position[1]][this.position[0]] :
                (this._panel.paddings[this.position[1]][this.position[0]] +
                 this._panel.paddings[this.position[1]][this.position[0]+1])/2;
            let newX = 0;
            for (let i = 0; ; i++) {
                if (false ||
		    this._panel.paddings[this.position[1]-1] == null ||
		    this._panel.paddings[this.position[1]-1][i] == null ||
                    this._panel.paddings[this.position[1]-1][i] > nowX) {
                    newX = i-1;
                    break;
                }
            }
            
            this.position[1]--;
            this.position[0] = newX;
        } break;

        case 'ArrowDown': {
            let nowX = (this._panel.paddings[this.position[1]][this.position[0]+1] == null) ?
                this._panel.paddings[this.position[1]][this.position[0]] :
                (this._panel.paddings[this.position[1]][this.position[0]] +
                 this._panel.paddings[this.position[1]][this.position[0]+1])/2;
            let newX = 0;
            for (let i = 0; ; i++) {
                if (false ||
		    this._panel.paddings[this.position[1]+1] == null ||
		    this._panel.paddings[this.position[1]+1][i] == null ||
                    this._panel.paddings[this.position[1]+1][i] > nowX) {
                    newX = i-1;
                    break;
                }
            }
            this.position[1]++;
            this.position[0] = newX;
        } break;
            
        default:
            this.insert(e.key);
            this.update_paddings(this.position[1]);
            this.position[0]++;
            break;
        }
        this.render();
    }

    insert (str)
    {
        let idx = this.pos2idx();
        if (idx === -1) return;
        
        this._panel.content.insert(str, idx);
    }

    pos2idx (x = this.position[0], y = this.position[1], return_error = true)
    {
        let idx = 0;
        for (let i = 0; i < y; i++) {
            idx = this._panel.content.toString().indexOf("\n", idx)+1;
        }

        if (idx == 0 && y != 0) return (return_error) ? -1 : 0;

        idx += x;
        
        return idx;
    }

    // little fast!
    line2idx (y)
    {
        let res = 0;
        for (let i = 0; i < y; i++) {
            res += this._panel.paddings[i].length;
        }
        return res;
    }

    char (x = this.position[0], y = this.position[1])
    {
        let idx = this.pos2idx(x, y, true);
        if (idx == -1 || !this._panel.content) return " ";
        
        return this._panel.content.clusterAt(idx);
    }

    update_paddings (y)
    {
        let x = 1;
        this._panel.paddings[y] = [0];
        for (let i = this.line2idx(y); ; i++) {
            let tmp = this._panel.content.clusterAt(i);
            if (!tmp || tmp == "\n") break;

            let w = fontSize(tmp, "'terminal', monospace")[0];
            if (w >= user_conf.fontWidth) {
                this._panel.paddings[y][x] = this._panel.paddings[y][x-1] + w;
            } else {
                this._panel.paddings[y][x] = this._panel.paddings[y][x-1] + w;
            }
            x ++;
        }
    }

    update_all_paddings ()
    {
        let y = 0, x = 1;
        for (let i = 0; ; i++) {
            let tmp = this._panel.content.clusterAt(i);
            if (!tmp) break;

            if (tmp == "\n") {
                this._panel.paddings.push([0]);
                y++;
                x = 1;
                continue;
            }

            let w = fontSize(tmp, "'terminal', monospace")[0];
            if (w >= user_conf.fontWidth) {
                if (x == 0) this._panel.paddings[y][x] = w;
                else this._panel.paddings[y][x] = this._panel.paddings[y][x-1] + w;
            } else {
                if (x == 0) this._panel.paddings[y][x] = w;
                else this._panel.paddings[y][x] = this._panel.paddings[y][x-1] + w;
                
            }
            x ++;
        }
    }

    render ()
    {
        let chr = this.char(this.position[0], this.position[1]);
        //        let fontDimension = fontSize(chr, "'terminal', monospace");
        let fontWidth;
        if (this._panel.paddings[this.position[1]] == null || this._panel.paddings[this.position[1]][this.position[0]+1] == null || this._panel.paddings[this.position[1]][this.position[0]] == null)
            fontWidth = user_conf.fontWidth;
        else fontWidth = (this._panel.paddings[this.position[1]][this.position[0]+1] - this._panel.paddings[this.position[1]][this.position[0]]);
 
        $('#caret'+this._panel.id).val(chr);
        $('#caret'+this._panel.id).css('width', fontWidth+'px');
        $('#caret'+this._panel.id).css('height', user_conf.fontHeight+'px');
        $('#caret'+this._panel.id).css('left', this._panel.d_content().offset().left + this._panel.paddings[this.position[1]][this.position[0]]+'px');
        $('#caret'+this._panel.id).css('top', this._panel.d_content().offset().top + this.position[1]*user_conf.fontHeight+'px');
    }

    draw ()
    {
        $('#caret'+this._panel.id).css('position', 'fixed');
        $('#caret'+this._panel.id).css('z-index', '999');
        $('#caret'+this._panel.id).css('color', 'black');
        $('#caret'+this._panel.id).css('background-color', 'white');
        $('#caret'+this._panel.id).css('width', user_conf.fontWidth+'px');
        $('#caret'+this._panel.id).css('height', user_conf.fontHeight+'px');
        $('#caret'+this._panel.id).css('top', this._panel.d_self().find('.panel-title').height() +'px');
        $('#caret'+this._panel.id).focus();

//        this.render();
    }
}
