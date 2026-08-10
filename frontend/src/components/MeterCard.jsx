export default function MeterCard({ title, value, unit, icon, accent = "text-gold" }) {
    return (
        <div className="glass glass-hover stat-card rounded-xl p-5">
            <div className="flex justify-between items-start mb-3">
                <span className="text-futm-300/75 text-xs font-medium uppercase tracking-wider">
                    {title}
                </span>
                <span className="text-futm-400/60">{icon}</span>
            </div>
            <div className="flex items-end gap-2">
                <span className={`text-3xl font-extrabold tabular-nums ${accent}`}>{value}</span>
                <span className="text-futm-300/60 text-xs mb-1.5">{unit}</span>
            </div>
        </div>
    );
}

/** Per-building live telemetry tile. */
export function BuildingMeter({ reading }) {
    const rows = [
        ["Voltage", `${reading.voltage} V`, ""],
        ["Current", `${reading.current} A`, ""],
        ["Power", `${reading.power} W`, "text-emerald-300"],
        ["Energy", `${reading.energy_kwh} kWh`, ""],
        ["Surplus", `${reading.surplus} Wh`, "text-gold"],
    ];
    return (
        <div className="glass glass-hover rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-white">{reading.building}</h3>
                <span className="pulse-dot" />
            </div>
            <div className="space-y-1.5">
                {rows.map(([k, v, cls]) => (
                    <div key={k} className="flex justify-between text-xs">
                        <span className="text-futm-300/60">{k}</span>
                        <span className={`tabular-nums font-medium ${cls || "text-futm-100"}`}>{v}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/** Simple SVG icons — no extra dependency. */
export const Icons = {
    coin: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" /><path d="M12 7v10M9.5 9.5h5M9.5 14.5h5" strokeLinecap="round" />
        </svg>
    ),
    bolt: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
            <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8z" />
        </svg>
    ),
    check: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
        </svg>
    ),
    chart: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
        </svg>
    ),
};
