'use babel';

import { CompositeDisposable, Disposable } from 'atom';
import path from 'path';

const KEYS = {
  DELETE: 8,
  SPACE: 32
};

function playAudio(name) {
  let audio = new Audio(path.join(__dirname, 'audio', name));
  audio.play();
}

function handleKeyDown(event) {
  let name;

  switch (event.keyCode) {
    case KEYS.DELETE: name = 'delete_press.mp3'; break;
    case KEYS.SPACE : name = 'spacebar_press.mp3'; break;
    default         : name = 'key_press.mp3'; break;
  }

  playAudio(name);
}

export default {
  subscriptions: null,

  activate() {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      atom.workspace.observeTextEditors(this.attachListeners.bind(this))
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  attachListeners(editor) {
    let view = atom.views.getView(editor);

    view.addEventListener('keydown', handleKeyDown);

    this.subscriptions.add(new Disposable(function() {
      view.removeEventListener('keydown', handleKeyDown);
    }));
  }
};
