# RgKeymap

RgKeymap is a JavaScript class that allows users to easily create and use custom hotkeys or key sequences in their applications.

## Installation

Simply copy and paste the class code into your JavaScript file. RgKeymap requires no dependencies and should work in any modern browser.

## Usage

```javascript
// Creating an instance of the class
let keymap = new RgKeymap();

// Adding a hotkey
keymap.add(['ControlLeft', 'KeyA'], () => {
    console.log('Hotkey Ctrl+A activated!');
});

// Adding a complex hotkey with multiple steps
keymap.add(['AltLeft', 's', 'n', '-n', 'Numpad1'], () => {
    console.log('Hotkey Alt+S+N (up N) +1 activated!');
});
```

### Hotkey Format
Hotkeys are described as arrays of strings, where each string represents a key identifier. The key codes correspond to the **code** property of the JavaScript keyboard event object. The list of key codes can be found [here](https://www.w3.org/TR/uievents-code/#code-value-tables).

You can use the following prefixes to describe hotkeys:

* No prefix: The key is triggered on the **'keydown'** event.
* **'-'**: The key is triggered on the **'keyup'** event.
* **'+'**: The key is triggered on the **'keyup'** event and then immediately on the **'keydown'**

Examples:

* **'ControlLeft'**: Left Ctrl key.
* **'KeyA'** or **'a'**: Key A. For alphabetical keys, you can use just the letter symbol.
* **'-'**: On **'keyup'** event.
* **'+'**: On **'keyup'**, and then immediately on the **'keydown'** event.

### Callback Functions
Callback functions are called when a hotkey is triggered. They take no arguments and are called with no context.
