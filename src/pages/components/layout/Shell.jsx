import Footer from "../footer.jsx";
import Navigation from "../navigation.jsx";

const Shell = ({children, user, onLogout}) => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navigation />

      <main className="pt-16 min-h-screen transition-all duration-200">
        {/* Centered, proportional container */}
        <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Shell;
