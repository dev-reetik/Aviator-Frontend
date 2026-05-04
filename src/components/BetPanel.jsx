import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const quickAmounts = [25, 50, 100, 250];

function BetPanel({
  cashOut,
  cashoutPending,
  connected,
  activeBet,
  gameState,
  joined,
  message,
  multiplier,
  pendingBet,
  placeBet,
}) {
  const { wallet } = useAuth();
  const [amount, setAmount] = useState("50");

  const numericAmount = Number(amount);
  const canBet =
    connected &&
    joined &&
    gameState === "FLYING" &&
    !activeBet &&
    !pendingBet &&
    Number.isFinite(numericAmount) &&
    numericAmount > 0 &&
    numericAmount <= wallet;
  const canCashOut = activeBet && gameState === "FLYING" && !cashoutPending;

  const projectedPayout = useMemo(() => {
    if (!activeBet) return 0;
    return activeBet.amount * multiplier;
  }, [activeBet, multiplier]);

  function handleBet() {
    if (!canBet) return;

    const value = Number(numericAmount.toFixed(2));
    placeBet(value);
  }

  function handleCashOut() {
    if (!canCashOut) return;

    cashOut();
  }

  function updateAmount(value) {
    setAmount(String(value));
  }

  return (
    <section className="bet-panel">
      <div className="panel-heading">
        <h2>Bet panel</h2>
        <span>{pendingBet ? "Pending" : activeBet ? "Placed" : "Ready"}</span>
      </div>

      <label className="amount-label" htmlFor="bet-amount">
        Amount
      </label>
      <div className="amount-row">
        <input
          id="bet-amount"
          min="1"
          step="1"
          type="number"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
        <button
          className="secondary-button"
          type="button"
          onClick={() => updateAmount(Math.max(1, numericAmount / 2 || 25))}
        >
          1/2
        </button>
        <button
          className="secondary-button"
          type="button"
          onClick={() => updateAmount((numericAmount || 25) * 2)}
        >
          2x
        </button>
      </div>

      <div className="quick-grid">
        {quickAmounts.map((value) => (
          <button
            className="chip-button"
            key={value}
            type="button"
            onClick={() => updateAmount(value)}
          >
            {value}
          </button>
        ))}
      </div>

      <div className="payout-box">
        <span>Current payout</span>
        <strong>{projectedPayout.toFixed(2)}</strong>
      </div>

      <div className="bet-actions">
        <button
          className="primary-button"
          type="button"
          disabled={!canBet}
          onClick={handleBet}
        >
          {pendingBet ? "Placing" : "Bet"}
        </button>
        <button
          className="cash-button"
          type="button"
          disabled={!canCashOut}
          onClick={handleCashOut}
        >
          {cashoutPending ? "Cashing" : "Cash Out"}
        </button>
      </div>

      <p className="panel-message">
        {gameState === "CRASHED" && activeBet
          ? `Lost ${activeBet.amount.toFixed(2)}`
          : message || "No active bet"}
      </p>
    </section>
  );
}

export default BetPanel;
