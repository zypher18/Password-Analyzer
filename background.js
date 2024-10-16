import { Pane } from "https://esm.sh/tweakpane@4.0.3";

const state = {
  fps: 30,
  color: "#0f0",
  charset: "01",
  size: 25
};

const gui = new Pane({
  title: "1337 Matrix by pavi2410"
});
const fpsCtrl = gui.addBinding(state, "fps", { min: 1, max: 120, step: 1 });
gui.addBinding(state, "color");
gui.addBinding(state, "charset");
const sizeCtrl = gui.addBinding(state, "size", { min: 1, max: 120, step: 1 });

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let w, h, p;
const resize = () => {
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;

  p = Array(Math.ceil(w / state.size)).fill(0);
};
window.addEventListener("resize", resize);
sizeCtrl.on("change", (ev) => {
  if (ev.last) {
    resize();
  }
});
resize();

const random = (items) => items[Math.floor(Math.random() * items.length)];

const draw = () => {
  ctx.fillStyle = "rgba(0,0,0,.05)";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = state.color;

  ctx.font = state.size + "px monospace";
  for (let i = 0; i < p.length; i++) {
    let v = p[i];
    ctx.fillText(random(state.charset), i * state.size, v);
    p[i] = v >= h || v >= 10000 * Math.random() ? 0 : v + state.size;
  }
};

let interval = setInterval(draw, 1000 / state.fps);
fpsCtrl.on("change", (ev) => {
  if (!ev.last) return;
  const fps = ev.value;
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(draw, 1000 / fps);
});
