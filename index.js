!function(e){var t={};function n(o){if(t[o])return t[o].exports;var i=t[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(){return function(e){this._value=e}}(),i=(function(){}(),function(){function e(){this._levels=new Map}return e.prototype.getLevelNodes=function(e){return this._levels.get(e)},e.prototype.getNode=function(e,t){return this.getLevelNodes(e).find(function(e){return e._index===t})},e.prototype.addNode=function(e,t,n){if(t>=0&&n>=0){var o=this.getNode(t,n);this.addNewNode(e,o)}else this.addNewNode(e)},e.prototype.addNodes=function(e,t,n){var o=this;e.forEach(function(e){return o.addNode(e,t,n)})},e.prototype.updateLevel=function(e,t,n){if(this.getLevelNodes(e)){var o=this.getLevelNodes(e).slice();o.splice(t,0,n),this._levels.set(e,o)}else this._levels.set(e,[n])},e.prototype.addNewNode=function(e,t){var n=new o(e);n._children=[],this._root?t?(t._children.push(n),n._depth=t._depth+1,n._index=this.getLevelNodes(n._depth)?this.getLevelNodes(n._depth).length:t._children.length-1,this.updateLevel(n._depth,n._index,n)):(this._root._children.push(n),n._depth=this._root._depth+1,n._index=this._root._children.length-1,this.updateLevel(n._depth,n._index,n)):(n._index=n._depth=0,this._root=n,this.updateLevel(n._depth,0,n))},e}());t.default=i}]);