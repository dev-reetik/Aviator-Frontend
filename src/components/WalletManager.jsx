import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const walletAmounts = [100, 500, 1000];

function WalletManager() {
  const { deposit, wallet, withdraw } = useAuth();
  const [amount, setAmount] = useState("100");
  const [loading, setLoading] = useState("");
  const [message, setMessage] = useState("");

  const numericAmount = Number(amount);
  const validAmount = Number.isFinite(numericAmount) && numericAmount > 0;

  async function handleWalletAction(type) {
    if (!validAmount) return;

    setLoading(type);
    setMessage("");

    try {
      if (type === "deposit") {
        await deposit(numericAmount);
        setMessage(`Added ${numericAmount.toFixed(2)}`);
      } else {
        await withdraw(numericAmount);
        setMessage(`Withdrew ${numericAmount.toFixed(2)}`);
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading("");
    }
  }

  return (
    <section className="wallet-panel">
      <div className="panel-heading">
        <h2>Wallet management</h2>
        <span>{wallet.toFixed(2)}</span>
      </div>

      <div className="wallet-balance">
        <span>Available balance</span>
        <strong>{wallet.toFixed(2)}</strong>
      </div>

      <label className="amount-label" htmlFor="wallet-amount">
        Amount
      </label>
      <div className="amount-row wallet-row">
        <input
          id="wallet-amount"
          min="1"
          step="1"
          type="number"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </div>

      <div className="quick-grid">
        {walletAmounts.map((value) => (
          <button
            className="chip-button"
            key={value}
            type="button"
            onClick={() => setAmount(String(value))}
          >
            {value}
          </button>
        ))}
      </div>

      <div className="wallet-actions">
        <button
          className="primary-button"
          type="button"
          disabled={!validAmount || Boolean(loading)}
          onClick={() => handleWalletAction("deposit")}
        >
          {loading === "deposit" ? "Adding" : "Add Funds"}
        </button>
        <button
          className="ghost-button"
          type="button"
          disabled={!validAmount || numericAmount > wallet || Boolean(loading)}
          onClick={() => handleWalletAction("withdraw")}
        >
          {loading === "withdraw" ? "Withdrawing" : "Withdraw"}
        </button>
      </div>

      <p className="panel-message">{message || "Server wallet is synced"}</p>
    </section>
  );
}

export default WalletManager;
