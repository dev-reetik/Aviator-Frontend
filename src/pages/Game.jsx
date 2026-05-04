import BetPanel from "../components/BetPanel.jsx";
import GameCanvas from "../components/GameCanvas.jsx";
import Multiplier from "../components/Multiplier.jsx";
import Navbar from "../components/Navbar.jsx";
import WalletManager from "../components/WalletManager.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useSocket } from "../hooks/useSocket.js";

function Game() {
  const { user, wallet } = useAuth();
  const game = useSocket();

  return (
    <div className="app-shell">
      <Navbar connected={game.connected} joined={game.joined} />

      <main className="game-layout">
        <section className="flight-column">
          <Multiplier
            connected={game.connected}
            crashAt={game.crashAt}
            gameState={game.gameState}
            multiplier={game.multiplier}
          />
          <GameCanvas
            crashAt={game.crashAt}
            gameState={game.gameState}
            multiplier={game.multiplier}
          />

          <section className="history-panel" aria-label="Round history">
            <div className="panel-heading">
              <h2>Round history</h2>
              <span>{game.history.length} recent</span>
            </div>
            <div className="history-list">
              {game.history.length ? (
                game.history.map((round) => (
                  <span
                    className={`history-chip ${
                      round.value >= 2 ? "strong" : "soft"
                    }`}
                    key={round.id}
                  >
                    {round.value.toFixed(2)}x
                  </span>
                ))
              ) : (
                <span className="empty-state">Waiting for crash data</span>
              )}
            </div>
          </section>
        </section>

        <aside className="side-column">
          <BetPanel
            key={game.roundId || "waiting"}
            activeBet={game.activeBet}
            cashOut={game.cashOut}
            cashoutPending={game.cashoutPending}
            connected={game.connected}
            gameState={game.gameState}
            joined={game.joined}
            message={game.message}
            multiplier={game.multiplier}
            pendingBet={game.pendingBet}
            placeBet={game.placeBet}
          />

          <WalletManager />

          <section className="player-panel">
            <div className="panel-heading">
              <h2>Player panel</h2>
              <span>{game.joined ? "Live" : "Offline"}</span>
            </div>
            <dl className="player-stats">
              <div>
                <dt>Player</dt>
                <dd>{user?.username}</dd>
              </div>
              <div>
                <dt>Wallet</dt>
                <dd>{wallet.toFixed(2)}</dd>
              </div>
              <div>
                <dt>Round</dt>
                <dd>{game.roundId ? String(game.roundId).slice(-6) : "None"}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{game.gameState}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </main>
    </div>
  );
}

export default Game;
