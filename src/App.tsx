import { LandingPageLight } from "./pages/LandingPageLight";
import { AppProvider } from "./context/AppContext";
import { Toaster } from "./components/ui/Toaster";
import { WalletModal } from "./components/modals/WalletModal";
import { SupportModal } from "./components/modals/SupportModal";
import { StartPageModal } from "./components/modals/StartPageModal";
import { CreatorsModal } from "./components/modals/CreatorsModal";
import { LegalModal } from "./components/modals/LegalModal";

export function App() {
  return (
    <AppProvider>
      <div className="min-h-screen font-sans bg-white">
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[120] focus:rounded-lg focus:bg-brand-700 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>

        <LandingPageLight />

        {/* One dialog is open at a time; each renders only for its own kind. */}
        <WalletModal />
        <SupportModal />
        <StartPageModal />
        <CreatorsModal />
        <LegalModal />
        <Toaster />
      </div>
    </AppProvider>
  );
}
