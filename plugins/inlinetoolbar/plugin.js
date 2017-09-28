/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';


	var stylesLoaded = false;

	CKEDITOR.plugins.add( 'inlinetoolbar', {
		requires: 'balloonpanel',
		init: function( editor ) {
			if ( !stylesLoaded ) {
				CKEDITOR.document.appendStyleSheet( this.path + 'skins/' + CKEDITOR.skinName + '/inlinetoolbar.css' );
				stylesLoaded = true;
			}

			CKEDITOR.ui.inlineToolbar.prototype = Object.create( CKEDITOR.ui.balloonPanel.prototype );
			CKEDITOR.ui.inlineToolbar.prototype.templateDefinitions.panel = CKEDITOR.ui.inlineToolbar.prototype.templateDefinitions.panel.replace( 'cke_balloon', 'cke_inlinetoolbar' );
			CKEDITOR.ui.inlineToolbar.prototype.build = function() {
				CKEDITOR.ui.balloonPanel.prototype.build.call( this );
				this.parts.title.remove();
				this.parts.close.remove();
				var output = [];
				for ( var menuItem in this.menuItems ) {
					this.menuItems[ menuItem ].render( this.editor, output );
				}
				this.parts.content.setHtml( output.join( '' ) );
			};

			CKEDITOR.ui.inlineToolbar.prototype._getAlignments = function( elementRect, panelWidth, panelHeight ) {
				return {
					'top hcenter': {
						top: elementRect.top - panelHeight - this.triangleHeight,
						left: elementRect.left + elementRect.width / 2 - panelWidth / 2
					},
					'bottom hcenter': {
						top: elementRect.bottom + this.triangleHeight,
						left: elementRect.left + elementRect.width / 2 - panelWidth / 2
					}
				};
			};

			CKEDITOR.ui.inlineToolbar.prototype.destroy = function() {
				CKEDITOR.ui.balloonPanel.prototype.destroy.call( this );
				if ( this.listeners ) {
					this.editor.removeListener( 'resize', this.listeners.resize );
					this.listeners.scrollEvent.removeListener();
					this.listeners = null;
				}
				this.menuItems = [];
			};

			CKEDITOR.ui.inlineToolbar.prototype.create = function( element ) {
				this.build();
				this.attach( element );

				var that = this,
				editable = this.editor.editable();
				if ( this.listeners ) {
					this.editor.removeListener( 'resize', this.listeners.resize );
					this.listeners.scrollEvent.removeListener();
					this.listeners = null;
				}
				this.listeners = {
					resize: function() {
						that.attach( element, false );
					},
					scroll: function() {
						that.attach( element, false );
					}
				};

				this.editor.on( 'resize', this.listeners.resize );
				this.listeners.scrollEvent = editable.attachListener( editable.getDocument(), 'scroll', this.listeners.scroll );
			};

			CKEDITOR.ui.inlineToolbar.prototype.detach = function() {
				if ( this.listeners ) {
					this.editor.removeListener( 'resize', this.listeners.resize );
					this.listeners.scrollEvent.removeListener();
					this.listeners = null;
				}
				this.hide();
			};

				/**
			 * Adds an item from the specified definition to the editor context menu.
			 *
			 * @method
			 * @param {String} name The menu item name.
			 * @param {Object} definition The menu item definition.
			 * @member CKEDITOR.editor
			 */
			CKEDITOR.ui.inlineToolbar.prototype.addMenuItem = function( name, definition ) {
				this.menuItems[ name ] = new CKEDITOR.ui.button( definition );
			};

			/**
			 * Adds one or more items from the specified definition object to the editor context menu.
			 *
			 * @method
			 * @param {Object} definitions Object where keys are used as itemName and corresponding values as definition for a {@link #addMenuItem} call.
			 * @member CKEDITOR.editor
			 */
			CKEDITOR.ui.inlineToolbar.prototype.addMenuItems = function( definitions ) {
				for ( var itemName in definitions ) {
					this.addMenuItem( itemName, definitions[ itemName ] );
				}
			};

			/**
			 * Retrieves a particular menu item definition from the editor context menu.
			 *
			 * @method
			 * @param {String} name The name of the desired menu item.
			 * @returns {Object}
			 * @member CKEDITOR.editor
			 */
			CKEDITOR.ui.inlineToolbar.prototype.getMenuItem = function( name ) {
				return this.menuItems[ name ];
			};

				/////TEMPORARY CODE ///////
			editor.addCommand( 'testInlineToolbar', {
				exec: function( editor ) {
					var img = editor.editable().findOne( 'img' );
					if ( img ) {
						var panel = new CKEDITOR.ui.inlineToolbar( editor );
						panel.addMenuItems( {
							image: {
								label: editor.lang.image.menu,
								command: 'image',
								group: 'image'
							}
						} );
						panel.create( img );
					}
				}
			} );
			editor.ui.addButton( 'testInlineToolbar', {
				label: 'test inlinetoolbar',
				command: 'testInlineToolbar',
				toolbar: 'insert'
			} );
		}
	} );

	CKEDITOR.ui.inlineToolbar = function( editor, definition ) {
		var defParams = CKEDITOR.tools.extend( definition || {}, {
			width: 'auto',
			triangleWidth: 10,
			triangleHeight: 10
		} );
		CKEDITOR.ui.balloonPanel.call( this, editor, defParams );
		this.menuItems = [];
	};

}() );
