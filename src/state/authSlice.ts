import { createSlice } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import { createAppAsyncThunk } from "./hooks";
import type { Account } from "../types";
import {
  authorizeUrl,
  createRequestToken,
  createSession,
  deleteSession,
  getAccount,
  isValidToken,
} from "../api/auth";
import { clearWatchlist } from "./watchlistSlice";
import { local, session } from "../utils/storage";

const SESSION_KEY = "tmdb_session";
const PENDING_TOKEN_KEY = "tmdb_pending_token";
const RETURN_TO_KEY = "tmdb_return_to";

// Only same-site paths are allowed after sign-in, never another origin.
const safeReturnPath = (path: string | null | undefined): string =>
  typeof path === "string" && path.startsWith("/") && !path.startsWith("//") ? path : "/";

const storedSession = local.get(SESSION_KEY);
const initialSession = isValidToken(storedSession) ? storedSession : null;

export const startSignIn = createAppAsyncThunk("auth/start", async (returnTo: string) => {
  const token = await createRequestToken();
  // Remember which token we asked for, so the callback can reject a token
  // that someone else started (login CSRF).
  session.set(PENDING_TOKEN_KEY, token);
  session.set(RETURN_TO_KEY, safeReturnPath(returnTo));
  window.location.assign(authorizeUrl(token, `${window.location.origin}/auth/callback`));
});

export const completeSignIn = createAppAsyncThunk(
  "auth/complete",
  async ({ requestToken, approved }: { requestToken: string | null; approved: boolean }) => {
    const pending = session.get(PENDING_TOKEN_KEY);
    const returnTo = safeReturnPath(session.get(RETURN_TO_KEY));
    session.set(PENDING_TOKEN_KEY, null);
    session.set(RETURN_TO_KEY, null);

    if (!approved) throw new Error("cancelled");
    if (!pending || pending !== requestToken) throw new Error("token mismatch");

    const sessionId = await createSession(requestToken);
    const account = await getAccount(sessionId);
    local.set(SESSION_KEY, sessionId);
    return { sessionId, account, returnTo };
  },
  {
    condition: (_, { getState }) =>
      !["completing", "signedIn"].includes(getState().auth.status),
  }
);

export const restoreSession = createAppAsyncThunk(
  "auth/restore",
  async (_: void, { getState }) => {
    const { sessionId } = getState().auth;
    try {
      return { account: await getAccount(sessionId) };
    } catch (error) {
      // An expired or revoked session is forgotten; a network error keeps it
      // so the next visit can try again.
      if (isAxiosError(error) && error.response?.status === 401) local.set(SESSION_KEY, null);
      throw error;
    }
  },
  { condition: (_, { getState }) => getState().auth.status === "restoring" }
);

export const signOut = createAppAsyncThunk("auth/signOut", async (_: void, { getState, dispatch }) => {
  const { sessionId } = getState().auth;
  local.set(SESSION_KEY, null);
  // The watchlist belongs to the account, so it isn't left behind on this device.
  dispatch(clearWatchlist());
  try {
    await deleteSession(sessionId);
  } catch {
    // The session is already forgotten locally; nothing else to do.
  }
});

export type AuthStatus =
  | "signedOut"
  | "restoring"
  | "checking"
  | "redirecting"
  | "completing"
  | "signedIn";

export interface AuthState {
  status: AuthStatus;
  sessionId: string | null;
  account: Account | null;
  error: "failed" | "cancelled" | null;
}

const initialState: AuthState = {
  status: initialSession ? "restoring" : "signedOut",
  sessionId: initialSession,
  account: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(startSignIn.pending, (state) => {
        state.status = "redirecting";
        state.error = null;
      })
      .addCase(startSignIn.rejected, (state) => {
        state.status = "signedOut";
        state.error = "failed";
      })
      .addCase(completeSignIn.pending, (state) => {
        state.status = "completing";
        state.error = null;
      })
      .addCase(completeSignIn.fulfilled, (state, { payload }) => {
        state.status = "signedIn";
        state.sessionId = payload.sessionId;
        state.account = payload.account;
      })
      .addCase(completeSignIn.rejected, (state, { error, meta }) => {
        if (meta.condition) return;
        state.status = "signedOut";
        state.error = error.message === "cancelled" ? "cancelled" : "failed";
      })
      .addCase(restoreSession.pending, (state) => {
        state.status = "checking";
      })
      .addCase(restoreSession.fulfilled, (state, { payload }) => {
        state.status = "signedIn";
        state.account = payload.account;
      })
      .addCase(restoreSession.rejected, (state, { meta }) => {
        if (meta.condition) return;
        state.status = "signedOut";
        state.sessionId = null;
      })
      .addCase(signOut.pending, (state) => {
        state.status = "signedOut";
        state.sessionId = null;
        state.account = null;
      });
  },
});

export default authSlice.reducer;
