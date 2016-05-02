define(
  ["dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    'dojo/on',
    'dojo/query',
    'dojo/dom-style',
    "dojo/text!./EditDescription.html",
    'dijit/_TemplatedMixin',
    'jimu/BaseWidgetSetting',
    'dijit/Editor',
    "jimu/dijit/Popup",
    'esri/lang',
    'dojo/sniff',
    'jimu/utils',
    'dijit/_editor/plugins/LinkDialog',
    'dijit/_editor/plugins/ViewSource',
    'dijit/_editor/plugins/FontChoice',
    'dojox/editor/plugins/Preview',
    'dijit/_editor/plugins/TextColor',
    'dojox/editor/plugins/ToolbarLineBreak',
    'dojox/editor/plugins/FindReplace',
    'dojox/editor/plugins/PasteFromWord',
    'dojox/editor/plugins/InsertAnchor',
    'dojox/editor/plugins/Blockquote',
    'dojox/editor/plugins/UploadImage',
    './ChooseImage'
  ],
  function (
    declare,
    lang,
    array,
    on,
    query,
    domStyle,
    template,
    _TemplatedMixin,
    BaseWidgetSetting,
    Editor,
    Popup,
    esriLang,
    has,
    utils) {
    return declare([BaseWidgetSetting, _TemplatedMixin], {
      baseClass: "jimu-widget-smartEditor-edit-description",
      templateString: template,
      _layerInfo: null,
      _fieldValid: null,
      _fieldValidations: null,
      __layerName: null,
      postCreate: function () {
        this.inherited(arguments);
      
        this._initEditor();
      },

      popupEditDescription: function () {
        this._editorObj.focus();
        if (this._layerInfo.editDescription && this._layerInfo.editDescription !== null) {
          this._editorObj.set("value", this._layerInfo.editDescription);
        }

        var editDescPopup = new Popup({
          titleLabel: esriLang.substitute(
            { layername: this._layerName },
            this.nls.editDescriptionPage.title),
          width: 720,
          maxHeight: 700,
          autoHeight: true,
          content: this,
          buttons: [{
            label: this.nls.ok,
            onClick: lang.hitch(this, function () {
              this._layerInfo.editDescription = this._getText();
              editDescPopup.close();
            })
          }, {
            label: this.nls.cancel,
            classNames: ['jimu-btn-vacation'],
            onClick: lang.hitch(this, function () {

              editDescPopup.close();
            })
          }],
          onClose: lang.hitch(this, function () {
          })
        });
      },
      _getText: function () {
        var editorText, regExp;
        editorText = this._editorObj.focusNode.innerHTML;
        //editorText = editorText.replace(/&nbsp;/g, '');
        //regExp = new RegExp("<div><br></div>", 'g');
        //editorText = editorText.replace(regExp, "");
        //regExp = new RegExp("<p><br></p>", 'g');
        //editorText = editorText.replace(regExp, "");
        //regExp = new RegExp("<p></p>", 'g');
        //editorText = editorText.replace(regExp, "");
        //editorText = editorText.replace(/<br>/g, "");
        //editorText = lang.trim(editorText);

        return editorText;
      },
      _initEditor: function () {
        if (!this._editorObj) {
          this._initEditorPluginsCSS();
          this._editorObj = new Editor({
            plugins: [
              'bold', 'italic', 'underline', 'foreColor', 'hiliteColor',
              '|', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
              '|', 'insertOrderedList', 'insertUnorderedList', 'indent', 'outdent'
            ],
            extraPlugins: [
              '|', 'createLink', 'unlink', 'pastefromword', '|', 'undo', 'redo',
              '|', 'toolbarlinebreak',//'chooseImage', 'uploadImage',
              'fontName', 'fontSize', 'formatBlock'
            ]
          }, this.editText);
        //  this._editorObj = new Editor({
        //    plugins: [
        //      "bold", "italic", "underline", "|", "cut", "copy",
        //      "paste", "|", "foreColor"
        //    ]
        //  }, this.editText);
        //  domStyle.set(this._editorObj.domNode, {
        //    "width": '100%',
        //    "height": '100%'
        //  });
          this.own(on(this._editorObj, "focus", lang.hitch(this,
            function () {

            })));
          this.own(on(this._editorObj, "blur", lang.hitch(this,
            function () {

            })));

          this._editorObj.onLoadDeferred.then(lang.hitch(this, function () {

          }));

          this._editorObj.startup();
          if (has('ie') !== 8) {
            this._editorObj.resize({
              w: '100%',
              h: '100%'
            });
          } else {
            var box = html.getMarginBox(this.editText);
            this._editorObj.resize({
              w: box.w,
              h: box.h
            });
          }
        }
      },
      /**
* this function loads the editor tool plugins CSS
* @memberOf widgets/RelatedTableCharts/setting/ChartSetting
**/
      _initEditorPluginsCSS: function () {
        var head, tcCssHref, tcCss, epCssHref, epCss, pfCssHref, pfCss;
        head = document.getElementsByTagName('head')[0];
        tcCssHref = window.apiUrl + "dojox/editor/plugins/resources/css/TextColor.css";
        tcCss = query('link[href="' + tcCssHref + '"]', head)[0];
        if (!tcCss) {
          utils.loadStyleLink("editor_plugins_resources_TextColor", tcCssHref);
        }
        epCssHref = window.apiUrl + "dojox/editor/plugins/resources/editorPlugins.css";
        epCss = query('link[href="' + epCssHref + '"]', head)[0];
        if (!epCss) {
          utils.loadStyleLink("editor_plugins_resources_editorPlugins", epCssHref);
        }
        pfCssHref = window.apiUrl + "dojox/editor/plugins/resources/css/PasteFromWord.css";
        pfCss = query('link[href="' + pfCssHref + '"]', head)[0];
        if (!pfCss) {
          utils.loadStyleLink("editor_plugins_resources_PasteFromWord", pfCssHref);
        }
      },

    });
  });