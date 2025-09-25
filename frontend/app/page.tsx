import { ConnectWallet } from './ConnectWallet'; // Import the component

export default function Home() {
  return (
    <main style={{ padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>EduChain Automate</h1>
          <p>Automating Trust in Educational Finance</p>
        </div>
        <ConnectWallet /> {/* Add the component here */}
      </header>
    </main>
  );
}