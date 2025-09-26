import { ConnectWallet } from './ConnectWallet';
import { CreateScholarship } from './CreateScholarship';
import { ScholarshipList } from './ScholarshipList';

export default function Home() {
  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>EduChain Automate</h1>
          <p>Automating Trust in Educational Finance</p>
        </div>
        <ConnectWallet />
      </header>

      <CreateScholarship />
      <ScholarshipList />

    </main>
  );
}