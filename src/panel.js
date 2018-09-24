class Panel {

    constructor(id) {
        this.position = '';
        this.content = '';
        this.id = id;
        this.focused = false;
        this.caret = new Caret(this);

        $('#view').html($('#view').html()+`<div class="panel" id="panel${this.id}">
            <div class="panel-title">*scratch*</div>
            <div class="panel-contents">
                <pre></pre>
            </div>
</div>`);
        this.d_self = () => $(`#panel${this.id}`);
        this.d_content = () => $(`#panel${this.id} .panel-contents pre`);
        

    }

    on_key(e) 
    {
        this.caret.on_key(e);
        
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
        let compiled = this.content;
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
    }
    
    remove() {
        $(`#panel${this.id}`).remove();
    }
}
