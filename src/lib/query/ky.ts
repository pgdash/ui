import ky from "ky"
// import { createClient } from "../client/client";
// import {
//   accessExpired,
//   clearTokens,
//   REFRESH_TOKEN_LABEL,
//   refreshExpired,
//   saveTokens,
// } from "./tokens";

export const apiclient = ky.extend({
	headers: {
		Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
	},

	retry: {
		limit: 1,
		afterStatusCodes: [401, 403, 408, 413, 429, 500, 502, 503, 504],
		statusCodes: [401, 403, 408, 413, 429, 500, 502, 503, 504],
		delay: (count) => {
			console.debug("retrying", count)
			const fib = (n: number): number => (n <= 1 ? n : fib(n - 1) + fib(n - 2))
			return fib(count + 1) * 1000
		},
		shouldRetry: ({ error: err, retryCount: c }) => {
			if (err?.message.toLowerCase().includes("failed to fetch")) {
				return false
			}
			console.debug("shouldRetry, count=", c, "error=", err)
			return true
		},
	},

	hooks: {
		// beforeRequest: [
		//   async (req) => {
		//     if (!accessExpired()) return;
		//     if (refreshExpired()) {
		//       console.log("refresh token has expired, logout");
		//       clearTokens();
		//       return;
		//     }
		//     console.log("token has expired");
		//     const refresh_token = localStorage.getItem(
		//       REFRESH_TOKEN_LABEL,
		//     ) as string;
		//     const res = await refresh({
		//       body: { refresh_token },
		//       client: createClient({ baseUrl: import.meta.env.VITE_API_URL }),
		//     });
		//     if (res?.data) {
		//       saveTokens(res.data);
		//       req.headers.set("Authorization", `Bearer ${res.data.access_token}`);
		//       await new Promise((resolve) => setTimeout(resolve, 100));
		//     }
		//     console.debug("before request hook finished");
		//   },
		// ],
		beforeRetry: [
			(state) => {
				console.log("beforeRetry", state.error)
			},
		],
		beforeError: [
			async (err, state) => {
				console.error("error: ", err, "state", state)
				return err
			},
		],
	},
})
