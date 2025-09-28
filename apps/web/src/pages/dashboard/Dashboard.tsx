import Header from "./Header/Header";
import DroidCatalog from "./DroidCatalog/DroidCatalog";
import { DroidCatalogProvider } from "./DroidCatalog/context/DroidCatalogContext";

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <Header
          title="Gestion des droïdes"
          subtitle="Ajoutez, modifiez ou supprimez des droïdes de votre catalogue."
        />
        <DroidCatalogProvider>
          <DroidCatalog />
        </DroidCatalogProvider>
      </div>
    </div>
  );
}
