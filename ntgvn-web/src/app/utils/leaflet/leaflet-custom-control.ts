declare let L: any;

export const LeafletCustomControl = L.Control.extend({
    options: {
        position: 'topleft'
    },

    initialize: function (options) {
        this._button = {};
        this.__options = options;
        this.setButton(options);
    },

    onAdd: function (map) {
        this._map = map;
        let cssClass = ''
        if (this.__options && this.__options.cssClass) {
            cssClass = this.__options.cssClass;
        }
        this._container = L.DomUtil.create('div', `leaflet-control-button leaflet-bar ${cssClass}`);
        this._update();
        return this._container;
    },

    onRemove: function (map) {
        this._button = {};
        this._update();
    },

    setButton: function (options) {
        let button = {
            'class': options.class,
            'text': options.text,
            'onClick': options.onClick,
            'title': options.title,
            'icon': options.icon
        };
        this._button = button;
        this._update();
    },

    _update: function () {
        if (!this._map) {
            return;
        }
        this._container.innerHTML = '';
        this._makeButton(this._button);
    },

    _makeButton: function (button) {
        let newButton = L.DomUtil.create('a', 'leaflet-buttons-control-button ' + button.class, this._container);
        newButton.innerHTML = `<div style="background-image:url(${button.icon})"></div>`;
        newButton.title = button.title;
        let onClick = function (event) {
            button.onClick(event, newButton);
        }
        L.DomEvent.addListener(newButton, 'click', onClick, this);
        L.DomEvent.disableClickPropagation(newButton);
        return newButton;
    }
});
