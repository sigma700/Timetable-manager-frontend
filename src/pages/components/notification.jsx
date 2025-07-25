import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'react-feather';

const Notification = ({ message, type = 'info', duration = 5000, onClose }) => {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false);
			if (onClose) onClose();
		}, duration);

		return () => clearTimeout(timer);
	}, [duration, onClose]);

	if (!isVisible) return null;

	const icons = {
		success: <CheckCircle size={20} className="text-emerald-500" />,
		error: <XCircle size={20} className="text-rose-500" />,
		warning: <AlertCircle size={20} className="text-amber-500" />,
		info: <Info size={20} className="text-sky-500" />,
	};

	const colorClasses = {
		success: 'bg-emerald-50 border-emerald-500 text-emerald-700',
		error: 'bg-rose-50 border-rose-500 text-rose-700',
		warning: 'bg-amber-50 border-amber-500 text-amber-700',
		info: 'bg-sky-50 border-sky-500 text-sky-700',
	};

	return (
		<div className="fixed bottom-4 right-4 z-50 w-full max-w-xs sm:max-w-sm">
			<div
				className={`flex items-start p-4 rounded-lg border-l-4 shadow-lg transition-all duration-300 ${colorClasses[type]} animate-fade-in-up`}
				role="alert"
			>
				<div className="mr-3 mt-0.5 flex-shrink-0">{icons[type]}</div>
				<div className="flex-1">
					<p className="text-sm font-medium">{message}</p>
				</div>
				<button
					onClick={() => {
						setIsVisible(false);
						if (onClose) onClose();
					}}
					className="ml-3 text-gray-500 hover:text-gray-700 transition-colors"
					aria-label="Close notification"
				>
					<X size={18} />
				</button>
			</div>
		</div>
	);
};

export default Notification;
