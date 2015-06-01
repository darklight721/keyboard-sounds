'use babel';

import KeyboardSounds from './keyboard-sounds.js';
import { CompositeDisposable } from 'atom';

export default {
  keyboardSounds: null,
  subscriptions: null,

  activate() {
    this.keyboardSounds = new KeyboardSounds();
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add(
      'atom-workspace', { 'keyboard-sounds:toggle': () => this.toggle() }
    ));

    this.toggle();
  },

  deactivate() {
    this.keyboardSounds.deactivate();
    this.subscriptions.dispose();
  },

  toggle() {
    if (this.keyboardSounds.isActive)
      this.keyboardSounds.deactivate();
    else
      this.keyboardSounds.activate();
  }
}
