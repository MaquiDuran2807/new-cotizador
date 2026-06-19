import { j as jsxRuntimeExports } from './jsx-runtime-AgFCCyoZ.js';
import { P as PropTypes } from './index-Bj4csNK1.js';
import { r as reactExports } from './index-CHSTDiNz.js';
import PdfDownloadButton from './PdfDownloadButton-CQK-RrFb.js';

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatNumber(value) {
  return new Intl.NumberFormat('es', {
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function QuoteItem({ item, onRemove }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface-2 border-[1.5px] border-border-2 rounded-xl p-3 text-xs relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5 pr-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-text text-sm leading-tight block", children: item.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => onRemove(item.product_id),
          className: "absolute top-2 right-2 text-[#DC2626] opacity-50 hover:opacity-100 cursor-pointer bg-transparent border-none transition-opacity duration-[0.22s] p-0.5",
          title: "Eliminar",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[0.6rem] font-bold text-text-3 uppercase tracking-wider", children: "Precio U." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-num font-bold text-text", children: [
          "$",
          formatNumber(item.price)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[0.6rem] font-bold text-text-3 uppercase tracking-wider", children: "Cantidad" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-num font-bold text-text", children: item.amount })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[0.6rem] font-bold text-text-3 uppercase tracking-wider", children: "Horas" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-num font-bold text-text", children: [
          item.hours,
          "h"
        ] })
      ] })
    ] }),
    item.consumption_hr != null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-1 mt-2 pt-2 border-t border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[0.6rem] font-bold text-text-3 uppercase tracking-wider", children: "Cons/h" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-num font-bold text-text text-[0.7rem]", children: [
          formatNumber(item.consumption_hr),
          " W"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[0.6rem] font-bold text-text-3 uppercase tracking-wider", children: "Cons/día" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-num font-bold text-text text-[0.7rem]", children: [
          formatNumber(item.consumption_day),
          " W"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[0.6rem] font-bold text-text-3 uppercase tracking-wider", children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-num font-bold text-text text-[0.7rem]", children: [
          formatNumber(item.total_consumption),
          " W"
        ] })
      ] })
    ] })
  ] });
}
QuoteItem.propTypes = {
  item: PropTypes.shape({
    product_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number,
    amount: PropTypes.number.isRequired,
    hours: PropTypes.number,
    consumption_hr: PropTypes.number,
    consumption_day: PropTypes.number,
    total_consumption: PropTypes.number
  }).isRequired,
  onRemove: PropTypes.func.isRequired
};

const CATEGORIZED = [
  { key: "regulator_needed", label: "🔌 Reguladores" },
  { key: "panel_needed", label: "☀️ Paneles" },
  { key: "battery_needed", label: "🔋 Baterías" },
  { key: "breaker_needed", label: "⚡ Breakers" }
];
const OTHER_REQUIREMENTS = [
  "rubberized_cable_needed",
  "panel_support_needed",
  "centralized_modules_needed",
  "power_units_needed",
  "terminals_needed",
  "connector_needed",
  "vehicle_cable_needed",
  "electric_materials_needed",
  "ground_security_kit_needed",
  "rack_bateria",
  "inversor"
];
const OTHER_LABELS = {
  rubberized_cable_needed: "Cables",
  panel_support_needed: "Soporte techo",
  centralized_modules_needed: "Módulo Central",
  power_units_needed: "Unidad Potencia",
  terminals_needed: "Term. MC4",
  connector_needed: "Conect. Y",
  vehicle_cable_needed: "Cable Vehic.",
  electric_materials_needed: "Mat. Eléctricos",
  ground_security_kit_needed: "Kit Tierra",
  rack_bateria: "Rack Bat.",
  inversor: "Inversores"
};
function ReqSection({ title, requirement, reqKey, onRemove, onAdd, removed }) {
  const [open, setOpen] = reactExports.useState(false);
  if (!requirement) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-[1.5px] border-border-2 rounded-xl overflow-hidden mb-2 mx-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setOpen(!open),
        className: `w-full bg-surface-2 border-none px-4 py-3 font-display font-semibold text-xs text-text cursor-pointer text-left flex items-center justify-between transition-colors duration-[0.22s] hover:bg-green-light hover:text-green-dark ${open ? "bg-green-light text-green-dark" : ""}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center gap-1.5", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: `w-3 h-3 text-text-3 transition-transform duration-[0.22s] ${open ? "rotate-180 text-green-dark" : ""}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-surface px-4 pb-3 pt-2.5", style: { animation: "fadeIn 0.18s ease" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1.8fr_2fr_1.8fr_0.6fr] gap-1.5 items-start py-1.5 text-[0.75rem] border-t border-border-2 first:border-t-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[0.6rem] font-bold text-text-3 uppercase tracking-wider mb-0.5", children: "Cant." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-text", children: requirement.amount || 0 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[0.6rem] font-bold text-text-3 uppercase tracking-wider mb-0.5", children: "Tipo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-text", children: requirement.name || "-" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[0.6rem] font-bold text-text-3 uppercase tracking-wider mb-0.5", children: "P/Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-num font-bold text-green-dark", children: [
          "$",
          formatNumber((requirement.price || 0) * (requirement.amount || 0))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-center pt-4", children: removed ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onAdd(reqKey), className: "text-green cursor-pointer bg-transparent border-none text-sm opacity-70 hover:opacity-100 transition-opacity", title: "Reagregar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onRemove(reqKey), className: "text-[#DC2626] cursor-pointer bg-transparent border-none text-sm opacity-50 hover:opacity-100 transition-opacity", title: "Eliminar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }) })
    ] }) })
  ] });
}
ReqSection.propTypes = {
  title: PropTypes.string.isRequired,
  requirement: PropTypes.object,
  reqKey: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  removed: PropTypes.bool
};
function RequirementsPanel({ requirements, removedRequirements, onRemoveRequirement, onAddRequirement }) {
  if (!requirements) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2", children: [
    CATEGORIZED.map(({ key, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReqSection,
      {
        title: label,
        requirement: requirements[key],
        reqKey: key,
        onRemove: onRemoveRequirement,
        onAdd: onAddRequirement,
        removed: removedRequirements?.includes(key)
      },
      key
    )),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-[1.5px] border-border-2 rounded-xl overflow-hidden mb-2 mx-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "group", open: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("summary", { className: "w-full bg-surface-2 border-none px-4 py-3 font-display font-semibold text-xs text-text cursor-pointer text-left flex items-center justify-between hover:bg-green-light hover:text-green-dark transition-colors duration-[0.22s] list-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center gap-1.5", children: "🛠️ Otros requerimientos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-3 h-3 text-text-3 transition-transform duration-[0.22s] group-open:rotate-180", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-surface px-4 pb-3 pt-2.5", children: OTHER_REQUIREMENTS.map((key) => {
        const req = requirements[key];
        if (!req) return null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1.8fr_2fr_1.8fr_0.6fr] gap-1.5 items-start py-1.5 text-[0.75rem] border-t border-border-2 first:border-t-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[0.6rem] font-bold text-text-3 uppercase tracking-wider mb-0.5", children: OTHER_LABELS[key] || key }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-text", children: req.amount || 0 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[0.6rem] font-bold text-text-3 uppercase tracking-wider mb-0.5", children: "Tipo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-text", children: req.name || "-" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[0.6rem] font-bold text-text-3 uppercase tracking-wider mb-0.5", children: "P/Unit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-num text-text", children: [
              "$",
              formatNumber(req.price || 0)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-center pt-4", children: removedRequirements?.includes(key) ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onAddRequirement(key), className: "text-green cursor-pointer bg-transparent border-none text-sm opacity-70 hover:opacity-100", title: "Reagregar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onRemoveRequirement(key), className: "text-[#DC2626] cursor-pointer bg-transparent border-none text-sm opacity-50 hover:opacity-100", title: "Eliminar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }) })
        ] }, key);
      }) })
    ] }) })
  ] });
}
RequirementsPanel.propTypes = {
  requirements: PropTypes.object,
  removedRequirements: PropTypes.arrayOf(PropTypes.string),
  onRemoveRequirement: PropTypes.func.isRequired,
  onAddRequirement: PropTypes.func.isRequired
};

function Spinner() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 border-2 border-border border-t-green rounded-full animate-spin" }) });
}

function computeConsumptionTotals(consumptions) {
  if (!consumptions || consumptions.length === 0) return null;
  let totalHr = 0, totalDay = 0, totalLoss = 0, totalFinal = 0;
  consumptions.forEach((c) => {
    totalHr += c.consumption_hr || 0;
    totalDay += c.consumption_day || 0;
    totalLoss += c.loss_consumption || 0;
    totalFinal += c.total_consumption_day || 0;
  });
  return { totalHr, totalDay, totalLoss, totalFinal };
}
function CotizadorPanel({
  calculation,
  quoteItems,
  onRemoveRequirement,
  onAddRequirement,
  onReset,
  user,
  onRemoveItem,
  onSendPDF,
  removedRequirements,
  expanded,
  onExpand
}) {
  const totalNormal = (calculation?.total_final_basic || 0) + (calculation?.total_precios || 0);
  const totalPremium = (calculation?.total_final_premiun || 0) + (calculation?.total_precios || 0);
  const loading = calculation === null;
  const consTotals = computeConsumptionTotals(calculation?.consumptions);
  const panelProd = calculation?.panel_needed?.production;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full lg:w-[440px] flex-shrink-0 sticky top-[74px] max-h-[calc(100vh-90px)] overflow-y-auto bg-surface border-[1.5px] border-border rounded-2xl shadow-[0_4px_20px_rgba(13,27,9,0.10)] overflow-x-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 lg:p-6 border-b-[1.5px] border-border-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[0.6rem] lg:text-[0.68rem] font-bold text-green-dark tracking-widest uppercase flex items-center gap-1.5 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-3 h-3 lg:w-3.5 lg:h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" }) }),
          "Cotizador inteligente"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => onExpand(true),
            className: "w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-surface-2 border-[1.5px] border-border flex items-center justify-center cursor-pointer hover:bg-green hover:border-green hover:text-white transition-all duration-[0.22s] group",
            title: "Ampliar cotizador",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-3 h-3 lg:w-4 lg:h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" }) })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-num text-base lg:text-xl font-extrabold text-ink tracking-tight", children: "Tu presupuesto solar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[0.65rem] lg:text-xs text-text-3 mt-1", children: "Agrega productos para obtener tu cotización al instante" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-[1px] bg-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface p-1.5 lg:p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[0.55rem] lg:text-[0.68rem] font-semibold text-text-3 uppercase tracking-wider flex items-center gap-1.5 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-2.5 h-2.5 lg:w-3.5 lg:h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }),
          "Precio Normal"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-num text-base lg:text-2xl font-extrabold text-green-dark tracking-tight leading-tight", children: loading ? "..." : formatCurrency(totalNormal) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[0.5rem] lg:text-[0.62rem] text-text-3 italic", children: "Con módulo centralizado" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface p-1.5 lg:p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[0.55rem] lg:text-[0.68rem] font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-1", style: { color: "#7C3AED", opacity: 0.8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-2.5 h-2.5 lg:w-3.5 lg:h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" }) }),
          "Precio Premium"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-num text-base lg:text-2xl font-extrabold tracking-tight leading-tight", style: { color: "#7C3AED" }, children: loading ? "..." : formatCurrency(totalPremium) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[0.5rem] lg:text-[0.62rem] text-text-3 italic", children: "Con unidad de potencia" })
      ] })
    ] }),
    consTotals && !loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b-[1.5px] border-border-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 lg:p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[0.6rem] lg:text-[0.68rem] font-semibold text-text-3 uppercase tracking-wider mb-2 flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-2.5 h-2.5 lg:w-3.5 lg:h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }),
        "Resumen de consumo"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-text-3 text-[0.65rem] lg:text-xs", children: "Consumo diario" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-num font-bold text-ink text-[0.65rem] lg:text-xs", children: [
            formatNumber(consTotals.totalDay),
            " Wh/día"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-text-3 text-[0.65rem] lg:text-xs", children: [
            "Pérdidas (",
            calculation?.consumptions?.[0]?.loss_percentaje || 0,
            "%)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-num font-bold text-ink text-[0.65rem] lg:text-xs", children: [
            formatNumber(consTotals.totalLoss),
            " Wh/día"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-text-3 text-[0.65rem] lg:text-xs", children: "Total requerido" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-num font-bold text-green-dark text-[0.65rem] lg:text-xs", children: [
            formatNumber(consTotals.totalFinal),
            " Wh/día"
          ] })
        ] }),
        panelProd && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t-[1.5px] border-border-2 my-1.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-text-3 text-[0.65rem] lg:text-xs", children: [
              "Generación panel (",
              calculation?.panel_needed?.name,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-num font-bold text-premium text-[0.65rem] lg:text-xs", children: [
              formatNumber(panelProd.total_production_day),
              " Wh/día"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-text-3 text-[0.65rem] lg:text-xs", children: "Cantidad de paneles" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-num font-bold text-ink text-[0.65rem] lg:text-xs", children: [
              calculation?.panel_needed?.amount,
              " UND"
            ] })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 p-2 lg:p-5 border-b-[1.5px] border-border-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "flex-1 bg-surface-2 border-[1.5px] border-border rounded-lg px-2 py-1.5 lg:px-3 lg:py-2 font-display text-[0.7rem] lg:text-xs text-text outline-none transition-colors duration-[0.22s] focus:border-green cursor-pointer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "¿Dónde te encuentras?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "1", children: "Cundinamarca" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2", children: "Boyacá" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "3", children: "Resto del país" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: onReset,
          className: "bg-[#FEF2F2] border-[1.5px] border-[#FCA5A5] text-[#DC2626] font-display font-bold text-[0.7rem] lg:text-xs rounded-lg px-2 py-1.5 lg:px-3 lg:py-2 cursor-pointer whitespace-nowrap transition-all duration-[0.22s] hover:bg-[#FEE2E2] hover:border-[#F87171]",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-3 h-3 inline mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }) }),
            "Reiniciar"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 lg:p-5 flex flex-col gap-2 min-h-[80px]", children: [
      loading && /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}),
      !loading && quoteItems.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-4 text-text-3 text-[0.7rem]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6 mx-auto mb-1 text-green-mid", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" }) }),
        "Aún no has agregado productos.",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "Selecciona uno para comenzar."
      ] }),
      !loading && quoteItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(QuoteItem, { item, onRemove: onRemoveItem, compact: true }, item.product_id))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      RequirementsPanel,
      {
        requirements: calculation,
        removedRequirements,
        onRemoveRequirement,
        onAddRequirement,
        compact: true
      }
    ),
    user && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 lg:p-5 pt-2 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PdfDownloadButton, { onClick: () => onSendPDF(user), compact: true }) })
  ] });
}
CotizadorPanel.propTypes = {
  calculation: PropTypes.object,
  quoteItems: PropTypes.array.isRequired,
  onRemoveRequirement: PropTypes.func.isRequired,
  onAddRequirement: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    lastname: PropTypes.string
  }),
  onSendPDF: PropTypes.func.isRequired,
  removedRequirements: PropTypes.arrayOf(PropTypes.string),
  expanded: PropTypes.bool,
  onExpand: PropTypes.func
};

export { CotizadorPanel as default };
//# sourceMappingURL=CotizadorPanel-COPkxs8R.js.map
