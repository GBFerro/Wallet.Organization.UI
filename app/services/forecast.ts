import { ForecastResponse, PeriodEnum } from "@constants/api";
import { ApiResponse, httpClient } from "@services/http-client";
import { logger } from "@utils/logger";

export async function fetchForecast(
	period: PeriodEnum,
): Promise<ApiResponse<ForecastResponse>> {
	const result = await httpClient.get<ForecastResponse>("/api/forecast", {
		requiresAuth: true,
		params: { period },
	});

	if (result.isSuccess) {
		logger.info(
			`[Forecast] ${result.data.projections.length} projections from ${result.data.startDate} to ${result.data.endDate}`,
		);
	}

	return result;
}
