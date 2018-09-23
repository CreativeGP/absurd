class Editor {
    
    constructor() {
        //        this.keydown = document.
        this.panels = [];
        this.wno = 0;
        this.hno = 0;

        this.fired = false;
        $(window).keydown((e) => {
            if (this.fired) return;
            if (e.key != 'Shift') this.fired = true;

            switch (e.key) {
            case 'p':
                this.add_horizontal();
                break;
            case 'P':
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
            panel.draw();
        }
    }
};

let editor = new Editor();

class Panel {

    constructor(id) {
        this.position = '';
        this.id = id;

            $('#view').html($('#view').html()+`<div class="panel" id="panel${this.id}">
            <div class="panel-title">*scratch*</div>
            <div class="panel-contents">
                <pre>
#include &lt;stdio.h&gt;
int main(void) {
  printf("hello world");
}
                </pre>
            </div>
</div>`);
}

    draw() {
        $(`#panel${this.id}`).css('position', 'fixed');
        $(`#panel${this.id}`).css('left', 'calc('+(100/editor.wno)*this.id+'% - 2px)');
        $(`#panel${this.id}`).css('top', '0');
        $(`#panel${this.id}`).css('width', 'calc('+100/editor.wno+'% - 2px)');
        $(`#panel${this.id}`).css('height', '100%');
    }

    remove() {
        $(`#panel${this.id}`).remove();
    }
}

$(function() {
    // editor.add_horizontal();
    // editor.panels[0].draw();
});
