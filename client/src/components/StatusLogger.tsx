import { useEffect, useState } from "react";
import { AlertCircle, X } from "lucide-react";

interface StatusLoggerProps {
	status: string | null;
}

export const StatusLogger = ({ status }: StatusLoggerProps) => {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const normalizedStatus = status?.toLowerCase() ?? "";
		const isError = normalizedStatus.includes("error") ||
			normalizedStatus.includes("denied") ||
			normalizedStatus.includes("failed") ||
			normalizedStatus.includes("already exists");

		setIsOpen(Boolean(status && isError));
	}, [status]);

	if (!status || !isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
			role="presentation"
			onClick={() => setIsOpen(false)}
		>
			<div
				role="alertdialog"
				aria-modal="true"
				aria-labelledby="status-dialog-title"
				className="w-full max-w-md rounded-xl border border-red-900/60 bg-slate-950 p-5 text-slate-100 shadow-2xl"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="flex items-start gap-3">
					<div className="flex-1">
						<h2 id="status-dialog-title" className="text-sm font-semibold">
							Something went wrong
						</h2>
						<p className="mt-2 text-sm text-slate-300">{status}</p>
					</div>
					<button
						type="button"
						title="Close error dialog"
						onClick={() => setIsOpen(false)}
						className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
					>
						<X className="h-4 w-4" aria-hidden="true" />
					</button>
				</div>
			</div>
		</div>
	);
};

