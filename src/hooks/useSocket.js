import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const initialRoundState = {
  connected: false,
  joined: false,
  gameState: "WAITING",
  multiplier: 1,
  roundId: null,
  crashAt: null,
  history: [],
  activeBet: null,
  pendingBet: false,
  cashoutPending: false,
  lastBetResult: null,
  message: "",
};

export function useSocket() {
  const { syncUser, token, updateWallet } = useAuth();
  const socketRef = useRef(null);
  const [state, setState] = useState(initialRoundState);

 
  useEffect(() => {
    if (!token && socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setState(initialRoundState);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return undefined;

    const nextSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socketRef.current = nextSocket;

    nextSocket.on("connect", () => {
      setState((current) => ({
        ...current,
        connected: true,
        message: "",
      }));
    });

    nextSocket.on("disconnect", () => {
      setState((current) => ({
        ...current,
        connected: false,
        joined: false,
        gameState: "WAITING",
      }));
    });

    nextSocket.on("connect_error", (error) => {
      setState((current) => ({
        ...current,
        message: error.message || "Socket connection failed",
      }));
    });

    nextSocket.on("joined", ({ user, game } = {}) => {
      if (user) syncUser(user);

      setState((current) => ({
        ...current,
        ...mapGameState(game),
        joined: true,
        message: "Joined live room",
      }));
    });

    nextSocket.on("game_state", (game) => {
      setState((current) => ({
        ...current,
        ...mapGameState(game),
      }));
    });

    nextSocket.on("round_waiting", (game) => {
      setState((current) => ({
        ...current,
        ...mapGameState(game),
        activeBet: null,
        pendingBet: false,
        cashoutPending: false,
        message: "Next round waiting",
      }));
    });

    nextSocket.on("round_started", (game) => {
      setState((current) => ({
        ...current,
        ...mapGameState(game),
        gameState: "FLYING",
        multiplier: 1,
        crashAt: null,
        activeBet: null,
        pendingBet: false,
        cashoutPending: false,
        lastBetResult: null,
        message: "Round started",
      }));
    });

    nextSocket.on("multiplier_tick", ({ value }) => {
      setState((current) => ({
        ...current,
        gameState: "FLYING",
        multiplier: Number(value),
      }));
    });

    nextSocket.on("round_crashed", (game) => {
      setState((current) => ({
        ...current,
        ...mapGameState(game),
        gameState: "CRASHED",
        cashoutPending: false,
        message: `Crashed at ${Number(game.crashAt).toFixed(2)}x`,
      }));
    });

    nextSocket.on("bet_placed", ({ bet, balance }) => {
      updateWallet(balance);

      setState((current) => ({
        ...current,
        activeBet: bet,
        pendingBet: false,
        message: `Bet placed ${Number(bet.amount).toFixed(2)}`,
      }));
    });

    nextSocket.on("bet_result", (result) => {
      updateWallet(result.balance);

      setState((current) => ({
        ...current,
        activeBet: null,
        cashoutPending: false,
        lastBetResult: result,
        message: `Cashed out ${Number(result.profit).toFixed(2)}`,
      }));
    });

    nextSocket.on("bet_lost", ({ amount }) => {
      setState((current) => ({
        ...current,
        activeBet: null,
        pendingBet: false,
        cashoutPending: false,
        message: `Lost ${Number(amount).toFixed(2)}`,
      }));
    });

    nextSocket.on("wallet_updated", ({ balance }) => {
      updateWallet(balance);
    });

    nextSocket.on("error", (error) => {
      const message = typeof error === "string" ? error : error?.message;

      setState((current) => ({
        ...current,
        pendingBet: false,
        cashoutPending: false,
        message: message || "Bet failed",
      }));
    });

    return () => {
      nextSocket.disconnect();
      socketRef.current = null;
    };
  }, [syncUser, token, updateWallet]);

  const placeBet = useCallback(
    (amount) => {
      socketRef.current?.emit("place_bet", { amount });
      setState((current) => ({
        ...current,
        pendingBet: true,
        message: "Placing bet",
      }));
    },
    [],
  );

  const cashOut = useCallback(() => {
    socketRef.current?.emit("cash_out");
    setState((current) => ({
      ...current,
      cashoutPending: true,
      message: "Cash out sent",
    }));
  }, []);

  return {
    ...state,
    placeBet,
    cashOut,
  };
}

function mapGameState(game) {
  if (!game) return {};

  return {
    gameState: game.gameState,
    multiplier: Number(game.multiplier || 1),
    roundId: game.roundId || null,
    crashAt: game.crashAt ? Number(game.crashAt) : null,
    waitMs: Number(game.waitMs || 0),
    history: Array.isArray(game.history)
      ? game.history.map((round, index) => ({
          id: String(round.roundId || `${round.value}-${index}`),
          value: Number(round.value),
        }))
      : [],
  };
}
