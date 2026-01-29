// Tasas de cambio (tu config)
const tasaCambioUSD = 0.0008403;
const tasaCambioRE = 0.004671;
const tasaCambioEUR = 0.0007209;

// Referencias DOM
const currencyOptions = document.querySelectorAll(
  "#currencyMenu .currency-option"
);
const precios = document.querySelectorAll(".cambio");
const currentFlag = document.getElementById("currentFlag");
const currentCode = document.getElementById("currentCode");

// Función para actualizar precios según moneda
function actualizarPrecios(moneda) {
  precios.forEach((precio) => {
    const valorOriginal = parseFloat(precio.dataset.precio);
    if (isNaN(valorOriginal)) return;

    let valorConvertido = valorOriginal;
    let simbolo = "AR$";

    if (moneda === "USD") {
      valorConvertido = valorOriginal * tasaCambioUSD;
      simbolo = "USD $";
    } else if (moneda === "R$") {
      valorConvertido = valorOriginal * tasaCambioRE;
      simbolo = "R$";
    } else if (moneda === "EU") {
      valorConvertido = valorOriginal * tasaCambioEUR;
      simbolo = "€";
    }

    precio.textContent = `${simbolo} ${valorConvertido.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  });

  // Actualizar total si existe
  const totalElemento = document.getElementById("total");
  if (totalElemento) {
    let totalOriginal = 0;
    precios.forEach((p) => {
      const v = parseFloat(p.dataset.precio);
      if (!isNaN(v)) totalOriginal += v;
    });

    let totalConvertido = totalOriginal;
    let simboloTotal = "AR$";

    if (moneda === "USD") {
      totalConvertido = totalOriginal * tasaCambioUSD;
      simboloTotal = "USD $";
    } else if (moneda === "R$") {
      totalConvertido = totalOriginal * tasaCambioRE;
      simboloTotal = "R$";
    } else if (moneda === "EU") {
      totalConvertido = totalOriginal * tasaCambioEUR;
      simboloTotal = "€";
    }

    totalElemento.textContent = `${simboloTotal} ${totalConvertido.toLocaleString(
      "es-AR",
      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    )}`;
  }
}

// Función para actualizar el botón del dropdown con moneda y bandera actuales
function actualizarBotonMoneda(moneda) {
  const option = Array.from(currencyOptions).find(
    (opt) => opt.dataset.code === moneda
  );
  if (!option) return;

  currentFlag.textContent = option.dataset.flag || "";
  currentCode.textContent = option.dataset.code || moneda;
}

// Al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const monedaGuardada = localStorage.getItem("moneda") || "AR$";
  actualizarPrecios(monedaGuardada);
  actualizarBotonMoneda(monedaGuardada);
});

// Al seleccionar una moneda del menú
currencyOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const moneda = option.dataset.code;
    localStorage.setItem("moneda", moneda);
    actualizarPrecios(moneda);
    actualizarBotonMoneda(moneda);
  });
});
