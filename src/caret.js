class Caret {
    constructor (panel)
    {
        this.position = [0, 0];
        this._panel = panel;
        this.draw();
    }

    on_key (e)
    {
        switch (e.key) {
        case 'Shift':
        case 'Alt':
        case 'Control':
            break;
        case 'Backspace':
        case 'ArrowLeft':
            this.position[0]--;
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
        case 'Enter':
            this.position[1]++;
            this.position[0] = 0;
            break;
        default:
            this.position[0]++;
            break;
        }
        this.render();
    }

    render ()
    {
        $('#caret').val(this._panel.char(this.position[0], this.position[1]));
        $('#caret').css('left', this.position[0]*12.1+'px');
        $('#caret').css('top', 20+this.position[1]*20+'px');
    }

    draw ()
    {
        $('#view').html('<input id="caret" type="text"></input>'+$('#view').html());
        $('#caret').css('position', 'fixed');
        $('#caret').css('z-index', '999');
        $('#caret').css('color', 'black');
        $('#caret').css('background-color', 'white');
        $('#caret').css('width', '10px');
        $('#caret').css('height', '20px');
        $('#caret').focus();

        this.render();
    }
}
