'use babel';

import { CompositeDisposable } from 'atom';
import memoize from 'memoizee';
import path from 'path';

const KEYS = {
  DELETE: 8,
  ENTER: 13,
  SPACE: 32
};

let getAudio = memoize(function(keyCode) {
  let name;

  switch (keyCode) {
    case KEYS.ENTER :
    case KEYS.SPACE : name = 'spacebar_press.mp3'; break;
    case KEYS.DELETE: name = 'delete_press.mp3'; break;
    default         : name = 'key_press.mp3'; break;
  }

  return new Audio(path.join(__dirname, 'audio', name));
}, { primitive: true });

export default {
  subscriptions: null,

  activate() {
    let disposables = atom.workspace.observeTextEditors(editor => {
      let view = atom.views.getView(editor);
      view.addEventListener('keydown', this.handleKeyDown);
    });

    this.subscriptions = new CompositeDisposable(disposables);
  },

  deactivate() {
    atom.workspace.getTextEditors().forEach(editor => {
      let view = atom.views.getView(editor);
      view.removeEventListener('keydown', this.handleKeyDown);
    });

    this.subscriptions.dispose();
  },

  handleKeyDown(e) {
    let audio = getAudio(e.keyCode);
    audio.play();
  }
};
