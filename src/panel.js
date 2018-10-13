class Panel {

    constructor(title, id, _editor, default_content="", file=null) {
        this.position = '';
        this.id = id;
        this._editor = _editor;
	this.title = title;
        this.file = file;

        $('#view').html($('#view').html()+`<div class="panel" id="panel${this.id}">
            <div class="panel-title">${this.title}</div>
            <div class="panel-contents">
                <pre>${default_content}</pre>
            </div>
</div>`);
        this.d_self = () => $(`#panel${this.id}`);
        this.d_content = () => $(`#panel${this.id} .panel-contents pre`);
        this.content = Unistring(this.d_content().html());
        this.paddings = [[0]];
        
        this.caret = new Caret(this);
        this.caret.update_all_paddings();
    }

    set_style (name, value)
    {
	this.d_self().css(name, value);
    }

    set_color (col)
    {
	this.d_self().find('.panel-title').css('background-color', col);
	this.set_style('border-color', col);
    }

    set_title (title)
    {
	this.title = title;
	this.d_self().find('.panel-title').text(title);
    }

    change_content (str)
    {
        this.content = Unistring(str);
        this.caret.update_all_paddings();
        this.render();
    }

    on_key(e) 
    {
        if (this.id == this._editor.focusid) this.caret.on_key(e);
        
        switch (e.key) {
        case 'Shift':
        case 'Alt':
        case 'Control':
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'ArrowUp':
        case 'ArrowDown':
            break;
        }
        this.render();
    }

    render() {
        let compiled = this.content.toString();
        compiled = compiled.replace(/</g, "&lt;");
        compiled = compiled.replace(/>/g, "&gt;");
//        compiled = compiled.replace(/[\n\r]/g, "<br>");
        compiled = compiled.replace(/(#.*)/g, '<span class="import">$1</span>');
        this.d_content().html(compiled);
    }

    draw(editor) {
        this.d_self().css('position', 'fixed');
        this.d_self().css('left', 'calc('+(100/editor.wno)*this.id+'% - 2px)');
        this.d_self().css('top', '0');
        this.d_self().css('width', 'calc('+100/editor.wno+'% - 2px)');
        this.d_self().css('height', '100%');

	this.caret.draw();
    }
    
    remove() {
        $(`#panel${this.id}`).remove();
	this.caret.remove();
    }
}
