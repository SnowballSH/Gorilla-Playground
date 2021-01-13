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

function submit() {
  code = encodeURIComponent(cm.getValue());
  fetch(`https://gorilla.snowballsh.repl.co/${code}`)
    .then((response) => response.text())
    .then((data) => (document.getElementById("display").value = data));
}

cm.setSize("100%", 400);
