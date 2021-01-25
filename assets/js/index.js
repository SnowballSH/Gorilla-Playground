let cm = new CodeMirror.fromTextArea(document.getElementById("editor"), {
  lineNumbers: true,
  mode: "javascript",
  theme: "dracula",
  lineWrapping: true,
  scrollbarStyle: "overlay",
  autoCloseBrackets: true,
});

cm.setValue(
  `
func hello(name) {
  display("Hello, " + name + "!")
}
hello("world")
`.trim() + "\n"
);

const go = new Go();
WebAssembly.instantiateStreaming(fetch("main.wasm"), go.importObject).then(
  (result) => {
    go.run(result.instance);
  }
);

function submit() {
  code = cm.getValue();
  /*
  fetch(`https://gorilla.snowballsh.repl.co/${code}`)
    .then((response) => response.text())
    .then((data) => (document.getElementById("display").value = data));
    */
  document.getElementById("display").value = runGorilla(code);
}

cm.setSize("100%", 400);

// Add a warning before reloading so that you don't accidentally lose your code
// https://stackoverflow.com/a/1119324/12101554
window.onbeforeunload = () => true;
