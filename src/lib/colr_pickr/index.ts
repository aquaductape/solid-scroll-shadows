// @ts-nocheck
/*!
 * Colr Pickr
 *
 * R-TEK
 *
 * https://github.com/R-TEK/colr_pickr
 *
 * MIT License
 */
let colorPickerComp = new Object();
export function ColorPicker(t, e) {
  (this.element = t),
    (t.colorPickerObj = this),
    t.setAttribute("data-color", e),
    (t.style.background = e),
    t.addEventListener("click", function () {
      (colorPickerComp.instance = this.colorPickerObj),
        (colorPickerComp.pickerOpen = !0);
      const t = document.getElementById("color_picker");
      t.style.display = "block";
      let e = this.getBoundingClientRect().top,
        o = this.getBoundingClientRect().left;
      if (
        ((e =
          e + t.offsetHeight > window.innerHeight
            ? e - t.offsetHeight - 2
            : e + this.offsetHeight + 2),
        o + t.offsetWidth > window.innerWidth - 20)
      ) {
        o = o - (o + t.offsetWidth - window.innerWidth) - 20;
      }
      (t.style.top = e + "px"),
        (t.style.left = o + "px"),
        colorPickerComp.updateColorDisplays(this.getAttribute("data-color")),
        document.getElementById("color_text_values").focus();
    });
}
!(function () {
  (colorPickerComp.pickerOpen = !1),
    (colorPickerComp.instance = null),
    (colorPickerComp.boxStatus = !1),
    (colorPickerComp.boxStatusTouch = !1),
    (colorPickerComp.sliderStatus = !1),
    (colorPickerComp.sliderStatusTouch = !1),
    (colorPickerComp.opacityStatus = !1),
    (colorPickerComp.opacityStatusTouch = !1),
    (colorPickerComp.colorTypeStatus = "HEXA"),
    (colorPickerComp.hue = 0),
    (colorPickerComp.saturation = 100),
    (colorPickerComp.lightness = 50),
    (colorPickerComp.alpha = 1),
    (colorPickerComp.contextMenuElem = null),
    (colorPickerComp.doubleTapTime = 0),
    (colorPickerComp.LSCustomColors = { 0: [] });
  const t = document.createElement("ASIDE");
  if (
    ((t.id = "color_picker"),
    (t.innerHTML =
      '\n\t\t<svg id="color_box" width="263" height="130">\n\t\t\t<defs>\n\t\t\t\t<linearGradient id="saturation" x1="0%" y1="0%" x2="100%" y2="0%">\n\t\t\t\t\t<stop offset="0%" stop-color="#fff"></stop>\n\t\t\t\t\t<stop offset="100%" stop-color="hsl(0,100%,50%)"></stop>\n\t\t\t\t</linearGradient>\n\t\t\t\t<linearGradient id="brightness" x1="0%" y1="0%" x2="0%" y2="100%">\n\t\t\t\t\t<stop offset="0%" stop-color="rgba(0,0,0,0)"></stop>\n\t\t\t\t\t<stop offset="100%" stop-color="#000"></stop>\n\t\t\t\t</linearGradient>\n\t\t\t\t<pattern id="pattern_config" width="100%" height="100%">\n\t\t\t\t\t<rect x="0" y="0" width="100%" height="100%" fill="url(#saturation)"></rect> }\n\t\t\t\t\t<rect x="0" y="0" width="100%" height="100%" fill="url(#brightness)"></rect>\n\t\t\t\t</pattern>\n\t\t\t</defs>\n\t\t\t<rect rx="5" ry="5" x="1" y="1" width="263" height="130" stroke="#fff" stroke-width="2" fill="url(#pattern_config)"></rect>\n\t\t\t<svg id="box_dragger" x="336" y="14" style="overflow: visible;">\n\t\t\t\t<circle r="9" fill="none" stroke="#000" stroke-width="2"></circle>\n\t\t\t\t<circle r="7" fill="none" stroke="#fff" stroke-width="2"></circle>\n\t\t\t</svg>\n\t\t</svg>\n\t\t<br>\n\t\t<div id="sliders">\n\t\t\t<svg id="color_slider" width="263" height="20">\n\t\t\t\t<defs>\n\t\t\t\t\t<linearGradient id="hue" x1="100%" y1="0%" x2="0%" y2="0%">\n\t\t\t\t\t\t<stop offset="0%" stop-color="#f00"></stop>\n\t\t\t\t\t\t<stop offset="16.666%" stop-color="#ff0"></stop>\n\t\t\t\t\t\t<stop offset="33.333%" stop-color="#0f0"></stop>\n\t\t\t\t\t\t<stop offset="50%" stop-color="#0ff"></stop>\n\t\t\t\t\t\t<stop offset="66.666%" stop-color="#00f"></stop>\n\t\t\t\t\t\t<stop offset="83.333%" stop-color="#f0f"></stop>\n\t\t\t\t\t\t<stop offset="100%" stop-color="#f00"></stop>\n\t\t\t\t\t</linearGradient>\n\t\t\t\t</defs>\n\t\t\t\t<rect rx="5" ry="5" x="1" y="1" width="263" height="20" stroke="#fff" stroke-width="2" fill="url(#hue)"></rect>\n\t\t\t\t<svg id="color_slider_dragger" x="277" y="11" style="overflow: visible;">\n\t\t\t\t\t<circle r="7" fill="none" stroke="#000" stroke-width="2"></circle>\n\t\t\t\t\t<circle r="5" fill="none" stroke="#fff" stroke-width="2"></circle>\n\t\t\t\t</svg>\n\t\t\t</svg>\n\t\t\t<svg id="opacity_slider" width="263" height="20">\n\t\t\t\t<defs>\n\t\t\t\t\t<linearGradient id="opacity" x1="100%" y1="0%" x2="0%" y2="0%">\n\t\t\t\t\t\t<stop offset="0%" stop-color="#000"></stop>\n\t\t\t\t\t\t<stop offset="100%" stop-color="#fff"></stop>\n\t\t\t\t\t</linearGradient>\n\t\t\t\t</defs>\n\t\t\t\t<rect rx="5" ry="5" x="1" y="6" width="263" height="10" stroke="#fff" stroke-width="2" fill="url(#opacity)"></rect>\n\t\t\t\t<svg id="opacity_slider_dragger" x="277" y="11" style="overflow: visible;">\n\t\t\t\t\t<circle r="7" fill="none" stroke="#000" stroke-width="2"></circle>\n\t\t\t\t\t<circle r="5" fill="none" stroke="#fff" stroke-width="2"></circle>\n\t\t\t\t</svg>\n\t\t\t</svg>\n\t\t</div>\n\t\t<div id="color_text_values" tabindex="0">\n\t\t\t<div id="hexa">\n\t\t\t\t<input id="hex_input" name="hex_input" type="text" maxlength="9" spellcheck="false" />\n\t\t\t\t<br>\n\t\t\t\t<label for="hex_input" class="label_text">HEX</label>\n\t\t\t</div>\n\t\t\t<div id="rgba" style="display: none;">\n\t\t\t\t<div class="rgba_divider">\n\t\t\t\t\t<input class="rgba_input" name="r" type="number" min="0" max="255" />\n\t\t\t\t\t<br>\n\t\t\t\t\t<label for="r" class="label_text">R</label>\n\t\t\t\t</div>\n\t\t\t\t<div class="rgba_divider">\n\t\t\t\t\t<input class="rgba_input" name="g" type="number" min="0" max="255" />\n\t\t\t\t\t<br>\n\t\t\t\t\t<label for="g" class="label_text">G</label>\n\t\t\t\t</div>\n\t\t\t\t<div class="rgba_divider">\n\t\t\t\t\t<input class="rgba_input" name="b" type="number" min="0" max="255" />\n\t\t\t\t\t<br>\n\t\t\t\t\t<label for="b" class="label_text">B</label>\n\t\t\t\t</div>\n\t\t\t\t<div class="rgba_divider">\n\t\t\t\t\t<input class="rgba_input" name="a" type="number" step="0.1" min="0" max="1" />\n\t\t\t\t\t<br>\n\t\t\t\t\t<label for="a" class="label_text">A</label>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div id="hsla" style="display: none;">\n\t\t\t\t<div class="hsla_divider">\n\t\t\t\t\t<input class="hsla_input" name="h" type="number" min="0" max="359" />\n\t\t\t\t\t<br>\n\t\t\t\t\t<label for="h" class="label_text">H</label>\n\t\t\t\t</div>\n\t\t\t\t<div class="hsla_divider">\n\t\t\t\t\t<input class="hsla_input" name="s" type="number" min="0" max="100" />\n\t\t\t\t\t<br>\n\t\t\t\t\t<label for="s" class="label_text">S%</label>\n\t\t\t\t</div>\n\t\t\t\t<div class="hsla_divider">\n\t\t\t\t\t<input class="hsla_input" name="l" type="number" min="0" max="100" />\n\t\t\t\t\t<br>\n\t\t\t\t\t<label for="l" class="label_text">L%</label>\n\t\t\t\t</div>\n\t\t\t\t<div class="rgba_divider">\n\t\t\t\t\t<input class="hsla_input" name="a" type="number" step="0.1" min="0" max="1" />\n\t\t\t\t\t<br>\n\t\t\t\t\t<label for="a" class="label_text">A</label>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<button id="switch_color_type" class="remove_outline" name="switch-color-type">\n\t\t\t\t<svg viewBox="0 -2 24 24" width="20" height="20">\n\t\t\t\t\t<path fill="#555" d="M6 11v-4l-6 5 6 5v-4h12v4l6-5-6-5v4z"/>\n\t\t\t\t</svg>\n\t\t\t</button>\n\t\t</div>\n\t\t<div id="custom_colors">\n\t\t\t<div id="custom_colors_header">\n\t\t\t\t<svg id="custom_colors_pallet_icon" viewBox="0 0 24 24" width="15" height="18">\n\t\t\t\t\t<path fill="#555" d="M4 21.832c4.587.38 2.944-4.493 7.188-4.538l1.838 1.534c.458 5.538-6.315 6.773-9.026 3.004zm14.065-7.115c1.427-2.239 5.847-9.749 5.847-9.749.352-.623-.43-1.273-.976-.813 0 0-6.572 5.714-8.511 7.525-1.532 1.432-1.539 2.086-2.035 4.447l1.68 1.4c2.227-.915 2.868-1.039 3.995-2.81zm-11.999 3.876c.666-1.134 1.748-2.977 4.447-3.262.434-2.087.607-3.3 2.547-5.112 1.373-1.282 4.938-4.409 7.021-6.229-1-2.208-4.141-4.023-8.178-3.99-6.624.055-11.956 5.465-11.903 12.092.023 2.911 1.081 5.571 2.82 7.635 1.618.429 2.376.348 3.246-1.134zm6.952-15.835c1.102-.006 2.005.881 2.016 1.983.004 1.103-.882 2.009-1.986 2.016-1.105.009-2.008-.88-2.014-1.984-.013-1.106.876-2.006 1.984-2.015zm-5.997 2.001c1.102-.01 2.008.877 2.012 1.983.012 1.106-.88 2.005-1.98 2.016-1.106.007-2.009-.881-2.016-1.988-.009-1.103.877-2.004 1.984-2.011zm-2.003 5.998c1.106-.007 2.01.882 2.016 1.985.01 1.104-.88 2.008-1.986 2.015-1.105.008-2.005-.88-2.011-1.985-.011-1.105.879-2.004 1.981-2.015zm10.031 8.532c.021 2.239-.882 3.718-1.682 4.587l-.046.044c5.255-.591 9.062-4.304 6.266-7.889-1.373 2.047-2.534 2.442-4.538 3.258z"/>\n\t\t\t\t</svg>\n\t\t\t\t<button id="custom_colors_add" class="remove_outline" name="add-a-custom-color">\n\t\t\t\t\t<svg viewBox="0 -2 24 24" width="14" height="16">\n\t\t\t\t\t\t<path fill="#555" d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/>\n\t\t\t\t\t</svg>\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t\t<div id="custom_colors_box">\n\t\t\t</div>\n\t\t</div>\n\t\t<div id="color_context_menu" class="color_ctx_menu">\n\t\t\t<button id="color_clear_single" class="color_ctx_menu" name="remove-single-color">Remove</button>\n\t\t\t<button id="color_clear_all" class="color_ctx_menu" name="remove-all-colors">Remove All</button>\n\t\t</div>\n\t'),
    document.getElementsByTagName("BODY")[0].appendChild(t),
    null === localStorage.getItem("custom_colors"))
  )
    localStorage.setItem("custom_colors", '{"0": []}');
  else {
    colorPickerComp.LSCustomColors = JSON.parse(
      localStorage.getItem("custom_colors")
    );
    for (let t = colorPickerComp.LSCustomColors[0].length - 1; t >= 0; t--) {
      let e = document.createElement("BUTTON");
      (e.className = "custom_colors_preview"),
        (e.style.background = colorPickerComp.LSCustomColors[0][t]),
        e.setAttribute(
          "data-custom-color",
          colorPickerComp.LSCustomColors[0][t]
        ),
        document.getElementById("custom_colors_box").appendChild(e),
        19 == t &&
          (document.getElementById("custom_colors_add").style.display = "none");
    }
    28 == colorPickerComp.LSCustomColors[0].length &&
      (document.getElementById("custom_colors_add").style.display = "none");
  }
})(),
  (colorPickerComp.keyShortcuts = function (t) {
    for (let t in document.getElementsByTagName("INPUT"))
      if (
        !isNaN(t) &&
        document.getElementsByTagName("INPUT")[t] === document.activeElement
      )
        return;
    for (let t in document.getElementsByTagName("TEXTAREA"))
      if (
        !isNaN(t) &&
        document.getElementsByTagName("TEXTAREA")[t] === document.activeElement
      )
        return;
    switch (t.keyCode) {
      case 46:
        "custom_colors_preview" == document.activeElement.className &&
          colorPickerComp.clearSingleCustomColor(document.activeElement);
        break;
      case 27:
        colorPickerComp.pickerOpen && closePicker();
        break;
      case 9:
        let t = document.getElementsByClassName("remove_outline");
        for (; t.length > 0; )
          t[0].classList.add("add_outline"),
            t[0].classList.remove("remove_outline"),
            (t = document.getElementsByClassName("remove_outline"));
    }
  }),
  document.addEventListener(
    "keydown",
    colorPickerComp.keyShortcuts.bind(event)
  ),
  document.addEventListener("mousedown", function () {
    let t = document.getElementsByClassName("add_outline");
    for (; t.length > 0; )
      t[0].classList.add("remove_outline"),
        t[0].classList.remove("add_outline"),
        (t = document.getElementsByClassName("add_outline"));
  }),
  document.addEventListener("mousedown", function () {
    "color_context_menu" != event.target.id &&
      (document.getElementById("color_context_menu").style.display = "none");
  });
let closePicker = function () {
    (colorPickerComp.pickerOpen = !1),
      (document.getElementById("color_picker").style.display = "none"),
      "undefined" !=
        colorPickerComp.instance.element.getAttribute("data-color") &&
        updatePicker();
  },
  updatePicker = function () {
    colorPickerComp.colorChange({
      h: colorPickerComp.hue,
      s: colorPickerComp.saturation,
      l: colorPickerComp.lightness,
      a: colorPickerComp.alpha,
    });
  };
document.addEventListener("mousedown", function () {
  let t = event.target;
  if (colorPickerComp.pickerOpen)
    for (; t != document.getElementById("color_picker"); ) {
      if ("HTML" == t.tagName) {
        closePicker();
        break;
      }
      t = t.parentNode;
    }
}),
  document.addEventListener("scroll", function () {
    colorPickerComp.pickerOpen && closePicker();
  }),
  window.addEventListener("resize", function () {
    colorPickerComp.pickerOpen && closePicker();
  }),
  (colorPickerComp.colorChange = function (t, e) {
    "string" == typeof t && (t = colorPickerComp.hexAToRGBA(t, !0));
    const o = colorPickerComp.HSLAToRGBA(t.h, t.s, t.l, t.a),
      l = colorPickerComp.HSLAToRGBA(t.h, t.s, t.l, t.a, !0),
      c = new CustomEvent("colorChange", {
        detail: {
          color: {
            hsl: `hsla(${t.h}, ${t.s}%, ${t.l}%)`,
            rgb: `rgba(${o.r}, ${o.g}, ${o.b})`,
            hex: l,
            hsla: `hsla(${t.h}, ${t.s}%, ${t.l}%, ${t.a})`,
            rgba: `rgba(${o.r}, ${o.g}, ${o.b}, ${o.a})`,
            hexa: l,
          },
        },
      }),
      r = void 0 === e ? colorPickerComp.instance.element : e;
    r.setAttribute("data-color", l),
      (r.style.background = l),
      r.dispatchEvent(c);
  }),
  (colorPickerComp.HSLAToRGBA = function (t, e, o, l, c) {
    (e /= 100), (o /= 100);
    let r = (1 - Math.abs(2 * o - 1)) * e,
      n = r * (1 - Math.abs(((t / 60) % 2) - 1)),
      i = o - r / 2,
      s = 0,
      a = 0,
      u = 0;
    return (
      0 <= t && t < 60
        ? ((s = r), (a = n), (u = 0))
        : 60 <= t && t < 120
        ? ((s = n), (a = r), (u = 0))
        : 120 <= t && t < 180
        ? ((s = 0), (a = r), (u = n))
        : 180 <= t && t < 240
        ? ((s = 0), (a = n), (u = r))
        : 240 <= t && t < 300
        ? ((s = n), (a = 0), (u = r))
        : 300 <= t && t < 360 && ((s = r), (a = 0), (u = n)),
      (s = Math.round(255 * (s + i))),
      (a = Math.round(255 * (a + i))),
      (u = Math.round(255 * (u + i))),
      !0 === c
        ? colorPickerComp.RGBAToHexA(s, a, u, l)
        : { r: s, g: a, b: u, a: l }
    );
  }),
  (colorPickerComp.RGBAToHSLA = function (t, e, o, l) {
    (t /= 255), (e /= 255), (o /= 255), (l = null == l ? 1 : l);
    let c = Math.min(t, e, o),
      r = Math.max(t, e, o),
      n = r - c,
      i = 0,
      s = 0,
      a = 0;
    return (
      (i =
        0 == n
          ? 0
          : r == t
          ? ((e - o) / n) % 6
          : r == e
          ? (o - t) / n + 2
          : (t - e) / n + 4),
      (i = Math.round(60 * i)),
      i < 0 && (i += 360),
      (a = (r + c) / 2),
      (s = 0 == n ? 0 : n / (1 - Math.abs(2 * a - 1))),
      (s = +(100 * s).toFixed(1)),
      (a = +(100 * a).toFixed(1)),
      { h: i, s: s, l: a, a: l }
    );
  }),
  (colorPickerComp.RGBAToHexA = function (t, e, o, l) {
    return (
      (t = t.toString(16)),
      (e = e.toString(16)),
      (o = o.toString(16)),
      (l = Math.round(255 * l).toString(16)),
      1 == t.length && (t = "0" + t),
      1 == e.length && (e = "0" + e),
      1 == o.length && (o = "0" + o),
      1 == l.length && (l = "0" + l),
      "ff" == l ? "#" + t + e + o : "#" + t + e + o + l
    );
  }),
  (colorPickerComp.hexAToRGBA = function (t, e) {
    7 == t.length
      ? (t += "ff")
      : 4 == t.length && (t += t.substring(1, 4) + "ff");
    let o = 0,
      l = 0,
      c = 0,
      r = 1;
    return (
      5 == t.length
        ? ((o = "0x" + t[1] + t[1]),
          (l = "0x" + t[2] + t[2]),
          (c = "0x" + t[3] + t[3]),
          (r = "0x" + t[4] + t[4]))
        : 9 == t.length &&
          ((o = "0x" + t[1] + t[2]),
          (l = "0x" + t[3] + t[4]),
          (c = "0x" + t[5] + t[6]),
          (r = "0x" + t[7] + t[8])),
      (r = +(r / 255).toFixed(3)),
      !0 === e
        ? colorPickerComp.RGBAToHSLA(+o, +l, +c, r)
        : "rgba(" + +o + "," + +l + "," + +c + "," + r + ")"
    );
  }),
  (colorPickerComp.switchColorType = function () {
    if ("HEXA" == colorPickerComp.colorTypeStatus) {
      (colorPickerComp.colorTypeStatus = "RGBA"),
        (document.getElementById("hexa").style.display = "none"),
        (document.getElementById("rgba").style.display = "block");
      const t = colorPickerComp.HSLAToRGBA(
        colorPickerComp.hue,
        colorPickerComp.saturation,
        colorPickerComp.lightness,
        colorPickerComp.alpha
      );
      (document.getElementsByClassName("rgba_input")[0].value = t.r),
        (document.getElementsByClassName("rgba_input")[1].value = t.g),
        (document.getElementsByClassName("rgba_input")[2].value = t.b),
        (document.getElementsByClassName("rgba_input")[3].value = t.a);
    } else if ("RGBA" == colorPickerComp.colorTypeStatus)
      (colorPickerComp.colorTypeStatus = "HSLA"),
        (document.getElementById("rgba").style.display = "none"),
        (document.getElementById("hsla").style.display = "block"),
        (document.getElementsByClassName("hsla_input")[0].value =
          colorPickerComp.hue),
        (document.getElementsByClassName("hsla_input")[1].value =
          colorPickerComp.saturation),
        (document.getElementsByClassName("hsla_input")[2].value =
          colorPickerComp.lightness),
        (document.getElementsByClassName("hsla_input")[3].value =
          colorPickerComp.alpha);
    else if ("HSLA" == colorPickerComp.colorTypeStatus) {
      (colorPickerComp.colorTypeStatus = "HEXA"),
        (document.getElementById("hsla").style.display = "none"),
        (document.getElementById("hexa").style.display = "block");
      const t = colorPickerComp.HSLAToRGBA(
        colorPickerComp.hue,
        colorPickerComp.saturation,
        colorPickerComp.lightness,
        colorPickerComp.alpha,
        !0
      );
      document.getElementById("hex_input").value = t;
    }
  }),
  document
    .getElementById("switch_color_type")
    .addEventListener("click", function () {
      colorPickerComp.switchColorType();
    }),
  document.getElementById("hex_input").addEventListener("blur", function () {
    const t = this.value;
    t.match(/^#[0-9a-f]{3}([0-9a-f]{3})?([0-9a-f]{2})?$/) &&
      (colorPickerComp.updateColorDisplays(t), updatePicker());
  }),
  document.querySelectorAll(".rgba_input").forEach((t) => {
    t.addEventListener("change", function () {
      const t = document.querySelectorAll(".rgba_input");
      if (t[0].value > 255) throw "Value must be below 256";
      if (t[1].value > 255) throw "Value must be below 256";
      if (t[2].value > 255) throw "Value must be below 256";
      if (t[3].value > 1) throw "Value must be equal to or below 1";
      colorPickerComp.updateColorDisplays(
        `rgba(${t[0].value}, ${t[1].value}, ${t[2].value}, ${t[3].value})`
      ),
        updatePicker();
    });
  }),
  document.querySelectorAll(".hsla_input").forEach((t) => {
    t.addEventListener("change", function () {
      const t = document.querySelectorAll(".hsla_input");
      if (t[0].value > 359) throw "Value must be below 360";
      if (t[1].value > 100) throw "Value must be below 100";
      if (t[2].value > 100) throw "Value must be below 100";
      if (t[3].value > 1) throw "Value must be equal to or below 1";
      colorPickerComp.updateColorDisplays(
        `hsla(${t[0].value}, ${t[1].value}%, ${t[2].value}%, ${t[3].value})`
      ),
        updatePicker();
    });
  }),
  (colorPickerComp.getCustomColors = function () {
    return colorPickerComp.LSCustomColors();
  }),
  document
    .getElementById("custom_colors_box")
    .addEventListener("click", function (t) {
      if ("custom_colors_preview" == t.target.className) {
        const e = t.target.getAttribute("data-custom-color");
        colorPickerComp.updateColorDisplays(e), updatePicker();
      }
    }),
  (colorPickerComp.addCustomColor = function () {
    19 == colorPickerComp.LSCustomColors[0].length &&
      (document.getElementById("custom_colors_add").style.display = "none");
    const t = `hsla(${colorPickerComp.hue}, ${colorPickerComp.saturation}%, ${colorPickerComp.lightness}%, ${colorPickerComp.alpha})`;
    let e = document.createElement("BUTTON");
    (e.className = "custom_colors_preview"),
      (e.style.background = t),
      e.setAttribute("data-custom-color", t),
      document.getElementById("custom_colors_box").appendChild(e),
      colorPickerComp.LSCustomColors[0].unshift(t),
      localStorage.setItem(
        "custom_colors",
        JSON.stringify(colorPickerComp.LSCustomColors)
      );
  }),
  document
    .getElementById("custom_colors_add")
    .addEventListener("click", function () {
      colorPickerComp.addCustomColor();
    }),
  document
    .getElementById("custom_colors_box")
    .addEventListener("contextmenu", function (t) {
      if ("custom_colors_preview" == t.target.className) {
        t.preventDefault();
        const e = document.getElementById("color_context_menu");
        (e.style.display = "block"),
          (e.style.top = t.target.getBoundingClientRect().top + 25 + "px"),
          (e.style.left = t.target.getBoundingClientRect().left + "px"),
          (colorPickerComp.contextMenuElem = t.target);
      }
    }),
  (colorPickerComp.clearSingleCustomColor = function (t) {
    const e = void 0 === t ? colorPickerComp.contextMenuElem : t;
    document.getElementById("custom_colors_box").removeChild(e),
      (colorPickerComp.LSCustomColors = { 0: [] });
    for (let t in document.getElementsByClassName("custom_colors_preview"))
      !0 !== isNaN(t) &&
        colorPickerComp.LSCustomColors[0].push(
          document
            .getElementsByClassName("custom_colors_preview")
            [t].getAttribute("data-custom-color")
        );
    localStorage.setItem(
      "custom_colors",
      JSON.stringify(colorPickerComp.LSCustomColors)
    ),
      (document.getElementById("custom_colors_add").style.display =
        "inline-block");
  }),
  document
    .getElementById("color_clear_single")
    .addEventListener("mousedown", function () {
      colorPickerComp.clearSingleCustomColor();
    }),
  (colorPickerComp.clearAllCustomColors = function () {
    for (
      colorPickerComp.LSCustomColors = { 0: [] };
      document.getElementsByClassName("custom_colors_preview").length > 0;

    )
      document
        .getElementById("custom_colors_box")
        .removeChild(
          document.getElementsByClassName("custom_colors_preview")[0]
        );
    localStorage.setItem(
      "custom_colors",
      JSON.stringify(colorPickerComp.LSCustomColors)
    ),
      (document.getElementById("custom_colors_add").style.display =
        "inline-block");
  }),
  document
    .getElementById("color_clear_all")
    .addEventListener("mousedown", function () {
      colorPickerComp.clearAllCustomColors();
    }),
  (colorPickerComp.colorSliderHandler = function (t) {
    const e = document.getElementById("color_slider"),
      o = document.getElementById("color_slider_dragger");
    let l = t - e.getBoundingClientRect().left;
    l < 11 && (l = 11), l > 255 && (l = 255), (o.attributes.x.nodeValue = l);
    const c = ((l - 11) / 244) * 100,
      r = Math.round(359 - 3.59 * c);
    (colorPickerComp.hue = r),
      document
        .getElementById("saturation")
        .children[1].setAttribute(
          "stop-color",
          `hsla(${r}, 100%, 50%, ${colorPickerComp.alpha})`
        ),
      colorPickerComp.updateColorValueInput(),
      colorPickerComp.instance.element.setAttribute("data-color", "color"),
      updatePicker();
  }),
  document
    .getElementById("color_slider")
    .addEventListener("mousedown", function (t) {
      (colorPickerComp.sliderStatus = !0),
        colorPickerComp.colorSliderHandler(t.pageX);
    }),
  document.addEventListener("mousemove", function (t) {
    !0 === colorPickerComp.sliderStatus &&
      colorPickerComp.colorSliderHandler(t.pageX);
  }),
  document.addEventListener("mouseup", function () {
    !0 === colorPickerComp.sliderStatus && (colorPickerComp.sliderStatus = !1);
  }),
  document.getElementById("color_slider").addEventListener(
    "touchstart",
    function (t) {
      (colorPickerComp.sliderStatusTouch = !0),
        colorPickerComp.colorSliderHandler(t.changedTouches[0].clientX);
    },
    { passive: !0 }
  ),
  document.addEventListener(
    "touchmove",
    function () {
      !0 === colorPickerComp.sliderStatusTouch &&
        (event.preventDefault(),
        colorPickerComp.colorSliderHandler(event.changedTouches[0].clientX));
    },
    { passive: !1 }
  ),
  document.addEventListener("touchend", function () {
    !0 === colorPickerComp.sliderStatusTouch &&
      (colorPickerComp.sliderStatusTouch = !1);
  }),
  (colorPickerComp.opacitySliderHandler = function (t) {
    const e = document.getElementById("opacity_slider"),
      o = document.getElementById("opacity_slider_dragger");
    let l = t - e.getBoundingClientRect().left;
    l < 11 && (l = 11), l > 255 && (l = 255), (o.attributes.x.nodeValue = l);
    let c = 0.01 * (((l - 11) / 244) * 100);
    (c = Number(Math.round(c + "e2") + "e-2")),
      (colorPickerComp.alpha = c),
      colorPickerComp.updateColorValueInput(),
      colorPickerComp.instance.element.setAttribute("data-color", "color"),
      updatePicker();
  }),
  document
    .getElementById("opacity_slider")
    .addEventListener("mousedown", function (t) {
      (colorPickerComp.opacityStatus = !0),
        colorPickerComp.opacitySliderHandler(t.pageX);
    }),
  document.addEventListener("mousemove", function (t) {
    !0 === colorPickerComp.opacityStatus &&
      colorPickerComp.opacitySliderHandler(t.pageX);
  }),
  document.addEventListener("mouseup", function () {
    !0 === colorPickerComp.opacityStatus &&
      (colorPickerComp.opacityStatus = !1);
  }),
  document.getElementById("opacity_slider").addEventListener(
    "touchstart",
    function (t) {
      (colorPickerComp.opacityStatusTouch = !0),
        colorPickerComp.opacitySliderHandler(t.changedTouches[0].clientX);
    },
    { passive: !0 }
  ),
  document.addEventListener(
    "touchmove",
    function () {
      !0 === colorPickerComp.opacityStatusTouch &&
        (event.preventDefault(),
        colorPickerComp.opacitySliderHandler(event.changedTouches[0].clientX));
    },
    { passive: !1 }
  ),
  document.addEventListener("touchend", function () {
    !0 === colorPickerComp.opacityStatusTouch &&
      (colorPickerComp.opacityStatusTouch = !1);
  }),
  (colorPickerComp.colorBoxHandler = function (t, e, o) {
    const l = document.getElementById("color_box"),
      c = document.getElementById("box_dragger");
    let r = t - l.getBoundingClientRect().left,
      n =
        !0 === o
          ? e - l.getBoundingClientRect().top
          : e -
            l.getBoundingClientRect().top -
            document.getElementsByTagName("HTML")[0].scrollTop;
    r < 14 && (r = 14),
      r > 252 && (r = 252),
      n < 14 && (n = 14),
      n > 119 && (n = 119),
      (c.attributes.y.nodeValue = n),
      (c.attributes.x.nodeValue = r);
    const i = Math.round(((r - 15) / 238) * 100),
      s = 100 - i / 2,
      a = 100 - ((n - 15) / 105) * 100,
      u = Math.floor((a / 100) * s);
    (colorPickerComp.saturation = i),
      (colorPickerComp.lightness = u),
      colorPickerComp.updateColorValueInput(),
      colorPickerComp.instance.element.setAttribute("data-color", "color"),
      updatePicker();
  }),
  document
    .getElementById("color_box")
    .addEventListener("mousedown", function (t) {
      (colorPickerComp.boxStatus = !0),
        colorPickerComp.colorBoxHandler(t.pageX, t.pageY);
    }),
  document.addEventListener("mousemove", function (t) {
    !0 === colorPickerComp.boxStatus &&
      colorPickerComp.colorBoxHandler(t.pageX, t.pageY);
  }),
  document.addEventListener("mouseup", function (t) {
    !0 === colorPickerComp.boxStatus && (colorPickerComp.boxStatus = !1);
  }),
  document.getElementById("color_box").addEventListener(
    "touchstart",
    function (t) {
      (colorPickerComp.boxStatusTouch = !0),
        colorPickerComp.colorBoxHandler(
          t.changedTouches[0].clientX,
          t.changedTouches[0].clientY,
          !0
        );
    },
    { passive: !0 }
  ),
  document.addEventListener(
    "touchmove",
    function () {
      !0 === colorPickerComp.boxStatusTouch &&
        (event.preventDefault(),
        colorPickerComp.colorBoxHandler(
          event.changedTouches[0].clientX,
          event.changedTouches[0].clientY,
          !0
        ));
    },
    { passive: !1 }
  ),
  document.addEventListener("touchend", function () {
    !0 === colorPickerComp.boxStatusTouch &&
      (colorPickerComp.boxStatusTouch = !1);
  }),
  (colorPickerComp.updateColorDisplays = function (t) {
    if ("undefined" == t) t = { h: 0, s: 100, l: 50, a: 1 };
    else if ("#" == t.substring(0, 1)) t = colorPickerComp.hexAToRGBA(t, !0);
    else if ("r" == t.substring(0, 1)) {
      const e = t.match(/[.?\d]+/g);
      (e[3] = null == e[3] ? 1 : e[3]),
        (t = colorPickerComp.RGBAToHSLA(e[0], e[1], e[2], e[3]));
    } else {
      const e = t.match(/[.?\d]+/g);
      (e[3] = null == e[3] ? 1 : e[3]),
        (t = { h: e[0], s: e[1], l: e[2], a: e[3] });
    }
    (colorPickerComp.hue = t.h),
      (colorPickerComp.saturation = t.s),
      (colorPickerComp.lightness = t.l),
      (colorPickerComp.alpha = t.a),
      colorPickerComp.updateColorValueInput(),
      document
        .getElementById("saturation")
        .children[1].setAttribute("stop-color", `hsl(${t.h}, 100%, 50%)`);
    const e = document.getElementById("box_dragger");
    let o = 2.38 * t.s + 14;
    let l = 1.05 * (100 - (t.l / (100 - t.s / 2)) * 100) + 14;
    o < 14 && (o = 14),
      o > 252 && (o = 252),
      l < 14 && (l = 14),
      l > 119 && (l = 119),
      (e.attributes.x.nodeValue = o),
      (e.attributes.y.nodeValue = l);
    const c = document.getElementById("color_slider_dragger");
    let r = 2.44 * (100 - (t.h / 359) * 100) + 11;
    c.attributes.x.nodeValue = r;
    const n = document.getElementById("opacity_slider_dragger");
    let i = 100 * t.a * 2.44 + 11;
    n.attributes.x.nodeValue = i;
  }),
  (colorPickerComp.updateColorValueInput = function () {
    if ("HEXA" == colorPickerComp.colorTypeStatus) {
      const t = colorPickerComp.HSLAToRGBA(
        colorPickerComp.hue,
        colorPickerComp.saturation,
        colorPickerComp.lightness,
        colorPickerComp.alpha,
        !0
      );
      document.getElementById("hex_input").value = t;
    } else if ("RGBA" == colorPickerComp.colorTypeStatus) {
      const t = colorPickerComp.HSLAToRGBA(
        colorPickerComp.hue,
        colorPickerComp.saturation,
        colorPickerComp.lightness,
        colorPickerComp.alpha
      );
      (document.getElementsByClassName("rgba_input")[0].value = t.r),
        (document.getElementsByClassName("rgba_input")[1].value = t.g),
        (document.getElementsByClassName("rgba_input")[2].value = t.b),
        (document.getElementsByClassName("rgba_input")[3].value = t.a);
    } else
      (document.getElementsByClassName("hsla_input")[0].value =
        colorPickerComp.hue),
        (document.getElementsByClassName("hsla_input")[1].value =
          colorPickerComp.saturation),
        (document.getElementsByClassName("hsla_input")[2].value =
          colorPickerComp.lightness),
        (document.getElementsByClassName("hsla_input")[3].value =
          colorPickerComp.alpha);
  });
