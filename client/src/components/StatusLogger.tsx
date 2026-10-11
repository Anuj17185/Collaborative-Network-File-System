import { AlertCircle, CheckCircle2, Info } from "lucide-react";

interface StatusLoggerProps {
	status: string | null;
}

export const StatusLogger = ({ status }: StatusLoggerProps) => {
	if (!status) return null;

	const normalizedStatus = status.toLowerCase();
	const isError = normalizedStatus.includes("error") ||
		normalizedStatus.includes("denied");
	const Icon = isError
		? AlertCircle
		: normalizedStatus.includes("released")
			? CheckCircle2
			: Info;

	return (
		<div
			role="status"
			className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
				isError
					? "border-red-900/60 bg-red-950/40 text-red-300"
					: "border-slate-700 bg-slate-900 text-slate-300"
			}`}
		>
			<Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
			<span>{status}</span>
		</div>
	);
};

