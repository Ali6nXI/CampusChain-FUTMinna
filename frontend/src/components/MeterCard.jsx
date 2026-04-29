export default function MeterCard({ title, value, unit, icon, color }) {
    return (
        <div className={`bg-gray-800 rounded-xl p-5 border border-gray-700 shadow-md`}>
            <div className="flex justify-between items-center mb-3">
                <span className="text-gray-400 text-sm font-medium">{title}</span>
                <span className="text-2xl">{icon}</span>
            </div>
            <div className="flex items-end gap-2">
                <span className={`text-3xl font-bold ${color}`}>{value}</span>
                <span className="text-gray-400 text-sm mb-1">{unit}</span>
            </div>
        </div>
    );
}