type Tokens = {
	access_token: string
	access_token_expires_at: number
	refresh_token: string
	refresh_token_expires_at: number
}

export const ACCESS_TOKEN_LABEL = "access_token"
export const ACCESS_TOKEN_EXPIRES_AT_LABEL = "access_token_expires_at"
export const REFRESH_TOKEN_LABEL = "refresh_token"
export const REFRESH_TOKEN_EXPIRES_AT_LABEL = "refresh_token_expires_at"

export const saveTokens = <T extends Partial<Tokens>>(tokens: T) => {
	console.debug("saving", tokens)
	if (tokens.access_token) {
		sessionStorage.setItem(ACCESS_TOKEN_LABEL, tokens.access_token)
	}
	if (tokens.access_token_expires_at) {
		sessionStorage.setItem(
			ACCESS_TOKEN_EXPIRES_AT_LABEL,
			new Date(tokens.access_token_expires_at * 1000).toISOString(),
		)
	}

	if (tokens.refresh_token) {
		localStorage.setItem(REFRESH_TOKEN_LABEL, tokens.refresh_token)
	}
	if (tokens.refresh_token_expires_at) {
		localStorage.setItem(
			REFRESH_TOKEN_EXPIRES_AT_LABEL,
			new Date(tokens.refresh_token_expires_at * 1000).toISOString(),
		)
	}
	console.debug("saved", tokens)
}

export const getTokens = () => {
	const access_token = sessionStorage.getItem(ACCESS_TOKEN_LABEL)
	const access_token_expires_at =
		sessionStorage.getItem(ACCESS_TOKEN_EXPIRES_AT_LABEL) ||
		new Date().toISOString()
	const refresh_token = localStorage.getItem(REFRESH_TOKEN_LABEL)
	const refresh_token_expires_at =
		localStorage.getItem(REFRESH_TOKEN_EXPIRES_AT_LABEL) ||
		new Date().toISOString()

	return {
		access_token,
		access_token_expires_at: new Date(access_token_expires_at).getTime(),
		refresh_token,
		refresh_token_expires_at: new Date(refresh_token_expires_at).getTime(),
	}
}

export const clearTokens = () => {
	sessionStorage.removeItem(ACCESS_TOKEN_LABEL)
	sessionStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_LABEL)
	localStorage.removeItem(REFRESH_TOKEN_LABEL)
	localStorage.removeItem(REFRESH_TOKEN_EXPIRES_AT_LABEL)
}

export const refreshExpired = () => {
	const refresh = localStorage.getItem(REFRESH_TOKEN_LABEL)
	const exp = localStorage.getItem(REFRESH_TOKEN_EXPIRES_AT_LABEL)
	if (!exp || !refresh) return true
	if (Date.now() + 30 * 1000 > new Date(exp).getTime()) {
		return true
	}
	return false
}

export const accessExpired = () => {
	const t = sessionStorage.getItem(ACCESS_TOKEN_LABEL)
	const exp = sessionStorage.getItem(ACCESS_TOKEN_EXPIRES_AT_LABEL)
	if (!exp || !t) return true
	if (Date.now() + 50 * 1000 > new Date(exp).getTime()) {
		return true
	}
	return false
}
