// frontend/src/components/RateLimiterComparison.js
import { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const RateLimiterComparison = () => {
	const [responses, setResponses] = useState({ safe: [], unsafe: [] });
	const [loading, setLoading] = useState({ safe: false, unsafe: false });
	const [numRequests, setNumRequests] = useState(10);
	const [error, setError] = useState(null);

	const getStatusIcon = (status) => {
		if (status === 200)
			return <CheckCircle className="w-5 h-5 text-green-500" />;
		if (status === 429)
			return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
		return <XCircle className="w-5 h-5 text-red-500" />;
	};

	const getStatusColor = (status) => {
		if (status === 200) return 'border-green-500';
		if (status === 429) return 'border-yellow-500';
		return 'border-red-500';
	};

	const sendRequests = async (type) => {
		if (numRequests < 1 || numRequests > 100) {
			setError('Please enter a number between 1 and 100');
			return;
		}

		setLoading((prev) => ({ ...prev, [type]: true }));
		setError(null);

		try {
			const startTime = performance.now();
			const requestArray = Array.from({ length: numRequests }, (_, i) => i);

			const promises = requestArray.map(async (_, index) => {
				try {
					const response = await fetch(
						`${import.meta.env.VITE_API_URL}/api/data/${type}`,
						{
							method: 'GET',
							headers: {
								'Content-Type': 'application/json',
							},
						}
					);

					const data = await response.json();
					return {
						id: index + 1,
						status: response.status,
						message: data.message,
						limit: response.headers.get('X-RateLimit-Limit'),
						remaining: response.headers.get('X-RateLimit-Remaining'),
						retryAfter: response.headers.get('X-RateLimit-Retry-After'),
						timestamp: performance.now() - startTime,
					};
				} catch (error) {
					console.log(error);

					return {
						id: index + 1,
						status: 500,
						message: 'Failed to fetch data',
						limit: null,
						remaining: null,
						retryAfter: null,
						timestamp: performance.now() - startTime,
					};
				}
			});

			const results = await Promise.all(promises);
			setResponses((prev) => ({
				...prev,
				[type]: results.sort((a, b) => a.timestamp - b.timestamp),
			}));
		} catch (err) {
			console.log(err);

			setError('Failed to send requests. Please try again.');
		} finally {
			setLoading((prev) => ({ ...prev, [type]: false }));
		}
	};

	const getSuccessRate = (responses) => {
		if (!responses.length) return 0;
		return (
			((responses.filter((r) => r.status === 200).length / responses.length) *
				100
			).toFixed(1)
		);
	};

	const getTotalTime = (responses) => {
		if (!responses.length) return 0;
		return (responses[responses.length - 1]?.timestamp / 1000).toFixed(2);
	};

	return (
		<div className="container mx-auto px-6">
			<div className="bg-gray-800 rounded-2xl shadow-xl p-8 -mt-20">
				<h2 className="text-3xl font-bold text-white mb-6 text-center">
					Rate Limiter Test Bench
				</h2>

				<div className="mb-8">
					<div className="flex flex-col md:flex-row md:items-end gap-6">
						<div className="flex-1">
							<label className="block text-sm font-medium text-gray-200 mb-2">
								Number of Concurrent Requests
							</label>
							<input
								type="number"
								min="1"
								max="100"
								value={numRequests}
								onChange={(e) => setNumRequests(Number(e.target.value))}
								className="w-full px-4 py-3 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
								placeholder="Enter a number between 1 and 100"
							/>
						</div>
						<div className="flex gap-4">
							<button
								onClick={() => sendRequests('unsafe')}
								disabled={loading.unsafe}
								className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all"
							>
								{loading.unsafe ? 'Testing Unsafe...' : 'Test Unsafe'}
							</button>
							<button
								onClick={() => sendRequests('safe')}
								disabled={loading.safe}
								className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all"
							>
								{loading.safe ? 'Testing Safe...' : 'Test Safe'}
							</button>
						</div>
					</div>

					{error && (
						<div className="mt-4 p-4 bg-red-700 border border-red-800 rounded-md">
							<p className="text-red-100">{error}</p>
						</div>
					)}
				</div>

				<div className="grid lg:grid-cols-2 gap-8">
					{/* Unsafe Version Results */}
					<div className="bg-gray-700 rounded-lg p-6">
						<h3 className="text-xl font-semibold mb-4 text-red-400 text-center">
							Unsafe Rate Limiter Results
						</h3>
						{responses.unsafe.length > 0 && (
							<div>
								<div className="flex justify-between mb-6">
									<div>
										<h4 className="text-sm font-medium text-gray-300">
											Success Rate
										</h4>
										<p className="text-2xl font-bold text-white">
											{getSuccessRate(responses.unsafe)}%
										</p>
									</div>
									<div>
										<h4 className="text-sm font-medium text-gray-300">
											Total Time
										</h4>
										<p className="text-2xl font-bold text-white">
											{getTotalTime(responses.unsafe)}s
										</p>
									</div>
								</div>
								<div className="space-y-3 max-h-96 overflow-y-auto pr-2">
									{responses.unsafe.map((response) => (
										<div
											key={response.id}
											className={`p-4 border-l-4 ${getStatusColor(
												response.status
											)} bg-gray-800 rounded-md shadow-sm`}
										>
											<div className="flex items-center mb-2">
												{getStatusIcon(response.status)}
												<span className="ml-2 font-medium text-gray-100">
													Request #{response.id}
												</span>
												<span className="ml-auto text-xs text-gray-400">
													{(response.timestamp / 1000).toFixed(2)}s
												</span>
											</div>
											<div className="text-sm text-gray-300">
												<p>Status: {response.status}</p>
												<p>Remaining: {response.remaining || 'N/A'}</p>
												{response.retryAfter && (
													<p>Retry After: {response.retryAfter}s</p>
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Safe Version Results */}
					<div className="bg-gray-700 rounded-lg p-6">
						<h3 className="text-xl font-semibold mb-4 text-green-400 text-center">
							Safe Rate Limiter Results
						</h3>
						{responses.safe.length > 0 && (
							<div>
								<div className="flex justify-between mb-6">
									<div>
										<h4 className="text-sm font-medium text-gray-300">
											Success Rate
										</h4>
										<p className="text-2xl font-bold text-white">
											{getSuccessRate(responses.safe)}%
										</p>
									</div>
									<div>
										<h4 className="text-sm font-medium text-gray-300">
											Total Time
										</h4>
										<p className="text-2xl font-bold text-white">
											{getTotalTime(responses.safe)}s
										</p>
									</div>
								</div>
								<div className="space-y-3 max-h-96 overflow-y-auto pr-2">
									{responses.safe.map((response) => (
										<div
											key={response.id}
											className={`p-4 border-l-4 ${getStatusColor(
												response.status
											)} bg-gray-800 rounded-md shadow-sm`}
										>
											<div className="flex items-center mb-2">
												{getStatusIcon(response.status)}
												<span className="ml-2 font-medium text-gray-100">
													Request #{response.id}
												</span>
												<span className="ml-auto text-xs text-gray-400">
													{(response.timestamp / 1000).toFixed(2)}s
												</span>
											</div>
											<div className="text-sm text-gray-300">
												<p>Status: {response.status}</p>
												<p>Remaining: {response.remaining || 'N/A'}</p>
												{response.retryAfter && (
													<p>Retry After: {response.retryAfter}s</p>
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default RateLimiterComparison;