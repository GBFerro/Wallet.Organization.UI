import { ForecastResponse, PeriodEnum } from "@constants/api";
import { ApiResponse, httpClient } from "@services/http-client";
import { logger } from "@utils/logger";

export async function fetchForecast(
	period: PeriodEnum,
): Promise<ApiResponse<ForecastResponse>> {
	const result = await httpClient.get<any>(`/api/forecast?Period=${period}`, {
		requiresAuth: true,
	});

	logger.info(`[Forecast] Found ${result.data.length} projections`);

	return result;
}
