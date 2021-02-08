CodeMirror.defineSimpleMode("gorilla", {
  start: [
    { regex: /"[\s\S]*?"/, token: "string" },
    {
      regex: /(func)(\s+)([\w$]+)/,
      token: ["keyword", null, "variable"],
    },
    {
      regex: /(?:func|let|return|if|while|else|fn|break|next|use)\b/,
      token: "keyword",
    },
    {
      regex: /(?:print|println|hash|debug|input)\b/,
      token: "variable-3",
    },
    { regex: /true|false|null|GORILLA_VERSION/, token: "atom" },
    {
      regex: /[-+]?(?:\d+(\.\d*)?)/i,
      token: "number",
    },
    { regex: /#.*/, token: "comment" },
    { regex: /[-+\/*=<>!\|&]+/, token: "operator" },
    { regex: /[\{\[\(]/, indent: true },
    { regex: /[\}\]\)]/, dedent: true },
    { regex: /([\w]+)(\()/, token: ["variable", null] },
    { regex: /[\w]+/, token: "variable-2" },
  ],
  meta: {
    dontIndentStates: ["comment"],
    lineComment: "#",
  },
});

let cm = new CodeMirror.fromTextArea(document.getElementById("editor"), {
  lineNumbers: true,
  mode: "gorilla",
  theme: "dracula",
  lineWrapping: true,
  scrollbarStyle: "overlay",
  autoCloseBrackets: true,
});

cm.setValue(
  `
func hello(name)
    print("Hello, " + name + "!")

hello("world")
`.trim() + "\n"
);

let cmdp = new CodeMirror.fromTextArea(document.getElementById("display"), {
  lineNumbers: false,
  mode: null,
  theme: "solarized light",
  lineWrapping: true,
  scrollbarStyle: "overlay",
  autoCloseBrackets: true,
  readOnly: true,
});

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
  cmdp.setValue(runGorilla(code));
}

cm.setSize("100%", 400);
cmdp.setSize("auto", 400);

cm.getWrapperElement().style.fontSize = "14px";
cm.getWrapperElement().style.padding = "10px";
cm.refresh();

cmdp.getWrapperElement().style.fontSize = "20px";
cmdp.getWrapperElement().style.padding = "20px";
cmdp.refresh();

const localStorage = window.localStorage;

function selectTheme() {
  const input = document.getElementById("select");
  const theme = input.options[input.selectedIndex].value;
  cm.setOption("theme", theme.trim().toLowerCase());
  update();
}

function update() {
  const input = document.getElementById("select");
  localStorage.setItem("SAVECODE", cm.getValue());
  localStorage.setItem("SAVETHEME", input.selectedIndex);
}

$(document).ready(function () {
  if ((c = localStorage.getItem("SAVECODE"))) cm.setValue(c);
  if ((c = localStorage.getItem("SAVETHEME"))) {
    const input = document.getElementById("select");
    input.options.selectedIndex = c;
    selectTheme();
  }
  $("select").on("change", selectTheme);
  cm.on("change", update);
});
